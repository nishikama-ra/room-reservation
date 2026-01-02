/**
 * 3月3日のイベント情報をログに出力して確認する
 */
function checkMarch3Events() {
  const calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
  const holidayCalendar = CalendarApp.getCalendarById(calendarId);
  
  // 調査対象日（2026年3月3日）
  const targetDate = new Date(2026, 2, 3); // 月は0から始まるため 2 = 3月
  const events = holidayCalendar.getEventsForDay(targetDate);
  
  console.log("--- 2026年3月3日のイベント調査結果 ---");
  if (events.length === 0) {
    console.log("イベントは見つかりませんでした（祝日・祭日ともに登録なし）");
  } else {
    events.forEach((event, i) => {
      console.log(`イベント ${i + 1}:`);
      console.log(` タイトル: ${event.getTitle()}`);
      console.log(` 説明文 (Description): ${event.getDescription()}`);
    });
  }
  console.log("---------------------------------------");
}