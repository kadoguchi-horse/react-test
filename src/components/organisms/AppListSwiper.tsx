import * as React from "react";
import App from "src/types/App";
import AppCard from "src/components/molecules/AppCard";
import { Swiper, SwiperSlide } from "swiper/react"; // カルーセル用のタグをインポート
import SwiperCore, { Pagination, Navigation, FreeMode } from "swiper"; // 使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import swiperCss from "src/styles/Swiper.module.css"; // カスタム用CSS

// 使いたい機能を設定
SwiperCore.use([Pagination, Navigation, FreeMode]);

const AppListSwiper: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const [apps, setApps] = React.useState<App[]>([]); // アプリ情報
  const [isLoad, setIsLoad] = React.useState(false); // ロード完了
  const narrowingDownApp = 10; //絞込み件数

  // アプリ情報取得
  React.useEffect(() => {
    async function fetchApps() {
      let res;
      let getapps;
      // 新着、各カテゴリで API の呼出し方法を切り替える
      if (categoryId === "new") {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?searchWord=&categoryId=&sort=2&offset=&limit=40`
        );
        getapps = (await res.json()) as App[];
        // 重複除外、10件絞込み ※カテゴリを指定していないので重複が発生する
        const filterapps = getapps.filter(
          (element, index, self) =>
            self.findIndex((e) => e.app_id === element.app_id) === index
        );
        const apps_slice = filterapps.slice(0, narrowingDownApp);
        setApps(apps_slice);
      } else {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?searchWord=&categoryId=${categoryId}&sort=2&offset=&limit=10`
        );
        getapps = (await res.json()) as App[];
        setApps(getapps);
      }
      // ロード完了状態にする
      setIsLoad(true);
    }
    fetchApps();
  }, [categoryId]);

  return (
    <div className={swiperCss.swiper_content}>
      <Swiper
        slidesPerView={1.1} // 一度に表示するスライドの数
        spaceBetween={10} // スライドの間隔
        loop={false} // スライドの繰り返し
        grabCursor={true} // マウスでのフリック
        navigation={{
          // スライドを前後させるためのボタン、スライドの左右にある
          prevEl: "#button_prev_" + categoryId, // 置き換えるhtml要素(Prevボタン)
          nextEl: "#button_next_" + categoryId, // 置き換えるhtml要素(Nextボタン)
        }}
        pagination={{
          clickable: true, // 何枚目のスライドかを示すアイコン、スライドの下の方にある
          el: "#pagination_" + categoryId, // 置き換えるhtml要素(Pageボタン)
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
          // sticky: true,           // 慣性スクロールが切れる着地点を固定にする
        }}
        breakpoints={{
          // 画面サイズ毎のスライド数
          600: { slidesPerView: 2.1 },
          900: { slidesPerView: 3.1 },
          1200: { slidesPerView: 4.1 },
          1536: { slidesPerView: 5.1 },
        }}
      >
        {isLoad ? (
          apps.length > 0 ? (
            apps.map((app) => {
              return (
                <SwiperSlide key={app.app_id}>
                  <AppCard app={app} />
                </SwiperSlide>
              );
            })
          ) : (
            <>該当するアプリがありません</>
          )
        ) : (
          <></>
        )}
      </Swiper>

      {/* 置き換え用要素 */}
      <div
        id={"button_prev_" + categoryId}
        className={"swiper-button-prev " + swiperCss.swiper_button_prev}
      ></div>
      <div
        id={"button_next_" + categoryId}
        className={"swiper-button-next " + swiperCss.swiper_button_next}
      ></div>
      <div
        id={"pagination_" + categoryId}
        className={"swiper-pagination " + swiperCss.swiper_pagination}
      ></div>
    </div>
  );
};

export default AppListSwiper;
