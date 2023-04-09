import { atom } from "recoil";
import AppInfo from "src/types/AppInfo";

export const appInfoState = atom<AppInfo>({
  key: "AppInfoState",
  default: {
    searchWord: "", // 検索バーに入力された文言
    selectedOrder: "", // 一覧画面で選択された並び順の value
    categoryId: "", // Top, 検索画面で選択されたカテゴリId
    ratingValue: "", // Top, 検索画面で選択されたフィルタ―用の評価値
    selectedAppId: 0, // Top, 一覧で選択されたカードの app_id
    thumbnailDisp: false, // Top, 一覧でのサムネイル画像の表示/非表示
    registerState: "",
    mayapplistState: "", //マイページ遷移モード
  },
});
