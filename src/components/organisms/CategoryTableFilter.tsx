import React, { useState } from "react";
import { Box, Grid, Typography, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { Category } from "src/types";

const filterFlg_categoryId = 1;
const filterFlg_categoryName = 2;
const filterFlg_order = 3;

const TableFilter = (props: {
  searchedid: any;
  searchedname: any;
  searchedsort: any;
  setsearchedid: React.Dispatch<React.SetStateAction<string>>;
  setsearchedname: React.Dispatch<React.SetStateAction<string>>;
  setSearchedsort: React.Dispatch<React.SetStateAction<string>>;
  initialRows: any;
  setRows: React.Dispatch<React.SetStateAction<Category[]>>;
}) => {
  const {
    searchedid,
    searchedname,
    searchedsort,
    initialRows,
    setRows,
    setsearchedid,
    setsearchedname,
    setSearchedsort,
  } = props;

  // 検索文字によってテーブルの行をフィルター関数
  const requestSearch = (searchedVal: string, flg: number) => {
    // console.log("searchedVal");
    // console.log(searchedVal);

    // console.log("initialRows");
    // console.log(initialRows);

    const filteredRows = initialRows.filter(
      (initialrows: {
        category_id: string;
        category_nm: string;
        sort_no: string;
      }) => {
        switch (flg) {
          case filterFlg_categoryId:
            return (
              (initialrows.category_id.toLowerCase().indexOf(searchedVal) >=
                0 ||
                initialrows.category_id.indexOf(searchedVal) >= 0) &&
              (initialrows.category_nm.toLowerCase().indexOf(searchedname) >=
                0 ||
                initialrows.category_nm.indexOf(searchedname) >= 0) &&
              (initialrows.sort_no.toLowerCase().indexOf(searchedsort) >= 0 ||
                initialrows.sort_no.indexOf(searchedsort) >= 0)
            );
            break;
          case filterFlg_categoryName:
            return (
              (initialrows.category_id.toLowerCase().indexOf(searchedid) >= 0 ||
                initialrows.category_id.indexOf(searchedid) >= 0) &&
              (initialrows.category_nm.toLowerCase().indexOf(searchedVal) >=
                0 ||
                initialrows.category_nm.indexOf(searchedVal) >= 0) &&
              (initialrows.sort_no.toLowerCase().indexOf(searchedsort) >= 0 ||
                initialrows.sort_no.indexOf(searchedsort) >= 0)
            );
            break;
          case filterFlg_order:
            return (
              (initialrows.category_id.toLowerCase().indexOf(searchedid) >= 0 ||
                initialrows.category_id.indexOf(searchedid) >= 0) &&
              (initialrows.category_nm.toLowerCase().indexOf(searchedname) >=
                0 ||
                initialrows.category_nm.indexOf(searchedname) >= 0) &&
              (initialrows.sort_no.toLowerCase().indexOf(searchedVal) >= 0 ||
                initialrows.sort_no.indexOf(searchedVal) >= 0)
            );
            break;
          default:
            return false;
        }
      }
    );
    setRows(filteredRows);

    // console.log("filteredRows");
    // console.log(filteredRows);
  };

  // 検索バーの文字が変化したときにフィルターを実行する関数
  const changeSearchedHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    flg: number
  ) => {
    switch (flg) {
      case filterFlg_categoryId:
        setsearchedid(event.target.value);
        break;
      case filterFlg_categoryName:
        setsearchedname(event.target.value);
        break;
      case filterFlg_order:
        setSearchedsort(event.target.value);
        break;
    }

    requestSearch(event.target.value, flg);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid style={{ margin: "20%" }}>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>ID</Typography>
          <TextField
            label="Filter…"
            variant="standard"
            value={searchedid}
            onChange={(event) =>
              changeSearchedHandler(event, filterFlg_categoryId)
            }
          ></TextField>
        </Grid>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>カテゴリ名</Typography>
          <TextField
            label="Filter…"
            variant="standard"
            value={searchedname}
            onChange={(event) =>
              changeSearchedHandler(event, filterFlg_categoryName)
            }
          />
        </Grid>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>表示順</Typography>
          <TextField
            label="Filter…"
            variant="standard"
            value={searchedsort}
            onChange={(event) => changeSearchedHandler(event, filterFlg_order)}
          ></TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableFilter;
