import { Box, TextareaAutosize, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
        <Box sx={{height: '50%'}}>
            <Box sx={{ padding: 0.5}}>
                <Typography variant="h4" sx={{padding: 1}}>Deadline</Typography>
                {!editMode && <Typography variant="body1">{deadline ? new Date(deadline).toLocaleDateString() : "No deadline"}</Typography>}
                {editMode && 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            defaultValue={dayjs(deadline)}
                            onChange={(newDeadline) => setDeadline(newDeadline?.toDate() ?? null)}
                        />
                    </LocalizationProvider>
                }
                
            </Box>
            <Box sx={{ padding: 0.5, overflowY: 'auto'}}>
                <Typography variant="h4" sx={{padding: 1}}>Description</Typography>
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