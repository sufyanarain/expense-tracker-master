import React, { useState } from 'react'
import LoginForm from './LoginForm'
import { Link } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, FacebookAuthProvider, sendSignInLinkToEmail } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getFirestore, addDoc, collection, getDoc } from "firebase/firestore";
import { auth } from '../../components/firebase'
import './login.css'
import PasswordLessLogin from './PasswordLessLogin';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [showLoginForm, setShowLoginForm] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const history = useHistory();

    const setUserDataToFirestore = async (user) => { // set users data to firestore from all providers
        const db = getFirestore();

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            const userRef = await addDoc(collection(db, "users_profile"), {
                name: user.displayName,
                email: user.email,
                categories: [],
                expenses: {},
                createdAt: serverTimestamp(),
            })
            console.log("user_profile added to firestore")

            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                userRef: doc(db, "users_profile", userRef.id),
                uid: user.uid,
                createdAt: serverTimestamp(),
            });
            console.log("user added to firestore");
        } else {
            history.push('/dashboard');
            console.log("user already exists");
        }
        history.push('/dashboard');
    }

    const googleAuthBtnHandler = async () => { // google auth
        const provider = new GoogleAuthProvider();
        try {
            const user = await signInWithPopup(auth, provider)
            setUserDataToFirestore(user.user);
        } catch (err) {
            setError(err.message)
        }
    }

    const facebookAuthBtnHandler = async () => { // facebook auth
        const provider = new FacebookAuthProvider();
        try {
            const user = await signInWithPopup(auth, provider)
            setUserDataToFirestore(user.user);
        } catch (err) {
            setError(err.message)
        }

    }

    const loginWithEmailPassword = async (email, password) => { // login with email and password
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            history.push('/dashboard');
            setLoading(false)
        } catch (err) {
            setError(err.message)
            console.log(err);
            setLoading(false)
        }
    }

    const passwordLessLoginFunc = async (email) => {
        const actionCodeSettings = {
            url: 'http://localhost:3000/confirm', // The URL to redirect to after email submission.
            handleCodeInApp: true,
        };

        const auth = getAuth();
        try {
            const sendLink = await sendSignInLinkToEmail(auth, email, actionCodeSettings) //send email link to user
            alert('Email sent ! please Confirm Email')
            window.localStorage.setItem('emailForSignIn', email);

        } catch (err) {
            const errorCode = err.code;
            const errorMessage = err.message;
        }

    }


    return (
        <div className='login-main-div'>

            <div className='login-right-sec'>
                <p className='login-heading'>Login</p>
                <div className='authproviders-div'>
                    <button className='google-btn' onClick={googleAuthBtnHandler}>Sign With Google</button>
                    <button className='facebook-btn' onClick={facebookAuthBtnHandler}>Sign With Facebook</button>
                </div>
                <p>or</p>
                <div className='login-form-div'>
                    {showLoginForm ? <LoginForm loginFunc={loginWithEmailPassword} error={error} loading={loading} /> : <PasswordLessLogin passwordLessLogin={passwordLessLoginFunc} />}
                </div>
                {showLoginForm ? <div className='forgot-password-div'><a onClick={() => setShowLoginForm(false)} className='show-form-link' >Passwordless Login</a></div> :
                    <div className='forgot-password-div'><a onClick={() => setShowLoginForm(true)} className='show-form-link' >Normal Login</a></div>}

                <div className='forgot-password-div'><Link className='forget-password-link' to='/forgotpassword'>Forgot Password ?</Link></div>
                <div className='signup-link-div'><span>Don't have account ? </span><Link className='signup-link' to='/signup'>Sign Up Now</Link> </div>
            </div>
            <div>

            </div>



        </div>
    )
}

export default Login
