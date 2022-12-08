import React, { useEffect, useState } from 'react'
import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios';
import { HOST, serverUrl } from '../App';

function ChatDisplay({ user, selectedUser }) {
  const userId = user?.user_id;
  const clickedUserId = selectedUser?.user_id;
  const [userMessages, setUserMessages] = useState([]);
  const [clikedUserMessages, setClikedUserMessages] = useState([]);

  const getMessages = async (senderId, recieverId) => {
    try {
      const response = await axios.get(`${HOST}/messages`, {
        params: { senderId, recieverId },
      })
      return response.data
    } catch (e) {
      console.log('error occured');
      return []
    }
  }

  const getAllMessage = async () => {
    const sentMessages = await getMessages(userId, clickedUserId);
    const recievedMessages = await getMessages(clickedUserId, userId);
    setUserMessages(sentMessages);
    setClikedUserMessages(recievedMessages);
  }

  const getSocketChats = () => {
    
  }
  useEffect(() => {
    getAllMessage()
  }, [])



  const createFormattedMessages = (messageArray, user = selectedUser) => {
    const userFormattedMessages = [];
    messageArray?.forEach(message => {
      const formattedMessage = {};
      formattedMessage['name'] = user?.first_name;
      formattedMessage['avatar'] = user?.url;
      formattedMessage['message'] = message.message;
      formattedMessage['timestamp'] = message.timestamp
      userFormattedMessages.push(formattedMessage)
    })
    return userFormattedMessages
  }

  const sentFormattedMessages = createFormattedMessages(userMessages, user);
  const recievedFormattedMessages = createFormattedMessages(clikedUserMessages)


  const sortedSentMessages = sentFormattedMessages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  const sortedRecievedMessages = recievedFormattedMessages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))


  return (
    <div className="chat-wrapper">
      <Chat
        sortedSentMessages={sortedSentMessages}
        sortedRecievedMessages={sortedRecievedMessages}
        user={user}
      />
      <ChatInput user={user} selectedUser={selectedUser} getAllMessage={ getAllMessage } />
    </div>
  )
}

export default ChatDisplay
