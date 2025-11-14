-- チャットボット用のテーブル作成SQL
-- Supabase SQLエディターで実行してください

-- scenariosテーブル
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  html_content TEXT,
  parent_id TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- optionsテーブル（シナリオの選択肢）
CREATE TABLE IF NOT EXISTS options (
  id BIGSERIAL PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  next_scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0
);

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_scenarios_order ON scenarios(order_index);
CREATE INDEX IF NOT EXISTS idx_scenarios_parent ON scenarios(parent_id);
CREATE INDEX IF NOT EXISTS idx_options_scenario ON options(scenario_id);
CREATE INDEX IF NOT EXISTS idx_options_order ON options(order_index);

-- Row Level Security (RLS) の設定
-- 匿名ユーザーにも読み取りを許可する場合
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み取りを許可
CREATE POLICY "Enable read access for all users" ON scenarios FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON options FOR SELECT USING (true);

-- 認証済みユーザーに書き込みを許可（管理者のみに制限したい場合は調整してください）
CREATE POLICY "Enable insert for authenticated users" ON scenarios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON scenarios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON scenarios FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON options FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON options FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON options FOR DELETE USING (auth.role() = 'authenticated');

-- コメント
COMMENT ON TABLE scenarios IS 'チャットボットのシナリオデータ';
COMMENT ON TABLE options IS 'シナリオの選択肢データ';
