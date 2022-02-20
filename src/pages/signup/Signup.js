import React, { useContext,useState } from 'react'
import SignupForm from './SignupForm'
import { Link } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getFirestore, addDoc, collection, getDoc } from "firebase/firestore";
import { FacebookAuthProvider } from "firebase/auth";
import { useHistory } from 'react-router-dom';
import userProfileContext from '../../components/context/userProfileContext';


import './signup.css'

const Signup = () => {
    const history = useHistory();
    const userProfile = useContext(userProfileContext);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const auth = getAuth();

    const setUserDataToFirestore = async (user) => { // set user data to firestore from all providers
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
        setLoading(false)
        history.push('/dashboard');


    }


    const googleAuthBtnHandler = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const credential = await signInWithPopup(auth, provider);
            const user = credential.user;
            setUserDataToFirestore(user);
        } catch (err) {
        }
    }


    const facebookAuthBtnHandler = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const credential = await signInWithPopup(auth, provider)
            const user = credential.user;
            setUserDataToFirestore(user)
        } catch (err) {
        }

    }

    const signupWithEmailPassword = async (name, email, password) => {
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            user.displayName = name;
            setUserDataToFirestore(user)
        } catch (err) {
            console.log(err,"dd",err.code,err.message);
            setError(err.code)
            setLoading(false)
        }
    }







    return (
        <div className='signup-main-div'>

            <div className='signup-right-sec'>
                <p className='signup-heading'>Signup</p>
                <div className='authproviders-div'>
                    <button className='google-btn' onClick={googleAuthBtnHandler}>Sign With Google</button>
                    <button className='facebook-btn' onClick={facebookAuthBtnHandler}>Sign With Facebook</button>
                </div>
                <p>or</p>
                <div className='signup-form-div'>
                    <SignupForm error={error} loading={loading} signupFunc={signupWithEmailPassword} />
                </div>
                <div className='forgot-password-div'><Link className='forget-password-link' to='/forgotpassword'>Forgot Password ?</Link></div>
                <div className='signup-link-div'>Already have an account? <Link className='signup-link' to='/'>Sign in Now</Link> </div>
            </div>
        </div>
    )
}

export default Signup