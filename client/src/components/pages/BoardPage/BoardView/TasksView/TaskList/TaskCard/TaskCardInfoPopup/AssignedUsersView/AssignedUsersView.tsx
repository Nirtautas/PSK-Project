import { BoardUser, TaskUser } from "@/types/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from './AssignedUsers.module.scss'
import SelectUsersField from "../../../../CreateTaskForm/SelectUsersField";
import { useEffect, useState } from "react";
import TaskOnUserApi from "@/api/taskOnUser.api";
import { Avatar } from "@mui/material";
import { useMessagePopup } from "@/components/shared/MessagePopup/MessagePopupProvider";

type Props = {
    users: TaskUser[]
    boardId: number
    taskId: number
    onUserChange: (u: TaskUser[]) => void
    editMode: boolean
}
  
export default function AssignedUsersView({ users, boardId, taskId, onUserChange, editMode }: Props) {
    const [currentUsers, setCurrentUsers] = useState<TaskUser[]>(users)
    const { displayError } = useMessagePopup()

    useEffect(() => {
        setCurrentUsers(users)
    }, [users])

    const handleSelectedUsersChange = async (changedUsers: BoardUser[]) => {
        if (currentUsers.length !== 0)
        {
            const unlinkedUserIds = currentUsers.filter(current => !changedUsers.some(changed => changed.id === current.id)).map(user => user.id)
            if (unlinkedUserIds.length !== 0) {
                const unlinkResult = await TaskOnUserApi.unlinkTaskUser(boardId, taskId, unlinkedUserIds)
                if (unlinkResult.error) {
                    displayError(unlinkResult.error)
                    return
                }
            }
        }
        
        const newAssignedUserIds = changedUsers.filter(changed => !currentUsers.some(current => changed.id === current.id)).map(user => user.id)
        if (newAssignedUserIds.length !== 0) {
            const linkResult = await TaskOnUserApi.linkTaskUser(boardId, taskId, newAssignedUserIds)
            if (linkResult.error) {
                displayError(linkResult.error)
                return
            }
        }

        const newUsers = changedUsers as unknown as TaskUser[]
        setCurrentUsers(newUsers)
        onUserChange(newUsers)
    }

    return (
        <Box sx={{ height: '100%'}}>
            <Typography variant="h4">Assigned Users</Typography>
            <Box className={styles.users_container}>
                {editMode && <SelectUsersField 
                    onUsersChange={handleSelectedUsersChange}
                    selectedUsers={users}
                    boardId={boardId}
                />}
                {!editMode && (currentUsers && currentUsers.length ? currentUsers.map((user) => (
                    <Box key={user.id} className={styles.user_box}>
                        <Avatar className={styles.avatar} alt={user.userName} src={user.imageURL}/>
                        <Typography>{user.userName}</Typography>
                    </Box>
                )) : (
                    <Typography>No users assigned</Typography>
                ))}
            </Box>
        </Box>
    );
}