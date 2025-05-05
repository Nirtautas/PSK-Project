import { Board, BoardUser, Comment, User } from "@/types/types";
import { getUserId } from "@/utils/userId";
import { Button, TablePagination, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import CommentDisplay from "./CommentDisplay";
import CommentApi from "@/api/comment.api";
import useFetch from "@/hooks/useFetch";
import BoardOnUserApi from "@/api/boardOnUser.api";
import usePagedFetch from "@/hooks/usePagedFetch";

export default function CommentsView
({
    taskId,
    boardId
}: {
    taskId: number,
    boardId: number
}) {
    const { data: users, isLoading: loadingUsers } = useFetch({ resolver: () => BoardOnUserApi.getBoardUsers(boardId), deps: [taskId] })
    const [pageNum, setPageNum] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [cashedComments, setCashedComments] = useState<Comment[]>([]);
    const [cashedUsers, setCashedUsers] = useState<BoardUser[] | null>(null);

    const { 
        data: comments,
        isLoading: loadingComments
    } = usePagedFetch({
        resolver: () => CommentApi.getAll(boardId, taskId, pageNum, rowsPerPage), 
        deps: [taskId, pageNum, rowsPerPage], 
        pageNum: pageNum, 
        resultKey: 'comments' 
    });
    
    //TODO: useFetch instead of get all
    useEffect((() => {
        console.log(taskId);
        if (!loadingComments){
            setCashedComments((comments?.results as Comment[]) || []);
            setTotalCount(comments?.totalCount || 0);
        } else {
            console.log("Loading comments...");
        }
    }), [comments])

    useEffect(() => {
        if (loadingUsers) return;
        const currUsers = users.result ? users.result : null;
        setCashedUsers(currUsers);
    }, [users]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setCashedComments([]);
        setPageNum(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCashedComments([]);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNum(0);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const commentText = (event.currentTarget[0] as HTMLInputElement).value;
        //TODO: the comments taskId returns as 0 all the time
        const createdComment = await CommentApi.create(boardId, commentText, taskId);

        if (createdComment.error) {
            console.error("Error creating comment:", createdComment.error);
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
        });
    }
    
    return (
        <Box sx={{ height: '70%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '50%' }}>
                {cashedComments.map((comment: Comment, index: number) => (
                    <CommentDisplay key={index} commentData={comment} boardId={boardId} handleDelete={handleDelete} cashedUsers={cashedUsers}/>
                ))}
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Add a comment" fullWidth sx={{ marginBottom: 1 }} />
                <Button variant="outlined" type="submit">
                    Post
                </Button>
            </form>
            <TablePagination
                component="div"
                count={totalCount}
                page={pageNum}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Comments per page"
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
}