import React from 'react'

import styles from './PageChanger.module.scss'
import { Button } from '@mui/material'

type Props = {
    pageNumber: number
    totalPages: number
    onClickPrevious: () => void
    onClickNext: () => void
    disabledPrevious?: boolean
    disabledNext?: boolean
    isLoading?: boolean
}

const PageChanger = ({ pageNumber, totalPages, onClickPrevious, onClickNext, disabledPrevious, disabledNext, isLoading }: Props) => {
    return (
        <div className={styles.container}>
            <Button onClick={onClickPrevious} disabled={disabledPrevious || isLoading}>Previous</Button>
            <span>{`Page: ${isLoading ? '...' : pageNumber + 1} of ${isLoading ? 999 : totalPages}`}</span>
            <Button onClick={onClickNext} disabled={disabledNext || isLoading}>Next</Button>
        </div>
    )
}

export default PageChanger