import React, { useState } from 'react'
import AuthModal from '../components/AuthModal';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const authToken = false;

const Home = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [{AuthToken }] = useCookies();

    if(AuthToken) navigate('/dashboard')
    

    const handleClick = () => {
        setSignUp(true);
        setShowModal(true);
    }

    React.useEffect(() => {
        navigate('/')
    },[])
    return (
        <div className="overlay">
            <Nav
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setSignUp={setSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Swipe Right</h1>
                <button className="primary-button" onClick={handleClick}>{authToken ? "Sign Out" : "Create Account"}</button>
            </div>

            {showModal && (
                <AuthModal
                    setShowModal={setShowModal}
                    signUp={signUp}
                />
            )}
        </div>
    )
}

export default Home
