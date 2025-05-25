'use client'

import React, { createContext, useContext, useRef } from 'react'
import MessagePopupContainer, { MessagePopupRef } from './MessagePopupContainer'
import ConfirmationDialog, { ConfirmationDialogArgs, ConfirmationDialogRef } from './ConfirmationDialog/ConfirmationDialog'

type MessagePopupContextType = {
    displayErrorWithMs: (message: string, durationMs: number) => void
    displayError: (message: string) => void
    displayDialog: (args: ConfirmationDialogArgs) => void
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
    const messagesRef = useRef<MessagePopupRef>(null)
    const confirmationDialogRef = useRef<ConfirmationDialogRef>(null)
    return (
        <MessagePopupContext.Provider value={{
            displayErrorWithMs: (message, duration) => messagesRef.current?.pushMessage(message, duration, 'error'),
            displayError: (message) => messagesRef.current?.pushMessage(message, 5000, 'error'),
            displayDialog: (args) => confirmationDialogRef.current?.showDialog(args)
        }}>
            {children}
            <MessagePopupContainer ref={messagesRef} />
            <ConfirmationDialog ref={confirmationDialogRef} />
        </MessagePopupContext.Provider>
    )
}

export default MessagePopupProvider
