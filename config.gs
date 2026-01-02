/**
 * システム設定（固定値）
 */
const CONFIG = {

  // 外部接続先を含む定義

  // スプレッドシート・フォルダID
  SPREADSHEET_ID: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  BACKUP_FOLDER_ID: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

  // 部屋・カレンダー設定
  ROOMS: [
    { id: "A室", display: "A室 (24畳)", calId: "c_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com" },
    { id: "B室", display: "B室 (16畳)", calId: "c_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com" },
    { id: "C室", display: "C室 (24畳)", calId: "c_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com" },
    { id: "D室", display: "D室 (8.2畳)", calId: "c_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com" },
    { id: "厨房", display: "厨房", calId: "c_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com" }
  ],

  // メール設定（記載通りの順序）
  OFFICE_EMAIL: "xxxxxxx@xxxxxxxxxxxxxxxxxxx.xxx",
  ALLOWED_ADMINS: [
    "xxxxxxx@xxxxxxxxxxxxxxxxxxx.xxx",
    "xxxxxxx@xxxxxxxxxxxxxxxxxxx.xxxm"
  ],


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