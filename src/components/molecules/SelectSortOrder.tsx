import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const SelectSortOrder: React.FC<{ value: string, onChange: (event: SelectChangeEvent) => void }> = ({ value, onChange }) => {

  return (
    <FormControl sx={{ m:0, minWidth: 120 }} size="small">
      <InputLabel id="sort-select-label">並び順</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        value={value}
        label="並び順"
        onChange={onChange}
        ref={React.createRef()}
      >
        <MenuItem value={''}>なし</MenuItem>
        <MenuItem value={'1'}>評価</MenuItem>
        <MenuItem value={'2'}>登録日</MenuItem>
        <MenuItem value={'3'}>ダウンロード</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SelectSortOrder;