import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { HOST, socket } from '../App';
function MatchesDisplay({ matches, setSelectedUser, isChanged, user }) {

    const [matchedUsers, setMatchedUsers] = useState([]);
    const [cookie] = useCookies(['user']);

    const getFullMathcedUsers = async () => {
        const matchedUsers = matches?.map(user => user.user_id);
        if (!matchedUsers.length) return;
        try {
            const response = await axios.get(`${HOST}/user-matched`, {
                params: {
                    matchedUsers
                }
            });
            setMatchedUsers(response.data);
        } catch {
            //error code
        } finally {
            //final code
        }
    }

    useEffect(() => {
        getFullMathcedUsers();
    }, [matches.length, isChanged])

    const fullyMatchedUsers = matchedUsers?.filter(
        (matchedProfile) =>
            matchedProfile.matches.filter(profile => profile.user_id === cookie.UserId).length > 0
    )

    const handleMatchClick = (user) => {
        setSelectedUser(user);
        joinRoom(user);
    }

    const joinRoom = (selectedUser) => {
        const { user_id,first_name} = user
        const firstName = selectedUser.first_name
        socket.emit('joinRoom',{user_id,first_name,firstName})
    }

    if (!fullyMatchedUsers?.length) return (
        <>
            <div className="empty-match">
                <h2>No matches yet..</h2>
                <h4>Swipe right... if that person swipes you right</h4>
                <h2>It's a Match</h2>
            </div>
        </>
    )
    return (
        <div className="matches-display">
            {
                fullyMatchedUsers?.map((user, _index) => (
                    <div key={_index} className="match-card" onClick={() => handleMatchClick(user)}>
                        <div className="img-container avatar">
                            <img src={user.url} alt="user" />
                        </div>
                        <h3>{user.first_name}</h3>
                    </div>
                ))
            }
        </div>
    )
}

export default MatchesDisplay
