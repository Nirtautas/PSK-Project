'use client'

import { useState } from 'react'
import { useCollaborators } from '@/hooks/useCollaborators'
import CollaboratorApi from '@/api/collaborator.api'
import { Select, MenuItem, InputLabel, FormControl, Button, Typography } from '@mui/material'

const TransferOwnershipView = ({ boardId }: { boardId: number }) => {
    const { collaborators, error, loading } = useCollaborators(boardId)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [transferError, setTransferError] = useState<string | null>(null)
    const [isTransferring, setIsTransferring] = useState(false)
    const [transferSuccess, setTransferSuccess] = useState<string | null>(null)

    const handleTransferOwnership = async () => {
        if (!selectedUserId) {
            setTransferError('Please select a user to transfer ownership.')
            return
        }

        try {
            setIsTransferring(true)
            await CollaboratorApi.transferOwnership(boardId, selectedUserId) 
            setTransferSuccess('Ownership successfully transferred!')
            setTransferError(null)  
        } catch (error: any) {
            setTransferError(error?.message || 'Failed to transfer ownership.')
            setTransferSuccess(null)  
        } finally {
            setIsTransferring(false)
        }
    }

    return (
        <div>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    <FormControl fullWidth>
                        <InputLabel id="select-user" >Select User</InputLabel>
                        <Select
                            label="Search by username"
                            labelId="select-user"
                            value={selectedUserId ?? ''}
                            onChange={(e) => setSelectedUserId(e.target.value as number)}
                        >
                            {collaborators.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.userName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
                    >
                        {isTransferring ? 'Transferring...' : 'Transfer Ownership'}
                    </Button>
                </>
            )}
        </div>
    )
}

export default TransferOwnershipView