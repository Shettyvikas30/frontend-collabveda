import { useState, useRef } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { useAppContext } from "@/context/AppContext";
import { useChatRoom } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";
import { ChatMessage } from "@/types/chat";
import { SocketEvent } from "@/types/socket";
import { formatDate } from "@/utils/formateDate";
import { FormEvent } from "react";
import { v4 as uuidV4 } from "uuid";

function ChatInput() {
    const { currentUser } = useAppContext();
    const { socket } = useSocket();
    const { setMessages } = useChatRoom();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isRecording, setIsRecording] = useState(false); // Start with false, so mute icon is shown
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputVal = inputRef.current?.value.trim();

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
                type: "text",
            };
            socket.emit(SocketEvent.SEND_MESSAGE, { message });
            setMessages((messages) => [...messages, message]);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            // Start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                // Convert Blob to Base64 string for socket transmission
                const base64 = await blobToBase64(audioBlob);

                const message: ChatMessage = {
                    id: uuidV4(),
                    message: base64,
                    username: currentUser.username,
                    timestamp: formatDate(new Date().toISOString()),
                    type: "audio",
                };

                socket.emit(SocketEvent.SEND_MESSAGE, { message });
                setMessages((messages) => [...messages, message]);
            };

            mediaRecorder.start();
            setIsRecording(true); // Switch to mic icon when recording starts
        } else {
            // Stop recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false); // Switch to mute icon when recording stops
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    return (
        <div className="flex items-center gap-2 border border-primary rounded-md p-2 bg-dark">
            <button
                onClick={toggleRecording}
                className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
                type="button"
            >
                {isRecording ? <BsMicFill size={24} /> : <BsMicMuteFill size={24} />}
            </button>
            <form onSubmit={handleSendMessage} className="flex-grow flex">
                <input
                    type="text"
                    className="w-full flex-grow rounded-md border-none bg-dark p-2 outline-none"
                    placeholder="Enter a message..."
                    ref={inputRef}
                />
                <button
                    className="flex items-center justify-center rounded-r-md bg-primary p-2 text-black"
                    type="submit"
                >
                    <LuSendHorizonal size={24} />
                </button>
            </form>
        </div>
    );
}

export default ChatInput;
