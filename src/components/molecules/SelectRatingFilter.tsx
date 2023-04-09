import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Rating, Typography, Box } from '@mui/material';

const SelectRatingFilter: React.FC<{ value: string, onChange: (event: SelectChangeEvent) => void }> = ({ value, onChange }) => {

  return (
    <FormControl sx={{ m:0, minWidth: 120 }} size="small" style={{paddingRight:"15px"}}>
      <InputLabel id="select-ratig-filter">評価フィルター</InputLabel>
      <Select
        labelId="select-ratig-filter"
        id="select-ratig"
        value={value}
        label="評価フィルター"
        onChange={onChange}
        ref={React.createRef()}
      >
        <MenuItem value={'0'}>指定なし</MenuItem>
        <MenuItem value={'1'}>
          <Box style={{display: 'flex'}}>
            <Rating name="rating-read1" value={1} precision={1} size="small" readOnly  style={{alignItems:'center'}}/>
            <Typography style={{alignItems:'center'}}>  以上</Typography>
          </Box>
        </MenuItem>
        <MenuItem value={'2'}>
          <Box style={{display: 'flex'}}>
            <Rating name="rating-read2" value={2} precision={1} size="small" readOnly  style={{alignItems:'center'}}/>
            <Typography style={{alignItems:'center'}}>  以上</Typography>
          </Box>
        </MenuItem>
        <MenuItem value={'3'}>
          <Box style={{display: 'flex'}}>
            <Rating name="rating-read3" value={3} precision={1} size="small" readOnly  style={{alignItems:'center'}}/>
            <Typography style={{alignItems:'center'}}>  以上</Typography>
          </Box>
        </MenuItem>
        <MenuItem value={'4'}>
          <Box style={{display: 'flex'}}>
            <Rating name="rating-read4" value={4} precision={1} size="small" readOnly  style={{alignItems:'center'}}/>
            <Typography style={{alignItems:'center'}}>  以上</Typography>
          </Box>
        </MenuItem>
        <MenuItem value={'5'}>
          <Box style={{display: 'flex'}}>
            <Rating name="rating-read5" value={5} precision={1} size="small" readOnly  style={{alignItems:'center'}}/>
            <Typography style={{alignItems:'center'}}>  以上</Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default SelectRatingFilter;