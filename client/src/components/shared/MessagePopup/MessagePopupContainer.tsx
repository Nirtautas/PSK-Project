import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import MessagePopup from './MessagePopup'

import styles from './MessagePopupContainer.module.scss'
import { createPortal } from 'react-dom'

export type MessagePopupArgs = {
    id: string
    message: string
    state: 'initial' | 'shown' | 'ended'
    type: MessagePopupTypes
}

export type MessagePopupTypes = 'error'

export type MessagePopupRef = {
    pushMessage: (message: string, durationMs: number, type: MessagePopupTypes) => void
}

type Props = {}

const MessagePopupContainer = forwardRef<MessagePopupRef, Props>((props, ref) => {
    const initTime = 1
    const [messages, setMessages] = useState<MessagePopupArgs[]>([])
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const pushMessage = useCallback(async (message: string, durationMs: number, type: MessagePopupTypes) => {
        const currentMessage: MessagePopupArgs = {
            id: Math.random().toString(36),
            message,
            state: 'initial',
            type
        }

        setMessages((messages) => [
            ...messages,
            currentMessage
        ])

        setTimeout(() => {
            setMessages((messages) => messages.map((prevMessage) => prevMessage.id === currentMessage.id
                ? { ...currentMessage, state: 'shown' }
                : prevMessage
            ))
        }, initTime)

        setTimeout(() => {
            setMessages((messages) => messages.map((prevMessage) => prevMessage.id === currentMessage.id
                ? { ...currentMessage, state: 'ended' }
                : prevMessage
            ))
        }, durationMs + initTime)
    }, [])

    const handleMessageClose = (e: MouseEvent, message: MessagePopupArgs) => {
        setMessages((messages) => messages.map((prevMessage) => prevMessage.id === message.id
            ? { ...message, state: 'ended' }
            : prevMessage
        ))
    }

    useImperativeHandle(ref, () => ({
        pushMessage
    }))

    return (
        <>
            {isMounted &&
                createPortal(
                    (
                        <div className={styles[`wrapper`]}>
                            {messages.map((message) => (
                                <div key={`message-popup-${message.id}`}>
                                    <MessagePopup message={message} onClickClose={(e) => handleMessageClose(e, message)} />
                                </div>
                            ))}
                        </div>
                    ),
                    document.body
                )}


        </>
    )
})

export default MessagePopupContainer
