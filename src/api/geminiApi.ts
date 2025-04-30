import axios from "axios"

const geminiApi = axios.create({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    params: {
        key: import.meta.env.VITE_GEMINI_API_KEY, // or process.env if server-side
    },
    headers: {
        "Content-Type": "application/json",
    },
})

export default geminiApi
