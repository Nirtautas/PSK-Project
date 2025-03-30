import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

export default function TaskCardInfoPopup({
    open,
    setOpen,
    taskTitle
}: {
    open: boolean, 
    setOpen: (open: boolean) => void,
    taskTitle: string
}) {
    
    const handleClose = () => setOpen(false);
    
    const style = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', padding: 2, height: 100, alignItems: 'center'}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {taskTitle}
                    </Typography>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1 }}>
                        Close
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ width: '100%', height: '100%', padding: 2}}>
                    <Grid container spacing={2} sx={{width: '100%', height: '100%', padding: 2}} >
                        <Grid size={8} sx={{border: '1px solid black', height: '100%'}}>
                            <Stack spacing={2} sx={{height: '100%'}}>
                                <Typography sx={{height: '50%', border: '1px solid red'}}>Deadline and description</Typography>
                                <Typography sx={{height: '50%', border: '1px solid red'}}>Comments</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={0.1}>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid size={3}>
                            <Typography sx={{ height: '100%', border: '1px solid red'}}>Assigned users</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    )
}