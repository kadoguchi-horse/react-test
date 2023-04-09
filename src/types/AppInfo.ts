// 共通ステート
type AppInfo = {
  searchWord: string; // 検索バーに入力された文言
  selectedOrder: string; // 一覧画面で選択された並び順の value
  categoryId: string; // 検索画面で選択されたカテゴリ
  ratingValue: string; // 検索画面で選択されたカテゴリ
  selectedAppId: number; // Top, 一覧で選択されたカードの app_id
  thumbnailDisp: boolean; // Top, 一覧でのサムネイル画像の表示/非表示
  registerState: string; // 登録画面遷移時のモード　[登録, 更新, 削除]
  mayapplistState: string; //マイページ遷移モード
};

export default AppInfo;
