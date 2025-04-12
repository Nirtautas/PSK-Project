import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import { Comment } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import CommentApi from "@/api/comment.api";

export default function CommentDisplay({
    commentData,
    boardId,
    handleDelete
}: {
    commentData: Comment,
    boardId: number,
    handleDelete: ({commentData}: {commentData: Comment}) => void
}) {
    const userId = getUserId();
    const [userName, setUserName] = useState<string>("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        //TODO: fetch user data from commentData.userId and save the name for display
        setUserName(commentData.userId.toString());
    }, [commentData]);
    
    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        const updatedComment = await CommentApi.update(boardId, commentData.taskId, commentData.id, commentText);
        if (updatedComment.error) {
            console.error("Error updating comment:", updatedComment.error);
        }
        if (updatedComment.result) {
            console.log("Edited text to:", commentText);
            commentData.content = commentText;
        }
        setEditing(false);
    }
    
    return (
        <Box sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
            {editing ? (
                <form onSubmit={handleEdit}>
                    <TextField
                        variant="outlined"
                        defaultValue={commentData.content}
                        fullWidth 
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ marginTop: 1 }}
                        type="submit"
                    >
                        Save
                    </Button>
                </form>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Typography variant="body1">{userName}: {commentData.content}</Typography>
                        <Typography variant="body2" sx={{ marginLeft: 2, color: 'gray' }}>{commentData.creationDate.toLocaleString()}</Typography>
                    </Box>
                    {commentData.userId === userId && (
                    <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => setEditing(true)}
                            startIcon={<EditIcon fontSize="small"/>}
                        />
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            onClick={() => handleDelete({commentData})}
                            startIcon={<Delete fontSize="small"/>}
                        />
                    </Box>
                    )}
                </>
            )}
        </Box>
    )
}