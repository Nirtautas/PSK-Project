import { Card, CardActionArea, Skeleton, Typography } from '@mui/material'

import styles from './BoardCard.module.scss'
import { placeholderImageUrl } from '@/constants/placeholders'

type Props = {
    name: string
    description: string
    imgUrl?: string
    onClick: () => void
    isLoading: boolean
} | { isLoading: true }


const BoardCard = ({
    // @ts-ignore
    name,
    // @ts-ignore
    description,
    // @ts-ignore
    imgUrl,
    // @ts-ignore
    onClick,
    isLoading
}: Props) => (
    <Card className={styles.board_card}>
        <CardActionArea
            onClick={onClick}
            sx={{
                display: 'flex',
                height: '100%',
            }}
        >
            <div className={styles.card_content}>
                {
                    !isLoading
                        ? (
                            <>
                                <img src={imgUrl || placeholderImageUrl} alt="Card Image" className={styles.board_image}/>
                                <div className={styles.text_content}>
                                    <Typography variant="h4">{name}</Typography> <br/>
                                    <p>{description}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton variant="rectangular" width={100} height={100} className={styles.board_image}/>

                                <div className={styles.text_content}>
                                    <Skeleton sx={{ width: '50%', height: '2.5em', marginBottom: '0.8rem' }} variant="rounded"/><br/>
                                    <Skeleton sx={{ display: 'flex', flex: 1 }} variant="rounded" />
                                </div>
                            </>
                        )
                }
            </div>
        </CardActionArea>
    </Card>
)

export default BoardCard
