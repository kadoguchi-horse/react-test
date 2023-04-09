import * as React from 'react';
import Typography from '@mui/material/Typography';

const LabelOptional: React.FC = () => {

  return (
    <Typography
      variant='body2'
      borderRadius={"5px"}
      sx={{textAlign: "center"}}
      style={{backgroundColor:"gray", color:"white", width:"50px", borderColor:"gray"}}
    >任意</Typography>
  );
}

export default LabelOptional;
