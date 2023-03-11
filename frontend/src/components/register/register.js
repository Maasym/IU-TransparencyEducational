import React, { useRef, useState, useEffect } from 'react'
import './register.css'
import {Link, Navigate} from 'react-router-dom'
import Notification from '../notification/notification'
import registerService from '../../services/register'

const Register = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [user, setUser] = useState('')
    const [registered, setRegistered] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault();

        if(password !== rePassword) {
            setErrorMessage('password not identical')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        } else {
            try {
                await registerService.register({email, password,})
                setUser('');
                setPassword('');
                setRePassword('')
                setRegistered(true)
            } catch (err) {
                setErrorMessage(err.response.data.error)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            }
        }
    }

    return (
        <div className='registerPageContainer'>
            <p className='registerTitle'>Transparency Educational</p>
            {registered && (<Navigate to="/login" replace={true} />)}
            <form className='registerForm' onSubmit={handleRegister}>
                <p className='registerHeader'>Register</p>
                <div className='registerErrorMessage'>
                <Notification message={errorMessage} />
                </div>
                <div className='emailRegister'>
                    Email
                    <input
                        type="text"
                        value={email}
                        name="Email"
                        onChange={({ target }) => setEmail(target.value)}
                    />
                </div>
                <div className='passwordRegister'>
                    Password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <div className='rePassword'>
                    Reenter password
                    <input
                        type="password"
                        value={rePassword}
                        name="rePassword"
                        onChange={({ target }) => setRePassword(target.value)}
                    />
                </div>
                <button className='registerButton' type="submit">Register</button>

                <div className='login'>
                    <Link to='/login' >Have an account? Click here</Link>

                </div>
            </form>
        </div>
    )
}

export default Register