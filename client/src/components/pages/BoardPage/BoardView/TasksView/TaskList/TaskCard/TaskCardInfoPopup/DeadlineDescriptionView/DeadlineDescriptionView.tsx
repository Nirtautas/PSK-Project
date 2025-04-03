import { Box, Typography } from "@mui/material";

export default function DeadlineDescriptionView
({
    deadline, 
    description
}: {
    deadline: Date | null,
    description: string | null
}) {
    return(
        <Box sx={{height: '50%'}}>
            <Box sx={{ padding: 0.5}}>
                <Typography variant="h4" sx={{padding: 1}}>Deadline</Typography>
                <Typography variant="body1">{deadline ? deadline.toLocaleString() : "No deadline"}</Typography>
            </Box>
            <Box sx={{ padding: 0.5, overflowY: 'auto'}}>
                <Typography variant="h4" sx={{padding: 1}}>Description</Typography>
                <Typography variant="body1">{description ? description : "No description provided"}</Typography>
            </Box>
        </Box>
    )
}