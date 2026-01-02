/**
 * システム設定など
 */
const CONFIG = {

  // 外部接続先を含む定義

  // スプレッドシート・フォルダID(google)
  SPREADSHEET_ID: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  BACKUP_FOLDER_ID: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

  // 部屋・カレンダー設定
  ROOMS: [
        { id: "A室", display: "A室 (24畳)", calId: "c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { id: "B室", display: "B室 (16畳)", calId: "c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { id: "C室", display: "C室 (24畳)", calId: "c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { id: "D室", display: "D室 (8.2畳)", calId: "c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { id: "厨房", display: "厨房", calId: "c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" }
  ],

// 管理画面用：個別カレンダーリンク設定
  ADMIN_CAL_LINKS: [
    { name: "A", url: "https://calendar.google.com/calendar/u/0/r?cid=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { name: "B", url: "https://calendar.google.com/calendar/u/0/r?cid=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { name: "C", url: "https://calendar.google.com/calendar/u/0/r?cid=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { name: "D", url: "https://calendar.google.com/calendar/u/0/r?cid=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" },
    { name: "厨房", url: "https://calendar.google.com/calendar/u/0/r?cid=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com" }
  ],

// 全体カレンダーのURL
  CALENDAR_VIEW_URL: "https://calendar.google.com/calendar/u/0/r?src=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com&src=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com&src=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com&src=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com&src=c_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@group.calendar.google.com",

  // メール設定
  OFFICE_EMAIL: "XXXXXXXXXXXX@XXXXXXXXXXXXXXXXXXX.XXX",
  ALLOWED_ADMINS: [
    "XXXXXXXXXXXX@XXXXXXXXXXXXXXXXXXX.XXX",
    "XXXXXXXXXXXX@XXXXXXXXXXXXXXXXXXX.XXX"
  ],

  // ロゴの画像ソースURL
  LOGO_IMAGE_URL: "https://drive.google.com/thumbnail?id=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&sz=w1000",

  
  
  // 各種稼働定義

  // 名称
  SYSTEM_NAME: "西鎌倉住宅地自治会館予約システム",
  ORG_NAME: "西鎌倉住宅地自治会館",

  // 予約時間・期間設定
  TIME_STEP: 15,       
  START_HOUR: 10,      
  END_HOUR: 16,        
  MAX_MONTHS_AHEAD: 2,

  // 営業日・祝日設定
  BUSINESS_DAYS: [false, true, true, true, true, true, true], 
  ALLOW_HOLIDAY: false,

  // 分類と料金設定
  CATEGORIES: {
    "自治会活動": { name: "自治会活動", rate: 0, kitchen: 0 },
    "自治会活動に準ずる団体": { name: "自治会活動に準ずる団体", rooms: { "A室": 440, "B室": 330, "C室": 440, "D室": 280 }, kitchen: 550 },
    "自治会員（個人・団体）": { name: "自治会員（個人・団体）", rooms: { "A室": 440, "B室": 330, "C室": 440, "D室": 280 }, kitchen: 1100 },
    "その他": { name: "その他", rooms: { "A室": 660, "B室": 500, "C室": 660, "D室": 440 }, kitchen: 1650 }
  }
};

