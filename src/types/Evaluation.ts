// アプリ評価テーブル
type Evaluation = {
  app_id: string;           // アプリID
  seq: string;              // 連番
  title: string;            // タイトル
  score: string;            // 点数
  assessor: string;         // 評価者
  comment: string;          // コメント
  useful_count: number;     // 有益件数
  unuseful_count: number    // 無益件数
  create_by: string;        // 作成者
  create_datetime: Date;    // 作成日時
  update_by: string;        // 最終更新者
  update_datetime: Date;    // 最終更新日時
  modify_count: number;     // 更新数
  delete_flg: string;       // 削除フラグ
};

export default Evaluation;
