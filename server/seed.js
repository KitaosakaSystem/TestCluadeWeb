import {
  initDatabase,
  createScenario,
  createOption
} from './database.js';

console.log('🌱 Seeding database with initial data...');

// データベース初期化
initDatabase();

// 初期データの投入
const scenarios = [
  {
    id: 'start',
    message: 'こんにちは！サポートチャットボットです。',
    html_content: '<p>どのようなお困りごとでしょうか？</p>',
    parent_id: null,
    order_index: 0
  },
  {
    id: 'login',
    message: 'ログインに関するお困りですね。',
    html_content: '<p>具体的にどのような状況でしょうか？</p>',
    parent_id: 'start',
    order_index: 1
  },
  {
    id: 'login_password',
    message: 'パスワードをお忘れの場合',
    html_content: `
      <h3>パスワードの再設定方法</h3>
      <ol>
        <li>ログイン画面の<strong>「パスワードを忘れた方」</strong>をクリック</li>
        <li>登録済みのメールアドレスを入力</li>
        <li>届いたメールのリンクから新しいパスワードを設定</li>
      </ol>
      <p><strong>📧 メールが届かない場合</strong></p>
      <ul>
        <li>迷惑メールフォルダをご確認ください</li>
        <li>5分経っても届かない場合は再送してください</li>
      </ul>
    `,
    parent_id: 'login',
    order_index: 2
  },
  {
    id: 'login_locked',
    message: 'アカウントがロックされた場合',
    html_content: `
      <h3>🔒 アカウントロックについて</h3>
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <p><strong>原因：</strong>連続して誤ったパスワードを入力すると、セキュリティのため一時的にロックされます。</p>
      </div>
      <h4>解決方法</h4>
      <p>30分後に自動的に解除されます。それまでお待ちください。</p>
      <p><strong>緊急の場合：</strong></p>
      <p>サポートセンター <a href="tel:0120-XXX-XXX">0120-XXX-XXX</a> までお電話ください。</p>
    `,
    parent_id: 'login',
    order_index: 3
  },
  {
    id: 'usage',
    message: 'サービスの使い方について',
    html_content: '<p>どの機能についてお知りになりたいですか？</p>',
    parent_id: 'start',
    order_index: 4
  },
  {
    id: 'usage_basic',
    message: '基本的な操作方法',
    html_content: `
      <h3>📚 基本的な操作方法</h3>
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4>初めての方へ</h4>
        <ol>
          <li>ダッシュボードから各機能にアクセス</li>
          <li>左側のメニューから目的の機能を選択</li>
          <li>「？」アイコンでヘルプを表示</li>
        </ol>
      </div>
      <p style="margin-top: 15px;"><strong>詳しい操作ガイド：</strong></p>
      <p>メニューの「ヘルプ」→「操作マニュアル」からご覧いただけます。</p>
      <p>🎥 チュートリアル動画もご用意しております。</p>
    `,
    parent_id: 'usage',
    order_index: 5
  },
  {
    id: 'error',
    message: 'エラーが表示されている',
    html_content: '<p>どのようなエラーでしょうか？</p>',
    parent_id: 'start',
    order_index: 6
  },
  {
    id: 'error_network',
    message: '通信エラーの対処法',
    html_content: `
      <h3>🌐 通信エラーの対処法</h3>
      <h4>確認事項</h4>
      <ul>
        <li>✓ インターネット接続を確認</li>
        <li>✓ ファイアウォール設定を確認</li>
        <li>✓ VPN接続時は一時的に解除して試す</li>
      </ul>
      <h4>解決方法</h4>
      <ol>
        <li>ブラウザを再起動</li>
        <li>ルーターを再起動</li>
        <li>時間をおいて再度アクセス</li>
      </ol>
      <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin-top: 10px;">
        <p>⚠️ サーバーメンテナンス中の可能性もあります。お知らせをご確認ください。</p>
      </div>
    `,
    parent_id: 'error',
    order_index: 7
  },
  {
    id: 'billing',
    message: '料金に関するお問い合わせ',
    html_content: '<p>具体的にどのような内容でしょうか？</p>',
    parent_id: 'start',
    order_index: 8
  },
  {
    id: 'billing_plan',
    message: '料金プランについて',
    html_content: `
      <h3>💳 料金プラン一覧</h3>
      <div style="display: grid; gap: 15px; margin: 15px 0;">
        <div style="border: 2px solid #42a5f5; padding: 15px; border-radius: 10px;">
          <h4 style="color: #42a5f5;">ベーシック</h4>
          <p style="font-size: 24px; font-weight: bold;">¥5,000<span style="font-size: 14px;">/月</span></p>
          <ul>
            <li>ユーザー数：5名まで</li>
            <li>ストレージ：10GB</li>
          </ul>
        </div>
        <div style="border: 2px solid #66bb6a; padding: 15px; border-radius: 10px;">
          <h4 style="color: #66bb6a;">スタンダード</h4>
          <p style="font-size: 24px; font-weight: bold;">¥15,000<span style="font-size: 14px;">/月</span></p>
          <ul>
            <li>ユーザー数：20名まで</li>
            <li>ストレージ：50GB</li>
          </ul>
        </div>
        <div style="border: 2px solid #ff9800; padding: 15px; border-radius: 10px;">
          <h4 style="color: #ff9800;">プレミアム</h4>
          <p style="font-size: 24px; font-weight: bold;">¥30,000<span style="font-size: 14px;">/月</span></p>
          <ul>
            <li>ユーザー数：無制限</li>
            <li>ストレージ：200GB</li>
          </ul>
        </div>
      </div>
      <p>プラン変更はいつでも可能です。詳細は「料金ページ」をご覧ください。</p>
    `,
    parent_id: 'billing',
    order_index: 9
  }
];

const options = [
  // startからの選択肢
  { scenario_id: 'start', text: 'ログインできない', next_scenario_id: 'login', order_index: 0 },
  { scenario_id: 'start', text: 'サービスの使い方がわからない', next_scenario_id: 'usage', order_index: 1 },
  { scenario_id: 'start', text: 'エラーが表示される', next_scenario_id: 'error', order_index: 2 },
  { scenario_id: 'start', text: '料金について知りたい', next_scenario_id: 'billing', order_index: 3 },

  // loginからの選択肢
  { scenario_id: 'login', text: 'パスワードを忘れた', next_scenario_id: 'login_password', order_index: 0 },
  { scenario_id: 'login', text: 'アカウントがロックされた', next_scenario_id: 'login_locked', order_index: 1 },

  // 詳細ページから「最初に戻る」
  { scenario_id: 'login_password', text: '最初に戻る', next_scenario_id: 'start', order_index: 0 },
  { scenario_id: 'login_locked', text: '最初に戻る', next_scenario_id: 'start', order_index: 0 },

  // usageからの選択肢
  { scenario_id: 'usage', text: '基本的な操作方法', next_scenario_id: 'usage_basic', order_index: 0 },
  { scenario_id: 'usage_basic', text: '最初に戻る', next_scenario_id: 'start', order_index: 0 },

  // errorからの選択肢
  { scenario_id: 'error', text: '「通信エラー」と表示される', next_scenario_id: 'error_network', order_index: 0 },
  { scenario_id: 'error_network', text: '最初に戻る', next_scenario_id: 'start', order_index: 0 },

  // billingからの選択肢
  { scenario_id: 'billing', text: '料金プランについて', next_scenario_id: 'billing_plan', order_index: 0 },
  { scenario_id: 'billing_plan', text: '最初に戻る', next_scenario_id: 'start', order_index: 0 }
];

// シナリオを投入
scenarios.forEach(scenario => {
  try {
    createScenario(scenario);
    console.log(`✓ Created scenario: ${scenario.id}`);
  } catch (error) {
    console.error(`✗ Error creating scenario ${scenario.id}:`, error.message);
  }
});

// 選択肢を投入
options.forEach(option => {
  try {
    createOption(option);
    console.log(`✓ Created option: ${option.text} (${option.scenario_id} → ${option.next_scenario_id})`);
  } catch (error) {
    console.error(`✗ Error creating option:`, error.message);
  }
});

console.log('\n✅ Database seeding completed!');
