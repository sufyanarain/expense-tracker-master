import React, { Component, useContext, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Protected = ({ path, component }) => {
    const [getUser, setUser] = useState(false);
    const [protected1, setProtected] = useState('');
    const [pub, setPub] = useState('');

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(true);
                setProtected(<Route path={path} component={component} />)
            } else {
                setUser(false);
                setPub(<Redirect to='/' />)
            }
        })
        //clean up
        return () => {
            return
        }
    }, []);

    
    return getUser ? protected1 : pub





}



export default Protected