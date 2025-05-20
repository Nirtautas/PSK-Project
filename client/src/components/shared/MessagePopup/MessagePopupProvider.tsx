'use client'

import React, { createContext, useContext, useRef } from 'react'
import MessagePopupContainer, { MessagePopupRef } from './MessagePopupContainer'

type MessagePopupContextType = {
    displayErrorWithMs: (message: string, durationMs: number) => void
    displayError: (message: string) => void
}

type Props = {
    children: React.ReactNode
}

export type MessagePopupTypes = 'error'
export type MessagePopupArgs = {
    id: string
    message: string
    state: 'initial' | 'shown' | 'ended'
    type: MessagePopupTypes
}

const MessagePopupContext = createContext<MessagePopupContextType | null>(null)

export const useMessagePopup = () => {
    const messageContext = useContext(MessagePopupContext)
    if (messageContext === null) {
        throw new Error('The "useMessagePopup" hook must be used under a "MessagePopupProvider"')
    }
    return messageContext
}

const MessagePopupProvider = ({ children }: Props) => {
    const ref = useRef<MessagePopupRef>(null)
    return (
        <MessagePopupContext.Provider value={{
            displayErrorWithMs: (message, duration) => ref.current?.pushMessage(message, duration, 'error'),
            displayError: (message) => ref.current?.pushMessage(message, 5000, 'error')
        }}>
            {children}
            <MessagePopupContainer ref={ref} />
        </MessagePopupContext.Provider>
    )
}

export default MessagePopupProvider
