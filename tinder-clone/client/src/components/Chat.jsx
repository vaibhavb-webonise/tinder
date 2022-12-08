import React from 'react'
import Message from './Message'

function Chat({ sortedSentMessages, sortedRecievedMessages, user }) {

  const totalChat = [...sortedSentMessages, ...sortedRecievedMessages];
  const sortedChats = totalChat.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  if (!sortedChats.length) return (
    <div className="empty-chat-display">
      <h2> Nothing yet here</h2> why don't say Hi and start conversation.
    </div>
  )

  return (
    <div className="chat-display">
      {
        sortedChats.reverse().map(message => (
          <div className="chat-message" style={{ justifyContent: `flex-${message.name === user.first_name ? 'end' : 'start'}` }}>
            <Message message={message} />
          </div>
        ))
      }

    </div>
  )
}

export default Chat
