import * as React from "react";
import TextField from "@mui/material/TextField";
import { ViewKanban } from "@mui/icons-material";

const TextFieldRequired: React.FC<{
  id: string;
  value: string;
  maxLength?: number;
  disabled?: boolean;
  pattern?: string;
  autoFocus?: boolean;
}> = ({ id, value, maxLength, disabled, pattern, autoFocus }) => {
  const [valueName, setValue] = React.useState(""); // テキストフィールド値更新に使用

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  // 入力エリア必須チェック（入力エリアが変更された場合で、何も入力がない場合は親エレメント背景色をピンクにする）
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    htmlElementid: string
  ) => {
    if (pattern === "number") {
      const patterns = /^\d*$/;
      if (patterns.test(event.target.value) || event.target.value === "") {
        const name = event.target.value;
        setValue(name);
      }
    } else if (pattern !== undefined) {
      const patterns = new RegExp(pattern);
      if (patterns.test(event.target.value) || event.target.value === "") {
        const name = event.target.value;
        setValue(name);
      }
    } else {
      const name = event.target.value;
      setValue(name);
    }
    if (event.currentTarget.value === "") {
      document.getElementById(htmlElementid)!.parentElement!.style.background =
        "#ffcccc";
    } else {
      document.getElementById(htmlElementid)!.parentElement!.style.background =
        "white";
    }
  };

  return (
    <TextField
      id={id}
      sx={{
        "& .MuiInputBase-input": { color: "#000000" },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "gray",
          backgroundColor: "#bbbbbb",
          borderRadius: "5px",
        },
      }}
      style={{ backgroundColor: "white", borderRadius: "5px" }}
      onChange={(event) => handleChange(event, id)}
      value={valueName}
      inputProps={{ maxLength: maxLength, pattern: pattern }}
      disabled={disabled}
      autoFocus={autoFocus}
    />
  );
};

export default TextFieldRequired;
