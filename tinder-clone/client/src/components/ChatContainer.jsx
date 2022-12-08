import React, { useState } from 'react'
import ChatHeader from './ChatHeader';
import MatchesDisplay from './MatchesDisplay';
import ChatDisplay from './ChatDisplay';

function ChatContainer({ user, isChanged }) {
    const [selectedUser, setSelectedUser] = useState();

    const handleMatchClick = () => {
        setSelectedUser(null);
    }


    return (
        <div className="chat-container">

            <ChatHeader user={user} />

            <div>
                <button className={`option ${selectedUser ? '' : 'selected'}`} onClick={handleMatchClick}>
                    Matches
                </button>
                <button className={`option ${!selectedUser ? 'disable' : 'selected'}`} disabled={!selectedUser}>Chat</button>
            </div>

            {!selectedUser &&
                <MatchesDisplay
                    matches={user?.matches ?? []}
                    setSelectedUser={setSelectedUser}
                    isChanged={isChanged}
                    user={user}
                />}

            {selectedUser && <ChatDisplay user={user} selectedUser={selectedUser} />}
        </div>
    )
}

export default ChatContainer
