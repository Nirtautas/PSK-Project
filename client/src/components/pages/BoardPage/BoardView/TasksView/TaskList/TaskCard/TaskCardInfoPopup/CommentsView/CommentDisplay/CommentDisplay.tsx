import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import { BoardUser, Comment } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import CommentApi from "@/api/comment.api";
import Avatar from "@mui/material/Avatar";

export default function CommentDisplay({
    commentData,
    boardId,
    handleDelete,
    cashedUsers,
}: {
    commentData: Comment,
    boardId: number,
    handleDelete: ({commentData}: {commentData: Comment}) => void,
    cashedUsers: BoardUser[] | null
}) {
    const userId = getUserId();
    const [editing, setEditing] = useState(false);
    
    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        const updatedComment = await CommentApi.update(boardId, commentData.taskId, commentData.id, commentText, commentData.version);
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar alt="profile picture" src={cashedUsers?.find(user => user.id === commentData.userId)?.imageURL} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {commentData.userId === userId ? "You" : cashedUsers?.find(user => user.id === commentData.userId)?.userName}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" 
                              sx={{
                                wordBreak: 'break-word', // allows long words to wrap
                                whiteSpace: 'pre-wrap',  // respects line breaks and wraps text
                              }}>{commentData.content}</Typography>
                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                {new Date(commentData.creationDate).toISOString().slice(0, 16).replace('T', ' ')}
                            </Typography>
                        </Box>
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