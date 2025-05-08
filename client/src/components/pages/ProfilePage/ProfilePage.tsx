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
  const [originalUser, setOriginalUser] = useState<PatchUserDto | null>(null);

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
    
            setOriginalUser({
              firstName: user.firstName,
              lastName: user.lastName,
              userName: user.userName,
              email: user.email,
              imageURL: user.imageURL,
            });
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
  
  const buildPatchDocument = (): any[] => {
    if (!originalUser) return [];
  
    const patch: any[] = [];
  
    if (firstName !== originalUser.firstName) {
      patch.push({ op: 'replace', path: '/firstName', value: firstName });
    }
    if (lastName !== originalUser.lastName) {
      patch.push({ op: 'replace', path: '/lastName', value: lastName });
    }
    if (userName !== originalUser.userName) {
      patch.push({ op: 'replace', path: '/userName', value: userName });
    }
    if (email !== originalUser.email) {
      patch.push({ op: 'replace', path: '/email', value: email });
    }
    if (imageURL !== originalUser.imageURL) {
      patch.push({ op: 'replace', path: '/imageURL', value: imageURL });
    }
  
    return patch;
  };

  const handleSaveChanges = async () => {
    const patchUserDto = buildPatchDocument();
    if (patchUserDto.length === 0) {
      setIsEditMode(false);
      return; 
    }
  
    try {
      const response = await UserApi.updateUser(Number(userId), patchUserDto);
      if (response) {
        setIsEditMode(false);
        setOriginalUser({ firstName, lastName, userName, email, imageURL }); 
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
          <Box 
            display="flex" 
            justifyContent="flex-end" 
            gap={1} 
            mt={2}
            sx={{ ml: 'auto' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              sx={{ width: '100px', height: '36px' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditMode(false)}
              sx={{ width: '100px', height: '36px' }}
            >
              Cancel
            </Button>
          </Box>
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