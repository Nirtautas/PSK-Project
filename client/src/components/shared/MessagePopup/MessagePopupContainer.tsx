import React from 'react'
import { MessagePopupArgs } from './MessagePopupProvider'
import MessagePopup from './MessagePopup'

import styles from './MessagePopupContainer.module.scss'

type Props = {
    messages: MessagePopupArgs[],
    onMessageClose: (e: MouseEvent, message: MessagePopupArgs) => void
}
const MessagePopupContainer = ({ messages, onMessageClose }: Props) => {
    return (
        <div className={styles[`wrapper`]}>
            {messages.map((message) => (
                <div key={`message-popup-${message.id}`}>
                    <MessagePopup message={message} onClickClose={(e) => onMessageClose(e, message)} />
                </div>
            ))}
        </div>
    )
}

export default MessagePopupContainer