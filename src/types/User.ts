// 共通ステート
type User = {
  account_name: string;     // アカウント名
  user_name: string;        // 氏名
  user_role: string;        // 権限
  create_by: string;        // 作成者
  create_datetime: Date;    // 作成日時
  update_by: string;        // 最終更新者
  update_datetime: Date;    // 最終更新日時
  modify_count: number;     // 更新数
  delete_flg: string;       // 削除フラグ
};

export default User;
