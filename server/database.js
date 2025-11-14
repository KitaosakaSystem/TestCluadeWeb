import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../chatbot.db'));

// データベースの初期化
export function initDatabase() {
  // scenariosテーブルの作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      html_content TEXT,
      parent_id TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // optionsテーブルの作成（シナリオの選択肢）
  db.exec(`
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id TEXT NOT NULL,
      text TEXT NOT NULL,
      next_scenario_id TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
      FOREIGN KEY (next_scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

// シナリオの全取得
export function getAllScenarios() {
  const scenarios = db.prepare('SELECT * FROM scenarios ORDER BY order_index').all();

  // 各シナリオの選択肢も取得
  const scenariosWithOptions = scenarios.map(scenario => {
    const options = db.prepare('SELECT * FROM options WHERE scenario_id = ? ORDER BY order_index').all(scenario.id);
    return {
      ...scenario,
      options
    };
  });

  return scenariosWithOptions;
}

// 特定のシナリオを取得
export function getScenarioById(id) {
  const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id);

  if (scenario) {
    const options = db.prepare('SELECT * FROM options WHERE scenario_id = ? ORDER BY order_index').all(id);
    return {
      ...scenario,
      options
    };
  }

  return null;
}

// シナリオの作成
export function createScenario(data) {
  const { id, message, html_content, parent_id, order_index } = data;

  const stmt = db.prepare(`
    INSERT INTO scenarios (id, message, html_content, parent_id, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(id, message, html_content || null, parent_id || null, order_index || 0);

  return getScenarioById(id);
}

// シナリオの更新
export function updateScenario(id, data) {
  const { message, html_content, parent_id, order_index } = data;

  const stmt = db.prepare(`
    UPDATE scenarios
    SET message = ?, html_content = ?, parent_id = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(message, html_content || null, parent_id || null, order_index || 0, id);

  return getScenarioById(id);
}

// シナリオの削除
export function deleteScenario(id) {
  // 関連するoptionsも自動的に削除される（CASCADE）
  const stmt = db.prepare('DELETE FROM scenarios WHERE id = ?');
  const result = stmt.run(id);

  return result.changes > 0;
}

// 選択肢の作成
export function createOption(data) {
  const { scenario_id, text, next_scenario_id, order_index } = data;

  const stmt = db.prepare(`
    INSERT INTO options (scenario_id, text, next_scenario_id, order_index)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(scenario_id, text, next_scenario_id, order_index || 0);

  return db.prepare('SELECT * FROM options WHERE id = ?').get(result.lastInsertRowid);
}

// 選択肢の更新
export function updateOption(id, data) {
  const { text, next_scenario_id, order_index } = data;

  const stmt = db.prepare(`
    UPDATE options
    SET text = ?, next_scenario_id = ?, order_index = ?
    WHERE id = ?
  `);

  stmt.run(text, next_scenario_id, order_index || 0, id);

  return db.prepare('SELECT * FROM options WHERE id = ?').get(id);
}

// 選択肢の削除
export function deleteOption(id) {
  const stmt = db.prepare('DELETE FROM options WHERE id = ?');
  const result = stmt.run(id);

  return result.changes > 0;
}

// シナリオIDに紐づく選択肢を全削除
export function deleteOptionsByScenarioId(scenarioId) {
  const stmt = db.prepare('DELETE FROM options WHERE scenario_id = ?');
  const result = stmt.run(scenarioId);

  return result.changes;
}

export default db;
