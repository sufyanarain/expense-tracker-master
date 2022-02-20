import React, { useRef } from 'react'

const PasswordLessLogin = (props) => {
    const email = useRef()

    const formSubmitHandler = (e) => {

        props.passwordLessLogin(email.current.value)
        e.preventDefault()
    }

    return (
        <form className='login-form' onSubmit={formSubmitHandler}>
            <label htmlFor="email">Email </label>
            <input type="text" id='email' ref={email} placeholder='Enter Email' />
            <button className='login-btn'>Submit</button>
        </form>
    )
}

export default PasswordLessLogin