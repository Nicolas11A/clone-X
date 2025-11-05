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
const COLLECTION_NAME5 = 'tweet_likes';


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
    return !snapshot.empty; // true if it exists
  } catch (error) {
    console.error('Error verifying email:', error);
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
    return !snapshot.empty; // true if it exists
  } catch (error) {
    console.error('Error verifying username:', error);
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
    console.error('Error retrieving profile by username:', error);
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
    console.error('Error retrieving tweets:', error);
    throw error;
  }
};

export const updateTweetLikes = async (tweetId, incrementValue) => {
  try {
    const tweetRef = doc(db, 'tweets', tweetId);
    await updateDoc(tweetRef, {
      likes: increment(incrementValue),
    });
    console.log('updated likes');
  } catch (error) {
    console.error('Error updating likes:', error);
    throw error;
  }
};

export const hasUserLikedTweet = async (tweetId, username) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME5),
      where('tweetId', '==', tweetId),
      where('username', '==', username)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error verificando like del usuario:', error);
    throw error;
  }
};

export const addUserLike = async (tweetId, username) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME5), {
      tweetId,
      username,
    });
  } catch (error) {
    console.error('Error agregando like del usuario:', error);
    throw error;
  }
};
export const removeUserLike = async (tweetId, username) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME5),
      where('tweetId', '==', tweetId),
      where('username', '==', username)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(docu => deleteDoc(doc(db, COLLECTION_NAME5, docu.id)));
  } catch (error) {
    console.error('Error quitando like del usuario:', error);
    throw error;
  }
};
export const getUserLikedTweets = async username => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME5),
      where('username', '==', username)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().tweetId);
  } catch (error) {
    console.error('Error obteniendo likes del usuario:', error);
    throw error;
  }
};
export const getFollowersCount = async (username) => {
  try {
    const q = query(collection(db, COLLECTION_NAME2), where('followingUsername', '==', username));
    const snapshot = await getDocs(q);
    return snapshot.size; //number of documents (followers)
  } catch (error) {
    console.error('Error obtaining follower count:', error);
    throw error;
  }
};


export const getFollowingCount = async (username) => {
  try {
    const q = query(collection(db, COLLECTION_NAME3), where('followerUsername', '==', username));
    const snapshot = await getDocs(q);
    return snapshot.size; // number of followed
  } catch (error) {
    console.error('Error obtaining number of consecutive:', error);
    throw error;
  }
};


export const fetchCounts = async (username) => {
  try {
    const [followers, following] = await Promise.all([
      getFollowersCount(username),
      getFollowingCount(username),
    ]);

    return { followers, following };
  } catch (error) {
    console.error('Error retrieving trace counters:', error);
    throw error;
  }
};

export const isFollowing = async (followerUsername, followingUsername) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME3), // follows
      where('followerUsername', '==', followerUsername),
      where('followingUsername', '==', followingUsername)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error verificando si sigue:', error);
    throw error;
  }
};

export const followUser = async (followerUsername, followingUsername) => {
  try {
    // add follows
    await addDoc(collection(db, COLLECTION_NAME3), {
      followerUsername,
      followingUsername,
    });

    // add followers
    await addDoc(collection(db, COLLECTION_NAME2), {
      followerUsername,
      followingUsername,
    });

    console.log(`${followerUsername} ahora sigue a ${followingUsername}`);
  } catch (error) {
    console.error('Error siguiendo usuario:', error);
    throw error;
  }
};

export const unfollowUser = async (followerUsername, followingUsername) => {
  try {
    // delete follows
    const q1 = query(
      collection(db, COLLECTION_NAME3),
      where('followerUsername', '==', followerUsername),
      where('followingUsername', '==', followingUsername)
    );
    const snapshot1 = await getDocs(q1);
    snapshot1.forEach(docu => deleteDoc(doc(db, COLLECTION_NAME3, docu.id)));

    // delete  followers
    const q2 = query(
      collection(db, COLLECTION_NAME2),
      where('followerUsername', '==', followerUsername),
      where('followingUsername', '==', followingUsername)
    );
    const snapshot2 = await getDocs(q2);
    snapshot2.forEach(docu => deleteDoc(doc(db, COLLECTION_NAME2, docu.id)));

    console.log(`${followerUsername} dejó de seguir a ${followingUsername}`);
  } catch (error) {
    console.error('Error al dejar de seguir usuario:', error);
    throw error;
  }
};
