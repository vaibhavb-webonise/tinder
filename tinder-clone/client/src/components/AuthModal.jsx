import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useLoading } from '../Consumer';
import LoadingScreen from '../pages/LoadingScreen';
import { HOST } from '../App';

function AuthModal({ setShowModal, signUp }) {
    const [error, setError] = useState();
    const [cookie, setCookie] = useCookies(['user']);
    const [user, setUser] = useState({})
    const [loading, setLoading] = useLoading();
    const handleChange = (e) => {
        const { value, name } = e.target;
        console.log('value ', value);
        setUser({
            ...user,
            [name]: value,
        })
    }

    const handleClick = () => {
        setShowModal(false)
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true)
        const { password, confirm, email } = user;
        try {
            if (signUp && (password !== confirm)) {
                setError("Password needs to match ")
            }

            else {
                try {
                    const resp = await axios.post(`${HOST}/${signUp ? 'register' : 'login'}`, { email, password })
                    const success = resp.status === 201;
                    if (success) {
                        setCookie('Email', resp.data.email);
                        setCookie('UserId', resp.data.userId);
                        setCookie('AuthToken', resp.data.token);
                        signUp ? navigate('onboarding') : navigate('/dashboard');
                        window.location.reload();
                    }
                } catch (e) {
                    const { data, status } = e.response;
                    setError(data ?? 'Error occured')
                } finally {
                    setLoading(false);
                }

            }

            console.log('make a post request to our database');
        } catch {
            //nothing to do
        }
    }

    return (
        <div className="auth">
            <div className="auth-modal">
                <div className="close-icon" onClick={handleClick}>
                    X
                </div>
                <h2>{signUp ? "CREATE ACOOUNT" : "LOG IN"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name='email'
                        id="email"
                        required
                        placeholder="email"
                        onChange={handleChange}
                        value={user.email}
                    />

                    <input
                        type="password"
                        name='password'
                        id="password"
                        required
                        placeholder="password"
                        onChange={handleChange}
                        value={user.password}
                    />

                    {signUp && <input
                        type="password"
                        name='confirm'
                        id="password-check"
                        required
                        placeholder=" confirm password"
                        onChange={e => handleChange(e)} />}

                    <input
                        type="submit"
                        className="secondary-button"
                    />

                    <p>{error}</p>
                </form>
                <hr />

                <h2>GET THE APP</h2>
            </div>


            <LoadingScreen open={loading} alertText={`Please wait ${signUp ? '...we creating your account...' : '...signing in ...'} `} />
        </div>
    )
}

export default AuthModal
