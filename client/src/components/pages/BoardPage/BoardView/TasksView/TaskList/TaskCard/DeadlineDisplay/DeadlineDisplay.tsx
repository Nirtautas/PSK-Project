import { Task } from "@/types/types"
import { Box } from "@mui/material"

type Props = {
    deadline: Date | null
}

const DeadlineDisplay = ({ deadline }: Props) => {
    if (!deadline) return ""
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const dateStr = deadlineDate.toLocaleDateString()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 0) {
        return `Deadline by - ${dateStr} (${diffDays} days left)`
    } else {
        return (
            <>
                <Box sx={{ color: 'red' }}>
                    Deadline {dateStr} passed ({Math.abs(diffDays)} days late)
                </Box>
            </>
        )
    }
}

export default DeadlineDisplay