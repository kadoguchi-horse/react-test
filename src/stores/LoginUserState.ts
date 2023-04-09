import { atom } from "recoil";
import LoginUser from "src/types/LoginUser";

export const loginUserState = atom<LoginUser>({
  key: "LoginUserState",
  default: {
    account_name: 'anonymous',
    user_name: '',
    user_role: 'User',
  }
});
