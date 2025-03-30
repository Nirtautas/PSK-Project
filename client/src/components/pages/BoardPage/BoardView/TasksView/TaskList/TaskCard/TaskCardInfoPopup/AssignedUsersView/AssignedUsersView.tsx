import { User } from "@/types/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AssignedUsersView({users}: {users: User[]}) {
    return (
        <Box sx={{ height: '100%'}}>
            <Typography variant="h4">Assigned Users</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                {users.map((user) => (
                    <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                        <Typography>{user.name}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}