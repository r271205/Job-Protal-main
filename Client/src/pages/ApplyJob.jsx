import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

function Applyjob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { jobs,backendUrl,userData,userApplications,fetchAppliedJob } = useContext(AppContext);

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Job ---------------- */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (data.success) {
          setJobData(data.job);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (jobs.length > 0) {
      fetchJob();
    }
  }, [id, jobs, backendUrl]);

  /* ---------------- Derived State ---------------- */
  const isAlreadyApplied = useMemo(() => {
    if (!jobData) return false;
    return userApplications.some(
      (item) =>
        item.jobId?._id === jobData._id || item.jobId === jobData._id
    );
  }, [jobData, userApplications]);

    useEffect(() => {
        if (userData && userApplications.length === 0) {
            fetchAppliedJob();
        }
    }, [userData]);


  /* ---------------- Apply Handler ---------------- */
  const applyHandler = async () => {
    if (isAlreadyApplied) return;

    if (!userData) {
      toast.error("Login to apply for this job");
      return;
    }

    if (!userData.resume) {
      toast.error("Upload resume to apply");
      navigate("/application");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply-job`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchAppliedJob(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Reusable Button ---------------- */
  const ApplyButton = () => (
    <button
      onClick = {applyHandler}
      disabled = {isAlreadyApplied || loading}
      className={`p-2.5 px-10 rounded text-white transition
        ${
          isAlreadyApplied
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
      `}
    >
      {isAlreadyApplied ? "Already Applied" : "Apply now"}
    </button>
  );

  if (!jobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen container py-10 px-4 2xl:px-20 mx-auto">
        <div className="bg-white rounded-lg w-full">
          {/* Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col items-center md:flex-row">
              <img
                className="h-24 rounded-lg bg-white p-4 mr-4 border max-md:mb-4"
                src={jobData.companyId.image}
                alt=""
              />

              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData.title}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-2 text-gray-600">
                  <span className="flex gap-1 items-center">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex gap-1 items-center">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex gap-1 items-center">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex gap-1 items-center">
                    <img src={assets.money_icon} alt="" />
                    CTC : {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end max-md:text-center">
              <ApplyButton />
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-xl mb-4 font-bold">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
              <div className="mt-10">
                <ApplyButton />
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-1/4 space-y-5">
              <h2>More jobs from {jobData.companyId.name}</h2>

              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id
                )
                .filter(
                  (job) =>
                    !userApplications.some(
                      (app) =>
                        app.jobId?._id === job._id || app.jobId === job._id
                    )
                )
                .slice(0, 4)
                .map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Applyjob;
