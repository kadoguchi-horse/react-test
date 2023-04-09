import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { AppInfo, Category } from "src/types";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles/";

const SelectCategoryBox: React.FC<{
  id: string;
  disable?: boolean;
  categoryKey: string[];
  categoryName: string[];
}> = ({ id, disable, categoryKey, categoryName }) => {
  const theme = useTheme();
  const theme_Chip = createTheme({
    palette: {
      text: {
        disabled: theme.palette.mode === "dark" ? "#000000DE" : "#FFFFFF",
      },
      warning: {
        main: theme.palette.mode === "dark" ? "#ffa726" : "#ED6C02",
        light: "#ED6C02",
        dark: "#ffa726",
      },
    },
  });

  const [appInfo] = useRecoilState<AppInfo>(appInfoState);
  const [categories, setCategories] = useState<Category[]>([]); // カテゴリマスタ全件格納
  const [selectedNames, setSelectedNames] = useState<string[]>(categoryName); // 選択されたカテゴリ名をカンマ区切り文字列で格納
  const [selectedKeys, setSelectedKeys] = useState<string[]>(categoryKey);
  const [beforeState, setBeforeState] = useState<string>(appInfo.registerState);

  // カテゴリー情報取得
  useEffect(() => {
    async function fetchApps() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
      );
      const rescategories = (await res.json()) as Category[];
      setCategories(rescategories);
    }
    fetchApps();

    if (appInfo.registerState === "更新") {
      setSelectedNames(categoryName);
      setSelectedKeys(categoryKey);
    } else if (beforeState !== appInfo.registerState) {
      setSelectedNames([]);
      setSelectedKeys([]);
    }

    setBeforeState(appInfo.registerState);
  }, [
    categoryName,
    categoryKey,
    appInfo.registerState,
    beforeState,
    setBeforeState,
  ]);

  // SelectBox 内での選択処理
  const handleChange = (event: SelectChangeEvent<typeof selectedNames>) => {
    // event.target.valueの取り出し
    const {
      target: { value },
    } = event;
    setSelectedNames(typeof value === "string" ? value.split(",") : value);
    let key: string = "";
    const key_array: string[] = [];
    for (let i = 0; value.length > i; i++) {
      for (let j = 0; categories.length > j; j++) {
        if (value[i] === categories[j].category_nm) {
          key_array.push(categories[j].category_id.toString());
        }
      }
    }
    key = key_array.join(",");
    setSelectedKeys(key.split(","));
  };

  // Chip の×ボタン押下で選択を解除
  const handleDelete = (name: string) => {
    setSelectedNames(selectedNames.filter((value) => value !== name));
    let key: string = "";
    for (let i = 0; categories.length > i; i++) {
      if (name === categories[i].category_nm) {
        key = categories[i].category_id.toString();
        setSelectedKeys(selectedKeys.filter((value) => value !== key));
      }
    }
  };

  return (
    <ThemeProvider theme={theme_Chip}>
      <FormControl
        style={{
          width: "100%",
          backgroundColor: disable !== true ? "white" : "",
          borderRadius: "5px",
        }}
        disabled={disable}
      >
        <textarea id={id} value={selectedKeys} readOnly hidden></textarea>
        <Select
          multiple
          value={selectedNames}
          inputProps={{}}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) =>
                disable === true ? (
                  <Chip
                    key={value}
                    label={value}
                    color={"warning"}
                    sx={{
                      "& .MuiChip-deleteIcon": { display: "none" },
                    }}
                  />
                ) : (
                  <Chip
                    key={value}
                    label={value}
                    color={"warning"}
                    onDelete={(event) => handleDelete(value)}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                  />
                )
              )}
            </Box>
          )}
        >
          {categories.map((category) => (
            <MenuItem key={category.category_id} value={category.category_nm}>
              <Checkbox
                checked={selectedNames.indexOf(category.category_nm) > -1}
              />
              <ListItemText primary={category.category_nm} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
};

export default SelectCategoryBox;
