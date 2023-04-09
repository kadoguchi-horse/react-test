import * as React from "react";
import { useRecoilState } from "recoil";
import ScreenShot from "src/types/ScreenShot";
import Image from "next/image";
import { Box } from "@mui/material";
import { ScreenShotDialog } from "src/types";
import { ScreenShotDialogState } from "src/stores/ScreenShotDialog";
import { Swiper, SwiperSlide } from "swiper/react"; // カルーセル用のタグをインポート
import SwiperCore, { Pagination, Navigation, FreeMode } from "swiper"; // 使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import swiperCss from "src/styles/ScreenShotSwiper.module.css"; // カスタム用CSS

// 使いたい機能を設定
SwiperCore.use([Pagination, Navigation, FreeMode]);

const AppListSwiper: React.FC<{ appId: string }> = ({ appId }) => {
  const [screenShot, setScreenShot] = React.useState<ScreenShot[]>([]);
  const [scrDialog, setscrDialog] = useRecoilState<ScreenShotDialog>(
    ScreenShotDialogState
  );

  React.useEffect(() => {
    async function fetchApps() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appScreenshot/searchAppId?appId=${appId}`
      );
      const apps = (await res.json()) as ScreenShot[];
      setScreenShot(apps);
    }
    fetchApps();
  }, [appId]);

  return (
    <div
      className={swiperCss.swiper_content}
      id={"screenShotSwoper"}
      onLoad={() => {
        if (screenShot.length === 0) {
          (
            document.getElementById("screenShotSwoper") as HTMLDivElement
          ).style.display = "none";
        } else {
          (
            document.getElementById("screenShotSwoper") as HTMLDivElement
          ).style.display = "block";
        }
      }}
    >
      <Swiper
        slidesPerView={1} // 一度に表示するスライドの数
        initialSlide={0}
        spaceBetween={50} // スライドの間隔
        loop={false} // スライドの繰り返し
        grabCursor={true} // マウスでのフリック
        navigation={{
          // スライドを前後させるためのボタン、スライドの左右にある
          prevEl: "#button_prev_screenshot", // 置き換えるhtml要素(Prevボタン)
          nextEl: "#button_next_screenshot", // 置き換えるhtml要素(Nextボタン)
        }}
        pagination={{
          clickable: true, // 何枚目のスライドかを示すアイコン、スライドの下の方にある
          el: "#pagination_screenshot", // 置き換えるhtml要素(Pageボタン)
          renderBullet: function (index, className) {
            return (
              '<span class="' +
              className +
              '" ' +
              'style="height: 18px; width:18px; background-color: gray; font-size: small;">' +
              (index + 1) +
              "</span>"
            );
          },
        }}
        freeMode={{
          enabled: true, // freeMode on
          momentum: true, // 慣性スクロール あり
        }}
      >
        {screenShot.map(({ app_id, image }) => (
          <SwiperSlide
            key={app_id}
            className={"swiper-Slide" + swiperCss.Swiper_Slide}
            onClick={() => {
              const newScrDialog: ScreenShotDialog = JSON.parse(
                JSON.stringify(scrDialog)
              );
              newScrDialog.dialogOpen = true;
              newScrDialog.dialogImage = image;
              setscrDialog(newScrDialog);
            }}
          >
            <Box
              style={{
                textAlign: "center",
                minWidth: "380px",
                minHeight: "200px",
                width: "auto",
                height: "auto",
              }}
            >
              <Image
                src={image}
                layout="fill"
                objectFit="contain"
                alt=""
              ></Image>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        id="button_prev_screenshot"
        className={"swiper-button-prev " + swiperCss.swiper_button_prev}
      ></div>
      <div
        id="button_next_screenshot"
        className={"swiper-button-next " + swiperCss.swiper_button_next}
      ></div>
      <div
        id="pagination_screenshot"
        className={"swiper-pagination " + swiperCss.swiper_pagination}
      ></div>
    </div>
  );
};

export default AppListSwiper;
