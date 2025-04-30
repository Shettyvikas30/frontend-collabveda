import { useState, useEffect } from "react";
import { useChatRoom } from "@/context/ChatContext";

const ChatList = () => {
    const { messages } = useChatRoom();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        return () => {
            Object.values(audioUrls).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [audioUrls]);

    useEffect(() => {
        const newUrls: Record<string, string> = {};

        messages.forEach((msg) => {
            if (msg.type === "audio") {
                // If message is a base64 string
                if (typeof msg.message === "string") {
                    newUrls[msg.id] = msg.message;
                }
                // If message is a Blob
                else if (msg.message instanceof Blob) {
                    const blobUrl = URL.createObjectURL(msg.message);
                    newUrls[msg.id] = blobUrl;
                }
            }
        });

        setAudioUrls(newUrls);
    }, [messages]);

    const handleAudioPlay = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.play();
        setPlayingAudio(audioUrl);
        audio.onended = () => setPlayingAudio(null);
    };

    return (
        <div>
            <ul className="space-y-2">
                {messages.map((msg) => (
                    <li
                        key={msg.id}
                        className={`p-2 rounded-md ${
                            selectedUser === msg.username ? "bg-blue-500" : "bg-gray-800"
                        }`}
                        onClick={() => setSelectedUser(msg.username)}
                    >
                        <strong className="text-white">{msg.username}: </strong>
                        {msg.type === "text" && typeof msg.message === "string" ? (
                            <span className="text-white">{msg.message}</span>
                        ) : msg.type === "audio" && audioUrls[msg.id] ? (
                            <div className="flex items-center gap-2">
                                <audio
                                    controls
                                    className="w-full"
                                    src={audioUrls[msg.id]}
                                    onPlay={() => handleAudioPlay(audioUrls[msg.id])}
                                    style={{
                                        opacity: playingAudio === audioUrls[msg.id] ? 0.5 : 1,
                                    }}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ) : (
                            <span className="text-red-400 text-sm">Unsupported message type</span>
                        )}
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div className="mt-2 text-sm text-blue-400">
                    Selected for voice chat: {selectedUser}
                </div>
            )}
        </div>
    );
};

export default ChatList;
