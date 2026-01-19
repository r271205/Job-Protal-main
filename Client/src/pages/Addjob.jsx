import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
function Addjob() {

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [location, setLocation] = useState('Bangalore');
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const description = quillRef.current.root.innerHTML

      const { data } = await axios.post(backendUrl + '/api/company/post-job', {
        title,
        category,
        location,
        level,
        salary,
        description
      },{headers: {token:companyToken}});

      if (data.success) {
        toast.success(data.message);
        setTitle('');
        setSalary(0)
        quillRef.current.root.innerHTML = ""
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    // Initiate Qill only once
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  },[])
  return (
    <form onSubmit = {onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          required
          placeholder='Type here'
          value={title}
          className='w-full max-w-lg mx-3 py-2 border-2 border-gray-300 rounded' />
      </div>

      <div className='w-full max-w-lg'>
        <p className='my-2'>Job Description</p>
        <div ref={editorRef}>

        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 sm:gap-8 w-full'>

        <div>
          <p className='mb-2'>Job Category</p>
          <select
            className="rounded border-2 border-gray-300 w-full px-3 py-2 outline-none"
            onChange={e => setCategory(e.target.value)}>
            {JobCategories.map((category, index) => (
              <option
                key = {index}
                value = {category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2' >Job Location</p>
          <select
            className="rounded border-2 border-gray-300 w-full px-3 py-2 outline-none"
            onChange={e => setLocation(e.target.value)}>
            {JobLocations.map((location, index) => (
              <option
                key={index}
                value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2' >Job Level</p>
          <select
            className="rounded border-2 border-gray-300 w-full px-3 py-2 outline-none"
            onChange={e => setLevel(e.target.value)}>
            <option value="Beginner Level" > Beginner Level</option>
            <option value="Beginner Level"> Intermediate Level</option>
            <option value="Beginner Level"> Senior Level</option>
          </select>
        </div>

      </div>

      <div>
        <p className='mb-2'>Salary</p>
        <input
          min={0}
          className='border-2 border-gray-300 rounded w-full sm:w-[120px]'
          type="number"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          placeholder='25000' />
      </div>

      <button className='bg-black rounded py-3 mt-4 text-white w-28 cursor-pointer'>ADD</button>
    </form>
  )
}

export default Addjob; 