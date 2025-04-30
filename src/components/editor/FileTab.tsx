import { useFileSystem } from "@/context/FileContext"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import { IoClose } from "react-icons/io5"
import cn from "classnames"
import { useEffect, useRef } from "react"
import customMapping from "@/utils/customMapping"
import { useSettings } from "@/context/SettingContext"
import langMap from "lang-map"

function FileTab() {
    const {
        openFiles,
        closeFile,
        activeFile,
        updateFileContent,
        setActiveFile,
    } = useFileSystem()
    const fileTabRef = useRef<HTMLDivElement>(null)
    const { setLanguage } = useSettings()

    const changeActiveFile = (fileId: string) => {
        // If the file is already active, do nothing
        if (activeFile?.id === fileId) return

        updateFileContent(activeFile?.id || "", activeFile?.content || "")

        const file = openFiles.find((file) => file.id === fileId)
        if (file) {
            setActiveFile(file)
        }
    }

    useEffect(() => {
        const fileTabNode = fileTabRef.current
        if (!fileTabNode) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                fileTabNode.scrollLeft += 100
            } else {
                fileTabNode.scrollLeft -= 100
            }
        }

        fileTabNode.addEventListener("wheel", handleWheel)

        return () => {
            fileTabNode.removeEventListener("wheel", handleWheel)
        }
    }, [])

    // Update the editor language when a file is opened
    useEffect(() => {
        if (activeFile?.name === undefined) return
        // Get file extension on file open and set language when file is opened
        const extension = activeFile.name.split(".").pop()
        if (!extension) return

        // Check if custom mapping exists
        if (customMapping[extension]) {
            setLanguage(customMapping[extension])
            return
        }

        const language = langMap.languages(extension)
        setLanguage(language[0])
    }, [activeFile?.name, setLanguage])

    return (
        <div
            className="flex h-[50px] w-full select-none gap-1 overflow-x-auto px-2 pt-2"
            ref={fileTabRef}
            style={{ backgroundColor: 'rgb(11, 15, 25)' }}
        >
            {openFiles.map((file) => {
                const isActive = file.id === activeFile?.id;
    
                return (
                    <span
                        key={file.id}
                        onClick={() => changeActiveFile(file.id)}
                        className={cn(
                            "flex items-center rounded-t-md px-3 py-1 transition-all",
                            {
                                "bg-[#1e293b] border-b-2 border-blue-500 text-white": isActive,
                                "hover:bg-[#1e2533] text-[rgb(229,231,235)]": !isActive,
                            }
                        )}
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        <Icon
                            icon={getIconClassName(file.name)}
                            fontSize={18}
                            className="mr-2"
                        />
                        <p
                            className="max-w-[150px] truncate"
                            title={file.name}
                        >
                            {file.name}
                        </p>
                        <IoClose
                            className="ml-3 hover:text-red-400"
                            size={18}
                            onClick={(e) => {
                                e.stopPropagation();
                                closeFile(file.id);
                            }}
                        />
                    </span>
                );
            })}
        </div>
    )
    
    
}

export default FileTab
