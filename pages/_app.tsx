import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import PropTypes from "prop-types";
import { RecoilRoot } from "recoil";
import createEmotionCache from "src/utils/createEmotionCache";
import ColorModeContext from "src/stores/ColorModeContext";
import NavBar from "src/components/templates/NavBar";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { blueGrey, grey } from "@mui/material/colors";
import "swiper/css/bundle";
import { User, LoginUser } from "src/types";
import { HttpStatus } from "src/const";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  React.useEffect(() => {
    // 画面遷移毎に走る処理

    // セッション保持しているカラーモードを適用する
    setMode(localStorage.getItem("colorMode") === "light" ? "light" : "dark");

    // セッションが破棄されている場合、初期画面に遷移
    if (
      (localStorage.length === 0 ||
        // TODO:後々はSSO認証するので、明示的ログアウト自体不要になる。 Start
        localStorage.getItem("logout") === "true") &&
      // TODO:後々はSSO認証するので、明示的ログアウト自体不要になる。 End
      props.router.pathname !== "/"
    ) {
      location.pathname = "/";
      return;
    }

    async function fetchPost() {
      // セッションのユーザーが削除されている場合は、ログアウトする
      const sessionLoginUser = localStorage.getItem("LoginUser");
      if (sessionLoginUser !== null) {
        const wLoginUser: LoginUser = JSON.parse(sessionLoginUser);

        const res_user = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountName?accountName=${wLoginUser.account_name}`
        );
        const user = (await res_user.json()) as User[];
        if (
          res_user.status === HttpStatus.Code.OK &&
          user[0].delete_flg === "1"
        ) {
          // 明示的ログアウトフラグ　※意図的にログアウトしているかどうかの判定用
          localStorage.setItem("logout", "true");
          // ログイン情報破棄
          localStorage.removeItem("LoginUser");

          location.pathname = "/";
          return;
        }
      }
    }
    fetchPost();
  }, [props.router.pathname]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Theme 切換え
  const [mode, setMode] = React.useState("dark");
  const grayCode = 800;
  const blueGreyDode = 100;
  const theme =
    mode === "dark"
      ? createTheme({
          palette: {
            mode: "dark",
            background: {
              paper: grey[grayCode],
            },
          },
        })
      : createTheme({
          palette: {
            mode: "light",
            background: {
              default: blueGrey[blueGreyDode],
            },
          },
        });
  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      localStorage.setItem("colorMode", mode === "light" ? "dark" : "light");
    },
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <RecoilRoot>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <NavBar />
            <Container maxWidth="xl">
              <Component {...pageProps} />
            </Container>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </RecoilRoot>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
