import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { AnyFunction } from 'sequelize/types/utils';

const OkModal: React.FC<{
  open: boolean,
  onClose?: AnyFunction,
  onClick?: AnyFunction,
  detailText:string,
  maxWidth?:string
}> = ({ open, onClose, onClick, detailText, maxWidth}) => {

  const m_maxWidth = maxWidth === undefined ? 'fit-content' : maxWidth;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
          position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: '90%', maxWidth: m_maxWidth, bgcolor: 'background.paper', border: '1px solid #cccccc', p: 2}}>
        <div style={{textAlign: 'center'}} >
          <Typography variant="subtitle2" noWrap>{detailText.split("\n").map((line, key) => <span key={key}>{line}<br /></span>)}</Typography>
          <Button sx={{margin: '10px 0px 0px 0px'}} variant="contained" color="warning" onClick={onClick}>OK</Button>
        </div>
      </Box>
    </Modal>
  );
}

export default OkModal;
