import { useContext } from "react";
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Applyjob from "./pages/ApplyJob.jsx";
import Application from "./pages/Application.jsx";
import './App.css'
import Recruiterlogin from "./components/Recruiterlogin.jsx";
import { AppContext } from "./context/AppContext.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Addjob from "./pages/Addjob.jsx"
import ManageJobs from "./pages/ManageJobs.jsx";
import ViewApplications from "./pages/ViewApplications.jsx";
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';

function App() {

  const {isRecruiterLogin,companyToken} = useContext(AppContext);

  return (
    <div>
      <ToastContainer/>
      {isRecruiterLogin && <Recruiterlogin/>}
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/apply-job/:id' element = {<Applyjob/>}/>
        <Route path = '/application' element = {<Application/>}/>
  
        <Route path="/dashboard" element={<DashBoard />}>
          <Route index element={<Addjob />} />
          <Route path="add-job" element={<Addjob />} />
          <Route path="manage-job" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>


      </Routes>
    </div>
  );
}

export default App;