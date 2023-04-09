import React, { useRef } from "react";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";

const ImgUpload: React.FC<{
  id: string;
  type: string;
  imgWidth: string;
  imgHeight: string;
  changeList: () => void;
  imageSrc: string;
  displayClearBtn: string;
}> = ({
  id,
  type,
  imgWidth,
  imgHeight,
  changeList,
  imageSrc,
  displayClearBtn,
}) => {
  // イメージデータ(Base64)格納ステート
  const [base64, setBase64] = useState<string>(imageSrc);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    function () {
      setBase64(imageSrc);
    },
    [imageSrc]
  );

  const fileUpload = () => {
    inputRef.current!.click();
  };

  const onFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    imgType: string
  ) => {
    if (event.currentTarget.files![0] != null) {
      event.preventDefault();

      const files = event.currentTarget.files!;
      const file = files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        // ドロップした画像の情報を取得(Base64)
        const base64Text = "" + reader!.result;
        const img = new window.Image();
        img.src = base64Text;
        img.onload = function () {
          // 10MBファイルサイズチェック
          const fileUploadMaxByte = 10485760;
          if (file.size > fileUploadMaxByte) {
            window.alert(
              "アップロードするファイルサイズは10MB以下のものにしてください"
            );
            return;
          }

          // 画像の大きさを判定し、下記サイズ以上の場合はアップさせない（アイコン:512px*512px　サムネイル:3200px*1500px）
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          if (imgType === "icon") {
            const whMaxIcon = 512
            if (width > whMaxIcon && height > whMaxIcon) {
              window.alert(
                "アップロードするアイコンの画像サイズは 512px × 512px 以下のものにしてください"
              );
            } else {
              setBase64(base64Text);
            }
          } else if (imgType === "screenshot") {
            const wMaxIcon = 3200
            const hMaxIcon = 1800
            if (width > wMaxIcon && height > hMaxIcon) {
              window.alert(
                "アップロードするスクリーンショットの画像サイズは 3200px × 1800px 以下のものにしてください"
              );
            } else {
              setBase64(base64Text);
            }
          } else {
            const wMaxOther = 3200
            const hMaxOther = 1800
            if (width > wMaxOther && height > hMaxOther) {
              window.alert(
                "アップロードするサムネイルの画像サイズは 3200px × 1800px 以下のものにしてください"
              );
            } else {
              setBase64(base64Text);
            }
          }
        };
      };
    }
  };

  return (
    <Box>
      <Box
        style={{
          position: "relative",
          maxWidth: imgWidth,
          maxHeight: imgHeight,
          border: "1px solid",
          borderColor: "#aaaaaa",
        }}
      >
        <Image
          id={id + "Img"}
          src={base64}
          alt={id}
          width={imgWidth}
          height={imgHeight}
        ></Image>
        <ClearIcon
          style={{
            position: "absolute",
            right: "0px",
            display: displayClearBtn,
          }}
          onClick={() => changeList()}
        />
        <textarea id={id} value={base64} readOnly hidden></textarea>
      </Box>
      <Button
        variant="contained"
        onClick={fileUpload}
        style={{ marginTop: "10px" }}
      >
        ファイルアップロード
      </Button>
      <input
        ref={inputRef}
        onChange={(event) => onFileInputChange(event, type)}
        hidden
        type="file"
        accept="image/*"
      />
    </Box>
  );
};

export default ImgUpload;
