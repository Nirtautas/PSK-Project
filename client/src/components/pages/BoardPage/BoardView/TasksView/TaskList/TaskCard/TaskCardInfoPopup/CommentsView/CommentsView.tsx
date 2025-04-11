import { Comment } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { use, useEffect } from "react";
import CommentDisplay from "./CommentDisplay";

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
    const userId = getUserId();
    useEffect(() => {
        console.log("user id"+userId);
    }, []);

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
                    <CommentDisplay commentData={comment} />
                )) : comments && (
                    <CommentDisplay commentData={comments} />
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