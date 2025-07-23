import React, { useState } from 'react'
import chatIcon from '../assets/chat.png'
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../services/RoomService';
import axios from 'axios';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';

const JoinCreateRoom = () => {


  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  })

  const {roomId, userName, setRoomId, setCurrentUser, setConnected} = useChatContext();
  const navigate = useNavigate();

  // Function to get values from input form
  function handleFormInputChange(event){
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  // Function to validate form
  function validateForm(){
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Fill all details...")
      return false;
    }
    return true;
  }

  // Function to join chat room
  async function joinChat(){
    if (validateForm()) {
      // Call api to join room on backend
      
      try {
        const room = await joinChatApi(detail.roomId)
      toast.success("joined successfully...")
      
      // Set user name and roomId
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);

        // Forward to chat page
        navigate("/chat")
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Room not exists!")
        }else
          console.log("Error in joining room")
        
      }

    }
  }

  // Function to create chat room
  async function createRoom(){
    if (validateForm()) {
      // Call api to create room on backend
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room created successfully")

        // Set user name and roomId
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        // Forward to chat page
        navigate("/chat")

      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 400) {
          toast.error("Room already exists !")
        }else
          console.log("Error in creating room")
      }
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center'>
      
      <div className='p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow'>

        <div>
          <img src={chatIcon} alt="" className='w-28 mx-auto' />
        </div>

        <h1 className='text-2xl font-semibold text-center'>Join Room /Create Room</h1>
        
        {/* Name div */}
        <div className=''>

          <label htmlFor="" className='block font-medium mb-2'>Your Name</label>
          <input
              onChange={handleFormInputChange}
              value={detail.name}
              type="text" 
              id='name'
              name='userName'
              placeholder='Enter your name' 
              className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' />

        </div>

        {/* Room Id div */}
        <div className=''>

          <label htmlFor="" className='block font-medium mb-2'>Room Id / New Room Id</label>
          <input 
              name='roomId'
              onChange={handleFormInputChange}
              value={detail.roomId}
              type="text" 
              id='name' 
              placeholder='Enter room Id'
              className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
        
        </div>

        {/* Button */}
        <div className='flex justify-center gap-10 mt-4'>

          <button 
              onClick={joinChat}
              className='px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full'>

            Join Room
          </button>

          <button 
              onClick={createRoom}
              className='px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full'>
            Create Room
          </button>

        </div>


      </div>

    </div>
  )
}

export default JoinCreateRoom
