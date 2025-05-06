'use client'

import { useState } from 'react'
import { useCollaborators } from '@/hooks/useCollaborators'
import CollaboratorApi from '@/api/collaborator.api'
import { Select, MenuItem, Button, Typography, TextField, Paper } from '@mui/material'

const TransferOwnershipView = ({ boardId }: { boardId: number }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [transferError, setTransferError] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [openMenu, setOpenMenu] = useState(false)

  const { collaborators, error, loading } = useCollaborators(boardId, userName)

  const handleTransferOwnership = async () => {
    if (!selectedUserId) {
      setTransferError('Please select a user to transfer ownership.');
      return;
    }
  
    try {
      setIsTransferring(true);
      const response = await CollaboratorApi.transferOwnership(boardId, selectedUserId);

      if (response.error) {
        setTransferError(response.error); 
        setTransferSuccess(null);
      } else if (response.result) {
        setTransferSuccess('Ownership successfully transferred!');
        setTransferError(null);
        setSelectedUserId(null);
        setUserName('');
      } else {
        setTransferError('An unexpected error occurred.');
        setTransferSuccess(null);
      }
    } catch (error: any) {
      console.error('Ownership transfer failed:', error);
  
      if (error instanceof SyntaxError) {
        setTransferError('Failed to parse response. The server may not have returned valid JSON.');
      } else if (error?.message) {
        setTransferError(error.message || 'Failed to transfer ownership.');
      } else {
        setTransferError('Failed to transfer ownership due to an unknown error.');
      }
  
      setTransferSuccess(null);
    } finally {
      setIsTransferring(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
    setOpenMenu(e.target.value.length > 0)
  }

  const handleUserSelection = (userId: number, userName: string) => {
    setSelectedUserId(userId)
    setUserName(userName)
    setOpenMenu(false)
  }

  return (
    <div>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TextField
            label="Search by username"
            value={userName}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          {openMenu && collaborators.length > 0 && (
            <Paper sx={{ width: '63%', maxHeight: 200, overflow: 'auto', marginTop: 1, position: 'absolute', zIndex: 1 }}>
              {collaborators.map((user) => (
                <MenuItem key={user.id} onClick={() => handleUserSelection(user.id, user.userName)}>
                  {user.userName}
                </MenuItem>
              ))}
            </Paper>
          )}

          {collaborators.length === 0 && userName.length > 0 && !loading && (
            <Typography>No collaborators found</Typography>
          )}

          {transferError && (
            <Typography color="error" variant="body2" mt={2}>
              {transferError}
            </Typography>
          )}

          {transferSuccess && (
            <Typography color="success" variant="body2" mt={2}>
              {transferSuccess}
            </Typography>
          )}

          <Button
            onClick={handleTransferOwnership}
            variant="outlined"
            color="error"
            disabled={isTransferring}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isTransferring ? 'Transferring...' : 'Transfer Ownership'}
          </Button>
        </>
      )}
    </div>
  )
}

export default TransferOwnershipView