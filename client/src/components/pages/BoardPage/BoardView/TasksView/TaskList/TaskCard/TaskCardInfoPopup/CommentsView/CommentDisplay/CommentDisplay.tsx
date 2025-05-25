import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import { BoardUser, Comment, TaskStatus } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import CommentApi from "@/api/comment.api";
import Avatar from "@mui/material/Avatar";
import styles from "./CommentDisplay.module.scss"
import { useDarkTheme } from "@/hooks/darkTheme";

export default function CommentDisplay({
    commentData,
    boardId,
    handleDelete,
    user,
    onEdit,
    taskStatus
}: {
    commentData: Comment,
    boardId: number,
    handleDelete: ({commentData}: {commentData: Comment}) => void,
    user?: BoardUser
    onEdit: (newContent: string) => void
    taskStatus: TaskStatus
}) {
    const userId = getUserId();
    const [editing, setEditing] = useState(false);
    const isDarkTheme = useDarkTheme()
    
    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        onEdit(commentText)
        setEditing(false);
    }
    
    return (
        <Box className={styles.comment_container} sx={{backgroundColor: isDarkTheme ? '#1F1F1F' : '#E0E0E0'}}>
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
                    <div className={styles.comment_header}>
                        <Avatar className={styles.avatar} alt="userName" src={user?.imageURL} />
                        <div className={styles.username}>{user?.userName}</div>
                        <Typography variant="body2" className={styles.date}>
                            {new Date(commentData.creationDate).toISOString().slice(0, 16).replace('T', ' ')}
                        </Typography>
                    </div>
                    <Typography variant="body1" className={styles.comment_text}>
                        {commentData.content}
                    </Typography>
                    {commentData.userId === userId && taskStatus !== TaskStatus.ARCHIVED && (
                        <Box className={styles.buttons_container}>
                            <Button
                                className={styles.button}
                                variant="text"
                                size="small"
                                onClick={() => setEditing(true)}
                                startIcon={<EditIcon fontSize="small"/>}
                            />
                            <Button
                                className={styles.button}
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