// アプリ評価テーブル
type EvaluationUseful = {
  app_id: string;           // アプリID
  seq: number;              // 連番
  user_name: string;        // ユーザ名
  useful_flg: string;       // 有益フラグ
  create_by: string;        // 作成者
  create_datetime: Date;    // 作成日時
  update_by: string;        // 最終更新者
  update_datetime: Date;    // 最終更新日時
  modify_count: number;     // 更新数
  delete_flg: string;       // 削除フラグ
};

export default EvaluationUseful;
