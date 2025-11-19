import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';
import ReactNativeBlobUtil from 'react-native-blob-util';

// Init Storage
const storage = getStorage(app);


// ERROR HANDLER
const handleStorageError = (error) => {
  console.error("Storage error:", error);

  switch (error.code) {
    case 'storage/unauthorized':
      return new Error('You do not have permission to upload files (rules).');
    case 'storage/canceled':
      return new Error('The upload was canceled.');
    case 'storage/unknown':
      return new Error('Unknown error. Check rules or connection.');
    default:
      return new Error(error.message || "Error uploading file");
  }
};

// Convert URI → Blob
const uriToBlob = async (uri) => {
  try {
    console.log("Convert URI → blob...");
    console.log("URI:", uri);

    const base64Data = await ReactNativeBlobUtil.fs.readFile(uri, 'base64');

    const blob = ReactNativeBlobUtil.polyfill.Blob.build(base64Data, {
      type: 'image/jpeg',
    });

    return blob;
  } catch (error) {
    console.error("Error converting URI to blob:", error);
    throw new Error("Could not process the image");
  }
};

// MAIN UPLOAD FUNCTION
export const uploadTweetImage = async (imageAsset, username) => {
  try {
    if (!imageAsset || !imageAsset.uri) {
      throw new Error("No image was selected");
    }

    console.log("Uploading image...");
    console.log("URI:", imageAsset.uri);
    console.log("Username:", username);

    const blob = await uriToBlob(imageAsset.uri);

    // Generate safe filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = (imageAsset.type || "image/jpeg").split("/")[1];

    const fileName = `${username}_${timestamp}_${random}.${extension}`;
    const path = `Tweets/${fileName}`;

    console.log("Upload path:", path);

    const storageRef = ref(storage, path);

    // Metadata
    const metadata = {
      contentType: imageAsset.type || "image/jpeg",
    };

    console.log("Metadata:", metadata);

    // Upload 
    const snapshot = await uploadBytes(storageRef, blob, metadata);

    console.log("Upload complete. Getting URL...");

    // Get Public URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("Download URL:", downloadURL);

    return downloadURL;

  } catch (error) {
    console.error("Error in uploadTweetImage:", error);
    throw handleStorageError(error);
  }
};

export default uploadTweetImage;
