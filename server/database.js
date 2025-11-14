import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// Supabaseクライアントの初期化
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// データベースの初期化（Supabaseでは不要だが互換性のために残す）
export function initDatabase() {
  console.log('Connected to Supabase successfully');
  console.log('Please ensure tables are created in Supabase dashboard or using schema.sql');
}

// シナリオの全取得
export async function getAllScenarios() {
  const { data: scenarios, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('order_index');

  if (error) throw error;

  // 各シナリオの選択肢も取得
  const scenariosWithOptions = await Promise.all(
    scenarios.map(async (scenario) => {
      const { data: options } = await supabase
        .from('options')
        .select('*')
        .eq('scenario_id', scenario.id)
        .order('order_index');

      return {
        ...scenario,
        options: options || []
      };
    })
  );

  return scenariosWithOptions;
}

// 特定のシナリオを取得
export async function getScenarioById(id) {
  const { data: scenario, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  const { data: options } = await supabase
    .from('options')
    .select('*')
    .eq('scenario_id', id)
    .order('order_index');

  return {
    ...scenario,
    options: options || []
  };
}

// シナリオの作成
export async function createScenario(data) {
  const { id, message, html_content, parent_id, order_index } = data;

  const { error } = await supabase
    .from('scenarios')
    .insert({
      id,
      message,
      html_content: html_content || null,
      parent_id: parent_id || null,
      order_index: order_index || 0
    });

  if (error) throw error;

  return await getScenarioById(id);
}

// シナリオの更新
export async function updateScenario(id, data) {
  const { message, html_content, parent_id, order_index } = data;

  const { error } = await supabase
    .from('scenarios')
    .update({
      message,
      html_content: html_content || null,
      parent_id: parent_id || null,
      order_index: order_index || 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;

  return await getScenarioById(id);
}

// シナリオの削除
export async function deleteScenario(id) {
  // 関連するoptionsを先に削除（Supabaseでもカスケード設定すれば自動削除される）
  await supabase.from('options').delete().eq('scenario_id', id);

  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id);

  return !error;
}

// 選択肢の作成
export async function createOption(data) {
  const { scenario_id, text, next_scenario_id, order_index } = data;

  const { data: option, error } = await supabase
    .from('options')
    .insert({
      scenario_id,
      text,
      next_scenario_id,
      order_index: order_index || 0
    })
    .select()
    .single();

  if (error) throw error;

  return option;
}

// 選択肢の更新
export async function updateOption(id, data) {
  const { text, next_scenario_id, order_index } = data;

  const { data: option, error } = await supabase
    .from('options')
    .update({
      text,
      next_scenario_id,
      order_index: order_index || 0
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return option;
}

// 選択肢の削除
export async function deleteOption(id) {
  const { error } = await supabase
    .from('options')
    .delete()
    .eq('id', id);

  return !error;
}

// シナリオIDに紐づく選択肢を全削除
export async function deleteOptionsByScenarioId(scenarioId) {
  const { error, count } = await supabase
    .from('options')
    .delete()
    .eq('scenario_id', scenarioId);

  return count || 0;
}
