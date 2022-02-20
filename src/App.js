import React, { useEffect, useState } from "react";
import Protected from "./routes/Protected";
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import PasswordLessConfirm from "./pages/login/passwordLessConfirm";
import Dashboard from "./pages/dashboard/Dashboard";
import AuthContext from "./components/context/AuthContext";
import userProfileContext from "./components/context/userProfileContext";
import { getAuth, onAuthStateChanged,signOut } from "firebase/auth";
import { doc, onSnapshot,getFirestore } from "firebase/firestore";

function App() {
  const [userAuthObj, setUserAuthObj] = useState({});
  const [userProfileObj, setUserProfileObj] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  console.log(userAuthObj);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuthObj(user);
        
      } else {
        setUserAuthObj({});
      }
    })
  }, []);

  useEffect(() => {
    userAuthObj.uid && onSnapshot(doc(db, "users", userAuthObj.uid), (doc) => {
      const id = doc.data().userRef.id;
      console.log(id, "id", doc.data().userRef);
      setUserProfileObj(id)

    });
  }, [userAuthObj])


  return (
    <Switch>
      <Route exact path="/" component={Login} Route />
      <Route path="/signup" component={Signup} />
      <Route path="/confirm" component={PasswordLessConfirm} />


      <AuthContext.Provider value={userAuthObj}>
        <userProfileContext.Provider value={userProfileObj}>
          <Protected path="/dashboard" component={Dashboard} />
        </userProfileContext.Provider>
      </AuthContext.Provider>

    </Switch>
  );
}

export default App;
