import { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
function Navbar() {
    const { openSignIn } = useClerk();

    const { user } = useUser();

    const navigate = useNavigate();

    const { setisRecruiterLogin } = useContext(AppContext);
    return (
        <div className='shadow-md bg-white'>
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center py-4'>
                <img 
                    onClick={() => navigate("/")}
                    className=' cursor-pointer select-none' src = {assets.logo}
                    alt="" 
                />
                {user
                    ? <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                        <Link to={'/application'}
                        className="hover:text-blue-600 transition-colors"
                        >
                            Applied jobs</Link>
                        <span className="text-gray-300">|</span>
                        <p className="hidden sm:block font-semibold">
                            Hi,<span className="font-semibold">{user.firstName} {user.lastName}</span>
                        </p>
                        <div className="ml-2">
                        <UserButton />
                        </div>
                    </div>
                    : <div className="flex items-center gap-3 text-sm">
                        <button onClick={() => setisRecruiterLogin(true)} 
                            className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                            Recruiter Login
                        </button>
                        <button onClick={() => openSignIn()} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer">
                            Login
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Navbar;