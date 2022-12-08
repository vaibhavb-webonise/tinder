import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function ChatHeader({ user }) {
    const navigate = useNavigate()
    const [cookie, , removeCookie] = useCookies(['user']);

    const handleLogout = () => {
        removeCookie('UserId');
        removeCookie('AuthToken');
        removeCookie('Email');
        window.location.reload();
        navigate('/');;

    }

    const defaultImage = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url ?? defaultImage} />
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i className="log-out-icon" onClick={handleLogout}><LogoutIcon /></i>
        </div>
    )
}

export default ChatHeader
