import React, { useEffect, useRef, useState } from 'react'
const LoginForm = (props) => {
    const [error, setError] = useState(null)
    // setError(props.error)
    const email = useRef()
    const password = useRef()

    const validate = () => {
        if (email.current.value.trim() === '' || password.current.value.trim() === '') {
            setError('All fields are required')
            return false
        } else if (password.current.value.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }
        return true
    }



    const formSubmitHandler = (e) => {
        if (navigator.onLine) {
            if (validate()) {
                props.loginFunc(email.current.value, password.current.value)
            }
        } else {
            setError('Please check your internet connection');
        }

        e.preventDefault()
    }

    useEffect(() => {
        setError(props.error)
    }, [props])
    

    return (
        <form className='login-form' onSubmit={formSubmitHandler}>
            <label htmlFor="email">Email </label>
            <input type="text" id='email' ref={email} placeholder='Enter Email' />
            <label htmlFor="password">Password </label>
            <input type="password" id='password' ref={password} placeholder='Password' />
            <p className='show-error'>{error}</p>
            <button className='login-btn'>{props.loading ? 'Loading' : 'Login'}</button>
        </form>
    )
}

export default LoginForm