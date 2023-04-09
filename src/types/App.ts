// アプリマスタ
type App = {
  app_id: number;                     // アプリID
  app_name: string;                   // アプリ名
  explanation: string;                // 説明
  category_id: string;                // カテゴリID
  app_destination_category: string;   // アプリ格納先区分
  app_destination: string;            // アプリ格納先
  author_name: string;                // 作成者名
  icon: string;                       // アイコン画像
  thumbnail_image: string;            // サムネイル画像
  downloads: number;                  // ダウンロード数
  average_rating_score: number;       // 評価平均点
  create_by: string;                  // 作成者
  create_datetime: Date;              // 作成日時
  update_by: string;                  // 最終更新者
  update_datetime: Date;              // 最終更新日時
  modify_count: number;               // 更新数
  delete_flg: string;                 // 削除フラグ
};

export default App;
