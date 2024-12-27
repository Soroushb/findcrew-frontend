import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDggTbal1jxN9hwwKS3Ogg1FxvDZeyLh04",
  authDomain: "crewfind-64348.firebaseapp.com",
  projectId: "crewfind-64348",
  storageBucket: "crewfind-64348.appspot.com", // Fixed bucket name
  messagingSenderId: "219711766919",
  appId: "1:219711766919:web:6351c0bb746ba79ae11322",
  measurementId: "G-G4W31T1ZFN",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);


const getUserInfo = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);  
    const userSnapshot = await getDoc(userRef);  
    
    if (userSnapshot.exists()) {
      return userSnapshot.data(); 
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

const getUsers = async (location) => {
  try {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("location", "==", location));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => doc.data());

    return users;
  } catch (err) {
    console.error("Error getting users:", err.message);
    throw err;
  }
};


const updateUserInfo = async (uid, updatedData) => {
  try {
    if (!uid) {
      throw new Error("User is not authenticated");
    }

    const userRef = doc(db, "users", uid); 

    await setDoc(userRef, {updatedData}, { merge: true });
    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

const updateDisplayName = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userRef = doc(db, "users", user.uid); // Reference to user document

      await setDoc(userRef, {
        displayName: user.displayName || "Anonymous", 
      }, { merge: true }); 

      console.log("User display name updated successfully.");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  } else {
    console.log("No authenticated user found.");
  }
};

export { auth, getUserInfo, updateDisplayName, updateUserInfo, getUsers };
