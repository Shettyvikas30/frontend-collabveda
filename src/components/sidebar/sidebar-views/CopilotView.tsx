import { useCopilot } from "@/context/CopilotContext"
import { useFileSystem } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { SocketEvent } from "@/types/socket"
import toast from "react-hot-toast"
import { LuClipboardPaste, LuCopy, LuRepeat } from "react-icons/lu"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

function CopilotView() {
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const { generateCode, output, isRunning, setInput } = useCopilot()
    const { activeFile, updateFileContent, setActiveFile } = useFileSystem()

    const copyOutput = async () => {
        try {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            await navigator.clipboard.writeText(content)
            toast.success("Output copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy output to clipboard")
            console.error(error)
        }
    }

    const pasteCodeInFile = () => {
        if (activeFile) {
            const newContent = `${activeFile.content || ""}\n${output.replace(/```[\w]*\n?/g, "").trim()}`
            updateFileContent(activeFile.id, newContent)
            setActiveFile({ ...activeFile, content: newContent })
            toast.success("Code pasted successfully")
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent,
            })
        }
    }

    const replaceCodeInFile = () => {
        if (activeFile && confirm("Are you sure you want to replace the code in the file?")) {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            updateFileContent(activeFile.id, content)
            setActiveFile({ ...activeFile, content })
            toast.success("Code replaced successfully")
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight, backgroundColor: "rgb(11, 15, 25)", color: "rgb(229, 231, 235)" }}
        >
            <h1 className="text-xl font-semibold">GEMINI AI </h1>

            <textarea
                className="min-h-[120px] w-full rounded-md bg-[#1b2234] p-2 text-white outline-none placeholder-gray-400"
                placeholder="What code do you want to generate?"
                onChange={(e) => setInput(e.target.value)}
            />

            <button
                className="mt-1 w-full rounded-md bg-[#3ddc91] py-2 font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={generateCode}
                disabled={isRunning}
            >
                {isRunning ? "Generating..." : "Generate Code"}
            </button>

            {output && (
                <div className="flex justify-end gap-4 pt-2">
                    <button title="Copy Output" onClick={copyOutput}>
                        <LuCopy size={18} className="cursor-pointer text-[#3ddc91]" />
                    </button>
                    <button title="Replace code in file" onClick={replaceCodeInFile}>
                        <LuRepeat size={18} className="cursor-pointer text-[#3ddc91]" />
                    </button>
                    <button title="Paste code in file" onClick={pasteCodeInFile}>
                        <LuClipboardPaste size={18} className="cursor-pointer text-[#3ddc91]" />
                    </button>
                </div>
            )}

            <div className="h-full w-full overflow-y-auto rounded-lg bg-[#1b2234] p-2">
                <ReactMarkdown
                    components={{
                        code({ inline, className, children }: any) {
                            const match = /language-(\w+)/.exec(className || "")
                            const language = match ? match[1] : "js"

                            return !inline ? (
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={language}
                                    PreTag="pre"
                                    className="!m-0 !rounded-lg !bg-[#0b0f19] !p-4"
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className="bg-[#2c2f3b] px-1 py-0.5 rounded">{children}</code>
                            )
                        },
                        pre({ children }) {
                            return <pre className="h-full">{children}</pre>
                        },
                    }}
                >
                    {output}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default CopilotView
