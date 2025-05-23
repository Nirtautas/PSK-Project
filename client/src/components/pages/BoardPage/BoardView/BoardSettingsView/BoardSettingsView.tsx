'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BoardApi, { UpdateBoardDto } from '@/api/board.api'
import { Typography, Button, Box } from '@mui/material'
import styles from './BoardSettingsView.module.scss'
import BoardManagementModal, { CreateBoardFormArgs } from '../../../BoardsPage/BoardManagemenModal/BoardManagementModal'
import { Board, Role } from '../../../../../types/types'
import useFetch from '@/hooks/useFetch'
import BoardOnUserApi from '@/api/boardOnUser.api'
import TransferOwnershipView from './TransferOwnershipView/TransferOwnershipView'
import { getUserId } from '@/utils/userId'
import CollaboratorApi from '../../../../../api/collaborator.api'
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider'
import UploadApi from '@/api/upload.api'
import TaskApi from '@/api/task.api'

type Props = {
    boardId: number
    isLoading: boolean
    errorMsg: string
    onUpdate: (updatedBoard: Board) => void
}

const BoardSettingsView = ({ boardId, isLoading, errorMsg, onUpdate }: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<UpdateBoardDto | null>(null)
    const [editError, setEditError] = useState<string>('')

    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string>('')

    const [isArchTaskDeleting, setIsArchTaskDeleting] = useState(false)

    const [isLeaving, setIsLeaving] = useState(false)
    const [leaveError, setLeaveError] = useState<string>('')

    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const { displayError } = useMessagePopup()

    useEffect(() => {
        const userId = getUserId()
        setUserId(userId)
    }, [])

    const { data: userRoleData } = useFetch({
        resolver: () => BoardOnUserApi.getUserRole(boardId, userId),
        deps: [userId]
    })
    const userRole = userRoleData?.userRole

    const { 
        data: archTaskData,
        setData: setArchTaskData,
        isLoading: isArchTasksLoading,
    } = useFetch({
        resolver: () => TaskApi.getArchivedTasks(boardId)
    })

    const handleOpenEdit = async () => {
        try {
            const { result } = await BoardApi.getBoardById(boardId)
            if (result == null) throw new Error('Board not found.')
            const boardData: UpdateBoardDto = {
                title: result.title,
                description: result.description,
                imageName: result.imageURL || '',
                version: result.version
            }
            setEditData(boardData)
            setIsEditOpen(true)
        } catch (err: any) {
            setEditError(err?.message || 'Failed to fetch latest board data.')
        }
    }

    const handleUpdateBoard = async ({ description, image, title}: CreateBoardFormArgs) => {
        let imageName = editData?.imageName || ''
        if (image) {
            const imageResponse = await UploadApi.uploadImage(image)
            if (!imageResponse.result) {
                displayError(imageResponse.error || 'An error occured')
                return
            }
            imageName = imageResponse.result
        }
        const updatedDataWithVersion: UpdateBoardDto = {
            title,
            description,
            imageName,
            version: editData?.version ?? 0
        }

        const response = await BoardApi.updateBoard(boardId, updatedDataWithVersion)
        if (!response.result) {
            setIsEditOpen(false)
            displayError(`${response.error} Try again.` || 'Failed to update board.')
            return
        }
        setIsEditOpen(false)
        onUpdate(response.result)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this board?'))
            return

        setIsDeleting(true)
        const result = await BoardApi.deleteBoard(boardId)
        if (result.error) {
            displayError(result.error || 'Failed to delete board.')
        }
        else {
            router.push('/boards')
        }
        setIsDeleting(false)
    }

    const handleArchivedDelete = async () => {
        const confirmMsg = `All archived tasks will be deleted. Are you sure you want to delete ALL archived tasks?`
        if (!confirm(confirmMsg))
            return

        setIsArchTaskDeleting(true)
        const result = await TaskApi.deleteArchived(boardId)
        if (result.error) {
            displayError('Error deleting archived tasks!')
        }
        else {
            setArchTaskData([])
        }
        setIsArchTaskDeleting(false)
    }

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this board?'))
            return

        setIsLeaving(true)
        setLeaveError('')
        var response = await CollaboratorApi.removeCollaborator(boardId, userId ?? 0)

        if (response.error) {
            setLeaveError(response.error)
            setIsLeaving(false)
            return
        }

        router.push('/boards')
        setIsLeaving(false)
    }

    return (
        <div className="board-settings">
            <Typography variant="h5">Board Settings</Typography>

            {errorMsg && <Typography color="error">{errorMsg}</Typography>}
            {editError && <Typography color="error">{editError}</Typography>}

            {userRole === null || userRole === undefined ? <Typography>Loading user role...</Typography>
                : userRole !== Role.VIEWER ?
                    <Box className={styles.info_box}>
                        <Typography variant="body2" className={styles.info_text}>
                            Selecting this option will allow you to edit board information.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleOpenEdit}
                            disabled={isLoading}
                        >
                            Edit Board
                        </Button>
                    </Box>
                    : <Typography></Typography>
            }

            {userRole === null || userRole === undefined ? <Typography>Loading user role...</Typography>
                : userRole === Role.OWNER ?
                    <Box className={styles.warning_box}>
                        <Typography variant="body2" className={styles.info_text}>
                            Selecting this option will delete the board including tasks, linked users, and comments!
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={isDeleting || isLoading}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Board'}
                        </Button>
                    </Box>
                    : <Typography></Typography>
            }

            {leaveError && <Typography color="error">{leaveError}</Typography>}

            {userRole === null || userRole === undefined ? <Typography>Loading user role...</Typography>
                : userRole !== Role.OWNER ?
                    <Box className={styles.warning_box}>
                        <Typography variant="body2" className={styles.info_text}>
                            Selecting this option will remove you from the board.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLeave}
                            disabled={isLeaving || isLoading}
                        >
                            {isLeaving ? 'Leaving...' : 'Leave Board'}
                        </Button>
                    </Box>
                    : <Typography></Typography>
            }

            {userRole === null || userRole === undefined ? <Typography>Loading user role...</Typography>
                : userRole !== Role.VIEWER ?
                    <Box className={styles.warning_box}>
                        <Typography variant="body2" className={styles.info_text}>
                            Selecting this option will permanently delete all archived tasks.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleArchivedDelete}
                            disabled={isArchTaskDeleting || isArchTasksLoading || isLoading || archTaskData?.length === 0}
                        >
                            {isDeleting ? 'Deleting Archived Tasks...' : 'Delete Archived Tasks'}
                        </Button>
                    </Box>
                    : <Typography></Typography>
            }

            {userRole === null || userRole === undefined ? (
                <Typography>Loading user role...</Typography>
            ) : userRole === Role.OWNER ? (
                <Box className={styles.warning_box}>
                    <Typography variant="body2" className={styles.info_text} sx={{ marginBottom: 2 }}>
                        Select a user to transfer ownership:
                    </Typography>
                    <TransferOwnershipView boardId={boardId} />
                </Box>
            ) : (
                <Typography></Typography>
            )}

            <BoardManagementModal
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleUpdateBoard}
                initialData={editData ?? undefined}
                mode="edit"
            />
        </div>
    )
}

export default BoardSettingsView
