'use client'

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => { 

  const [isEditMode, setIsEditMode] = React.useState(false);


  return (
    <Box sx={{ p: 4, maxWidth: 800 }}>
      <Box className={styles.toolbar}>
      <Typography variant="h3">My Profile:</Typography>
      <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
      Edit Profile
      </Button>
      </Box>

      <Paper elevation={3} sx={{ maxWidth: 600, p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 64, height: 64 }}>TR</Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h6">TomRaider78</Typography>
                <Typography variant="body2" color="text.secondary">
                  Joined since 2025-04-08
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={styles.line}>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                value="Tom"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                value="Raider"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value="tom.raider@gmail.com"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Reset Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProfilePage;