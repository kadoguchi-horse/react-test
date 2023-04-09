import { Box, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const InProgressDisplay: React.FC<{
  open: boolean,
  message?:string
}> = ({ open, message}) => {

  const m_message = message === undefined ? '処理中...' : message;
  
  const display = open ? '' : 'none';

  return(
    <Box
      sx={{
        backgroundColor:'rgba(255, 255, 255, 0.6)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        zIndex: 9999,
        display: display}}
    >
      <Box
        sx={{display: 'flex', height: '100%'}}>
          <table style={{margin: 'auto'}}>
            <tr>
              <td><CircularProgress sx={{color: '#1a90ff'}} /></td>
              <td><h2 style={{color: 'black', height: '100%', top: '50%'}}>{m_message}</h2></td>
            </tr>
          </table>
      </Box>
    </Box>
  );
}

export default InProgressDisplay;
