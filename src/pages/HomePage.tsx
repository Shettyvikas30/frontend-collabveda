import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // adjust path if needed

import FormComponent from "@/components/forms/FormComponent";
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-16 relative">
            {/* Logout button at the top right */}
            <button
                onClick={() => signOut(auth)}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>

            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full items-center justify-center sm:w-1/2">
                    <FormComponent />
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default HomePage;