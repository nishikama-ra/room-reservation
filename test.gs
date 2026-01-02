/**
 * 予約システム用テストスイート
 */

function runAllTests() {
  console.log("--- テスト開始 ---");
  
  test_isHoliday();
  test_doGet_index();
  test_doGet_admin_denied();
  test_createMailBody();
  
  console.log("--- すべてのテストが終了しました ---");
}

/**
 * 1. 祝日判定ロジックのテスト
 */
function test_isHoliday() {
  console.log("Testing: isHoliday...");
  try {
    // 日曜日の判定 (2025/12/28 は日曜日)
    const sundayResult = isHoliday("2025-12-28");
    assert(sundayResult === true, "日曜日は祝日判定（True）されるべきです");

    // 平日の判定 (2025/12/10 は水曜日・祝日なし)
    const weekdayResult = isHoliday("2025-12-10");
    assert(weekdayResult === false, "通常の平日はFalseであるべきです");

    console.log("✅ test_isHoliday: 成功");
  } catch (e) {
    console.error("❌ test_isHoliday: 失敗 - " + e.message);
  }
}

/**
 * 2. doGet関数の挙動テスト（一般画面）
 */
function test_doGet_index() {
  console.log("Testing: doGet (Index)...");
  try {
    const e = {}; // パラメータなし
    const result = doGet(e);
    assert(result.getTitle() === '西鎌倉住宅地自治会館予約システム', "タイトルが一般画面用であるべきです");
    console.log("✅ test_doGet_index: 成功");
  } catch (e) {
    console.error("❌ test_doGet_index: 失敗 - " + e.message);
  }
}

/**
 * 3. 管理画面の権限拒否テスト
 * ※ Session.getActiveUser() がテスト実行者（あなた）になるため、
 * allowedAdminsに含まれないアドレスの場合のみ失敗をシミュレートできます。
 */
function test_doGet_admin_denied() {
  console.log("Testing: doGet (Admin Denied)...");
  try {
    const e = { parameter: { mode: 'admin' } };
    const result = doGet(e);
    
    // 戻り値がHtmlOutputであり、タイトルが【管理】になっていないことを確認
    const title = result.getTitle();
    if (title !== '【管理】西鎌倉住宅地自治会館予約システム') {
      assert(result.getContent().includes("閲覧権限がありません"), "権限エラーメッセージが表示されるべきです");
      console.log("✅ test_doGet_admin_denied: 成功（権限拒否を確認）");
    } else {
      console.log("⚠️ test_doGet_admin_denied: スキップ（実行者が管理者のため、拒否画面をテストできません）");
    }
  } catch (e) {
    console.error("❌ test_doGet_admin_denied: 失敗 - " + e.message);
  }
}

/**
 * 4. メール本文生成のテスト
 */
function test_createMailBody() {
  console.log("Testing: createMailBody...");
  try {
    const body = createMailBody("テスト太郎", "A室", "2025-01-01", "10:00", "12:00", "880円", "会議", "メッセージ", "dummy-uuid", true);
    
    assert(body.includes("テスト太郎"), "氏名が含まれるべきです");
    assert(body.includes("A室"), "部屋名が含まれるべきです");
    assert(body.includes("mode=cancel"), "キャンセルリンクが含まれるべきです");
    
    console.log("✅ test_createMailBody: 成功");
  } catch (e) {
    console.error("❌ test_createMailBody: 失敗 - " + e.message);
  }
}

/**
 * 簡易アサーション関数
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}