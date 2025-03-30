import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import DeadlineDescriptionView from './DeadlineDescriptionView';
import CommentsView from './CommentsView';
import AssignedUsersView from './AssignedUsersView';
import { Task } from '@/types/types';

export default function TaskCardInfoPopup({
    open,
    setOpen,
    task
}: {
    open: boolean, 
    setOpen: (open: boolean) => void,
    task: Task
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
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', padding: 2, height: 100, alignItems: 'center' }}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ flexGrow: 1 }}>
                        {task.title}
                    </Typography>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Close
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ width: '100%', height: '100%', padding: 1}}>
                    <Grid container spacing={2} sx={{width: '100%', height: '100%', padding: 2}} >
                        <Grid size={8} sx={{height: '100%'}}>
                            <Stack spacing={2} sx={{height: '100%'}}>
                                <DeadlineDescriptionView deadline='2022-02-03' description='a very important task you must get done'/>
                                <CommentsView comments={['nice', 'great', 'wont be able to do it', 'a', 'a', 'a', 'a']} taskId={task.id}/>
                            </Stack>
                        </Grid>
                        <Grid size={0.1}>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid size={3}>
                            <AssignedUsersView users={[{id: 1, name: 'User 1'}, {id: 2, name: 'User 2'}]}/>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    )
}