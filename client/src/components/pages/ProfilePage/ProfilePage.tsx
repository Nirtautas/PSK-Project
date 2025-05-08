import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Grid, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './ProfilePage.module.scss';
import UserApi from '@/api/user.api';
import { getUserId } from '@/utils/userId'; 
import { User } from '@/types/types';

export type PatchUserDto = Omit<User, 'id' | 'creationDate' >

const ProfilePage = () => {
  const userId = getUserId(); 

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const response = await UserApi.getById(Number(userId)); 
          if (response.result) {
            const user = response.result; 
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setUserName(user.userName);
            setImageURL(user.imageURL);
          } else {
            console.error('Failed to fetch user data', response.error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [userId]); 
  
  const handleSaveChanges = async () => {
    const patchUserDto = [
      { op: 'replace', path: '/firstName', value: firstName },
      { op: 'replace', path: '/lastName', value: lastName },
      { op: 'replace', path: '/userName', value: userName },
      { op: 'replace', path: '/email', value: email },
      { op: 'replace', path: '/imageURL', value: imageURL },
    ];
    

    try {
      const response = await UserApi.updateUser(Number(userId), patchUserDto);
      
      if (response) {
        setIsEditMode(false); 
      } else {
        console.error('Failed to update user:', response);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800 }}>
      <Box className={styles.toolbar}>
        <Typography variant="h3">
          {isEditMode ? "Edit Profile:" : "My Profile:"}
        </Typography>
        {isEditMode ? (
          <>
            <Button variant="contained" color="primary" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ maxWidth: 600, p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 64, height: 64 }}>TR</Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h6">{firstName} {lastName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Joined since 2025-04-08
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={styles.line}></Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                InputProps={{ readOnly: !isEditMode }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                InputProps={{ readOnly: !isEditMode }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                InputProps={{ readOnly: !isEditMode }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                InputProps={{ readOnly: !isEditMode }}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
              label="Image URL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              fullWidth
              InputProps={{ readOnly: !isEditMode }}
            />
          </Grid>

            {!isEditMode && (
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  Reset Password
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;