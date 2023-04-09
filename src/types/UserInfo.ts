// 共通ステート
type UserInfo = {
  account_name: string;         // アカウント名
  user_name: string;            // 氏名
  user_role: string;            // 権限
  delete_flg: string;           // 削除フラグ
  selectedAccountName: string;  // Top, 一覧で選択されたレコードの account_name
  registerState: string;        // 登録画面遷移時のモード　[登録, 更新, 削除]
};

export default UserInfo;
