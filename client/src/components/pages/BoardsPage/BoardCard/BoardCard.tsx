import {Card, CardActionArea, Typography} from '@mui/material'

import styles from './BoardCard.module.scss'

type Props = {
    name: string
    description: string
    imgUrl: string
    onClick: () => void
}

const BoardCard = ({
    name,
    description,
    imgUrl,
    onClick
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
                <img src={imgUrl} alt="Card Image" className={styles.board_image} />
                <div className={styles.text_content}>
                    <Typography variant="h5">{name}</Typography> <br />
                    <p>{description}</p>
                </div>
            </div>
        </CardActionArea>
    </Card>
)

export default BoardCard
