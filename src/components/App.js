import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        //setUserObj(user) 
        // 방법 2
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
        //userObj 안에는 많은 method가 있다 so 작게 만들어준다 
        // 방법 1
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      // 방법 1

      // setUserObj(Object.assign({}. user)); 
      // 방법 2
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  // refresh user's profile 
  return (
    <>
      {init ? (
        <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
          "Initializing..."
        )}
    </>
  );
}

export default App;