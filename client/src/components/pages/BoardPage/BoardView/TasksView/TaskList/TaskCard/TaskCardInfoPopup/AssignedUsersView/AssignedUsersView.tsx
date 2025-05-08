import { BoardUser, TaskUser } from "@/types/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from './AssignedUsers.module.scss'
import SelectUsersField from "../../../../CreateTaskForm/SelectUsersField";
import { useEffect, useState } from "react";
import TaskOnUserApi from "@/api/taskOnUser.api";
import { Avatar } from "@mui/material";

type Props = {
    users: TaskUser[]
    boardId: number
    taskId: number
    onUserChange: (u: TaskUser[]) => void
    editMode: boolean
}
  
export default function AssignedUsersView({ users, boardId, taskId, onUserChange, editMode }: Props) {
    const [currentUsers, setCurrentUsers] = useState<TaskUser[]>(users)

    useEffect(() => {
        setCurrentUsers(users)
    }, [users])

    const handleSelectedUsersChange = async (changedUsers: BoardUser[]) => {
        if (currentUsers.length !== 0)
        {
            const userIds = currentUsers.map(user => user.id)
            console.log(`currentUsers: ${userIds}`)
            await TaskOnUserApi.unlinkTaskUser(boardId, taskId, userIds)
        }
        
        const newAssignedUserIds = changedUsers.map(user => user.id)
        console.log(`newAssignedUserIds: ${newAssignedUserIds}`)
        const linkResult = await TaskOnUserApi.linkTaskUser(boardId, taskId, newAssignedUserIds)

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