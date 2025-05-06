import React from 'react'
import { MessagePopupArgs } from './MessagePopupProvider'
import MessagePopup from './MessagePopup'


type Props = {
    messages: MessagePopupArgs[]
}

const MessagePopupContainer = ({ messages }: Props) => {
    return (
        <div style={{
            position: 'absolute',
            zIndex: 1000,
            top: 0,
            left: 100
        }}>
            {messages.map((message, index) => (
                <MessagePopup key={`message-popup-${index}`} message={message} />
            ))}
        </div>
    )
}

export default MessagePopupContainer