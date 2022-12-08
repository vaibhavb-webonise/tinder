import React from 'react'
import { authToken } from '../pages/Home';

const colorLogo = "https://logosmarken.com/wp-content/uploads/2020/09/Tinder-Zeichen.png"
const whiteLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/TinderLogo-2017.svg/1280px-TinderLogo-2017.svg.png";



function Nav({ minimal,setShowModal,showModal,setSignUp }) {
    const handleClick = () => {
        setShowModal(true)
        setSignUp(false)
    }

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={minimal ? colorLogo : whiteLogo} alt="logo" />
            </div>

            {!authToken && !minimal && <button onClick={handleClick} className="nav-button" disabled={showModal}>Log In</button>}
        </nav>
    )
}

export default Nav
