import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDggTbal1jxN9hwwKS3Ogg1FxvDZeyLh04",
  authDomain: "crewfind-64348.firebaseapp.com",
  projectId: "crewfind-64348",
  storageBucket: "crewfind-64348.appspot.com", // Fixed bucket name
  messagingSenderId: "219711766919",
  appId: "1:219711766919:web:6351c0bb746ba79ae11322",
  measurementId: "G-G4W31T1ZFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication and Storage instances
const auth = getAuth(app);
const storage = getStorage(app);

// Function to upload profile picture to Firebase Storage
const uploadProfilePic = (file) => {
  const storageRef = ref(storage, `profile_pics/${file.name}`); // Reference to the storage location
  return uploadBytes(storageRef, file)  // Upload the file to Firebase Storage
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref); // Get the download URL for the uploaded file
    })
    .catch((error) => {
      console.error("Error uploading file: ", error);
      throw error; // Propagate the error if upload fails
    });
};

// Function to update the user's profile (including photo URL)
const updateUserProfile = async (file) => {
  try {
    const downloadURL = await uploadProfilePic(file);  // Upload the file and get the download URL
    await updateProfile(auth.currentUser, { photoURL: downloadURL }); // Update the user's profile with the new photo URL
    console.log("Profile updated with new photo URL");
  } catch (error) {
    console.error("Error updating profile: ", error);
  }
};

export { auth, storage, updateUserProfile }; // Export for use in other components
