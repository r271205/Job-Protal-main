import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";


function Joblisting(){
    const {isSearch,SearchFilter,setSearchFilter,jobs} = useContext(AppContext);

    const [showFilter,setShowFilter] = useState(false);

    const [Pages,setPages] = useState(1);

    const [selectedCategories,setselectedCategories] = useState([]);

    const [selcetedLocation,setselcetedLocation] = useState([]);

    const [filteredJobs,setfilteredJobs] = useState(jobs);

    
    const handleCategoriesChange = (category) => {
        setselectedCategories(
            prev => prev.includes(category) ? prev.filter( c => c !== category) : [...prev,category]
        );
    }
    const handleLocationChange = (location) => {
        setselcetedLocation(
            prev => prev.includes(location) ? prev.filter( c => c !== location) : [...prev,location]
        );
    }

    useEffect( () => {
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);

        const matchesLocation = job => selcetedLocation.length === 0 || selcetedLocation.includes(job.location);

        const matchestitle = job => SearchFilter.title === "" || job.title.toLowerCase().includes(SearchFilter.title.toLowerCase());

        const matchesSerachLoction = job => SearchFilter.location === "" || job.location.toLowerCase().includes(SearchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchestitle(job) && matchesSerachLoction(job)
        ) 

        setfilteredJobs(newFilteredJobs);
        setPages(1);
    },[jobs,selectedCategories,selcetedLocation,SearchFilter]);
    return(
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
        {/* sidebar */}
        <div className="w-full lg:w-1/4 bg-white px-4 ">
            {/* Serch Filter From Hero Componet */}
            {
                isSearch && (SearchFilter.title !== "" || SearchFilter.location !== "")
                &&(
                    <>
                    <h3 className="font-medium mb-4 text-lg">Current Search</h3>
                    <div className="mb-4 text-gray-600">
                        {SearchFilter.title && (
                            <span className="inline-flex gap-2.5 bg-blue-50 border-blue-200 items-center px-4 py-1.5 rounded">
                                {SearchFilter.title}
                                <img onClick = {e => setSearchFilter(prev => ({...prev,title:""}))} className = 'cursor-pointer' src={assets.cross_icon}/>
                            </span>
                        )}
                        {SearchFilter.location && (
                            <span className="ml-2 inline-flex gap-2.5 bg-red-50 border-red-200 items-center px-4 py-1.5 rounded">
                                {SearchFilter.location}
                                 <img onClick = {e => setSearchFilter(prev => ({...prev,location:""}))} className = 'cursor-pointer' src={assets.cross_icon}/>
                            </span>
                        )}
                    </div>
                    </>
                ) 
            }

            <button onClick= {(e => setShowFilter((prev) => !prev))}className="border border-gray-400 px-6 py-1.5 lg:hidden rounded">
                {showFilter ? "Close" : "Filters"}
            </button>
            {/* Cetegory Filter */}
            <div className={showFilter ? "" : "max-lg:hidden"}>
                < h4 className="font-medium mb-4 text-lg ">Search by Categories</h4>
                <ul className="space-y-4 text-gray-600">
                    {
                        JobCategories.map((category,index) => (
                            <li className = "flex gap-3 items-center" key={index}>
                                <input 
                                className= "scale-125"
                                type="checkbox"
                                onChange={ () => handleCategoriesChange(category) } 
                                checked = {selectedCategories.includes(category)}/>
                                {category}
                            </li>
                        ))
                    }
                </ul>
            </div>
            
            {/* Location Filter */}
            <div className={showFilter ? "" : "max-lg:hidden"}>
                <h4 className="font-medium mb-4 text-lg pt-15">Search by Location</h4>
                <ul className="space-y-4 text-gray-600">
                    {
                        JobLocations.map((Location,index) => (
                            <li className = "flex gap-3 items-center"key={index}>
                                <input 
                                className= "scale-125"
                                type="checkbox" 
                                onChange={ () => handleLocationChange(Location) } 
                                checked = {selcetedLocation.includes(Location)}
                                />
                                {Location}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
            {/* Job listings */}
            <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
                <h3 className="font-medium text-3xl py-2" id='job-list'>Latest jobs</h3>
                <p className="mb-8">Get your desired job from top companies</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {
                        filteredJobs.slice((Pages-1)*6,Pages*6).map((job,index) => (
                            <JobCard key={index} job = {job}/>
                        ))
                    }
                </div>

                {/* Pagination */}
                {jobs.length> 0 && (
                    <div className="flex items-center justify-center space-x-2 mt-10">
                        <a href = '#job-list'>
                            <img onClick={() => setPages(Math.max(Pages-1,1))} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({length:Math.ceil(filteredJobs.length/6)}).map((_,index) => (
                            <a key = {index} href='#job-list'>
                                <button onClick ={() => setPages(index+1)}className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${Pages === index+1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index+1}</button>
                            </a>
                        ))}
                        <a href = '#job-list'>
                            <img onClick={() => setPages(Math.min(Math.ceil(filteredJobs.length/6),Pages+1))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
    </div>
    );
}

export default Joblisting;