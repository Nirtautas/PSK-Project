import React, { MouseEventHandler } from 'react'

import styles from './MessagePopup.module.scss'
import { MessagePopupArgs } from './MessagePopupProvider'

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
            {message.message}
            <button onClick={onClickClose as unknown as MouseEventHandler<HTMLButtonElement>}>Close</button>
        </div>
    )
}

export default MessagePopup