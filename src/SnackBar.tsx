import React from 'react';
import { Snackbar } from '@mui/material';
import { useSnackBar } from '../contexts/snackbar.context';

const SnackBar: React.FC = () => {
  const { snackOpen, setSnackOpen, snackMessage } = useSnackBar();

  return (
    <Snackbar
      open={snackOpen}
      onClose={() => setSnackOpen(false)}
      autoHideDuration={2500}
      message={snackMessage}
      anchorOrigin={{
        vertical: 'bottom', 
        horizontal: 'center' 
      }}
    />
  )
}

export default SnackBar;