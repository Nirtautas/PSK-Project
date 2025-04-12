import { Comment } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import CommentDisplay from "./CommentDisplay";
import CommentApi from "@/api/comment.api";

export default function CommentsView
({
    taskId,
    boardId
}: {
    taskId: number,
    boardId: number
}) {
    const userId = getUserId();
    const [comments, setComments] = useState<Comment[]>([]);
    useEffect(() => {
        setComments([]);
        CommentApi.getAll(boardId, taskId).then((resp) => {
            if (resp.error){
                console.error("Error fetching comments:", resp.error);
                return;
            }
            if (resp.result === undefined) {
                console.log("No comments found for this task.");
                return;
            };
            console.log("Fetched comments:", resp.result.item1);
            setComments(resp.result.item1 as Comment[]);
        }).catch((error) => {
            console.error("Failed to fetch comments:", error);
        });
        console.log("user id"+userId);
    }, [taskId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        const createdComment = await CommentApi.create(boardId, commentText, taskId);

        if (createdComment.error) {
            console.error("Error creating comment:", createdComment.error);
            setComments((prevComments) => [...prevComments, {id: 0, taskId: 0, userId: 0, content: `internal error, read text ${commentText}`, creationDate: new Date()} as Comment]);
            return;
        }
        if (createdComment.result) {
            console.log("Created comment:", createdComment.result);
            setComments((prevComments) => [...prevComments, createdComment.result as Comment]);
        }
        //Reset
        (event.currentTarget[0] as HTMLInputElement).value = '';
    }

    const handleDelete = ({commentData} : {commentData: Comment} ) => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;
        
        //TODO: WHY TF DOES COMMENT NOT HAVE BOARD ID BUT REQUIRES IT FOR DELETION??
        CommentApi.delete(boardId, commentData.taskId, commentData.id).then((resp) => {
            if (resp.error) {
                console.error("Error deleting comment:", resp.error);
                return;
            }
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentData.id));
            console.log("Deleted comment successfully");
        });
    }

    return (
        <Box sx={{ height: '50%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '60%' }}>
                {Array.isArray(comments) ? comments.map((comment: Comment, index: number) => (
                    <CommentDisplay key={index} commentData={comment} boardId={boardId} handleDelete={handleDelete} />
                )) : comments && (
                    <CommentDisplay commentData={comments} boardId={boardId} handleDelete={handleDelete}/>
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