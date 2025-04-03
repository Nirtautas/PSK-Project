import { Box, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TaskApi from "@/api/task.api";
import SelectUsersField from "./SelectUsersField";
import dayjs from "dayjs";
import { useState, FormEvent } from "react";
import { Task } from "@/types/types";

export default function CreateTaskForm({ 
  handleClose, 
  boardId 
}: { 
  handleClose: () => void, 
  boardId: number 
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const newTask = {
                title,
                description: description || null,
                status: 'waiting',
                deadline: deadline ? deadline.toDate() : null,
                assignedUsers: selectedUsers
            };
            
            const createdTask = await TaskApi.create(newTask as Omit<Task, 'id'>, boardId);
            //refresh tasks here if needed
            console.log('created task ', newTask);

            handleClose();
        } catch (error) {
            console.error('Task creation failed:', error);
        }
    };

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
                    value={selectedUsers} 
                    onChange={setSelectedUsers}
                />
                <Button type="submit" variant="contained">
                    Create Task
                </Button>
            </Box>
        </form>
    )
}
