// お知らせ情報
type NotificationInfo = {
  notification_id: number;      // お知らせID
  indicates_start_date: string; // 表示開始日時
  indicates_end_date: string;   // 表示終了日時
  notification_date: string;    // お知らせ日
  title: string;                // タイトル
  details: string;              // 内容
  create_by: string;            // 作成者
  create_datetime: Date;        // 作成日時
  update_by: string;            // 最終更新者
  update_datetime: Date;        // 最終更新日時
  modify_count: number;         // 更新数
  delete_flg: string;           // 削除フラグ
};

export default NotificationInfo;
