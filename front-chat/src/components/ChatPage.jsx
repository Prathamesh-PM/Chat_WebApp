import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'

import { AvatarGenerator } from 'random-avatar-generator';
import useChatContext from '../context/ChatContext'
import { useNavigate } from 'react-router';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import {baseURL} from "../config/AxiosHealper"
import { getMessages } from '../services/RoomService';
import { timeAgo } from '../config/helper';


const ChatPage = () => {

    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext()
    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);
    
    const navigate = useNavigate()
    useEffect(()=>{
        if (!connected) {
            navigate("/")
        }
    },[connected, roomId, currentUser])
    
    

    const generator = new AvatarGenerator();

    const [messages, setMessages] = useState([
        // {
        //     content:"Hello",
        //     sender:"Rohan",
        // },
        // {
        //     content:"Hi",
        //     sender:"Ganesh",
        // },
        // {
        //     content:"Hey",
        //     sender:"Omkar",
        // },
        // {
        //     content:"Hello",
        //     sender:"Prathamesh",
        // },
        // {
        //     content:"How are you guys",
        //     sender:"Prathamesh",
        // },
        // {
        //     content:"Fine",
        //     sender:"Omkar",
        // },
        // {
        //     content:"How are you",
        //     sender:"Omkar",
        // },
        // {
        //     content:"Fine",
        //     sender:"Prathamesh",
        // },
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    // const [roomId, setRoomId] = useState("");

    // const [currentUser] = useState("Prathamesh")

    // Page init: 
    // load messages 

    useEffect(() => {
        async function loadMessages() {
            
            try {
                const messages = await getMessages(roomId)
                setMessages(messages)
                    
            } catch (error) {
                
            }

        }
        if (connected) {
            loadMessages();
        }
    }, [])



    // Auto scroll down
    useEffect(()=> {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top:chatBoxRef.current.scrollHeight,
                behavior:'smooth',
            });
        }
    }, [messages])



    // StompClient initialization 
    // subscribe 

        useEffect(()=>{

            const connectWebSocket = () => {
                // SockJS
                const sock = new SockJS(`${baseURL}/chat`)

                const client = Stomp.over(sock)

                client.connect({},() => {
                    setStompClient(client);

                    toast.success("connected")

                    client.subscribe(`/topic/room/${roomId}`, (message) => {
                        console.log(message);
                        const newMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, newMessage]);
                    })
                });
            }

            if (connected) {
                connectWebSocket();
            }

        },[roomId])

    // send message handle

    const sendMessage = async () => {
        if (stompClient && connected && input.trim) {
            console.log(input);
            
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId
            }

            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message))
            setInput("");


        }
    };


    // Logout
    function handleLogout() {
        stompClient.disconnect();
        setConnected(false);
        setRoomId('');
        setCurrentUser('');
        navigate('/');
    }



  return (
    <div className=''>
      
        {/* Header container */}
        <header className='dark:border-gray-700 shadow w-full h-20 fixed dark:bg-gray-900 py-5 flex justify-around items-center'>
            {/* Room name Container */}
            <div>
                <h1 className='text-xl font-semibold'>Room : <span>{roomId}</span></h1>
            </div>

            {/* Username Container */}
            <div>
                <h1 className='text-xl font-semibold'>User : <span>{currentUser}</span></h1>
            </div>

            {/* Button for leave room */}
            <div>
                <button onClick={handleLogout} className='dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full'>Leave Room</button>
            </div>
        </header>


        {/* Message window container */}
        <main ref={chatBoxRef} className='py-20 w-2/3 px-10 dark:bg-slate-600 mx-auto h-screen overflow-auto'>
            
            {messages.map((message, index)=>(
                <div key={index} className={`flex ${message.sender == currentUser?"justify-end":"justify-start"}`}>
                    <div className={`my-2 p-2 rounded-md max-w-xs ${message.sender == currentUser? "bg-green-800" : "bg-gray-700"}`}>
                        <div className='flex flex-row gap-2'>
                            <img src={generator.generateRandomAvatar(message.sender)} alt="" className='h-10 w-10'/>
                            <div className='flex flex-col gap-1'>
                                <p className='text-sm font-bold'>{message.sender}</p>
                                <p>{message.content}</p>
                                <p className="text-[10px] text-gray-400 text-right mt-1">{timeAgo(message.timeStamp)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }

        </main>



        {/* Message input container */}
        <div className='fixed bottom-5 w-full h-12 mx-auto '>
            <div className='rounded-full pr-1 flex justify-between items-center h-full w-1/2 mx-auto gap-3 dark:bg-gray-950'>
                <input 
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                        onKeyDown={(e)=>{
                            if (e.key == "Enter") {
                                sendMessage();
                            }
                        }}
                        type="text" 
                        placeholder='Type your message here...' 
                        className='dark:border-gray-700 dark:bg-gray-800 px-5 py-2 w-full h-full rounded-full focus:outline-none' />

                <div className='flex gap-2'>
                    <button className='dark:bg-purple-900 w-11 h-11 rounded-full flex justify-center items-center'>
                    <MdAttachFile size={26}/>
                    </button>

                    <button 
                        onClick={sendMessage}
                        className='dark:bg-green-700 w-11 h-11 rounded-full flex justify-center items-center'>
                    <MdSend size={26}/>
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default ChatPage
