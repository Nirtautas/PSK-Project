import React, { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import MessagePopup from './MessagePopup'
import MessagePopupContainer from './MessagePopupContainer'


type MessagePopupContextType = {
    displayError: (message: string, durationMs: number) => void
}

type Props = {
    children: React.ReactNode
}

export type MessagePopupArgs = {
    id: string
    message: string
    state: 'initial' | 'shown' | 'ended'
    type: MessagePopupTypes
}

export type MessagePopupTypes = 'error'


const MessagePopupContext = createContext<MessagePopupContextType | null>(null)

export const useMessagePopup = () => {
    const messageContext = useContext(MessagePopupContext)
    if (messageContext === null) {
        throw new Error('"useMessagePopup" must be used with a "MessagePopupProvider"')
    }
    return messageContext
}



const MessagePopupProvider = ({ children }: Props) => {
    const initTime = 1
    const [messages, setMessages] = useState<MessagePopupArgs[]>([])

    const pushMessage = async (message: string, durationMs: number, type: MessagePopupTypes) => {
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
            setMessages((messages) => messages.map((prevMessage) => prevMessage.id === currentMessage.id ? { ...currentMessage, state: 'shown' } : prevMessage))
        }, initTime)

        setTimeout(() => {
            setMessages((messages) => messages.map((prevMessage) => prevMessage.id === currentMessage.id ? { ...currentMessage, state: 'ended' } : prevMessage))
        }, durationMs + initTime)
    }

    return (
        <MessagePopupContext.Provider value={{
            displayError: (mesage, duration) => pushMessage(mesage, duration, 'error')
        }}>
            {children}
            {createPortal(
                <MessagePopupContainer messages={messages}/>,
                document.body
            )}
        </MessagePopupContext.Provider>
    )
}

export default MessagePopupProvider