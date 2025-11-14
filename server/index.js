import express from 'express';
import cors from 'cors';
import {
  initDatabase,
  getAllScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  createOption,
  updateOption,
  deleteOption,
  deleteOptionsByScenarioId
} from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース初期化
initDatabase();

// ============= API エンドポイント =============

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running' });
});

// シナリオの全取得
app.get('/api/scenarios', (req, res) => {
  try {
    const scenarios = getAllScenarios();
    res.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

// 特定のシナリオを取得
app.get('/api/scenarios/:id', (req, res) => {
  try {
    const scenario = getScenarioById(req.params.id);

    if (scenario) {
      res.json(scenario);
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

// シナリオの作成
app.post('/api/scenarios', (req, res) => {
  try {
    const { id, message, html_content, parent_id, order_index, options } = req.body;

    if (!id || !message) {
      return res.status(400).json({ error: 'ID and message are required' });
    }

    // シナリオを作成
    const scenario = createScenario({ id, message, html_content, parent_id, order_index });

    // 選択肢があれば作成
    if (options && Array.isArray(options)) {
      options.forEach((option, index) => {
        createOption({
          scenario_id: id,
          text: option.text,
          next_scenario_id: option.next_scenario_id,
          order_index: option.order_index ?? index
        });
      });
    }

    // 更新されたシナリオを返す
    const updatedScenario = getScenarioById(id);
    res.status(201).json(updatedScenario);
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({ error: 'Failed to create scenario' });
  }
});

// シナリオの更新
app.put('/api/scenarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { message, html_content, parent_id, order_index, options } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // シナリオを更新
    const scenario = updateScenario(id, { message, html_content, parent_id, order_index });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // 選択肢を更新（既存を削除して再作成）
    if (options && Array.isArray(options)) {
      deleteOptionsByScenarioId(id);

      options.forEach((option, index) => {
        createOption({
          scenario_id: id,
          text: option.text,
          next_scenario_id: option.next_scenario_id,
          order_index: option.order_index ?? index
        });
      });
    }

    // 更新されたシナリオを返す
    const updatedScenario = getScenarioById(id);
    res.json(updatedScenario);
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
  }
});

// シナリオの削除
app.delete('/api/scenarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteScenario(id);

    if (success) {
      res.json({ message: 'Scenario deleted successfully' });
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
});

// 選択肢の作成
app.post('/api/options', (req, res) => {
  try {
    const { scenario_id, text, next_scenario_id, order_index } = req.body;

    if (!scenario_id || !text || !next_scenario_id) {
      return res.status(400).json({ error: 'scenario_id, text, and next_scenario_id are required' });
    }

    const option = createOption({ scenario_id, text, next_scenario_id, order_index });
    res.status(201).json(option);
  } catch (error) {
    console.error('Error creating option:', error);
    res.status(500).json({ error: 'Failed to create option' });
  }
});

// 選択肢の更新
app.put('/api/options/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { text, next_scenario_id, order_index } = req.body;

    if (!text || !next_scenario_id) {
      return res.status(400).json({ error: 'text and next_scenario_id are required' });
    }

    const option = updateOption(id, { text, next_scenario_id, order_index });

    if (option) {
      res.json(option);
    } else {
      res.status(404).json({ error: 'Option not found' });
    }
  } catch (error) {
    console.error('Error updating option:', error);
    res.status(500).json({ error: 'Failed to update option' });
  }
});

// 選択肢の削除
app.delete('/api/options/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteOption(id);

    if (success) {
      res.json({ message: 'Option deleted successfully' });
    } else {
      res.status(404).json({ error: 'Option not found' });
    }
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({ error: 'Failed to delete option' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Chatbot API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /api/health - Health check`);
  console.log(`   GET    /api/scenarios - Get all scenarios`);
  console.log(`   GET    /api/scenarios/:id - Get scenario by ID`);
  console.log(`   POST   /api/scenarios - Create new scenario`);
  console.log(`   PUT    /api/scenarios/:id - Update scenario`);
  console.log(`   DELETE /api/scenarios/:id - Delete scenario`);
  console.log(`   POST   /api/options - Create new option`);
  console.log(`   PUT    /api/options/:id - Update option`);
  console.log(`   DELETE /api/options/:id - Delete option`);
});
