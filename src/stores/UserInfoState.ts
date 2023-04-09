import { atom } from "recoil";
import UserInfo from "src/types/UserInfo";

export const userInfoState = atom<UserInfo>({
  key: "UserInfoState",
  default: {
    account_name: '',
    user_name: '',
    user_role: '',
    delete_flg: '0',
    selectedAccountName: '',
    registerState: ''
  }
});
