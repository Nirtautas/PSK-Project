import { Box, TextareaAutosize, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DeadlineDisplay from '@/components/shared/DeadlineDisplay';

export default function DeadlineDescriptionView
({
    editMode,
    deadline,
    setDeadline,
    description,
    setDescription
}: {
    editMode: boolean
    deadline: Date | null,
    setDeadline: (d: Date | null) => void
    description: string | null
    setDescription: (d: string | null) => void
}) {
    return(
        <Box sx={{height: '40%'}}>
            <Box>
                <Typography variant="h4" sx={{padding: '1rem 1rem 1rem 0'}}>Deadline</Typography>
                {!editMode && (deadline ? <DeadlineDisplay deadline={deadline}/> : "No deadline provided")}
                {editMode && 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            defaultValue={dayjs(deadline)}
                            onChange={(newDeadline) => setDeadline(newDeadline?.toDate() ?? null)}
                        />
                    </LocalizationProvider>
                }
                
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
                <Typography variant="h4" sx={{padding: '1rem 1rem 1rem 0'}}>Description</Typography>
                {!editMode && <Typography variant="body1">{description ? description : "No description provided"}</Typography>}
                {editMode &&
                    <TextareaAutosize
                        style={{ width: "100%" }}
                        minRows={5}
                        value={description ?? ""}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                }
            </Box>
        </Box>
    )
}