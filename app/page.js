'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"


export default function Home() {

  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // declare the async data fetching function
    const wakeUp = async () => {
        // get the data from the api
        const response = await fetch('https://yt-dl-server-yg8o.onrender.com/wakeup',{
            method:'get',
            credentials:"include",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            mode:'cors',
        });
        setLoading(false)
    }
    // call the function
    wakeUp()
      // make sure to catch any error
      .catch(console.error);
  }, [])

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


  if(loading){
    return(
      <main className="flex bg-zinc-900 h-screen w-full">
        <div id='Section_1' className='flex flex-col text-white w-full justify-center items-center'>
          <div id='Header' className="w-full font-title text-3xl md:text-5xl h-fit text-center">
            YouTube Downloader
          </div>
          <div className="p-8 text-xl md:text-2xl">
            Server is starting...
          </div>
          <div className='flex justify-center items-center bottom-0 text-xl md:text-2xl p-10'>
              Developed by 
            <Link target='_blank' href='https://personal-website-v2-pi.vercel.app/' className="font-sign text-4xl md:text-[50px] lg:text-5xl ml-3">Un</Link>
          </div>
        </div>   
      </main>
    )
  } else {
    return (
      <main className="flex bg-zinc-900 min-h-screen min-w-full p-2 no-scrollbar overflow-y-auto">
        <div id='Section_1' className='flex flex-col text-white w-full no-scrollbar overflow-y-auto '>
           <div id='Header' className="w-full font-title px-5 py-4 text-3xl md:text-5xl h-fit text-center lg:fixed">
              YouTube Downloader
           </div>
           <div id='Content' className="flex items-center justify-center flex-col my-auto md:mx-2 ">
              <div id='About' className="sm-landscape:hidden lg:block md:w-2/3 lg:w-1/2 px-5 py-4 text-xl md:text-2xl xl:text-3xl h-fit text-center">
                A Next.js application for downloading YouTube videos for free without any advertisements and YouTube Premium.
              </div>
              <div id='Error Messages' className="text-red-500 mt-16 lg:mt-12 text-lg">
                {message}
              </div>
              <input type="text" placeholder="Enter the link" onChange={(e) => setUrl(e.target.value)} className=" text-gray-900 my-8 lg:my-8 rounded-lg text-md md:text-lg block w-4/5 md:w-2/3 lg:w-2/5 p-3.5 placeholder-gray-400 bg-gray-300 border border-gray-300"/>
              <button className="bg-gray-700 my-8 lg:my-8 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-xl w-1/2 lg:w-1/3 py-4" onClick={handleRetrieval}>
                  Retrieve the Video
              </button>
           </div>
           <div className='flex justify-center items-center bottom-0 text-xl md:text-2xl p-10'>
              Developed by 
              <Link target='_blank' href='https://personal-website-v2-pi.vercel.app/' className="font-sign text-4xl md:text-[50px] lg:text-5xl ml-3">Un</Link>
            </div>
        </div>
      </main>
    )
  }
}
