import React from 'react'

import styles from './MessagePopup.module.scss'
import { MessagePopupArgs } from './MessagePopupProvider'

type MessageType = 'error' | 'warning'

type Props = {
    message: MessagePopupArgs
}

const MessagePopup = ({
    message
}: Props) => {
    return (
        <div className={[
            styles[`colors_${message.type}`],
            styles[`state_${message.state}`]
        ].join(' ')}>{message.message}</div>
    )
}

export default MessagePopup