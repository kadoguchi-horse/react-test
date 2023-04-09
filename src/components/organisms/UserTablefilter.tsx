import {
  Box,
  Grid,
  Typography,
  TextField,
  NativeSelect,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ChangeEvent } from "react";
import { User } from "src/types";

const filterFlg_account_name = 1;
const filterFlg_user_name = 2;
const filterFlg_user_role = 3;

const TableFilter = (props: {
  searched_account_name: any;
  searched_user_name: any;
  searched_user_role: any;
  setsearched_account_name: React.Dispatch<React.SetStateAction<string>>;
  setsearched_user_name: React.Dispatch<React.SetStateAction<string>>;
  setsearched_user_role: React.Dispatch<React.SetStateAction<string>>;
  initialRows: any;
  setRows: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const {
    searched_account_name,
    searched_user_name,
    searched_user_role,
    initialRows,
    setRows,
    setsearched_account_name,
    setsearched_user_name,
    setsearched_user_role,
  } = props;

  // 検索文字によってテーブルの行をフィルター関数
  const requestSearch = (searchedVal: string, flg: number) => {
    // console.log("searchedVal");
    // console.log(searchedVal);

    // console.log("initialRows");
    // console.log(initialRows);

    const filteredRows = initialRows.filter(
      (initialrows: {
        account_name: string;
        user_name: string;
        user_role: string;
      }) => {
        switch (flg) {
          case filterFlg_account_name:
            return (
              (initialrows.account_name.toLowerCase().indexOf(searchedVal) >=
                0 ||
                initialrows.account_name.indexOf(searchedVal) >= 0) &&
              (initialrows.user_name
                .toLowerCase()
                .indexOf(searched_user_name) >= 0 ||
                initialrows.user_name.indexOf(searched_user_name) >= 0) &&
              (initialrows.user_role
                .toLowerCase()
                .indexOf(searched_user_role) >= 0 ||
                initialrows.user_role.indexOf(searched_user_role) >= 0)
            );
            break;
          case filterFlg_user_name:
            return (
              (initialrows.account_name
                .toLowerCase()
                .indexOf(searched_account_name) >= 0 ||
                initialrows.account_name.indexOf(searched_account_name) >= 0) &&
              (initialrows.user_name.toLowerCase().indexOf(searchedVal) >= 0 ||
                initialrows.user_name.indexOf(searchedVal) >= 0) &&
              (initialrows.user_role
                .toLowerCase()
                .indexOf(searched_user_role) >= 0 ||
                initialrows.user_role.indexOf(searched_user_role) >= 0)
            );
            break;
          case filterFlg_user_role:
            return (
              (initialrows.account_name
                .toLowerCase()
                .indexOf(searched_account_name) >= 0 ||
                initialrows.account_name.indexOf(searched_account_name) >= 0) &&
              (initialrows.user_name
                .toLowerCase()
                .indexOf(searched_user_name) >= 0 ||
                initialrows.user_name.indexOf(searched_user_name) >= 0) &&
              (initialrows.user_role.toLowerCase().indexOf(searchedVal) >= 0 ||
                initialrows.user_role.indexOf(searchedVal) >= 0)
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
    event: ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
    flg: number
  ) => {
    switch (flg) {
      case filterFlg_account_name:
        setsearched_account_name(event.target.value);
        break;
      case filterFlg_user_name:
        setsearched_user_name(event.target.value);
        break;
      case filterFlg_user_role:
        setsearched_user_role(event.target.value);
        break;
    }

    requestSearch(event.target.value, flg);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid style={{ margin: "20%" }}>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>アカウント名</Typography>
          <TextField
            label="Filter…"
            variant="standard"
            value={searched_account_name}
            onChange={(event) =>
              changeSearchedHandler(event, filterFlg_account_name)
            }
          ></TextField>
        </Grid>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>氏名</Typography>
          <TextField
            label="Filter…"
            variant="standard"
            value={searched_user_name}
            onChange={(event) =>
              changeSearchedHandler(event, filterFlg_user_name)
            }
          />
        </Grid>
        <Grid style={{ marginBottom: "20%" }}>
          <Typography>権限</Typography>
          <FormControl fullWidth>
            <NativeSelect
              defaultValue=""
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              onChange={(event) =>
                changeSearchedHandler(event, filterFlg_user_role)
              }
            >
              <option value="">ALL</option>
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="User">User</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableFilter;
