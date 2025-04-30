import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { buttonStyles, tooltipStyles } from "../tooltipStyles"

// Icon Imports
import { FaFolderOpen, FaRobot, FaPlay, FaUsersCog, FaCog } from "react-icons/fa"
import { BiMessageDetail } from "react-icons/bi"

interface SidebarButtonProps {
    viewName: VIEWS
}

const getIcon = (viewName: VIEWS): JSX.Element => {
    switch (viewName) {
        case VIEWS.FILES:
            return <FaFolderOpen size={22} />
        case VIEWS.CHATS:
            return <BiMessageDetail size={22} />
        case VIEWS.COPILOT:
            return <FaRobot size={22} />
        case VIEWS.RUN:
            return <FaPlay size={22} />
        case VIEWS.CLIENTS:
            return <FaUsersCog size={22} />
        case VIEWS.SETTINGS:
            return <FaCog size={22} />
        default:
            return <FaFolderOpen size={22} />
    }
}

const SidebarButton = ({ viewName }: SidebarButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = useViews()
    const { isNewMessage } = useChatRoom()
    const [showTooltip, setShowTooltip] = useState(true)

    const handleViewClick = () => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    const icon = getIcon(viewName)

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={handleViewClick}
                onMouseEnter={() => setShowTooltip(true)}
                className={`${buttonStyles.base} ${buttonStyles.hover}`}
                {...(showTooltip && {
                    "data-tooltip-id": `tooltip-${viewName}`,
                    "data-tooltip-content": viewName,
                })}
            >
                <div className="flex items-center justify-center text-white">
                    {icon}
                </div>

                {/* Notification dot for chat view */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-blue-500 shadow-md animate-ping" />
                )}
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <Tooltip
                    id={`tooltip-${viewName}`}
                    place="right"
                    offset={25}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}

export default SidebarButton
