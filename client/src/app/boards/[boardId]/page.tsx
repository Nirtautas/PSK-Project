import BoardPage from '@/components/pages/BoardPage'
import { notFound } from 'next/navigation'
import NavBarLayout from '@/components/templates/NavBarLayout'

type Props = {
    params: {
        boardId: string
    }
}

const Page = async ({ params }: Props) => {
    const { boardId } = await params
    const number = parseInt(boardId)
    if (isNaN(number)) {
        notFound()
    }

    return (
        <NavBarLayout>
            <BoardPage boardId={Number(boardId)} />
        </NavBarLayout>
    )
}

export default Page
