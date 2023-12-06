import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase_config";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const updateUserProfile = (displayName) => {
    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        console.log("profile updated", auth.currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emailSignUp = (displayName, email, password) => {
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up successfully.

        setUser(userCredential.user);
        updateProfile(auth.currentUser, {
          displayName: displayName,
        })
          .then(() => {
            console.log("profile updated", auth.currentUser);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        // Handle errors here.
        console.error(error);
      });
  };

  const emailSignIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully.
        setUser(userCredential.user);
      })
      .catch((error) => {
        // Handle errors here.
        console.error(error);
      });
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User", currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        googleSignIn,
        emailSignUp,
        emailSignIn,
        logOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
