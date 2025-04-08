import React from 'react'

import styles from './PageChanger.module.scss'
import { Button } from '@mui/material'

type Props = {
    pageNumber: number
    onClickPrevious: () => void
    onClickNext: () => void
    disabledPrevious?: boolean
    disabledNext?: boolean
}

const PageChanger = ({ pageNumber, onClickPrevious, onClickNext, disabledPrevious, disabledNext }: Props) => {
    return (
        <div className={styles.container}>
            <Button onClick={onClickPrevious} disabled={disabledPrevious}>Previous</Button>
            <span>{`Page: ${pageNumber}`}</span>
            <Button onClick={onClickNext} disabled={disabledNext}>Next</Button>
        </div>
    )
}

export default PageChanger