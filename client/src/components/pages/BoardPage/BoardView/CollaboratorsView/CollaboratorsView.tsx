import { useState, useEffect } from 'react'
import { Typography, Button, Box, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Card, CardContent, Avatar, Paper } from '@mui/material'
import CollaboratorApi from '@/api/collaborator.api'
import { RoleString, User } from '@/types/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import styles from './CollaboratorsView.module.scss'

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type Props = {
  boardId: number
  isLoading: boolean
  errorMsg: string
}

const CollaboratorView = ({ boardId, isLoading, errorMsg }: Props) => {
  const [userName, setUserName] = useState('') // Search term for filtering users
  const [users, setUsers] = useState<User[]>([]) // List of users that match the search term
  const [roleMapping, setRoleMapping] = useState<{ [userId: number]: string }>({}) // Mapping of userId to selected role
  const [linkErrorMsg, setLinkErrorMsg] = useState<string>('')
  const [collaborators, setCollaborators] = useState<any>([]) // Collaborators state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]) // Track selected users to add to board

  const debouncedUserName = useDebounce(userName, 500) // 500ms debounce delay
  
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const { result } = await CollaboratorApi.getCollaborators(boardId);
        setCollaborators(result || []);
      } catch (error) {
        setLinkErrorMsg('Failed to fetch collaborators');
      }
    };
  
    fetchCollaborators();
  }, [boardId]); // Only re-fetch when boardId changes
  
  // Fetch users based on search
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedUserName.length > 0) {
        try {
          const { result } = await CollaboratorApi.getUsersByUserName(boardId, debouncedUserName)
          setUsers(result || [])
        } catch (error) {
          setLinkErrorMsg('Failed to fetch users')
        }
      }
    }

    fetchUsers()
  }, [debouncedUserName, boardId])

  const handleRoleSelection = (userId: number, newRole: string) => {
    setRoleMapping(prevState => ({
      ...prevState,
      [userId]: newRole
    }))
  }

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await CollaboratorApi.updateUserRole(boardId, userId, newRole);
      if (response.result) {
        setRoleMapping((prev) => ({ ...prev, [userId]: newRole }));
        const { result } = await CollaboratorApi.getCollaborators(boardId);
        setCollaborators(result || []); 
      } else {
        console.error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId) 
      } else {
        return [...prev, userId] 
      }
    })
  }

  const handleLinkUsers = async () => {
    setLinkErrorMsg('')
    
    // Link selected users to board
    for (const userId of selectedUsers) {
      const selectedRole = roleMapping[userId] || 'VIEWER'
      try {
        const { result: updatedCollaborators } = await CollaboratorApi.linkUserToBoard(boardId, userId, selectedRole)
        if (updatedCollaborators) {
          setCollaborators(updatedCollaborators)
        } else {
          setLinkErrorMsg('Failed to add collaborators')
        }
      } catch (error) {
        setLinkErrorMsg('Failed to add collaborators')
      }
    }
    
    setSelectedUsers([]) 
  }
  
const mapUserRoleEnumToString = (role: string | null): RoleString => {
  if (role === null) return null; 
  const roleNumber = parseInt(role); 
  if (isNaN(roleNumber)) return null;
  
  switch (roleNumber) {
    case 0:
      return 'Owner'; 
    case 1:
      return 'Editor'; 
    case 2:
      return 'Viewer'; 
    default:
      return null;
  }
};

const handleRemoveCollaborator = (userId: number) => {
console.log("Remove collaborator with id:", userId);
};

return (
    <Box className={styles.main_panel}>
      <Box className={styles.panel}>
        <div className="BoardPage-module-scss-module___CFF7a__toolbar MuiBox-root css-0">
          <Typography variant="h5">
            Your Collaborators:
          </Typography>
        </div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box className={styles.card_container}>
            {collaborators.length === 0 ? (
              <Typography>No collaborators found.</Typography>
            ) : (
              collaborators.map((user: User, index: number) => (
                <Card key={user.id} className={styles.user_card}>
                  <CardContent className={styles.card_Content}>
                  <Paper elevation={1} sx={{ marginBottom: 1, padding: 1, display: 'flex', alignItems: 'center' }}>
                    {index + 1}.    <Avatar className={styles.img_container} alt={user.userName} src="https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/blt5f18c2119ce26485/6668df65db90945e0caf9be6/beautiful-flowers-lotus.jpg?q=70&width=3840&auto=webp" />
                     {user.userName} Role: {mapUserRoleEnumToString(user.userRole)}
                    
                    </Paper>
                    <div className={styles.date_container}>
                      <Typography variant="body2" color="text.secondary">
  Joined since - {new Date(user.date).toLocaleDateString("en-GB")}
</Typography>

                    </div>
                  </CardContent>
                  <FormControl className={styles.roleSelect}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={roleMapping[user.id] || 'VIEWER'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        label="Role"
                        size="small"
                      >
                        <MenuItem value="EDITOR">Editor</MenuItem>
                        <MenuItem value="VIEWER">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton onClick={() => handleRemoveCollaborator(user.id)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>

      <Box className={styles.panel}>
          <div className="BoardPage-module-scss-module___CFF7a__toolbar MuiBox-root css-0">
          <Typography variant="h5">Add Collaborator</Typography>
          </div>
          {errorMsg && <Typography color="error">{errorMsg}</Typography>}
          {linkErrorMsg && <Typography color="error">{linkErrorMsg}</Typography>}

          <TextField
            label="Search by username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2 }}
          />

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box>
              {users.length > 0 ? (
                users.map((user) => (
                  <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Typography>{user.userName}</Typography>

                    <FormControl className={styles.roleSelect}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={roleMapping[user.id] || 'VIEWER'}
                        onChange={(e) => handleRoleSelection(user.id, e.target.value)}
                        label="Role"
                        size="small"
                      >
                        <MenuItem value="EDITOR">Editor</MenuItem>
                        <MenuItem value="VIEWER">Viewer</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => handleUserSelection(user.id)}
                    >
                      {selectedUsers.includes(user.id) ? 'Remove' : 'Select'}
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No users found</Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleLinkUsers}
            sx={{ marginTop: 2 }}
            disabled={selectedUsers.length === 0}
          >
            Add Selected Users to Board
          </Button>
      </Box>
    </Box>
)}

export default CollaboratorView