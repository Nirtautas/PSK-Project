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
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider'

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
        if (pageNum + 1 >= pageCount) {
            setPageNum(pageCount - 1)
        }
    }, [comments])

    const messages = useMessagePopup()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //TODO: the comments taskId returns as 0 all the time
        const response = await CommentApi.create(boardId, commentInputText, taskId)
        if (!response.result) {
            messages.displayError("Error creating comment: " + response.error)
            return
        }

        refetch()
        setCommentInputText('')
    }

    const handleDelete = ({ commentData }: { commentData: Comment }) => {
        messages.displayDialog({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this comment?",
            onOkClick: async () => {
                const response = await CommentApi.delete(boardId, commentData.taskId, commentData.id)
                if (response.error) {
                    messages.displayError("Error deleting comment: " + response.error)
                    return
                }
                refetch()
            }
        })
    }

    const getUserData = (userId: number) => !loadingUsers ? users.find((user: BoardUser) => user.id === userId) : undefined
    const handleEdit = async (comment: Comment, newText: string) => {
        const commentData = comment
        const { error, result: updatedComment } = await CommentApi.update(boardId, commentData.taskId, commentData.id, newText, commentData.version);
        if (!updatedComment) {
            messages.displayError(error!)
            return
        }
        setComments(comments.map((c) => c.id === updatedComment.id ? updatedComment : c))
        refetch()
    }

    return (
        <Box sx={{ height: '70%' }}>
            <Typography variant="h4">Comments</Typography>
            <Box sx={{ padding: '1rem 0.6rem 1rem 0', overflowY: 'auto', height: '50%' }}>
                {!errorMsgComments && !loadingComments && Array.isArray(comments) && comments.map((comment: Comment, index: number) => (
                    // <CommentDisplay key={index} commentData={comment} boardId={boardId} handleDelete={handleDelete} user={getUserData(comment.userId)} taskStatus={taskStatus}/>
                    <CommentDisplay
                        key={index}
                        commentData={comment}
                        boardId={boardId}
                        handleDelete={handleDelete}
                        onEdit={(newContent) => handleEdit(comment, newContent)}
                        user={getUserData(comment.userId)}
                        taskStatus={taskStatus}
                    />
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
