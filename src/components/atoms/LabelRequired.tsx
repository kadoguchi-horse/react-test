import * as React from 'react';
import Typography from '@mui/material/Typography';

const LabelRequired: React.FC = () => {

  return (
    <Typography
      variant='body2'
      borderRadius={"5px"}
      sx={{textAlign: "center"}}
      style={{backgroundColor:"#cc3333", color:"white", width:"50px", borderColor:"gray" }}
    >必須</Typography>
  );
}

export default LabelRequired;
