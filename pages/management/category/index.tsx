import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  Box,
  Modal,
  Typography,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  IconButton, //フィルタ機能追加対応
} from "@mui/material";
import {
  TableRow,
  TableCell,
  Paper,
  TableSortLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { visuallyHidden } from "@mui/utils";
import { CategoryInfo, Category, LoginUser } from "src/types";
import { categoryInfoState } from "src/stores/CategoryInfoState";
import TextFieldRequired from "src/components/atoms/TextFieldRequired";
import iconv from "iconv-lite";
import { parse } from "csv-parse/sync";
import { loginUserState } from "src/stores/LoginUserState";
import OkModal from "src/components/atoms/OkModal";

import FilterListIcon from "@mui/icons-material/FilterList"; //フィルタ機能追加対応
import Popover from "@mui/material/Popover"; //フィルタ機能追加対応
import TableFilter from "src/components/organisms/CategoryTableFilter"; //フィルタ機能追加対応
import { HttpStatus } from "src/const";

interface Data {
  category_id: number;
  category_nm: string;
  sort_no: number;
}

function createData(
  category_id: number,
  category_nm: string,
  sort_no: number
): Data {
  const row_btn: string = "";
  return {
    category_id,
    category_nm,
    sort_no,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (Number(b[orderBy]) < Number(a[orderBy])) {
    return -1;
  }
  if (Number(b[orderBy]) > Number(a[orderBy])) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  width: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "category_id",
    numeric: false,
    disablePadding: true,
    label: "ID",
    width: "20%",
  },
  {
    id: "category_nm",
    numeric: false,
    disablePadding: false,
    label: "カテゴリ名",
    width: "30%",
  },
  {
    id: "sort_no",
    numeric: false,
    disablePadding: false,
    label: "表示順",
    width: "auto",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  categories: Category[]; //フィルタ機能追加
  setFilterCategory: React.Dispatch<React.SetStateAction<Category[]>>; //フィルタ機能追加
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    categories, //フィルタ機能追加
    setFilterCategory, //フィルタ機能追加
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  //フィルタ機能追加
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClickfilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [searchedid, setsearchedid] = useState("");
  const [searchedname, setsearchedname] = useState("");
  const [searchedsort, setSearchedsort] = useState("");
  //END フィルタ機能追加

  return (
    <TableHead
      style={{
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <TableRow
        sx={{
          border: "1.5px solid gray",
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
      >
        <TableCell width={"50px"}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.width}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              style={{ height: "100%" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell key="row_btn" align="right" padding="normal" width="220px">
          {/* フィルタ機能追加 */}
          <IconButton
            //aria-describedby={id}
            //variant="contained"
            onClick={handleClickfilter}
          >
            <FilterListIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <TableFilter
              initialRows={categories}
              setRows={setFilterCategory}
              searchedid={searchedid}
              searchedname={searchedname}
              searchedsort={searchedsort}
              setsearchedid={setsearchedid}
              setsearchedname={setsearchedname}
              setSearchedsort={setSearchedsort}
            />
          </Popover>

          {/* フィルタ機能追加 */}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

class ProcInfo {
  message: string = "";
  okng: string = ""; // ok or ng
}

export default function EnhancedTable() {
  const router = useRouter();

  const defaultRowsPerPage = 5;
  const handleChangeTimer = 500; //タイマー秒数
  const checkCatagoryIdLength = 10; //カテゴリIDの文字数
  const checkCatagoryNameLength = 50; //カテゴリ名の文字数
  const checkCategorySortNoLength = 5; //表示順の桁数

  const number_catagoryId = 0; // カテゴリID(1番目)
  const number_categoryName = 1; // カテゴリ名(2番目)
  const number_categorySortno = 2; // カテゴリ表示順(3番目)
  const number_deleteFlg = 3; // 削除フラグ(4番目)
  const rowHeightTrue = 33; //正の場合の行の高さ
  const rowHeightFalse = 53; //負の場合の行の高さ

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("sort_no");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage] = React.useState(defaultRowsPerPage);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoryInfo, setCategoryInfo] =
    useRecoilState<CategoryInfo>(categoryInfoState); // 共通ステート
  const [uploadBtnDisplay, setUploadBtnDisplay] = React.useState(true);
  const [procInfo, setProcInfo] = React.useState(new ProcInfo()); // 処理結果
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [existSession, setExistSession] = React.useState(false);
  const contentType = { "Content-Type": "application/json" };

  //フィルタ機能追加
  const [filterCategory, setFilterCategory] = useState(categories);

  //END フィルタ機能追加

  // 追加ボタン
  function CreateBtnClick() {
    const newCategoryInfo: CategoryInfo = JSON.parse(
      JSON.stringify(categoryInfo)
    );
    newCategoryInfo.registerState = "登録";
    setCategoryInfo(newCategoryInfo);
    router.push(`/management/category/register`);
  }

  // 表示順の更新処理
  async function UpdateSortNo(categoryId: number, sortNo_Id: string) {
    let categorySortNo = "";

    categorySortNo = (document.getElementById(sortNo_Id) as HTMLInputElement)!
      .value;

    const res_category = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/searchCategoryId?categoryId=${categoryId}`
    );
    const category = (await res_category.json()) as Category[];

    // 表示順が変更されている場合のみ、更新APIを呼び出す
    if (category[0].sort_no !== Number(categorySortNo)) {
      const requestOption_update = {
        method: "POST",
        headers: contentType,
        body: JSON.stringify({
          categoryId: categoryId,
          sortNo: categorySortNo,
          user: loginUser.account_name,
        }),
      };
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/update`,
        requestOption_update
      );
    }
  }

  // 編集ボタン
  function EditBtnClick(row: Category) {
    const updCategorInfo: CategoryInfo = JSON.parse(
      JSON.stringify(categoryInfo)
    );
    updCategorInfo.registerState = "更新";
    updCategorInfo.category_Id = row.category_id.toString();
    setCategoryInfo(updCategorInfo);
    router.push(`/management/category/register`);
  }

  // 削除ボタン
  async function DeleteBtnClick(row: Category) {
    const updCategorInfo: CategoryInfo = JSON.parse(
      JSON.stringify(categoryInfo)
    );
    updCategorInfo.registerState = "削除";
    setCategoryInfo(updCategorInfo);
    // 更新 API を呼び出す
    const requestOption_update = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        categoryId: row.category_id.toString(),
        user: loginUser.account_name,
        deleteFlg: "1",
      }),
    };
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/update`,
      requestOption_update
    );

    // 処理完了 Modal 表示
    setProcInfo({
      message: `カテゴリを削除しました。`,
      okng: "ok",
    } as ProcInfo);
  }

  // まとめて削除ボタン
  async function SelectedDeleteBtnClick() {
    stableSort(categories, getComparator(order, orderBy)).forEach(
      (row, index) => {
        if (isSelected(row.category_id.toString())) {
          DeleteBtnClick(row);
        }
      }
    );
    // 処理完了 Modal 表示
    // setModalDisplay(true);
    // メッセージモーダル表示
    setProcInfo({
      message: `カテゴリを削除しました。`,
      okng: "ok",
    } as ProcInfo);
  }

  // 必須入力が全て埋まっているかチェック
  function HandleChange() {
    window.setTimeout(() => {
      const checkSortNo: string[] = [];

      categories.forEach((category) => {
        //フィルタリング機能追加
        if (
          (document.getElementById(
            "sortNo" + category.category_id
          ) as HTMLInputElement) &&
          (document.getElementById(
            "sortNo" + category.category_id
          ) as HTMLInputElement)!.value === ""
        ) {
          console.log(
            (document.getElementById(
              "sortNo" + category.category_id
            ) as HTMLInputElement)!.value
          );
          checkSortNo.push("True");
        }
      });
      if (checkSortNo.length === 0) {
        setUploadBtnDisplay(true);
      } else {
        setUploadBtnDisplay(false);
      }
    }, handleChangeTimer);
  }

  // CSVインポートボタン
  const fileUpload = () => {
    inputRef.current!.click();
  };

  // CSVインポートボタン処理
  async function onFileInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) {
    if (event.currentTarget.files![0] != null) {
      const csv = event.currentTarget.files![0];
      if (csv === undefined) {
        // ダイアログをキャンセルした場合は何もしない。
        return;
      }

      // ファイル読み込み
      const reader: any = new FileReader();
      const readCsv = async () => {
        const csvString = iconv.decode(Buffer.from(reader.result), "UTF-8"); // 文字コードを UTF-8 に変換
        const records = parse(csvString, {
          columns: false,
          skip_empty_lines: true,
        }); // CSVファイルを JavaScriptのオブジェクト に変換

        let category_id: string = "";
        let i = 0;

        // 読込後の処理
        try {
          // 入力チェック
          if (records.length === 0) {
            throw new Error(`ファイルが空です`);
          }

          for (i = 0; i < records.length; i++) {
            category_id = records[i][number_catagoryId]; // カテゴリID(1番目)
            const category_name: string = records[i][number_categoryName]; // カテゴリ名(2番目)
            const category_sortno: string = records[i][number_categorySortno]; // カテゴリ表示順(3番目)
            const delete_flg: string = records[i][number_deleteFlg]; // 削除フラグ(4番目)

            if (i === 0) {
              // ヘッダ行
              // キー項目存在チェック
              if (category_id !== "カテゴリID") {
                throw new Error("項目 'カテゴリID'　が存在しません");
              }
            } else {
              // 明細
              // 区分チェック
              if (delete_flg !== "0" && delete_flg !== "1") {
                throw new Error(
                  `項目4番目(削除フラグ)は '0' '1' のいずれかで設定してください`
                );
              }

              // 桁数チェック
              if (category_id.length > checkCatagoryIdLength) {
                throw new Error(
                  `項目1番目(カテゴリID)は 10桁以下にしてください`
                );
              }
              if (category_name.length > checkCatagoryNameLength) {
                throw new Error(
                  `項目2番目(カテゴリ名)は 50文字以下にしてください`
                );
              }
              if (category_sortno.length > checkCategorySortNoLength) {
                throw new Error(`項目3番目(表示順)は 5桁以下にしてください`);
              }
            }
          }

          // 登録処理
          for (i = 1; i < records.length; i++) {
            category_id = records[i][number_catagoryId]; // カテゴリID(1番目)
            const category_name: string = records[i][number_categoryName]; // カテゴリ名(2番目)
            const category_sortno: string = records[i][number_categorySortno]; // カテゴリ表示順(3番目)
            const delete_flg: string = records[i][number_deleteFlg]; // 削除フラグ(4番目)

            // 存在チェック
            const res_category = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/searchCategoryId?categoryId=${category_id}`
            );

            if (res_category.status === HttpStatus.Code.NOT_FOUND) {
              // 存在しない（登録）
              const requestOption_create = {
                method: "POST",
                headers: contentType,
                body: JSON.stringify({
                  categoryId: category_id, // カテゴリID
                  categoryName: category_name, // カテゴリ名
                  sortNo: category_sortno, // 表示順
                  deleteFlg: delete_flg, // 削除フラグ
                  user: loginUser.account_name,
                }),
              };
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/create`,
                requestOption_create
              );
              if (res.status !== HttpStatus.Code.CREATED) {
                throw new Error(`更新状況とファイルをご確認ください`);
              }
            } else if (res_category.status === HttpStatus.Code.OK) {
              // 存在する（更新）
              const requestOption_update = {
                method: "POST",
                headers: contentType,
                body: JSON.stringify({
                  categoryId: category_id, // カテゴリID
                  categoryName: category_name, // カテゴリ名
                  sortNo: category_sortno, // 表示順
                  deleteFlg: delete_flg, // 削除フラグ
                  user: loginUser.account_name,
                }),
              };
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/update`,
                requestOption_update
              );
              if (res.status !== HttpStatus.Code.OK) {
                throw new Error(`更新状況とファイルをご確認ください`);
              }
            }
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            // メッセージモーダル表示
            setProcInfo({
              message:
                `${
                  i + 1
                }行目( ${category_id} ) の読み込みでエラーが発生しました。\n` +
                err.message,
              okng: "ng",
            } as ProcInfo);
            return false;
          }
        }

        const updCategorInfo: CategoryInfo = JSON.parse(
          JSON.stringify(categoryInfo)
        );
        updCategorInfo.registerState = "登録";
        setCategoryInfo(updCategorInfo);
        setProcInfo({
          message: `ユーザーをインポートしました。`,
          okng: "ok",
        } as ProcInfo);
        return true;
      };

      reader.onload = readCsv;
      reader.onerror = () => {
        console.log(event);
      };
      reader.readAsArrayBuffer(csv);

      // ファイル選択クリア
      (document.getElementById("fileUploadInput") as HTMLInputElement).value =
        "";
    }
  }

  // カテゴリ情報取得
  useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }

    async function fetchcategories() {
      const res_categorie = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
      );
      const categories_json = (await res_categorie.json()) as Category[];
      setCategories(categories_json);
      setFilterCategory(categories_json); //フィルタ機能追加
    }
    fetchcategories();
  }, [setExistSession, setLoginUser]);

  // モーダルクローズ処理
  const modalClose_ok = () => {
    // 再表示する
    window.location.reload();
  };
  const modalClose_ng = () => {
    // モーダル情報を初期化する
    setProcInfo(new ProcInfo());
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = categories.map((n) => n.category_nm);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    category_id: string | number
  ) => {
    const selectedIndex = selected.indexOf(category_id.toString());
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, category_id.toString());
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (account_name: string) =>
    selected.indexOf(account_name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

  if (existSession === false) {
    // セッションが破棄されている場合
    return <p>読込中...</p>;
  } else if (loginUser.user_role !== "Administrator") {
    // 権限を持たないユーザーの場合
    return <p>権限がありません</p>;
  } else {
    return (
      <Box sx={{ width: "100%" }}>
        <div style={{ margin: "20px 0px 10px 0px", textAlign: "right" }}>
          <input
            ref={inputRef}
            onChange={(event) => {
              onFileInputChange(event, "");
            }}
            hidden
            type="file"
            accept=".csv"
            id="fileUploadInput"
          />
          <Button
            variant="contained"
            endIcon={<InsertDriveFileIcon />}
            onClick={fileUpload}
          >
            CSVインポート
          </Button>

          {selected.length > 0 ? (
            <Button
              style={{ marginLeft: "10px" }}
              variant="contained"
              color="error"
              endIcon={<DeleteIcon />}
              onClick={() => {
                SelectedDeleteBtnClick();
              }}
            >
              まとめて削除
            </Button>
          ) : (
            false
          )}
        </div>

        <Paper sx={{ width: "100%", mb: 2 }} onChange={HandleChange}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={categories.length}
                categories={categories}
                setFilterCategory={setFilterCategory}
              />
              <TableBody id="categoryListTable" style={{ height: "550px" }}>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.sort(getComparator(order, orderBy)).slice() */}
                {/* {stableSort(categories, getComparator(order, orderBy)).map( */}
                {stableSort(filterCategory, getComparator(order, orderBy)).map(
                  (row, index) => {
                    const isItemSelected = isSelected(
                      row.category_id.toString()
                    );
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const labelId_Name = `table-categoryname-${index}`;
                    const labelId_SortNo = `table-sortno-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.category_id}
                        selected={isItemSelected}
                      >
                        <TableCell width={"50px"}>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                            onClick={(event) =>
                              handleClick(event, row.category_id)
                            }
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.category_id}
                        </TableCell>
                        <TableCell id={labelId_Name} align="left">
                          {row.category_nm}
                        </TableCell>
                        <TableCell id={labelId_SortNo} align="left">
                          <div
                            onBlur={() =>
                              UpdateSortNo(
                                row.category_id,
                                "sortNo" + row.category_id
                              )
                            }
                          >
                            <TextFieldRequired
                              id={"sortNo" + row.category_id}
                              value={row.sort_no.toString()}
                              maxLength={5}
                              pattern="number"
                            />
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 2.0 }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<EditIcon />}
                              onClick={() => {
                                EditBtnClick(row);
                              }}
                            >
                              編集
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<DeleteIcon />}
                              onClick={() => {
                                DeleteBtnClick(row);
                              }}
                            >
                              削除
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height:
                        (dense ? rowHeightTrue : rowHeightFalse) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <div style={{ margin: "0px 0px 10px 0px", textAlign: "right" }}>
          <Button
            variant="contained"
            color="warning"
            style={{ marginRight: "10px" }}
            endIcon={<RefreshIcon />}
            disabled={!uploadBtnDisplay}
            onClick={() => {
              window.location.reload();
            }}
          >
            表示順更新
          </Button>

          <Button
            variant="contained"
            color="info"
            endIcon={<AddIcon />}
            onClick={() => {
              CreateBtnClick();
            }}
          >
            追加
          </Button>
        </div>

        <OkModal
          open={procInfo.okng !== ""}
          onClose={
            procInfo.okng === "ok"
              ? modalClose_ok
              : procInfo.okng === "ng"
              ? modalClose_ng
              : undefined
          }
          onClick={
            procInfo.okng === "ok"
              ? modalClose_ok
              : procInfo.okng === "ng"
              ? modalClose_ng
              : undefined
          }
          detailText={procInfo.message}
        />
      </Box>
    );
  }
}
