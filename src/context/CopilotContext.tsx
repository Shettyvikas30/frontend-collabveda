import { ICopilotContext } from "@/types/copilot"
import { createContext, ReactNode, useContext, useState } from "react"
import toast from "react-hot-toast"
import geminiApi from "../api/geminiApi"

const CopilotContext = createContext<ICopilotContext | null>(null)

export const useCopilot = () => {
    const context = useContext(CopilotContext)
    if (!context) {
        throw new Error("useCopilot must be used within a CopilotContextProvider")
    }
    return context
}

const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    const generateCode = async () => {
        if (!input.trim()) {
            toast.error("Please write a prompt")
            return
        }

        try {
            toast.loading("Generating code...")
            setIsRunning(true)

            const response = await geminiApi.post("", {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `You are a code generator copilot for a project named Code Sync. Generate code based on the given prompt without explanation. Format the output in a Markdown code block. Prompt: ${input}`,
                            },
                        ],
                    },
                ],
            })

            const code =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

            if (code) {
                setOutput(code)
                toast.success("Code generated successfully")
            } else {
                toast.error("No code returned")
            }
        } catch (error) {
            console.error("Gemini error:", error)
            toast.error("Failed to generate code")
        } finally {
            setIsRunning(false)
            toast.dismiss()
        }
    }

    return (
        <CopilotContext.Provider
            value={{ setInput, output, isRunning, generateCode }}
        >
            {children}
        </CopilotContext.Provider>
    )
}

export { CopilotContextProvider }
export default CopilotContext
