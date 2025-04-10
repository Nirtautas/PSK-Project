import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//TODO: users might want to pass a pictue too
export default function AssignedUsersView({users}: {users: string[] | string | null}) {
    return (
        <Box sx={{ height: '100%'}}>
            <Typography variant="h4">Assigned Users</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                {Array.isArray(users) ? users.map((user) => (
                    <Box key={user} sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                        <Typography>{user}</Typography>
                    </Box>
                )) : users ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                        <Typography>{users}</Typography>
                    </Box>
                ) : (
                    <Typography>No users assigned</Typography>
                )}
            </Box>
        </Box>
    );
}