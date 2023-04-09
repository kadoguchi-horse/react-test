import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { FormControlLabel, Switch } from "@mui/material";
import { orange, grey } from "@mui/material/colors";

// Switchの色を変更
const greyCode = 700;
const ColorSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: grey[greyCode],
    "&:hover": {
      backgroundColor: alpha(grey[greyCode], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: grey[greyCode],
  },
}));

const SwitchShared: React.FC<{
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      // control={<Switch checked={checked} onChange={onChange} />}
      control={<ColorSwitch checked={checked} onChange={onChange} />}
      label={label}
    />
  );
};

export default SwitchShared;
