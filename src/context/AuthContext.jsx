import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  if (currentUser) {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        email: currentUser.email,
        name: currentUser.displayName,
        photo: currentUser.photoURL,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  setUser(currentUser);
  setLoading(false);
});


    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
