import { BoardUser, TaskUser } from "@/types/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from './AssignedUsers.module.scss'
import SelectUsersField from "../../../../CreateTaskForm/SelectUsersField";
import { useEffect, useState } from "react";

type Props = {
    users: TaskUser[]
    boardId: number
    onUserChange: (u: TaskUser[]) => void
    editMode: boolean
}
  
export default function AssignedUsersView({ users, boardId, onUserChange, editMode }: Props) {
    const [currentUsers, setCurrentUsers] = useState<TaskUser[]>(users)


    const handleSelectedUsersChange = (changedUsers: BoardUser[]) => {
        const selectedFiltered = users.filter(u =>
            changedUsers.some(cu => cu.id === u.id)
        )
        onUserChange(selectedFiltered)
        setCurrentUsers(selectedFiltered)
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
                {!editMode && (users && currentUsers.length ? currentUsers.map((user) => (
                    <Box key={user.id} className={styles.user_box}>
                        <img key={user.id} width={25} height={25} src={user.imageURL ?? 'https://preview.colorkit.co/color/ff0000.png?static=true'} alt="image" />
                        <Typography>{user.userName}</Typography>
                    </Box>
                )) : (
                    <Typography>No users assigned</Typography>
                ))}
            </Box>
        </Box>
    );
}