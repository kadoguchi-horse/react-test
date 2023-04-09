import React, { useEffect, useState, useRef } from "react";
import { ImgUpload } from "src/components/molecules";
import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import { ScreenShot } from "src/types";

const Screenshot: React.FC<{
  dispCnt: number;
  defaultImageStr: string;
  scrImages: string[];
  registerState: string;
}> = ({ dispCnt, defaultImageStr, scrImages, registerState }) => {
  // 更新、かつスクリーンショットを登録していた場合、登録した画像を初期値に設定
  // 上記以外の場合、デフォルトの画像を初期値に設定する。
  const [images, setImages] = useState<string[]>(
    registerState === "登録"
      ? [defaultImageStr]
      : scrImages.length === 0
      ? [defaultImageStr]
      : scrImages
  );
  const [loadIndex, setLoadIndex] = useState(1);
  const [dispAddBtn, setDispAddBtn] = useState(true);

  useEffect(() => {
    setImages(
      registerState === "登録"
        ? [defaultImageStr]
        : scrImages.length === 0
        ? [defaultImageStr]
        : scrImages
    );
  }, [registerState, defaultImageStr, scrImages]);

  // ADD押下時
  const addBtnClick = () => {
    if (dispCnt) {
      setLoadIndex(loadIndex + 1);
      const newImages = [...images, defaultImageStr];
      setImages(newImages);
      if (loadIndex + 1 >= dispCnt) {
        setDispAddBtn(false);
      }
    }
  };

  const changeList = (index: number) => {
    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      if (i !== index) {
        const imgval = (
          document.getElementById("scr" + (i + 1)) as HTMLInputElement
        ).value;
        newImages.push(imgval);
      }
    }

    setImages(newImages);
    setLoadIndex(loadIndex - 1);

    if (loadIndex - 1 < dispCnt) {
      setDispAddBtn(true);
    }
  };

  return (
    <Grid container>
      {images.map((value, index) => (
        <Grid
          item
          style={{ marginRight: "20px", marginBottom: "20px", width: "400px" }}
          key={index}
        >
          <ImgUpload
            id={"scr" + (index + 1)}
            type="screenshot"
            imgWidth="400px"
            imgHeight="250px"
            changeList={() => changeList(index)}
            imageSrc={value}
            displayClearBtn="inline-block"
          />
        </Grid>
      ))}
      <Grid item>
        <Button
          id="addBtn"
          startIcon={<AddIcon />}
          onClick={addBtnClick}
          variant="contained"
          style={{ display: dispAddBtn ? "flex" : "none" }}
        >
          ADD
        </Button>
      </Grid>
    </Grid>
  );
};

export default Screenshot;
