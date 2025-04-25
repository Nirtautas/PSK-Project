import { useState, useEffect } from 'react'
import { Typography, Button, Box, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Card, CardContent } from '@mui/material'
import CollaboratorApi from '@/api/collaborator.api'
import { Role, RoleString, User } from '@/types/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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

  const handleRoleChange = (userId: number, newRole: string) => {
    setRoleMapping(prevState => ({
      ...prevState,
      [userId]: newRole
    }))
  }

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId) // Remove if already selected
      } else {
        return [...prev, userId] // Add if not selected
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
    
    setSelectedUsers([]) // Reset selected users after linking
  }
  
// Helper function to map UserRoleEnum to RoleString
const mapUserRoleEnumToString = (role: number | null): RoleString => {
  if (role === null) return null; // Handle the case where the role is null

  switch (role) {
    case 0:
      return 'Owner'; // Corresponding to UserRoleEnum.Owner
    case 1:
      return 'Editor'; // Corresponding to UserRoleEnum.Editor
    case 2:
      return 'Viewer'; // Corresponding to UserRoleEnum.Viewer
    default:
      return null; // Handle any other undefined role
  }
};


return (
  <Box>
    <Typography variant="h6" p={2}>
      Collaborators Management
    </Typography>

    <Box display="flex" gap={3}>
      {/* Left Panel: Current Collaborators */}
      <Box flex={1}>
        <Typography p={2} fontWeight="bold">
          Your Collaborators:
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box>
            {collaborators.length === 0 ? (
              <Typography>No collaborators found.</Typography>
            ) : (
              collaborators.map((user: User) => (
                <Card key={user.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{user.userName}</Typography>
                    {/* Display Role based on RoleString */}
                    <Typography variant="body2" color="text.secondary">
                      Role: {mapUserRoleEnumToString(user.userRole)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>

      {/* Right Panel: Add New Collaborator (unchanged logic) */}
      <Box flex={1}>
        <div className="collaborator-management">
          <Typography variant="h5">Add Collaborator</Typography>

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

                    <FormControl sx={{ marginLeft: 2 }}>
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
        </div>
      </Box>
    </Box>
  </Box>
);

  
}

export default CollaboratorView