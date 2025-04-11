import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import { Comment } from "@/types/types";
import { getUserId } from "@/utils/userId";

export default function CommentDisplay({commentData}: {commentData: Comment}) {
    const userId = getUserId();
    return (
        <Box sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Typography variant="body1">{commentData.createdBy.firstName}: {commentData.text}</Typography>
                <Typography variant="body2" sx={{ marginLeft: 2, color: 'gray' }}>{commentData.createdAt.toLocaleString()}</Typography>
            </Box>
            {commentData.createdBy.id === userId && (
            <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                    variant="text"
                    size="small"
                    onClick={() => console.log("Edit comment:", commentData.id)}
                    startIcon={<EditIcon fontSize="small"/>}
                />
                <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={() => console.log("Delete comment:", commentData.id)}
                    startIcon={<Delete fontSize="small"/>}
                />
            </Box>
            )}
        </Box>
    )
}