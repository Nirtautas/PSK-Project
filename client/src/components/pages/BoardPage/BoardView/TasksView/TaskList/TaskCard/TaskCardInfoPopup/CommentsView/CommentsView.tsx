import { BoardUser, Comment, User } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import CommentDisplay from "./CommentDisplay";
import CommentApi from "@/api/comment.api";
import useFetch from "@/hooks/useFetch";
import BoardOnUserApi from "@/api/boardOnUser.api";

export default function CommentsView
({
    taskId,
    boardId
}: {
    taskId: number,
    boardId: number
}) {
    const userId = getUserId();
    const { data: users, isLoading: loadingUsers } = useFetch({ resolver: () => BoardOnUserApi.getBoardUsers(boardId), deps: [taskId] })
    const { data: comments, isLoading: loadingComments } = useFetch({ resolver: () => CommentApi.getAll(boardId, taskId), deps: [taskId] });
    const [cashedComments, setCashedComments] = useState<Comment[]>([]);
    
    
    //TODO: useFetch instead of get all
    useEffect((() => {
        if (!loadingComments){
            setCashedComments(comments.result?.item1 as Comment[]);
        } else {
            console.log("Loading comments...");
        }
    }), [comments])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        const createdComment = await CommentApi.create(boardId, commentText, taskId);

        if (createdComment.error) {
            console.error("Error creating comment:", createdComment.error);
            setCashedComments((prevComments) => [...prevComments, {id: 0, taskId: 0, userId: 0, content: `internal error, read text ${commentText}`, creationDate: new Date()} as Comment]);
            return;
        }
        if (createdComment.result) {
            console.log("Created comment:", createdComment.result);
            setCashedComments((prevComments) => [...prevComments, createdComment.result as Comment]);
        }
        //Reset
        (event.currentTarget[0] as HTMLInputElement).value = '';
    }

    const handleDelete = ({commentData} : {commentData: Comment} ) => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;
        
        CommentApi.delete(boardId, commentData.taskId, commentData.id).then((resp) => {
            if (resp.error) {
                console.error("Error deleting comment:", resp.error);
                return;
            }
            setCashedComments((prevComments) => prevComments.filter((comment) => comment.id !== commentData.id));
            console.log("Deleted comment successfully");
        });
    }

    const link = !loadingUsers ? users.result?.find((user: BoardUser) => user.id === userId)?.imageURL || '' : '';
    
    return (
        <Box sx={{ height: '50%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '60%' }}>
                {cashedComments.map((comment: Comment, index: number) => (
                    <CommentDisplay key={index} commentData={comment} boardId={boardId} handleDelete={handleDelete} pfpLink={link}/>
                ))}
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