import App from 'src/types/App';
import AppCard from 'src/components/molecules/AppCard';
import { Box, Grid } from '@mui/material';

const AppList: React.FC<{ apps: App[] }> = ({ apps }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {apps.map((app) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={app.app_id}>
            <AppCard app={app} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AppList;
