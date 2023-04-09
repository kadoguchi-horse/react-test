// 共通ステート
type  CategoryInfo= {
  category_Id: string,        // アカウント名
  category_Name: string,      // 氏名
  category_SortNo: string,    // 権限
  delete_flg: string,         // 削除フラグ
  registerState: string,      // 登録画面遷移時のモード　[登録, 更新, 削除]
};

export default CategoryInfo;
