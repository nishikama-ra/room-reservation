function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();

  if (e && e.parameter && e.parameter.mode === 'cancel' && e.parameter.id) {
    const tmp = HtmlService.createTemplateFromFile('user_cancel');
    tmp.reservationId = e.parameter.id;
    tmp.config = CONFIG;
    return tmp.evaluate().setTitle(`予約キャンセル | ${CONFIG.ORG_NAME}`).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (e && e.parameter && e.parameter.mode === 'admin') {
    if (userEmail === "" || CONFIG.ALLOWED_ADMINS.indexOf(userEmail) === -1) {
        const switchAccountUrl = "https://accounts.google.com/AccountChooser?continue=" + encodeURIComponent(ScriptApp.getService().getUrl() + "?mode=admin");
        return HtmlService.createHtmlOutput(`<div style='font-family: sans-serif; padding: 40px; text-align: center;'><h2 style='color: #d9534f;'>閲覧権限がありません</h2><p>管理用アカウントでログインしてください。</p><a href='${switchAccountUrl}' target='_top' style='background-color: #2d5a27; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;'>アカウントを切り替える</a></div>`);
    }
    const tmp = HtmlService.createTemplateFromFile('admin');
    tmp.config = CONFIG;
    return tmp.evaluate().setTitle(`【管理】${CONFIG.SYSTEM_NAME}`).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const tmp = HtmlService.createTemplateFromFile('index');
  tmp.config = CONFIG;
  return tmp.evaluate().setTitle(CONFIG.SYSTEM_NAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function isHoliday(dateStr) {
  const date = new Date(dateStr.replace(/-/g, "/"));
  
  // 1. 曜日ごとの営業判定 (CONFIG.BUSINESS_DAYS を参照)
  if (!CONFIG.BUSINESS_DAYS[date.getDay()]) return true;

  // 2. 祝日の判定
  const calId = "ja.japanese#holiday@group.v.calendar.google.com";
  const cal = CalendarApp.getCalendarById(calId);
  const events = cal.getEventsForDay(date);
  const isPublicHoliday = events.some(event => {
    const firstLine = event.getDescription().split(/\n|<br/)[0];
    return firstLine.includes("祝日");
  });

  // 祝日かつ「祝日予約不可 (ALLOW_HOLIDAY: false)」なら true (予約不可) を返す
  if (isPublicHoliday && !CONFIG.ALLOW_HOLIDAY) return true;

  return false;
}

function processForm(formObject) {
  if (isHoliday(formObject.date)) throw new Error("指定された日は予約を受け付けておりません。");

  const dStr = formObject.date.replace(/-/g, "/");
  const start = new Date(dStr + " " + formObject.start);
  const end = new Date(dStr + " " + formObject.end);
  
  if (start >= end) throw new Error("終了時刻を開始時刻より後の時間に指定してください。");

  const roomInfo = CONFIG.ROOMS.find(r => r.id === formObject.room);
  if (!roomInfo) throw new Error("部屋情報が見つかりません。");
  const calId = roomInfo.calId;

  let cal = CalendarApp.getCalendarById(calId);
  if (cal.getEvents(start, end).length > 0) throw new Error("既に予約が入っています。");

  const categoryInfo = CONFIG.CATEGORIES[formObject.category];
  const diffMs = end - start;
  const rawHours = diffMs / (1000 * 60 * 60);
  let calcHours = rawHours <= 1.0 ? 1.0 : Math.ceil(rawHours * 2) / 2;

  let fee = 0, feeDetail = "", paymentStatus = "未";
  if (formObject.category === "自治会活動") {
    feeDetail = "無料（自治会活動）"; paymentStatus = "不要"; 
  } else if (roomInfo.id === "厨房") {
    fee = categoryInfo.kitchen; feeDetail = `${fee.toLocaleString()}円\n(厨房利用1回分)`;
  } else {
    const rate = categoryInfo.rooms[roomInfo.id];
    fee = calcHours * rate;
    feeDetail = `${fee.toLocaleString()}円\n(単価${rate.toLocaleString()}円 × ${calcHours}時間利用${rawHours < 1.0 ? " ※1時間未満は1時間料金" : ""})`;
  }

  try {
    const uuid = Utilities.getUuid();
    const event = cal.createEvent(`【仮/${roomInfo.id}】${formObject.purpose}`, start, end);

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName("シート1");

    // タイムスタンプを「yyyy/MM/dd HH:mm:ss」形式で生成
    const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");

    const rowData = [
      timestamp, formObject.email, formObject.user, roomInfo.id, 
      formObject.date, formObject.start, formObject.end, 
      "仮予約", paymentStatus, event.getId(), uuid,
      formObject.tel, categoryInfo.name, fee, formObject.purpose, feeDetail
    ];

    // 新しい予約を常に2行目（見出しの直下）へ挿入
    sheet.insertRowAfter(1);
    sheet.getRange(2, 1, 1, rowData.length).setValues([rowData]);

    const mailBody = createMailBody(formObject.user, roomInfo.id, formObject.date, formObject.start, formObject.end, feeDetail, formObject.purpose, "仮予約を受け付けました。内容を確認し、追って本登録のメールをお送りします。", uuid, true);
    
    GmailApp.sendEmail(formObject.email, "仮予約受付のお知らせ", mailBody, { 
      from: CONFIG.OFFICE_EMAIL, cc: CONFIG.OFFICE_EMAIL, replyTo: CONFIG.OFFICE_EMAIL, name: CONFIG.SYSTEM_NAME
    });
    return "success";
  } catch (e) {
    throw new Error("予約処理に失敗しました: " + e.message);
  }
}

function createMailBody(user, room, date, start, end, fee, purpose, message, uuid, showCancelLink) {
  let body = `${user} 様\n\n${message}\n\n■場所：${room}\n■日時：${date} ${start}〜${end}\n■目的：${purpose}\n■料金：${fee.replace(/\n/g, "")}\n\n`;
  if (showCancelLink && uuid) {
    const cancelUrl = `${ScriptApp.getService().getUrl()}?mode=cancel&id=${uuid}`;
    body += `------------------\n■Webからのキャンセルはこちら：\n${cancelUrl}\n------------------\n\n`;
  }
  body += `※このメールは送信専用です。\n${CONFIG.SYSTEM_NAME}`;
  return body;
}

function getReservations() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName("シート1");
  if (!sheet || sheet.getLastRow() < 2) return [];
  
  // スプレッドシートの2行目から最新順に並んでいる前提で取得
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 16).getDisplayValues(); 
  
  return data.filter(row => row[7] !== "削除").map((row, i) => ({
    row: i + 2, 
    timestamp: row[0], // 受付日時
    email: row[1], 
    user: row[2], 
    room: row[3], 
    date: row[4], 
    start: row[5], 
    end: row[6],
    status: row[7], 
    pay: row[8], 
    uuid: row[10], 
    tel: row[11], 
    category: row[12], 
    fee: row[13], 
    purpose: row[14], 
    feeDetail: row[15]
  })); // スプレッドシート自体が新しい順なら reverse() は削除
}

function updateReservation(row, action, source = "Web") {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName("シート1");
  const r = sheet.getRange(row, 1, 1, 16).getDisplayValues()[0];
  const roomInfo = CONFIG.ROOMS.find(rm => rm.id === r[3]);
  const cal = CalendarApp.getCalendarById(roomInfo.calId);
  const event = cal ? cal.getEventById(r[9]) : null;
  
  if (action === 'approve') {
    sheet.getRange(row, 8).setValue("本登録済");
    if (event) event.setTitle(event.getTitle().replace("【仮", "【確定"));
    const mailBody = createMailBody(r[2], r[3], r[4], r[5], r[6], r[15], r[14], "予約が本登録されました。当日は会館までお越しください。", r[10], true);
    GmailApp.sendEmail(r[1], "本登録完了のお知らせ", mailBody, { from: CONFIG.OFFICE_EMAIL, cc: CONFIG.OFFICE_EMAIL, replyTo: CONFIG.OFFICE_EMAIL, name: CONFIG.SYSTEM_NAME });
  } else if (action === 'paid') {
    sheet.getRange(row, 9).setValue("済");
  } else if (action === 'cancel') {
    sheet.getRange(row, 8).setValue((source === "Admin") ? "キャンセル" : "Webキャンセル");
    if (event) event.deleteEvent();
    const subject = `予約キャンセルのお知らせ (${source === 'Admin' ? '管理操作' : '利用者操作'})`;
    const cancelMailBody = createMailBody(r[2], r[3], r[4], r[5], r[6], r[15], r[14], "ご予約が取り消されました（キャンセル）。", r[10], false);
    GmailApp.sendEmail(r[1], subject, cancelMailBody, { from: CONFIG.OFFICE_EMAIL, cc: CONFIG.OFFICE_EMAIL, replyTo: CONFIG.OFFICE_EMAIL, name: CONFIG.SYSTEM_NAME });
  } else if (action === 'delete') {
    sheet.getRange(row, 8).setValue("削除");
    if (event) event.deleteEvent();
  }
}

function cancelByUserId(uuid) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName("シート1");
  const data = sheet.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][10] === uuid) { targetRow = i + 1; break; }
  }
  if (targetRow === -1) throw new Error("予約情報が見つかりません。");
  updateReservation(targetRow, 'cancel', 'Web');
  return "success";
}
