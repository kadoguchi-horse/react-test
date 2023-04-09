import { atom } from "recoil";
import CategoryInfo from "src/types/CategoryInfo";

export const categoryInfoState = atom<CategoryInfo>({
  key: "UserInfoState",
  default: {
    category_Id: '',
    category_Name: '',
    category_SortNo: '',
    delete_flg: '0',
    registerState: ''
  }
});
