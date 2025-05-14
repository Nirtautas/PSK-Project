import { useState, useEffect } from 'react'
import { Typography, Button, Box, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Card, CardContent, Avatar, Paper } from '@mui/material'
import CollaboratorApi from '@/api/collaborator.api'
import { Role, RoleString, BoardUser } from '@/types/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import styles from './CollaboratorsView.module.scss'
import { useCollaborators } from '@/hooks/useCollaborators'
import { getUserId } from '@/utils/userId';
import useFetch from '@/hooks/useFetch'
import BoardOnUserApi from '@/api/boardOnUser.api';
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider';

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
  const [userName, setUserName] = useState('') 
  const [users, setUsers] = useState<BoardUser[]>([]) 
  const [roleMapping, setRoleMapping] = useState<{ [userId: number]: string }>({}) 
  const { collaborators, error: collaboratorError, loading, setCollaborators } = useCollaborators(boardId)
  const [linkErrorMsg, setLinkErrorMsg] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]) 
  const [roleErrors, setRoleErrors] = useState<{ [userId: number]: string }>({})
  const debouncedUserName = useDebounce(userName, 500) 
  const [removeErrors, setRemoveErrors] = useState<{ [userId: number]: string }>({});
  const [userId, setUserId] = useState<number | null>(null)
  const { displayError } = useMessagePopup();

  useEffect(() => {
      const userId = getUserId();
      setUserId(userId);
  }, []);

  const { data: userRole } = useFetch({
      resolver: () => BoardOnUserApi.getUserRole(boardId, userId),
      deps: [userId]
    });
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedUserName.length > 0) {
        const response = await CollaboratorApi.getUsersByUserName(boardId, debouncedUserName);

        if (response.error) {
          displayError(response.error || 'Failed to fetch users. Try again.');
          return;
        }

        setUsers(response.result || []);
      }
    };

    fetchUsers();
  }, [debouncedUserName, boardId]);

  const handleRoleSelection = (userId: number, newRole: string) => {
    setRoleMapping(prevState => ({
      ...prevState,
      [userId]: newRole
    }))
  }

  const handleRoleChange = async (userId: number, newRole: string) => {
    const updateResponse = await CollaboratorApi.updateUserRole(boardId, userId, newRole);

    if (updateResponse.error) {
      displayError(updateResponse.error || 'Failed to update role.');
      return;
    }

    setRoleMapping((prev) => ({ ...prev, [userId]: newRole }));
    setRoleErrors((prev) => ({ ...prev, [userId]: '' }));

    const collaboratorsResponse = await CollaboratorApi.getCollaborators(boardId);
    if (collaboratorsResponse.error) {
      displayError(collaboratorsResponse.error || 'Failed to fetch collaborators after role update.');
      return;
    }

    setCollaborators(collaboratorsResponse.result || []);
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
    setLinkErrorMsg('');
  
    for (const userId of selectedUsers) {
      const selectedRole = roleMapping[userId] || 'VIEWER';
      await CollaboratorApi.inviteUserToBoard(boardId, userId, selectedRole);
    }
  
    setSelectedUsers([]);
    setUsers([]);
    setUserName('');
  };
  
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

const handleRemoveCollaborator = async (userId: number) => {
  const response = await CollaboratorApi.removeCollaborator(boardId, userId);

  if (response.error) {
    displayError(response.error || 'Failed to remove collaborator. Please try again.');
    return;
  }

  setCollaborators((prev) => prev.filter((user) => user.id !== userId));
};

return (
    <Box className={styles.main_panel}>
      <Box className={styles.panel}>
        <div className="BoardPage-module-scss-module___CFF7a__toolbar MuiBox-root css-0">
          <Typography variant="h5">
            Your Collaborators:
          </Typography>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box className={styles.card_container}>
              {Array.isArray(collaborators) && collaborators.map((user: BoardUser, index: number) => (
                <Card key={user.id} className={styles.user_card} sx={{backgroundColor: '#262626', width: '60%' }}>
                  <CardContent className={styles.card_Content}>
                  <Paper elevation={1} sx={{ marginBottom: 1, padding: 1, display: 'flex', alignItems: 'center', backgroundColor: '#262626'}} >
                    {index + 1}.    
                    <Avatar className={styles.img_container} alt={user.userName} src={user.imageURL}  sx={{ marginLeft: 2, marginRight: 3 }}/>
                    <span style={{ marginRight: '20px' }}>{user.userName}</span>
                    <span>Role: {mapUserRoleEnumToString(user.userRole)}</span>
                    </Paper>
                    <div className={styles.date_container}>
                      <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 2, marginRight: 3 }}>
                        Joined since - {new Date(user.addedAt).toLocaleDateString()}
                      </Typography>   
                    </div>
                  </CardContent>
                  <FormControl className={styles.roleSelect} sx={{ marginLeft: 2, marginRight: 3 }}>
                      <InputLabel>Role</InputLabel>
                      <Select 
                        value={roleMapping[user.id] || 'VIEWER'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        label="Role"
                        size="small"
                        disabled={user.userRole === Role.OWNER || userRole?.userRole !== Role.OWNER}
                      >
                        <MenuItem value="EDITOR">Editor</MenuItem>
                        <MenuItem value="VIEWER">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {errorMsg && <Typography color="error">{errorMsg}</Typography>}
                    {removeErrors[user.id] && <Typography color="error">{removeErrors[user.id]}</Typography>}
                    {userRole === null || userRole === undefined ? (
                      <Typography>Loading user role...</Typography>
                    ) : (
                      userRole.userRole === Role.OWNER && user.userRole !== Role.OWNER && (
                        <IconButton onClick={() => handleRemoveCollaborator(user.id)} sx={{ color: 'red' }} >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )
                    )}
                </Card>
              ))}
          </Box>
        )}
      </Box>

      {userRole?.userRole === Role.OWNER && (
        <Box className={styles.panel}>
          <div className="BoardPage-module-scss-module___CFF7a__toolbar MuiBox-root css-0">
            <Typography variant="h5">Add Collaborator</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLinkUsers}
              sx={{ marginTop: 2 }}
              disabled={selectedUsers.length === 0}
            >
              Add Selected Users to Board
            </Button>
          </div>

          {errorMsg && <Typography color="error">{errorMsg}</Typography>}
          {linkErrorMsg && <Typography color="error">{linkErrorMsg}</Typography>}

          <TextField
            label="Search by username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ marginBottom: 2, width: '50%' }}
          />

          {loading ? (
            <CircularProgress />
          ) : (
            <Box className={styles.add_user_container}>
              {users.length > 0 ? (
                users.map((user) => (
                  <Paper
                    key={user.id}
                    elevation={3}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 2,
                      marginBottom: 2,
                      backgroundColor: '#1e1e1e',
                      borderRadius: 2,
                      width: '50%'
                    }}
                  >
                    <Typography>{user.userName}</Typography>

                    <FormControl className={styles.roleSelect} sx={{ minWidth: 120 }}>
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
                  </Paper>
                ))
              ) : (
                <Typography>No users found</Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
)}

export default CollaboratorView