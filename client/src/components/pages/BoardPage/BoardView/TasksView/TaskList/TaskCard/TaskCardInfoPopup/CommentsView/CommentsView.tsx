import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CommentsView
({
    comments, 
    taskId
}: {
    //TODO: idk how we gonna store the comments, so for now it's a string[]
    //alternatievly we can fetch the comments from the server
    comments: string[],
    taskId: number
}) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        
    }

    return (
        <Box sx={{ height: '50%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '60%' }}>
                {comments.map((comment, index) => (
                    <Box key={index} sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
                        <Typography variant="body1">{comment}</Typography>
                    </Box>
                ))}
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Add a comment" fullWidth sx={{ marginBottom: 1 }} />
                <Button variant="outlined" type="submit">
                    Add a comment to task {taskId}
                </Button>
            </form>
        </Box>
    );
}