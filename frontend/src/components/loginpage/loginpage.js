import React, { useState } from 'react'
import { Navigate, Link } from "react-router-dom"
import './loginpage.css'
import loginService from '../../services/login.js'
import Notification from "../notification/notification";


const LoginPage = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                email, password,
            })

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )

            window.localStorage.setItem(
                'userID', JSON.stringify(user.userID)
            )

            window.localStorage.setItem(
                'token', JSON.stringify(user.token)
            )

            window.localStorage.setItem(
                'role', JSON.stringify(user.role)
            )

            setUser(user)
            setEmail('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <div className='loginPageContainer'>
            <p className='loginTitle'>Transparency Educational</p>
                {user && (<Navigate to="/dashboard" replace={true} />)}
                    <form className='loginForm' onSubmit={handleLogin}>
                        <p className='loginHeader'>Login</p>
                        <Notification message={errorMessage} />
                        <div className='emailLogin'>
                            Email
                            <input
                                type="text"
                                value={email}
                                name="Email"
                                onChange={({ target }) => setEmail(target.value)}
                            />
                        </div>
                        <div className='passwordLogin'>
                            Password
                            <input
                                type="password"
                                value={password}
                                name="Password"
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </div>
                        <button className='loginButton' type="submit">Login</button>

                        <div className='register'>
                            <Link to='/register' >No account yet? Click here</Link>
                        </div>
                    </form>
        </div>
    )
}

export default LoginPage