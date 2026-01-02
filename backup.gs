/**
 * バックアップ専用スクリプト
 * * トリガー設定: 
 * - 関数: backupSpreadsheet
 * - デプロイ: Head
 * - イベント: 時間主導型 / 日付ベースのタイマー / 午前0時〜1時（任意）
 */

/**
 * 毎日バックアップを実行する関数
 */
function backupSpreadsheet() {
  try {
    const ssFile = DriveApp.getFileById(CONFIG.SPREADSHEET_ID);
    const folder = DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
    const dateStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyyMMdd_HHmmssSSS");
    const newFileName = ssFile.getName() + "_" + dateStr;
    ssFile.makeCopy(newFileName, folder);
    console.log("Backup Success: " + newFileName);
  } catch (e) {
    console.error("Backup Failed: " + e.message);
  }
}