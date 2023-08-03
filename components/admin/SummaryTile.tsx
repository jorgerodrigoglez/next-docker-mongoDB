import { FC } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';

interface Props {
    title: string | number;
    subTitle: string;
    //icon: JSX.Element
    icon?: string;
    color?: string
}

export const SummaryTile:FC<Props> = ({ title, subTitle, icon, color }) => {


  return (
    <Grid item xs={12} sm={4} md={3}>
        <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ width: 50, display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon className={`material-icons-outlined md-48 ${color}`}>{icon}</Icon>
            </CardContent>
            <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h3'>{ title }</Typography>
                <Typography variant='caption'>{ subTitle }</Typography>
            </CardContent>
        </Card>
        
    </Grid>
  )
}