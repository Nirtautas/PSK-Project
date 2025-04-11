import { Card, CardActionArea, Skeleton, Typography } from '@mui/material'

import styles from './BoardCard.module.scss'

type Props = {
    name: string
    description: string
    imgUrl: string | undefined
    onClick: () => void
    isLoading: boolean
} | { isLoading: true }


const BoardCard = ({
    name,
    description,
    imgUrl,
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
                                <img src={imgUrl} alt="Card Image" className={styles.board_image}/>
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
