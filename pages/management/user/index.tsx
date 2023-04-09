import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableSortLabel,
  Checkbox,
  TablePagination,
  IconButton, //フィルタ機能追加対応
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { visuallyHidden } from "@mui/utils";
import { User, UserInfo, LoginUser } from "src/types";
import { userInfoState } from "src/stores/UserInfoState";
import iconv from "iconv-lite";
import { parse } from "csv-parse/sync";
import { loginUserState } from "src/stores/LoginUserState";
import OkModal from "src/components/atoms/OkModal";
import InProgressDisplay from "src/components/atoms/InProgressDisplay";
import { setGlobalLoginUser } from "pages/index";
import { equal } from "assert";

import FilterListIcon from "@mui/icons-material/FilterList"; //フィルタ機能追加対応
import Popover from "@mui/material/Popover"; //フィルタ機能追加対応
import TableFilter from "src/components/organisms/UserTablefilter"; //フィルタ機能追加対応
import user from "models/user";
import { HttpStatus } from "src/const";

interface Data {
  account_name: string;
  user_name: string;
  user_role: string;
}

function createData(
  account_name: string,
  user_name: string,
  user_role: string
): Data {
  const row_btn: string = "";
  return {
    account_name,
    user_name,
    user_role,
  };
}

interface csvData {
  account_name: string;
  user_name: string;
  user_role: string;
  delete_flg: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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
    id: "account_name",
    numeric: false,
    disablePadding: true,
    label: "アカウント名",
    width: "20%",
  },
  {
    id: "user_name",
    numeric: false,
    disablePadding: false,
    label: "氏名",
    width: "30%",
  },
  {
    id: "user_role",
    numeric: false,
    disablePadding: false,
    label: "権限",
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
  users: User[]; //フィルタ機能追加
  setFilterUser: React.Dispatch<React.SetStateAction<User[]>>; //フィルタ機能追加
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    users, //フィルタ機能追加
    setFilterUser, //フィルタ機能追加
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

  const [searched_account_name, setsearched_account_name] = useState("");
  const [searched_user_name, setsearched_user_name] = useState("");
  const [searched_user_role, setsearched_user_role] = useState("");
  //END フィルタ機能追加

  return (
    <TableHead>
      <TableRow
        sx={{
          border: "1.5px solid gray",
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
      >
        {/*
        <TableCell padding="checkbox">
        */}
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
              initialRows={users}
              setRows={setFilterUser}
              searched_account_name={searched_account_name}
              searched_user_name={searched_user_name}
              searched_user_role={searched_user_role}
              setsearched_account_name={setsearched_account_name}
              setsearched_user_name={setsearched_user_name}
              setsearched_user_role={setsearched_user_role}
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

  const checkAccounNameLength = 50; //アカウント名の最大文字数
  const checkUserNameLength = 50; //氏名の最大文字数

  const number_accounName = 0; // アカウント名(1番目)
  const number_userName = 1; // 氏名(2番目)
  const number_userRole = 2; // 権限(3番目)
  const number_deleteFlg = 3; // 削除フラグ(4番目)

  const rowHeightTrue = 33; //正の場合の行の高さ
  const rowHeightFalse = 53; //負の場合の行の高さ

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("account_name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [users, setUsers] = useState<User[]>([]); // ユーザー情報
  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState); // 共通ステート
  const [procInfo, setProcInfo] = React.useState(new ProcInfo()); // 処理結果
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [existSession, setExistSession] = React.useState(false);

  const [filterUser, setFilterUser] = useState(users); //フィルタ機能追加
  const [inProgressCSV, setInProgressCSV] = useState(false);
  const contentType = { "Content-Type": "application/json" };

  // 追加ボタン
  function CreateBtnClick() {
    const newUserInfo: UserInfo = JSON.parse(JSON.stringify(userInfo));
    newUserInfo.registerState = "登録";
    setUserInfo(newUserInfo);
    router.push(`/management/user/register`);
  }

  // 編集ボタン
  function EditBtnClick(row: User) {
    const updUserInfo: UserInfo = JSON.parse(JSON.stringify(userInfo));
    updUserInfo.registerState = "更新";
    updUserInfo.selectedAccountName = row.account_name;
    setUserInfo(updUserInfo);
    router.push(`/management/user/register`);
  }

  // 削除ボタン
  async function DeleteBtnClick(row: User, all: boolean = false) {
    const updUserInfo: UserInfo = JSON.parse(JSON.stringify(userInfo));
    updUserInfo.registerState = "削除";
    setUserInfo(updUserInfo);
    // 更新 API を呼び出す
    const requestOption_update = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        accountName: row.account_name,
        user: loginUser.account_name,
        deleteFlg: "1",
      }),
    };
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`,
      requestOption_update
    );

    if (all !== true) {
      // メッセージモーダル表示
      setProcInfo({
        message: `ユーザーを削除しました。`,
        okng: "ok",
      } as ProcInfo);
    }
  }

  // まとめて削除ボタン
  async function SelectedDeleteBtnClick() {
    stableSort(users, getComparator(order, orderBy)).forEach((row, index) => {
      if (isSelected(row.account_name)) {
        DeleteBtnClick(row, true);
      }
    });

    // メッセージモーダル表示
    setProcInfo({
      message: `ユーザーを削除しました。`,
      okng: "ok",
    } as ProcInfo);
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

        setInProgressCSV(true);
        // 読込後の処理
        try {
          // 入力チェック
          if (records.length === 0) {
            throw new Error(`ファイルが空です。`);
          }

          for (let i = 0; i < records.length; i++) {
            const account_name = records[i][number_accounName]; // アカウント名(1番目)
            const user_name: string = records[i][number_userName]; // 氏名(2番目)
            const user_role: string = records[i][number_userRole]; // 権限(3番目)
            const delete_flg: string = records[i][number_deleteFlg]; // 削除フラグ(4番目)

            if (i === 0) {
              // ヘッダ行
              // キー項目存在チェック
              if (account_name !== "アカウント名") {
                throw new Error(
                  `項目 'アカウント名'　が存在しません。`
                );
              }
            } else {
              // 明細
              // 区分チェック
              if (
                user_role !== "Administrator" &&
                user_role !== "Editor" &&
                user_role !== "User"
              ) {
                throw new Error(
                  `${i + 1}行目( ${account_name} ) の処理中にエラーが発生しました。\n` +
                  `項目3番目(権限)は 'Administrator' 'Editor' 'User' のいずれかで設定してください。`
                );
              }
              if (delete_flg !== "0" && delete_flg !== "1") {
                throw new Error(
                  `${i + 1}行目( ${account_name} ) の処理中にエラーが発生しました。\n` +
                  `項目4番目(削除フラグ)は '0' '1' のいずれかで設定してください。`
                );
              }

              // 桁数チェック
              if (account_name.length > checkAccounNameLength) {
                throw new Error(
                  `${i + 1}行目( ${account_name} ) の処理中にエラーが発生しました。\n` +
                  `項目1番目(アカウント名)は 50文字以下にしてください。`
                );
              }
              if (user_name.length > checkUserNameLength) {
                throw new Error(
                  `${i + 1}行目( ${account_name} ) の処理中にエラーが発生しました。\n` +
                  `項目2番目(氏名)は 50文字以下にしてください。`
                );
              }
            }
          }

          const prcSpan = 100; // 処理件数

          // 登録/処理処理の仕分け
          const createRecords: csvData[] = [];      // 登録レコード情報
          const updateRecords: csvData[] = [];      // 更新レコード情報

          for (let j = 1; j < records.length; j += prcSpan) {
            const targetAccountNames: string[] = [];  // 対象アカウント名情報
            const targetRecords: csvData[] = [];      // 対象レコード情報

            for (let i = j; i < records.length && i < j + prcSpan; i++) {
              const account_name = records[i][number_accounName]; // アカウント名(1番目)
              const user_name: string = records[i][number_userName]; // 氏名(2番目)
              const user_role: string = records[i][number_userRole]; // 権限(3番目)
              const delete_flg: string = records[i][number_deleteFlg]; // 削除フラグ(4番目)

              targetAccountNames.push(account_name);
              targetRecords.push({
                account_name: account_name,
                user_name: user_name,
                user_role: user_role,
                delete_flg: delete_flg,
              });
            }

            // 存在チェック
            const res_user = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountNames?accountNames=${targetAccountNames}`
            );
            const existsRecords = (await res_user.json()) as User[];

            // create/updateの仕分け
            targetRecords.forEach(function(targetRecord){
              //  対象レコード情報と存在チェック結果から、存在チェック
              if (!existsRecords.some(function(t){ 
                return t.account_name === targetRecord.account_name; 
              })) { 
                // 存在しない場合
                // 登録対象レコード情報の重複チェック
                if (!createRecords.some(function(u){ 
                  return u.account_name === targetRecord.account_name; 
                })) {
                  // 存在しない場合
                  createRecords.push({
                    account_name: targetRecord.account_name,
                    user_name: targetRecord.user_name,
                    user_role: targetRecord.user_role,
                    delete_flg: targetRecord.delete_flg,
                  }); 
                } else {
                  // 既に存在する場合、後勝ちにするために更新する
                  const createRecord: csvData = createRecords.filter(
                    (record) => record.account_name === targetRecord.account_name
                  )[0];
                  createRecord.user_name = targetRecord.user_name;
                  createRecord.user_role = targetRecord.user_role;
                  createRecord.delete_flg = targetRecord.delete_flg;
                }
              } else {
                // 存在する場合 
                updateRecords.push({
                  account_name: targetRecord.account_name,
                  user_name: targetRecord.user_name,
                  user_role: targetRecord.user_role,
                  delete_flg: targetRecord.delete_flg,
                });
              }
            }); 
          }
          
          // 一括登録処理
          const createSpan = 100; // 一括登録件数
          for (let j = 0; j < createRecords.length; j += createSpan) {
            const bodys: any[] = [];
            createRecords.slice(j, j + createSpan).forEach(function(creatRrecord) {
              bodys.push({
                accountName: creatRrecord.account_name, // アカウント名
                userName: creatRrecord.user_name,       // 氏名
                userRole: creatRrecord.user_role,       // 権限
                // deleteFlg: creatRrecord.delete_flg,  // 削除フラグ　※新規追加時は不要
                user: loginUser.account_name,
              });
            });
            const requestOption_create = {
              method: "POST",
              headers: contentType,
              body: JSON.stringify(bodys),
            };
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/bulkCreate`,
              requestOption_create
            );
            if (res.status !== HttpStatus.Code.CREATED) {
              throw new Error(
                `新規登録処理中にエラーが発生しました。\n` +
                `更新状況とファイルをご確認ください。`
              );
            }
          }

          // 更新処理
          for (let j = 0; j < updateRecords.length; j ++) {
            const updateRecord: csvData = updateRecords[j];

            const requestOption_update = {
              method: "POST",
              headers: contentType,
              body: JSON.stringify({
                accountName: updateRecord.account_name, // アカウント名
                userName: updateRecord.user_name,       // 氏名
                userRole: updateRecord.user_role,       // 権限
                deleteFlg: updateRecord.delete_flg,     // 削除フラグ
                user: loginUser.account_name,
              }),
            };
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`,
              requestOption_update
            );
            if (res.status !== HttpStatus.Code.OK) {
              throw new Error(
                `更新処理中にエラーが発生しました。\n` +
                `更新状況とファイルをご確認ください。`
              );
            }

            // ログイン情報を上書きする
            const sessionLoginUser = localStorage.getItem("LoginUser");
            if (sessionLoginUser !== null) {
              const loginuser: LoginUser = JSON.parse(sessionLoginUser);
              if (loginuser.account_name === updateRecord.account_name) {
                loginuser.account_name = updateRecord.account_name;
                loginuser.user_name = updateRecord.user_name;
                loginuser.user_role = updateRecord.user_role;

                setGlobalLoginUser(loginuser);
              }
            }
          }

        } catch (err: unknown) {
          if (err instanceof Error) {
            // メッセージモーダル表示
            setProcInfo({
              message: err.message,
              okng: "ng",
            } as ProcInfo);
            return false;
          }
        } finally {
          setInProgressCSV(false);
        }

        // メッセージモーダル表示
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

  // ユーザー情報取得
  useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }

    // ユーザー情報取得
    async function fetchUsers() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/all`
      );
      const resusers = (await res.json()) as User[];
      setUsers(resusers);
      setFilterUser(resusers); //フィルタ機能追加
    }
    fetchUsers();
  }, [setLoginUser]);

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
      const newSelected = users.map((n) => n.account_name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    account_name: string
  ) => {
    const selectedIndex = selected.indexOf(account_name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, account_name);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setDense(event.target.checked);
  };

  const isSelected = (account_name: string) =>
    selected.indexOf(account_name) !== -1;

  const numRowsPerPage5 = 5;
  const numRowsPerPage10 = 10;
  const numRowsPerPage25 = 25;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

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

        <Paper sx={{ width: "100%", mb: 2 }}>
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
                rowCount={users.length}
                users={users}
                setFilterUser={setFilterUser}
              />
              <TableBody>
                {stableSort(filterUser, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.account_name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.account_name}
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
                              handleClick(event, row.account_name)
                            }
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.account_name}
                        </TableCell>
                        <TableCell align="left">{row.user_name}</TableCell>
                        <TableCell align="left">{row.user_role}</TableCell>
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
                  })}
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
          <TablePagination
            rowsPerPageOptions={[numRowsPerPage5, numRowsPerPage10, numRowsPerPage25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <div style={{ margin: "0px 0px 10px 0px", textAlign: "right" }}>
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

        <InProgressDisplay
          open={inProgressCSV}
        />
      </Box>
    );
  }
}
