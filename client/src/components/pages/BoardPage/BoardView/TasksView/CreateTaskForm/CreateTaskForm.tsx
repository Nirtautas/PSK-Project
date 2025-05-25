import { Box, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TaskApi, { CreateTaskDto } from "@/api/task.api";
import SelectUsersField from "./SelectUsersField";
import dayjs from "dayjs";
import { useState, FormEvent } from "react";
import { BoardUser, Task, TaskStatus, TaskUser } from "@/types/types";
import TaskOnUserApi from "@/api/taskOnUser.api";
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider'

type Props = {
    handleClose: () => void
    boardId: number
    onCreate: (t: Task) => void
}

const CreateTaskForm = ({ handleClose, boardId, onCreate }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<BoardUser[]>([]);

    const messages = useMessagePopup()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newTask = {
            title,
            description: description || null,
            taskStatus: TaskStatus.PENDING,
            deadlineEnd: deadline ? deadline.toDate() : null
        }
        
        const response = await TaskApi.create(newTask as CreateTaskDto, boardId)
        if (!response.result) {
            messages.displayError(response.error || 'An error occured')
            handleClose()
            return
        }
        const userIds = selectedUsers.map(user => user.id)
            await TaskOnUserApi.linkTaskUser(boardId, response.result.id, userIds)
            
            const taskUsers: TaskUser[] = selectedUsers.map(user => ({
                id: user.id,
                userName: user.userName,
                imageURL: user.imageURL ?? '',
                assignedAt: new Date()
            }))
            
            const createdTask: Task = {
                ...response.result,
                assignedUsers: taskUsers
            }
            onCreate(createdTask)
        handleClose()
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                    required 
                    label="Title" 
                    variant="standard" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="Deadline" 
                        value={deadline}
                        onChange={(date) => setDeadline(date)}
                    />
                </LocalizationProvider>
                <TextField 
                    label="Description" 
                    variant="standard" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <SelectUsersField 
                    onUsersChange={setSelectedUsers}
                    boardId={boardId}
                />
                <Button type="submit" variant="contained">
                    Create Task
                </Button>
            </Box>
        </form>
    )
}

export default CreateTaskForm
