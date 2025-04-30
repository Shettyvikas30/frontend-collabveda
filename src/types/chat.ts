
type ChatMessage = {
    id: string;
    username: string;
    timestamp: string;
    message?: string|Blob;         // optional for audio
    audioUrl?: string;        // used for voice messages
    type: "text" | "audio";   // new field!
  };
  

interface ChatContext {
    messages: ChatMessage[]
    setMessages: (
        messages: ChatMessage[] | ((messages: ChatMessage[]) => ChatMessage[]),
    ) => void
    isNewMessage: boolean
    setIsNewMessage: (isNewMessage: boolean) => void
    lastScrollHeight: number
    setLastScrollHeight: (lastScrollHeight: number) => void
}

export { ChatContext, ChatMessage }
