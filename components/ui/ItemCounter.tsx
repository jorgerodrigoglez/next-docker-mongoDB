import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Icon from '@mui/material/Icon';

interface Props {
  currentValue: number;
  maxValue: number;
  updateQuantity: ( newValue: number ) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {

  const addOrRemove = (value: number) => {
    if( value === -1 ){
      if( currentValue === 1 ) return

      return updateQuantity( currentValue - 1 );
    }

    if( currentValue >= maxValue ) return;

    return updateQuantity( currentValue + 1 );
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={ () => addOrRemove(+1)} >
        <Icon className="material-icons-outlined">add_circle_outline</Icon>
      </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center'}}>{currentValue}</Typography>
      <IconButton onClick={ () => addOrRemove(-1)}>
        <Icon className="material-icons-outlined">remove_circle_outline</Icon>
      </IconButton>
    </Box>
  )
}
