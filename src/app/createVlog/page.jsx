"use client"
import "../../styles/createVlog.css"
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { individualVlogs } from '@/app/redux/features/vlogSlice';
import { CREATE_VLOG, GET_VLOGS } from '@/API/vlogAPI';
import VlogCard from '../VlogCard';
import Modal from 'react-modal';
import "@/styles/login.css";
import { vlogSchema } from '@/zodValidations/zodValidations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastPopUp } from "../CommonFunctions/popupInfo";
import { aiOutputGenerator } from "@/API/ai";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '80%',
    maxWidth: '500px',
  },
};

const Page = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((store) => store.vlogSlice);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [loadingAiGenerationTitle, setAiGenerationLoadingTitle] = useState(false);
  const [loadingAiGenerationDescription, setAiGenerationLoadingDescription] = useState(false);
  const [loadingCreatePost,setLoadingCreatePost] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function AiGenerate(e, type) {
    e.preventDefault();
    try {
      if (type) {
        setAiGenerationLoadingTitle(true);
        
        const output = await aiOutputGenerator(`generate only one proper and very shortest title for this text '${aiText}'`);
        if (output && output.data && output.data.output) {
          setTitle(output.data.output);
        }else{
          toastPopUp("something went wrong");
        }
        
       
      } else {
        setAiGenerationLoadingDescription(true);
        const output = await aiOutputGenerator(`generate only one proper and around 30 words description for this text '${aiText}'`);
        if (output && output.data && output.data.output) {
          setDescription(output.data.output);
        }else{
          toastPopUp("something went wrong");
        }
        
      }
    } catch (error) {
      console.error(error);
    }finally{
      setAiGenerationLoadingTitle(false);
        setAiGenerationLoadingDescription(false);
    }
  }

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function postVlog(vlog) {
    setLoadingCreatePost(true);
    CREATE_VLOG(vlog)
      .then((res) => {
        console.log(res);
        if (res && res.data && res.data.message == 'SFL') {
          toastPopUp('Successfully uploaded');
        } else if (res && res.response && res.response.data) {
          const message = res.response.data.message;
          if (message == 'SEXT' || message == 'ISE') {
            toastPopUp('Internal server error');
          } else if (message == 'NV') {
            toastPopUp("Try login again maybe session has expired");
          } else if (message == "NOV") {
            toastPopUp('No vlogs available');
          } else {
            toastPopUp("something went wrong");
          }
        } else {
          toastPopUp("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        toastPopUp("something went wrong");
      }).finally(()=>{
        setLoadingCreatePost(false);
      });
  }

  function createVlog(e) {
    e.preventDefault();
    try {
      const vlog = vlogSchema.parse({ title, description });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (file) {
        formData.append("media", file);
      }
      postVlog(formData);
    } catch (error) {
      error.errors.forEach((e) => {
        toastPopUp(e.message);
      });
      console.error("Validation Error:", error.errors);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-center mb-5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-10 pt-24 flex flex-col items-center">
        <div className="bg-white shadow-lg rounded-md p-6 w-full max-w-3xl">
          <h2 className='text-center text-gray-800 text-3xl mb-5'>Add Vlog</h2>
          <form onSubmit={createVlog} className='space-y-4'>
          <div>
              <label htmlFor="Title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input id="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              {
                loadingAiGenerationTitle?
                <div
                role="status"
                className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
                :
                <button style={{visibility:aiText.length !== 0 ?"visible":"hidden"}} onClick={(e) => AiGenerate(e, true)} className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Generate Title</button>
              }
              
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="description" id="description"></textarea>
              {
                loadingAiGenerationDescription?
                <div
                role="status"
                className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              :
              <button style={{visibility:aiText.length !== 0 ?"visible":"hidden"}} onClick={(e) => AiGenerate(e, false)} className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Generate Description</button>
              }
              
            </div>
            <div>
              <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Upload Media</label>
              <input type="file" id="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              {
                loadingCreatePost?
                <div
                role="status"
                className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
                :
                <input type="submit" className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-600 transition duration-300 ease-in-out" />
              }
            </div>
          </form>
          <button onClick={openModal} className="mt-4 bg-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-purple-600 transition duration-300 ease-in-out">Use AI</button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 className="text-2xl mb-4">AI Text Generator</h2>
          <button onClick={closeModal} className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600 transition duration-300 ease-in-out">Close</button>
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); }} className="mt-4">
            <textarea rows="4" value={aiText} onChange={e => setAiText(e.target.value)} className='w-full block margin-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'></textarea>
            <input type="submit" className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-600 transition duration-300 ease-in-out" />
          </form>
        </Modal>
      </div>
      
    </>
  )
}

export default Page;
