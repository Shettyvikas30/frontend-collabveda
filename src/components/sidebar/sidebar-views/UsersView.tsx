import Users from "@/components/common/Users"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { USER_STATUS } from "@/types/user"
import toast from "react-hot-toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

function UsersView() {
    const navigate = useNavigate()
    const { viewHeight } = useResponsive()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()

    const copyURL = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success("URL copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy URL to clipboard")
            console.log(error)
        }
    }

    const shareURL = async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toast.error("Unable to share URL")
            console.log(error)
        }
    }

    const leaveRoom = () => {
        socket.disconnect()
        setStatus(USER_STATUS.DISCONNECTED)
        navigate("/", {
            replace: true,
        })
    }

    return (
            <div
                className="flex flex-col px-4 py-6"
                style={{ height: viewHeight, backgroundColor: "#0b0f19", color: "#ffffff" }}
            >
                <h1 className="text-lg font-semibold text-white mb-4 tracking-wide">Users</h1>
    
            {/* Connected users list */}
            <Users />
    
            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-4 pt-6">
                <div className="flex w-full gap-3">
                    {/* Share URL */}
                    <button
                        className="flex flex-1 items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 transition text-white p-3 shadow-md"
                        onClick={shareURL}
                        title="Share Link"
                    >
                        <IoShareOutline size={24} />
                    </button>
    
                    {/* Copy URL */}
                    <button
                        className="flex flex-1 items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white p-3 shadow-md"
                        onClick={copyURL}
                        title="Copy Link"
                    >
                        <LuCopy size={20} />
                    </button>
    
                    {/* Leave Room */}
                    <button
                        className="flex flex-1 items-center justify-center rounded-md bg-red-600 hover:bg-red-700 transition text-white p-3 shadow-md"
                        onClick={leaveRoom}
                        title="Leave Room"
                    >
                        <GoSignOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
    
}

export default UsersView
