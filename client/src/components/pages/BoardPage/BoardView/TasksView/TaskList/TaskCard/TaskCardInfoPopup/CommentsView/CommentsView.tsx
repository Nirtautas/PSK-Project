import { Comment } from "@/types/types";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CommentsView
({
    comments, 
    taskId
}: {
    //TODO: idk how we gonna store the comments
    //alternatievly we can fetch the comments from the server
    comments: Comment[] | Comment | null,
    taskId: number
}) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const comment = {
            text: (event.currentTarget[0] as HTMLInputElement).value,
            createdBy: { firstName: 'Jonas' }, //TODO: get the user from the context or store
            taskId: taskId
        }

        //TODO: send the comment to the server
        console.log("Created comment:", comment);

        //Reset
        (event.currentTarget[0] as HTMLInputElement).value = '';
    }

    return (
        <Box sx={{ height: '50%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '60%' }}>
                {Array.isArray(comments) ? comments.map((comment: Comment, index: number) => (
                    <Box key={index} sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <Typography variant="body1">{comment.createdBy.firstName}: {comment.text}</Typography>
                            <Typography variant="body2" sx={{ marginLeft: 2, color: 'gray' }}>{comment.createdAt.toLocaleString()}</Typography>
                        </Box>
                    </Box>
                )) : comments && (
                    <Box sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <Typography variant="body1">{comments.createdBy.firstName}: {comments.text}</Typography>
                            <Typography variant="body2" sx={{ marginLeft: 2, color: 'gray' }}>{comments.createdAt.toLocaleString()}</Typography>
                        </Box>
                    </Box>
                )}
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Add a comment" fullWidth sx={{ marginBottom: 1 }} />
                <Button variant="outlined" type="submit">
                    Post
                </Button>
            </form>
        </Box>
    );
}