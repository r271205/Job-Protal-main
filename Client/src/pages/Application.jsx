import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

function Application(){

    const [isEdit,setisEdit] = useState(false);

    const [resume,setResume] = useState(null);

    const {backendUrl , userData, fetchUserData,userApplications,fetchAppliedJob} = useContext(AppContext);

    const {user} = useUser();
    const {getToken} = useAuth();


    // update User Resume 
    const updateResume = async () => {

        try {
            
            const formData = new FormData();
            formData.append('resume',resume);

            const token = await getToken();
            if (!token) throw new Error("Authentication failed");
            
            const {data} = await axios.post(backendUrl + '/api/users/update-resume'
                ,formData
                ,{ headers : {Authorization: `Bearer ${token}`}});

            if(data.success){
                toast.success(data.message);
                await fetchUserData()
                setResume(null);
                setisEdit(false);
            }
            else{
                toast.error(data.message);
            }

        } 
        catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchAppliedJob();
        }
    }, [user]);




    return ( 
    <>
        <Navbar/>
        <div className = " container px-4 min-h-[65vh] 2xl:px-20 mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-800">Your Resume</h2>

            <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
            {isEdit || !userData?.resume ? (
                <>
                <label
                    htmlFor="resumeUpload"
                    className="flex items-center gap-3 cursor-pointer bg-blue-50 hover:bg-blue-100 transition px-4 py-2 rounded-lg border border-blue-200"
                >
                    <span className="text-blue-600 font-medium">
                    {resume ? resume.name : "Select Resume"}
                    </span>
                    <img src={assets.profile_upload_icon} alt="" className="w-5 h-5" />
                    <input
                    id="resumeUpload"
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => setResume(e.target.files[0])}
                    />
                </label>

                <button
                    onClick={updateResume}
                    disabled={!resume}
                    className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                    Save
                </button>
                </>
            ) : (
                <>
                <a
                    href={userData.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    Download Resume
                </a>
                <button
                    onClick={() => setisEdit(true)}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                    Edit
                </button>
                </>
            )}
            </div>

            <div>
                <h2 className = "text-xl font-semibold mb-4">Jobs Applied</h2>
                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Company</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Job Title</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600 max-sm:hidden">Location</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600 max-sm:hidden">Date</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {userApplications.map((job) => (
                        <tr
                        key={job._id}
                        className="border-b hover:bg-gray-50 transition"
                        >
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                            <img
                                src={job.companyId.image}
                                alt=""
                                className="w-9 h-9 rounded-full"
                            />
                            <span className="font-medium text-gray-800">
                                {job.companyId.name}
                            </span>
                            </div>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                            {job.jobId.title}
                        </td>

                        <td className="px-5 py-4 text-gray-600 max-sm:hidden">
                            {job.jobId.location}
                        </td>

                        <td className="px-5 py-4 text-gray-600 max-sm:hidden">
                            {moment(job.date).format("ll")}
                        </td>

                        <td className="px-5 py-4">
                            <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                                job.status === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : job.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                            >
                            {job.status}
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        <Footer/>
    </>
    );
}

export default Application; 