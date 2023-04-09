import React, { useEffect, useState } from "react";
import { Category } from "src/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const SelectCategorie: React.FC<{
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]); // カテゴリ情報

  // カテゴリ情報取得
  useEffect(() => {
    async function fetchApps() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
      );
      const rescategories = (await res.json()) as Category[];
      setCategories(rescategories);
    }
    fetchApps();
  }, []);

  return (
    <FormControl
      sx={{ m: 0, minWidth: 120 }}
      size="small"
      style={{ paddingRight: "15px" }}
    >
      <InputLabel id="categorie-select-label">カテゴリ</InputLabel>
      <Select
        labelId="categorie-select-label"
        id="categorie-select"
        value={value}
        label="カテゴリ"
        onChange={onChange}
        ref={React.createRef()}
      >
        <MenuItem value="0">全てのアプリ</MenuItem>
        {categories.map(({ category_id, category_nm }) => (
          <MenuItem key={category_id} value={category_id}>
            {category_nm}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCategorie;
