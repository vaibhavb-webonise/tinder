import axios from 'axios';
import React, { useState } from 'react'
import { HOST, socket } from '../App';

function ChatInput({ selectedUser, user, getAllMessage }) {
    const [textArea, setTextArea] = useState('');
    
    const sentText = async () => {
        const messageData = {
            text: textArea,
            from: user.user_id,
            to: selectedUser.user_id,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        }
        await socket.emit('sendText',messageData);
    }
    const sendMessage = async () => {
        try {
            const response = await axios.post(`${HOST}/send-message`, {
                fromUserId: user?.user_id,
                toUserId: selectedUser?.user_id,
                timeStamp: new Date().toISOString(),
                message: textArea
            })
            const success = response.status === 201;
            if (success) {
                await getAllMessage();
                setTextArea('')
            }
        } catch (e) {
            console.log('error occured in sending', e)
        } finally {
        }
    }
    return (
        <div className="chat-input">
            <textarea value={textArea} onChange={e => setTextArea(e.target.value)} placeholder={'say something to ' + selectedUser?.first_name} />
            <button onClick={sentText} className={textArea ? 'secondary-button' : 'chat-submit'} disabled={!textArea}>Submit</button>
        </div>
    )
}

export default ChatInput
