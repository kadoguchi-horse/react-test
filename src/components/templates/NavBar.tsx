import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import ColorModeContext from "src/stores/ColorModeContext";
import { AppInfo, User, LoginUser } from "src/types";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  InputBase,
  Drawer,
  SvgIconTypeMap,
} from "@mui/material";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/ManageAccounts";
import StyleIcon from "@mui/icons-material/Style";
import { loginUserState } from "src/stores/LoginUserState";
import { g_loginUser, setGlobalLoginUser } from "pages/index";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; //マイページ対応
import { HttpStatus } from "src/const";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, Number("0.15")),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, Number("0.25")),
  },
  marginLeft: theme.spacing(Number("2")),
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, Number("2")),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(Number("4"))})`,
    transition: theme.transitions.create("width"),
    width: "8ch",
    [theme.breakpoints.up("sm")]: {
      width: "8ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function NavBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const colorMode = React.useContext(ColorModeContext);
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState);
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState); // 共通ステート

  React.useEffect(() => {
    async function fetchPost() {
      // ログイン情報を取得
      if (
        localStorage.getItem("logout") !== null &&
        localStorage.getItem("logout") === "true"
      ) {
        // 明示的にログアウトしている場合、グローバルから取得
        // ※この分岐はログイン無し状態を考慮している
        setLoginUser(g_loginUser);
      } else {
        // セッションから取得
        const sessionLoginUser = localStorage.getItem("LoginUser");
        if (sessionLoginUser !== null) {
          const wLoginUser: LoginUser = JSON.parse(sessionLoginUser);

          // マスタ情報と比較し、変更があれば最新の情報に上書きする
          const res_user = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountName?accountName=${wLoginUser.account_name}`
          );
          if (res_user.status === HttpStatus.Code.OK) {
            const user = (await res_user.json()) as User[];
            if (
              user[0].delete_flg === "0" &&
              (wLoginUser.user_name !== user[0].user_name ||
                wLoginUser.user_role !== user[0].user_role)
            ) {
              // ログイン情報にユーザー情報をセット
              wLoginUser.account_name = user[0].account_name;
              wLoginUser.user_name = user[0].user_name;
              wLoginUser.user_role = user[0].user_role;
              setGlobalLoginUser(wLoginUser);
            }
          }
          setLoginUser(wLoginUser);
        }
      }
    }
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g_loginUser.account_name]);
  // ログインユーザーを切り替える度に描画する考慮

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // TODO:後々はSSO認証するので、ログアウト自体不要になる。
  const logout = () => {
    setMobileOpen(false);

    // 明示的ログアウトフラグ　※意図的にログアウトしているかどうかの判定用
    localStorage.setItem("logout", "true");
    // ログイン情報破棄
    localStorage.removeItem("LoginUser");
    (document.getElementById("searchInput") as HTMLInputElement).value = "";
    location.pathname = "/";
  };

  const MENU_LIST = [
    // TODO:後々はSSO認証するので、ログアウト自体不要になる。 Start
    {
      title: "ログアウト",
      icon: <LogoutIcon />,
      href: "",
      display: loginUser.account_name !== "" ? true : false,
      onClick: logout,
    },
    // TODO:後々はSSO認証するので、ログアウト自体不要になる。 End
    // マイページ追加対応
    {
      title: "マイページ",
      icon: <AccountCircleIcon />,
      href: "/mypage",
      display: loginUser.account_name !== "" && loginUser.account_name !== "anonymous" ? true : false,
      onClick: () => {
        setMobileOpen(false);
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        router.push("/mypage");
      },
    },
    // マイページ追加対応　END
    {
      title: "ユーザ管理",
      icon: <SettingsIcon />,
      href: "/management/user",
      display: loginUser.user_role === "Administrator" ? true : false,
      onClick: () => {
        setMobileOpen(false);
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        router.push("/management/user");
      },
    },
    {
      title: "カテゴリ管理",
      icon: <StyleIcon />,
      href: "/management/category",
      display: loginUser.user_role === "Administrator" ? true : false,
      onClick: () => {
        setMobileOpen(false);
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        router.push("/management/category");
      },
    },
    {
      title: "登録",
      icon: <AddIcon />,
      href: "/register",
      display:
        loginUser.user_role === "Administrator" ||
        loginUser.user_role === "Editor"
          ? true
          : false,
      onClick: () => {
        const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
        newAppInfo.registerState = "登録";
        setAppInfo(newAppInfo);
        setMobileOpen(false);
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        router.push("/register");
      },
    },
  ];

  const MENU_LIST_Filter = MENU_LIST.filter((menu_list) => {
    return menu_list.display !== false;
  });

  const drawer = (
    <div>
      <List>
        {MENU_LIST_Filter.map(
          ({ title, icon, href, display, onClick }, index) => (
            <ListItem button key={title} onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          )
        )}
        <ListItem
          button
          onClick={() => {
            handleDrawerToggle();
            colorMode.toggleColorMode();
          }}
        >
          <ListItemIcon>
            <InvertColorsIcon />
          </ListItemIcon>
          <ListItemText primary="テーマ切換え" />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {loginUser.account_name !== "" ? (
              <Link href="/top">
                <Box
                  component="span"
                  onClick={() => {
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                  }}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  てすとあｐｐ★
                </Box>
              </Link>
            ) : (
              <></>
            )}
          </Typography>
          {MENU_LIST_Filter.map(({ title, href, icon, display, onClick }) => {
            return (
              <Typography
                noWrap
                sx={{ ml: 2, display: { xs: "none", sm: "block" } }}
                key={title}
              >
                <Link href={href}>
                  <IconButton
                    color="inherit"
                    sx={{
                      color: "white",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={onClick}
                  >
                    {icon}
                  </IconButton>
                </Link>
              </Typography>
            );
          })}
          <IconButton
            color="inherit"
            onClick={colorMode.toggleColorMode}
            sx={{ ml: 1, pt: 1.8, display: { xs: "none", sm: "block" } }}
          >
            <InvertColorsIcon />
          </IconButton>
          {loginUser.account_name !== "" ? (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                id={"searchInput"}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // エンターキー押下時の処理
                    const newAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    if (
                      (
                        document.getElementById(
                          "searchInput"
                        ) as HTMLInputElement
                      ).value === ""
                    ) {
                      newAppInfo.searchWord = "all";
                    } else {
                      newAppInfo.searchWord = (
                        document.getElementById(
                          "searchInput"
                        ) as HTMLInputElement
                      ).value;
                    }

                    // 評価フィルターを設定
                    if (newAppInfo.ratingValue === "0") {
                      newAppInfo.ratingValue = "0";
                    } else {
                      newAppInfo.ratingValue = appInfo.ratingValue;
                    }

                    // カテゴリ順を設定
                    if (newAppInfo.categoryId === "0") {
                      newAppInfo.categoryId = "0";
                    } else {
                      newAppInfo.categoryId = appInfo.categoryId;
                    }
                    // 並び順を設定
                    if (newAppInfo.selectedOrder === "3") {
                      newAppInfo.selectedOrder = "3";
                    } else {
                      newAppInfo.selectedOrder = appInfo.selectedOrder;
                    }

                    setAppInfo(newAppInfo);
                    router.push(`/search`);
                  }
                }}
              />
            </Search>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Toolbar />
    </Box>
  );
}
