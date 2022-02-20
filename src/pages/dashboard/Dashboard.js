import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../../components/nav/Nav'
import './dashboard.css'
import DisplayTransactions from './displayTransactions/DisplayTransactions'
import Modal from './displayTransactions/modal/Modal'
import AuthContext from '../../components/context/AuthContext'
import userProfileContext from '../../components/context/userProfileContext'
import { doc, updateDoc, arrayUnion, getFirestore, onSnapshot, serverTimestamp, getDocs, addDoc, collection, getAuth, signOut } from "firebase/firestore";
import useLoader from '../../components/customHooks/useLoader'
import Loader from '../../components/loader/Loader'

const Dashboard = () => {
    const [loader, showLoader, hideLoader] = useLoader();
    console.log(loader);
    const userObj = useContext(AuthContext);
    const userProfile = useContext(userProfileContext);
    const [transactions, setTransactions] = useState([]);
    const [userObjFromFirestore, setUserObjFromFirestore] = useState({});
    const [loading, setLoading] = useState(false);
    const addCategory = useRef(null);
    const nameInput = useRef(null)

    const db = getFirestore();

    const submitExpenseFuncs = async (category, description, amount) => {

        const userRef = doc(db, "users_profile", userProfile);

        await updateDoc(userRef, {
            expenses: arrayUnion({
                id: (new Date().getTime()).toString().slice(6),
                description: description,
                amount: amount,
                category: category,
                createdAt: new Date()
            })
        });
    }

    console.log(userObjFromFirestore);

    const addCategoryHandler = async () => { //add category to firestore
        setLoading(true);
        if (addCategory.current.value !== '') {
            const userRef = doc(db, "users_profile", userProfile);
            await updateDoc(userRef, {
                categories: arrayUnion(addCategory.current.value)
            });
        }
        setLoading(false);
        addCategory.current.value = ''
    }

    const nameInputHandler = async () => { // function for updating user's name
        console.log('name func run');
        const users_ref = doc(db, "users", userObj.uid);
        const users_profile_ref = doc(db, "users_profile", userProfile)
        await updateDoc(users_ref, {
            name: nameInput.current.value
        });

        await updateDoc(users_profile_ref, {
            name: nameInput.current.value
        });

        console.log('name updated');


    }

    const expenseOptionHandler = async ({ id, category, description, amount }, index) => {
        console.log('edit expense', id, category, description, amount, index);
        // const washingtonRef = doc(db, "cities", "DC");

        // // Atomically add a new region to the "regions" array field.
        // await updateDoc(washingtonRef, {
        //     regions: arrayUnion("greater_virginia")
        // });

        // // Atomically remove a region from the "regions" array field.
        // await updateDoc(washingtonRef, {
        //     regions: arrayRemove("east_coast")
        // });
    }

    useEffect(() => {
        showLoader()
        userProfile && onSnapshot(doc(db, "users_profile", `${userProfile}`), (doc) => { //get user data from firestore
            setUserObjFromFirestore(doc.data())
            hideLoader()
        });
    }, [userProfile]);

    useEffect(async () => {
        userProfile && onSnapshot(doc(db, "users_profile", userProfile), (doc) => {
            setTransactions(doc.data());
        });

    }, [userProfile])




    return (
        <div >
            {loader}
            <Nav />
            {userObjFromFirestore.name ? <div className='dashboard-main-div'>
                <div className='heading-buttons-top-div'>
                    <h3>Expense Management App</h3>
                    <div className='modal-btns'>
                        <div>
                            <input type='text' className='add-category-input' placeholder='Input Category' ref={addCategory} />
                        </div>
                        <button onClick={addCategoryHandler} className='btn primary category-btn'>{loading ? 'Loading' : '+ category'}</button>
                        <Modal userObj={userObjFromFirestore} submitExpenseFuncs={submitExpenseFuncs} />
                    </div>
                </div>
                <DisplayTransactions expenseOptionHandler={expenseOptionHandler} userObj={transactions} />
            </div> :
                <div className='dashboard-main-div'>
                    <div className='update-name-div'>
                        <h3>Please input your name to continue !</h3><br /><br />
                        <div>
                            <input type='text' className='add-name-input' placeholder='Input Your Name' ref={nameInput} />
                            <button className='btn primary add-input-btn' onClick={nameInputHandler}>Submit</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard