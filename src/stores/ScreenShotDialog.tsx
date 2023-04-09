import { atom } from "recoil";
import ScreenShotDialog from "src/types/ScreenShotDialog";

export const ScreenShotDialogState = atom<ScreenShotDialog>({
  key: "ScreenShotDialog",
  default: {
    dialogOpen: false,       // ダイアログ表示の切替
    dialogImage: '',         // 画面に表示する画像のsrc
  }
});
