import React, { MouseEventHandler } from 'react'

import styles from './MessagePopup.module.scss'
import { MessagePopupArgs } from './MessagePopupProvider'

import error_icon from './error_icon.svg'
import cross_icon from './cross_icon.svg'

type MessageType = 'error' | 'warning'

type Props = {
    message: MessagePopupArgs
    onClickClose: (e: MouseEvent) => void
}

const MessagePopup = ({
    message,
    onClickClose
}: Props) => {
    return (
        <div className={[
            styles[`colors_${message.type}`],
            styles[`state_${message.state}`]
        ].join(' ')}>
            <img src={error_icon.src} className={styles.icon} />
            <span className={styles.content}>{message.message}</span>
            <button className={styles.close_button} onClick={onClickClose as unknown as MouseEventHandler<HTMLButtonElement>}>
                <img src={cross_icon.src} />
            </button>
        </div>
    )
}

export default MessagePopup