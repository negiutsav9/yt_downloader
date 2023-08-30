'use client'

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function Video(){

    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [length, setLength] = useState("")
    const [description, setDescription] = useState("")
    const [channelUrl, setChannelUrl] = useState("")
    const [author, setAuthor] = useState("")
    const [publishDate, setPublishDate] = useState("")
    const [audioStreams , setAudioStreams] = useState([])
    const [videoOnlyStreams , setVideoOnlyStreams] = useState([])
    const [videoAudioStreams , setVideoAudioStreams] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("Your video is being retrieved")

    async function handleDownload(itag) {
        setMessage("Your video is being downloaded")
        setLoading(true)
        const res = await fetch("http://127.0.0.1:5000/download", {
            method: "POST",
            mode: "cors",
            headers:{
                'Accept':'application/json, text/plain',
                'Content-Type':'application/json'
            },
            credentials:"include",
            body: JSON.stringify({'itag' : itag})
        })

        console.log(res)
    
        const blob = await res.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        let file_name = title + ".mp4"
        link.setAttribute('download', file_name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        // clean up Url
        window.URL.revokeObjectURL(blobUrl);
        setLoading(false)
        setMessage("Your video is being retrieved")
    }


    useEffect(() => {
        setLoading(true)
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const response = await fetch('http://localhost:5000/data',{
                method:'get',
                credentials:"include",
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                mode:'cors',
            });
            // convert the data to json
            const json = await response.json();
            setTitle(json['title'])
            setUrl(json['url'])
            setLength(json["length"])
            setChannelUrl(json["channel_url"])
            setAuthor(json["author"])
            setPublishDate(json["publish_date"])
            setAudioStreams(json["audioStream"])
            setVideoAudioStreams(json["videoAudioStream"])
            setVideoOnlyStreams(json["videoOnlyStream"])
            setDescription(json["description"])
            setLoading(false)
        }
      
        // call the function
        fetchData()
          // make sure to catch any error
          .catch(console.error);
    }, [])

    if(loading) {
        return (
            <main className="flex bg-zinc-900 h-screen w-full">
                <div id='Section_1' className='flex flex-col text-white w-full justify-center items-center'>
                    <div id='Header' className="w-full font-title text-3xl md:text-5xl h-fit text-center">
                        YouTube Downloader
                    </div>
                    <div className="p-8 text-2xl md:text-4xl">
                        {message}
                    </div>
                </div>   
            </main>
        )
    } else {
        return(
            <main className="bg-zinc-900 h-full w-full p-2 lg:px-32">
                <div id='Section_1' className='text-white w-full h-full'>
                    <div id='Header' className="w-full font-title px-5 py-4 text-3xl md:text-5xl h-fit text-center">
                        <Link href='/'>
                            YouTube Downloader
                        </Link>
                    </div>
                    <div id='Content' className="my-5 lg:my-12 h-fit w-full px-3 lg:px-auto">
                        <div id='Header' className="text-2xl md:text-4xl py-3 px-3 lg:px-auto">
                            {title}
                        </div>
                        <div id='video' className="h-[30vh] lg:h-[60vh] my-5 px-3 lg:px-auto">
                            <ReactPlayer url={url} width='100%' height='100%'/>
                        </div>
                        <div id='about' className="w-full h-fit my-5 px-3 lg:px-auto">
                            <div id='date' className="grid grid-cols-2 h-fit gap-10 lg:gap-5">
                                <div className="text-lg md:text-xl font-bold">
                                    Published Date
                                </div>
                                <div className="text-lg text-right">
                                    {publishDate}
                                </div>
                                <div className="text-lg md:text-xl font-bold">
                                    Length
                                </div>
                                <div className="md:text-lg text-right">
                                    {length} seconds
                                </div>
                                <div className="text-lg md:text-xl font-bold">
                                    Channel
                                </div>
                                <div className="text-lg text-right underline underline-offset-4">
                                    <a href={channelUrl}>{author}</a>
                                </div>
                            </div>
                        </div>
                        <div id='Downloads' className="bg-zinc-900 w-full h-fit px-3 lg:px-auto">
                            <div id='Header' className="text-2xl md:text-4xl my-8">
                                Available Downloads
                            </div>
                            <div id='links' className="w-full">
                                <div id='Header' className="text-xl md:text-3xl my-8 w-full">
                                    Streams with Video and Audio
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {videoAudioStreams.map(stream => 
                                        <li>
                                            <button key={Math.random()} value={stream.id} className="bg-gray-700  hover:bg-gray-900 text-white font-bold rounded-2xl shadow-xl w-full py-4 my-4" onClick={(e) => handleDownload(e.target.value)}>
                                               Resolution: {stream.res} <br/>
                                               Filesize: {stream.size} MB <br/>
                                               Video Codec: {stream.vc} <br/>
                                               Audio Codec: {stream.ac} <br/>
                                            </button>
                                        </li> 
                                        )}
                                </ul>
                                <div id='Header' className="text-xl md:text-3xl my-8">
                                    Only Audio Streams
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {audioStreams.map(stream => 
                                        <li>
                                            <button key={Math.random()} value={stream.id} className="bg-gray-700  hover:bg-gray-900 text-white font-bold rounded-2xl shadow-xl w-full py-4 my-4" onClick={(e) => handleDownload(e.target.value)}>
                                               Filesize: {stream.size} MB <br/>
                                               Audio Codec: {stream.ac} <br/>
                                            </button>
                                        </li> 
                                        )}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        )
    }

    
}