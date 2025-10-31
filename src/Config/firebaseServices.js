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
} from 'firebase/firestore';

const COLLECTION_NAME = 'profiles';
const COLLECTION_NAME2 = 'followers';
const COLLECTION_NAME3 = 'follows';


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
