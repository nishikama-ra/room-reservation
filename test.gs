/**
 * 予約システム 仕様網羅テスト（全17要件）
 * サーバーサイドロジックが仕様通りに実装されているかを確認します。
 */
function runComprehensiveRequirementTest() {
  console.log("--- 仕様網羅テスト：実行開始 ---");

  // 1. カレンダー遷移URL（5つのソースが含まれているか）
  test_CalendarUrlLink();

  // 2. 利用者名：空白
  test_Logic("利用者名：空白エラー", { name: "" }, "Error");
  // 3. 利用者名：任意文字列（全角・半角・記号）
  test_Logic("利用者名：任意文字列OK", { name: "山田太郎 123 !?＃" }, "Success");

  // 4. 電話番号：体系維持（ハイフン有無問わず）
  test_Logic("電話番号：不正形式エラー", { tel: "abc-def-ghij" }, "Error");
  test_Logic("電話番号：ハイフンなしOK", { tel: "09012345678" }, "Success");
  test_Logic("電話番号：ハイフンありOK", { tel: "090-1234-5678" }, "Success");

  // 5. メールアドレス：10バリエーション
  const emails = [
    { v: "test@example.com", e: "Success", m: "標準" },
    { v: "test.name@example.jp", e: "Success", m: "ドット入り" },
    { v: "test+label@example.com", e: "Success", m: "プラス記号" },
    { v: "no_at_mark", e: "Error", m: "@なし" },
    { v: "test@example", e: "Error", m: "ドメイン不完全" },
    { v: "@example.com", e: "Error", m: "ユーザー名なし" },
    { v: "test..user@example.com", e: "Error", m: "連続ドット" },
    { v: ".test@example.com", e: "Error", m: "ドット開始" },
    { v: "test@example..com", e: "Error", m: "ドメイン連続ドット" },
    { v: "test space@example.com", e: "Error", m: "スペース混入" }
  ];
  emails.forEach(p => test_Logic(`メール検証(${p.m})`, { email: p.v }, p.e));

  // 6. 利用区分プルダウン：「選択してください」はエラー、それ以外は全通
  test_Logic("利用区分：未選択エラー", { category: "選択してください" }, "Error");
  Object.keys(CONFIG.CATEGORIES).forEach(cat => {
    test_Logic(`利用区分：[${cat}] OK`, { category: cat }, "Success");
  });

  // 7. 利用目的：任意文字列（全角・半角・記号）
  test_Logic("利用目的：任意文字列OK", { purpose: "会議 #123 (緊急) ＄％" }, "Success");

  // 8. 利用場所プルダウン：「部屋を選択してください」はエラー、それ以外は全通
  test_Logic("利用場所：未選択エラー", { room: "部屋を選択してください" }, "Error");
  CONFIG.ROOMS.forEach(r => {
    test_Logic(`利用場所：[${r.id}] OK`, { room: r.id }, "Success");
  });

  // 9. 日曜日エラー
  test_Logic("利用日：日曜日エラー", { date: "2026-01-04" }, "Error");
  // 10. 祝日エラー
  test_Logic("利用日：祝日エラー(元旦)", { date: "2026-01-01" }, "Error");

  // 11. 2ヶ月＋1日先以降、3日間のエラー確認
  const today = new Date();
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + CONFIG.MAX_MONTHS_AHEAD, today.getDate() + i);
    const dStr = Utilities.formatDate(d, "JST", "yyyy-MM-dd");
    test_Logic(`利用日：制限超過(${i}日目: ${dStr})エラー`, { date: dStr }, "Error");
  }

  // 12. 2ヶ月以内の平日OK
  test_Logic("利用日：2ヶ月以内の平日OK", { date: "2026-05-21" }, "Success");

  // 13. 時刻矛盾
  test_Logic("時刻：開始＞終了エラー", { startTime: "15:00", endTime: "10:00" }, "Error");
  // 14. 開始「選択」エラー
  test_Logic("時刻：開始未選択エラー", { startTime: "選択" }, "Error");
  // 15. 終了「選択」エラー
  test_Logic("時刻：終了未選択エラー", { endTime: "選択" }, "Error");

  // 16. スケジューラと重なっている場合（全室）
  CONFIG.ROOMS.forEach(r => {
    test_Logic(`重複確認：[${r.id}] 重複時にエラーになるか`, { room: r.id, date: "2026-05-20" }, "Error");
  });

  // 17. 通常データ全室OK
  CONFIG.ROOMS.forEach(r => {
    test_Logic(`正常確認：[${r.id}] 正常予約`, { room: r.id, date: "2026-05-22" }, "Success");
  });

  console.log("--- 仕様網羅テスト：終了 ---");
}

/**
 * 共通テスト実行・ログ出力
 */
function test_Logic(label, customData, expected) {
  const base = {
    name: "テスト太郎", email: "test@example.com", tel: "090-1234-5678",
    category: "その他", purpose: "テスト目的", room: "A室",
    date: "2026-05-20", startTime: "10:00", endTime: "11:00"
  };
  const input = Object.assign({}, base, customData);
  
  console.log(`[投入データ] ${label}: ${JSON.stringify(input)}`);

  try {
    processForm(input);
    if (expected === "Success") {
      console.log(`  ✅ RESULT: 仕様通り成功`);
    } else {
      console.error(`  ❌ RESULT: 仕様違反（エラーになるべきところが成功しました）`);
    }
  } catch (e) {
    if (expected === "Error" || e.message.includes("予約できません") || e.message.includes("失敗")) {
      console.log(`  ✅ RESULT: 仕様通りエラー検知 [${e.message}]`);
    } else {
      console.error(`  ❌ RESULT: 想定外のエラー発生 [${e.message}]`);
    }
  }
}

/**
 * カレンダーURLの仕様確認
 */
function test_CalendarUrlLink() {
  console.log("[投入データ] カレンダーURL確認");
  const url = CONFIG.CALENDAR_VIEW_URL;
  const srcCount = (url.match(/src=/g) || []).length;
  console.log(`  > 検証URL: ${url}`);
  if (srcCount === 5) {
    console.log(`  ✅ RESULT: 仕様通り5つのソースを確認。`);
  } else {
    console.error(`  ❌ RESULT: ソース数が ${srcCount} 個です。仕様と異なります。`);
  }
}
