'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'


export default function Home() {

  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleRetrieval(){
    const res = await fetch("https://yt-dl-server-yg8o.onrender.com/url", {
      method: "POST",
      mode: "cors",
      headers:{
        'Accept':'application/json, text/plain',
        'Content-Type':'application/json'
      },
      credentials:"include",
      body: JSON.stringify({'url' : url})
    })
    
    const json = await res.json()
    console.log(json['error'])
    if (json['error'] === 'Age Restricted'){
      setMessage("The video is age-restricted")
    } else if (json['error'] === 'Data Extraction Error'){
      setMessage("Data Extraction Error incurred during the retrieval")
    } else if (json['error'] === 'Live Stream Error'){
      setMessage("The link is a live stream")
    } else if (json['error'] === 'Video Unvailable'){
      setMessage(json['error'] === 'The video is not available')
    } else{
      router.push("/video")
    }
  }


  return (
    <main className="flex bg-zinc-900 min-h-screen min-w-full p-2 no-scrollbar overflow-y-auto">
      <div id='Section_1' className='flex flex-col text-white w-full no-scrollbar overflow-y-auto '>
         <div id='Header' className="w-full font-title px-5 py-4 text-3xl md:text-5xl h-fit text-center lg:fixed">
            YouTube Downloader
         </div>
         <div id='Content' className="flex items-center justify-center flex-col my-auto md:mx-2 ">
            <div id='About' className="sm-landscape:hidden lg:block md:w-2/3 lg:w-1/2 px-5 py-4 text-xl md:text-3xl h-fit text-center">
              A Next.js application for downloading YouTube videos for free without any advertisements and YouTube Premium.
            </div>
            <div id='Error Messages' className="text-red-500 mt-16 lg:mt-32 text-lg">
              {message}
            </div>
            <input type="text" placeholder="Enter the link" onChange={(e) => setUrl(e.target.value)} className=" text-gray-900 my-8 lg:my-8 rounded-lg text-md md:text-lg block w-4/5 md:w-2/3 lg:w-2/5 p-3.5 placeholder-gray-400 bg-gray-300 border border-gray-300"/>
            <button className="bg-gray-700 my-8 lg:my-8 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-xl w-1/2 lg:w-1/3 py-4" onClick={handleRetrieval}>
                Retrieve the Video
            </button>
         </div>
      </div>
    </main>
  )
}
