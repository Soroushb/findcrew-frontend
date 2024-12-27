import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 

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
const auth = getAuth(app);
const db = getFirestore(app);

const getUserInfo = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);  // Correct reference to the user document
    const userSnapshot = await getDoc(userRef);  // Fetch the user data
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();  // Return user data if document exists
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

const updateUserInfo = async (uid, updatedData) => {
  try {
    // Ensure the user is authenticated
    if (!uid) {
      throw new Error("User is not authenticated");
    }

    const userRef = doc(db, "users", uid); // Correct reference to the user document

    await setDoc(userRef, updatedData, { merge: true });
    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

// Export Firebase services and functions
export { auth, getUserInfo, updateUserInfo };
