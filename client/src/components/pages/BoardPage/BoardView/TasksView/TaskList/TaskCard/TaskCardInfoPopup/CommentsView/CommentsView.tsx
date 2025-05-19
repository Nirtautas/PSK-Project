import { BoardUser, Comment, TaskStatus } from "@/types/types"
import { Button, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import CommentDisplay from "./CommentDisplay"
import CommentApi from "@/api/comment.api"
import BoardOnUserApi from "@/api/boardOnUser.api"
import useFetch from '@/hooks/useFetch'
import usePagedFetch from '@/hooks/usePagedFetch'
import PageChanger from '@/components/shared/PageChanger'

export default function CommentsView
({
    taskId,
    boardId,
    taskStatus
}: {
    taskId: number,
    boardId: number,
    taskStatus: TaskStatus
}) {
    const [commentInputText, setCommentInputText] = useState<string>('')
    const { data: users, isLoading: loadingUsers } = useFetch({ resolver: () => BoardOnUserApi.getBoardUsers(boardId), deps: [taskId] })
    const [pageNum, setPageNum] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const {
        data: comments,
        setData: setComments,
        isLoading: loadingComments,
        errorMsg: errorMsgComments,
        pageCount,
        refetch
    } = usePagedFetch({
        resolver: () => CommentApi.getAll(boardId, taskId, pageNum, rowsPerPage),
        deps: [taskId, pageNum, rowsPerPage]
    })

    useEffect(() => {
        if(pageNum + 1 >= pageCount) {
            setPageNum(pageCount - 1)
        }}, [comments]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //TODO: the comments taskId returns as 0 all the time
        const response = await CommentApi.create(boardId, commentInputText, taskId)
        console.log("Response:", response)
        if (!response.result) {
            console.error("Error creating comment:", response.error)
            return
        }

        console.log("Created comment:", response.result)
        refetch()
        setCommentInputText('')
    }

    const handleDelete = ({commentData} : {commentData: Comment} ) => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?")
        if (!confirmed) return

        CommentApi.delete(boardId, commentData.taskId, commentData.id).then((resp) => {
            if (resp.error) {
                console.error("Error deleting comment:", resp.error)
                return
            }
            refetch()
        })
    }

    const getUserImageLink = (userId: number) => (
        !loadingUsers ? users.find((user: BoardUser) => user.id === userId)?.imageURL || '' : ''
    )

    return (
        <Box sx={{ height: '70%'}}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: 1, overflowY: 'auto', height: '50%' }}>
                {!errorMsgComments && !loadingComments && Array.isArray(comments) && comments.map((comment: Comment, index: number) => (
                    <CommentDisplay key={index} commentData={comment} boardId={boardId} handleDelete={handleDelete} pfpLink={getUserImageLink(comment.userId)} taskStatus={taskStatus}/>
                ))}
            </Box>
            {taskStatus !== TaskStatus.ARCHIVED &&
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        label="Add a comment"
                        fullWidth
                        sx={{ marginBottom: 1 }}
                        value={commentInputText}
                        onChange={(e) => setCommentInputText(e.currentTarget.value)}
                    />
                    <Button variant="outlined" type="submit">
                        Post
                    </Button>
                </form>
            }

            <PageChanger
                onClickNext={() => setPageNum(pageNum + 1)}
                onClickPrevious={() => setPageNum(pageNum - 1)}
                disabledPrevious={pageNum <= 0}
                disabledNext={pageNum >= pageCount - 1}
                pageNumber={pageNum}
                totalPages={pageCount}
            />
        </Box>
    )
}
