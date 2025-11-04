import { server } from 'typescript';
import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore';

const COLLECTION_NAME = 'profiles';
const COLLECTION_NAME2 = 'followers';
const COLLECTION_NAME3 = 'follows';
const COLLECTION_NAME4 = 'tweets';


export const createProfile = async (profileData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME),{
    name: profileData.name,
    lastName: profileData.lastName,
    username: profileData.username,
    email: profileData.email,
    password: profileData.password,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

export const checkEmailExists = async email => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty; // true si ya existe
  } catch (error) {
    console.error('Error verificando correo:', error);
    throw error;
  }
};

export const checkUsernameExists = async username => {
  try {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('username', '==', username),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty; // true si ya existe
  } catch (error) {
    console.error('Error verificando nombre de usuario:', error);
    throw error;
  }
};

export const getProfileByUsername = async username => {
  try {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('username', '==', username),
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  } catch (error) {
    console.error('Error obteniendo perfil por nombre de usuario:', error);
    throw error;
  }
};

export const createTweet = async tweetData => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME4), {
      name: tweetData.name,
      lastName: tweetData.lastName,
      username: tweetData.username,
      content: tweetData.content,
      likes: 0,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

export const getAllTweets = async () => {
  try {
    const q = query(collection(db, 'tweets'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const tweets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tweets;
  } catch (error) {
    console.error('Error obteniendo tweets:', error);
    throw error;
  }
};

export const updateTweetLikes = async (tweetId, incrementValue) => {
  try {
    const tweetRef = doc(db, 'tweets', tweetId);
    await updateDoc(tweetRef, {
      likes: increment(incrementValue),
    });
    console.log('Likes actualizados');
  } catch (error) {
    console.error('Error actualizando likes:', error);
    throw error;
  }
};