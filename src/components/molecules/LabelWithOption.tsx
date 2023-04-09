import * as React from "react";
import { LabelOptional, LabelRequired } from "src/components/atoms";
import { Stack, Typography } from "@mui/material";

const LabelWithOption: React.FC<{
  label: string;
  option: string;
  marginTop: string;
}> = ({ label, option, marginTop }) => {
  return (
    <Stack spacing={1} direction="row" style={{ marginTop: marginTop }}>
      <Typography variant="body2" noWrap>
        {label}
      </Typography>
      {(() => {
        if (option === "required") {
          return <LabelRequired />;
        } else {
          return <LabelOptional />;
        }
      })()}
    </Stack>
  );
};

export default LabelWithOption;
