import React, { useEffect, useRef, useState } from 'react'



const SignupForm = (props) => {
    const [error, setError] = useState('')
    
    const name = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const Cpassword = useRef(null)

    //validate fiels
    const validate = () => {
        if (name.current.value === '' || email.current.value === '' || password.current.value === '' || Cpassword.current.value === '') {
            setError('All fields are required')
            return false
        } else if (password.current.value !== Cpassword.current.value) {
            setError('Passwords do not match')
            return false
        } else if (password.current.value.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }
        return true
    }

    const formSubmitHandler = (e) => {
        if (navigator.onLine) {
            if (validate()) { // check if all fields are valid
                props.signupFunc(name.current.value, email.current.value, password.current.value); 
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
        <form className='signup-form' onSubmit={formSubmitHandler}> 
            <label htmlFor="name">Name </label>
            <input type="text" id='name' ref={name} placeholder='Enter Name' />
            <label htmlFor="email">Email </label>
            <input type="text" id='email' ref={email} placeholder='Enter Email' />
            <label htmlFor="password">Password </label>
            <input type="password" id='password' ref={password} placeholder='Password' />
            <input type="password" id='Cpassword' ref={Cpassword} placeholder='Confirm Password' />
            <p className='show-error'>{error}</p>
            <button className='signup-btn'>{props.loading ? 'Loading' : 'Signup'}</button>
        </form>
    )
}

export default SignupForm