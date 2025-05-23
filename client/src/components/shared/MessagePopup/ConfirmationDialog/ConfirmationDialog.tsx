import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import styles from './ConfirmationDialog.module.scss'
import { Button, Paper, Typography } from '@mui/material'
import { createPortal } from 'react-dom'

export type ConfirmationDialogArgs = {
    title: string,
    text: string,
    onOkClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onCancelClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    type?: 'warning' | 'error' | 'info'
}

export type ConfirmationDialogRef = {
    showDialog: (args: ConfirmationDialogArgs) => void
}

const ConfirmationDialog = forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [args, setArgs] = useState<ConfirmationDialogArgs>()
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
        showDialog: (args: ConfirmationDialogArgs) => {
            setShow(true)
            setArgs({ ...args, type: args.type || "error" })
        }
    }), [])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <>
            {isMounted && createPortal(
                <div className={show ? styles.overlay : styles.overlay_hidden}>
                    <div className={styles.wrapper}>
                        <Paper sx={{ height: '30vh', width: '30vw', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
                            <div className={styles.content_section}>
                                <Typography variant="h4">{args?.title}</Typography>
                                <br />
                                <p>{args?.text}</p>
                            </div>
                            <div className={styles.button_section}>
                                <Button
                                    color={args?.type}
                                    variant='contained'
                                    onClick={(e) => {
                                        args?.onOkClick?.(e)
                                        setShow(false)
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    color="info"
                                    sx={{ marginLeft: '1rem', paddingX: '2rem' }}
                                    variant='contained'
                                    onClick={(e) => {
                                        args?.onCancelClick?.(e)
                                        setShow(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Paper>
                    </div>
                </div>
                , document.body)}
        </>
    )
})

export default ConfirmationDialog