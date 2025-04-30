import { useRunCode } from "@/context/RunCodeContext"
import useResponsive from "@/hooks/useResponsive"
import { ChangeEvent } from "react"
import toast from "react-hot-toast"
import { LuCopy } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"

function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
        <div
    className="flex flex-col items-center gap-2 p-4"
    style={{ height: viewHeight, backgroundColor: 'rgb(11, 15, 25)' }}
>
    <h1 className="view-title" style={{ color: 'rgb(229, 231, 235)' }}>Run Code</h1>
    <div className="flex h-[90%] w-full flex-col items-end gap-2 md:h-[92%]">
        <div className="relative w-full">
            <select
                className="w-full rounded-md border-none px-4 py-2 outline-none"
                style={{ backgroundColor: 'rgb(11, 15, 25)', color: 'rgb(229, 231, 235)' }}
                value={JSON.stringify(selectedLanguage)}
                onChange={handleLanguageChange}
            >
                {supportedLanguages
                    .sort((a, b) => (a.language > b.language ? 1 : -1))
                    .map((lang, i) => {
                        return (
                            <option
                                key={i}
                                value={JSON.stringify(lang)}
                            >
                                {lang.language +
                                    (lang.version
                                        ? ` (${lang.version})`
                                        : "")}
                            </option>
                        );
                    })}
            </select>
            <PiCaretDownBold
                size={16}
                className="absolute bottom-3 right-4 z-10"
                style={{ color: 'rgb(229, 231, 235)' }}
            />
        </div>
        <textarea
            className="min-h-[120px] w-full resize-none rounded-md border-none p-2 outline-none"
            style={{ backgroundColor: 'rgb(11, 15, 25)', color: 'rgb(229, 231, 235)' }}
            placeholder="Write your input here..."
            onChange={(e) => setInput(e.target.value)}
        />
        <button
            className="flex w-full justify-center rounded-md bg-[#2d8cf0] p-2 font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={runCode}
            disabled={isRunning}
        >
            <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3l14 9-14 9V3z"
                />
            </svg>
            <span className="ml-2">Run</span>
        </button>
        <label className="flex w-full justify-between" style={{ color: 'rgb(229, 231, 235)' }}>
            Output :
            <button onClick={copyOutput} title="Copy Output">
                <LuCopy
                    size={18}
                    className="cursor-pointer"
                    style={{ color: 'rgb(229, 231, 235)' }}
                />
            </button>
        </label>
        <div className="w-full flex-grow resize-none overflow-y-auto rounded-md border-none p-2 outline-none"
            style={{ backgroundColor: 'rgb(11, 15, 25)', color: 'rgb(229, 231, 235)' }}
        >
            <code>
                <pre className="text-wrap">{output}</pre>
            </code>
        </div>
    </div>
</div>

    
    )
}

export default RunView
