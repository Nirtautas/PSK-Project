import { TaskUser } from "@/types/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
    users: TaskUser[]
}
  
export default function AssignedUsersView({ users }: Props) {
    return (
        <Box sx={{ height: '100%'}}>
            <Typography variant="h4">Assigned Users</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                {users ? users.map((user) => (
                    <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                        <Typography>{user.userName}</Typography>
                    </Box>
                )) : (
                    <Typography>No users assigned</Typography>
                )}
            </Box>
        </Box>
    );
}