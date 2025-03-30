import { Box, Typography } from "@mui/material";

export default function DeadlineDescriptionView
({
    deadline, 
    description
}: {
    //TODO: idk how we gonna store the deadline, so for now it's a string
    deadline: string,
    description: string
}) {
    return(
        <Box sx={{height: '50%'}}>
            <Box sx={{ padding: 0.5}}>
                <Typography variant="h4" sx={{padding: 1}}>Deadline</Typography>
                <Typography variant="body1">{deadline}</Typography>
            </Box>
            <Box sx={{ padding: 0.5, overflowY: 'auto'}}>
                <Typography variant="h4" sx={{padding: 1}}>Description</Typography>
                <Typography variant="body1">{description}</Typography>
            </Box>
        </Box>
    )
}