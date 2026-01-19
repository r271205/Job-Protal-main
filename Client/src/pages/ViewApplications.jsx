import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { assets } from '../assets/assets.js';

function ViewApplications() {

  const { backendUrl, companyToken } = useContext(AppContext);

  const [applictions, setApplictions] = useState([]);

  const [loading,setloading] = useState(true);

  // Featch Applied User For This comapny
  const featchCompanyJobApplications = async () => {

    try {
      setloading(true);
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      });

      if (data.success) {
        setApplictions(data.applications);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message)
    }
    finally {
      setloading(false);
    }
  }

  // Fuction for change JobApplictions status 

  const changeApplictionStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status'
        , { id, status },
        { headers: { token: companyToken } });

      if (data.success) {
        toast.success(data.message);
        featchCompanyJobApplications();
      }
      else {
        toast.error(data.message);
      }

    }
    catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (companyToken) {
      featchCompanyJobApplications();
    }
  }, [companyToken])

  if(loading){
    return <Loading/>
  }
  if(applictions.length === 0){
    return (
    <div className="flex items-center justify-center h-[70vh]"> 
        <p className="text-xl sm:text-2xl">No Applications Available</p>
    </div>
    ) 
  }
  return (
        <div className="container mx-auto p-4">
            <div>
                <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4 text-left">#</th>
                            <th className="py-2 px-4 text-left">User Name</th>
                            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                            <th className="py-2 px-4 text-left">Resume</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applictions.filter(item =>item.jobId && item.userId).map((applicant,index)=>(
                            <tr key={index} className="text-gray-700 border-b last:border-b-0 hover:bg-gray-50 transition">

                                <td className="py-2 px-4 border-b text-center">{index+1}</td>
                                <td className="py-3 px-4 border-b">
                                  <div className="flex items-center gap-3 justify-start">
                                    <img
                                      className="w-9 h-9 rounded-full object-cover max-sm:hidden"
                                      src={applicant.userId.image}
                                      alt=""
                                    />
                                    <span className="font-medium">{applicant.userId.name}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{applicant.jobId.title}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{applicant.jobId.location}</td>
                                <td className="py-2 px-4 border-b">
                                    <a href={applicant.userId.resume} target="_blank"
                                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                                    >
                                        Resume <img src={assets.resume_download_icon} alt="" />
                                    </a>
                                </td>
                                <td className="py-2 px-4 border-b relative">
                                    {applicant.status === "Pending"
                                     ?  <div className="relative inline-block text-left group">
                                        <button className="text-gray-500 action-button cursor-pointer">...</button>
                                        <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                                                <button onClick={() => changeApplictionStatus(applicant._id,'Accepted')}  className="block w-full text-left px-4 py-2  text-blue-500 hover:bg-gray-100 cursor-pointer">Accept</button>
                                                <button onClick={() =>changeApplictionStatus(applicant._id,'Rejected')} className="block w-full text-left px-4 py-2  text-red-500 hover:bg-gray-100 cursor-pointer">Reject</button>
                                        </div>
                                    </div>
                                    : (
                                      <span
                                        className={`font-medium px-2 py-1 rounded text-sm
                                          ${
                                            applicant.status === "Accepted"
                                              ? "text-green-600 bg-green-50"
                                              : applicant.status === "Rejected"
                                              ? "text-red-600 bg-red-50"
                                              : "text-gray-600 bg-gray-100"
                                          }
                                        `}
                                      >
                                        {applicant.status}
                                      </span>
                                    )
                                    }

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) 
}

export default ViewApplications; 
