import React, { MouseEventHandler } from 'react'

import styles from './MessagePopup.module.scss'
import { MessagePopupArgs } from './MessagePopupProvider'

import error_icon from './error_icon.svg'
import cross_icon_black from './cross_icon_black.svg'
import cross_icon_white from './cross_icon_white.svg'
import { useDarkTheme } from '@/hooks/darkTheme'

type MessageType = 'error' | 'warning'

type Props = {
    message: MessagePopupArgs
    onClickClose: (e: MouseEvent) => void
}

const MessagePopup = ({
    message,
    onClickClose
}: Props) => {
    const isDarkTheme = useDarkTheme()
    return (
        <div className={[
            styles[`colors_${message.type}`],
            styles[`state_${message.state}`]
        ].join(' ')}>
            <img src={error_icon.src} className={styles.icon} />
            <span className={styles.content}>{message.message}</span>
            <button className={styles.close_button} onClick={onClickClose as unknown as MouseEventHandler<HTMLButtonElement>}>
                <img src={isDarkTheme ? cross_icon_white.src : cross_icon_black.src} />
            </button>
        </div>
    )
}

export default MessagePopup