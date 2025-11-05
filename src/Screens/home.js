import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Card, FAB, IconButton  } from 'react-native-paper';
import { getAllTweets, 
  updateTweetLikes, 
  getUserLikedTweets, 
  addUserLike, 
  removeUserLike } from '../Config/firebaseServices';
import styles from '../Styles/styles_home';
import logo from '../Images/logo.png';
import home from '../Images/home.png';
import search from '../Images/search.png';
import close from '../Images/close.png';

const Home = ({ navigation, route }) => {
  const { profile } = route.params;
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedTweets, setLikedTweets] = useState({}); //  save which tweets have like


  useEffect(() => {
  const fetchTweets = async () => {
    setLoading(true);
    try {
      const fetchedTweets = await getAllTweets();
      setTweets(fetchedTweets);

      // cargar los likes del usuario actual
      const likedIds = await getUserLikedTweets(profile.username);
      const likedMap = likedIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
      setLikedTweets(likedMap);
    } catch (error) {
      console.error('Error loading tweets:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchTweets();
}, []);

  const handleSearch = () => navigation.navigate('search', { profile });
  const handleProfile = () =>
    navigation.navigate('view_Profile', { profile });
  const handleTweets = () => navigation.navigate('tweets', { profile });
  const handleLogin = () => navigation.navigate('log_in');
  const handleBackHome = () => navigation.navigate('home', { profile });

  // Like
  const handleLike = async tweetId => {
  try {
    const alreadyLiked = likedTweets[tweetId];
    const incrementValue = alreadyLiked ? -1 : 1;

    // actualizar contador del tweet
    await updateTweetLikes(tweetId, incrementValue);

    // registrar o eliminar el like en la colección tweet_likes
    if (alreadyLiked) {
      await removeUserLike(tweetId, profile.username);
    } else {
      await addUserLike(tweetId, profile.username);
    }

    // actualizar el estado local
    setLikedTweets(prev => ({
      ...prev,
      [tweetId]: !alreadyLiked,
    }));

    setTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet.id === tweetId
          ? { ...tweet, likes: tweet.likes + incrementValue }
          : tweet
      )
    );
  } catch (error) {
    console.error('Error liking:', error);
  }
};

  // format date and time
  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('es-CO', options);
  };

  // Render tweet
  const renderTweet = ({ item }) => (
    <Card style={styles.tweetCard}>
      <View>
        <Text style={styles.tweetAuthor}>
          {item.name} {item.lastName} @{item.username}
        </Text>
        <Text style={styles.tweetDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.tweetText}>{item.content}</Text>

        {/*Like more counter */}
        <View style={styles.likeContainer}>
          <IconButton
            icon={likedTweets[item.id] ? 'heart' : 'heart-outline'}
            iconColor={likedTweets[item.id] ? '#e53935' : '#777'}
            size={22}
            onPress={() => handleLike(item.id)}
          />
          <Text style={styles.likeCount}>{item.likes || 0}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.image} />
      </View>

      {/* header Menu*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfile}>
          <Text style={styles.headerUsername}>@{profile.username}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSearch} style={styles.headerIcon}>
          <Image source={search} style={styles.imageHeader} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackHome} style={styles.headerIcon}>
          <Image source={home} style={styles.imageHeader} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.headerIcon}>
          <Image source={close} style={styles.imageHeader} />
        </TouchableOpacity>
      </View>

      {/* List the tweets */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={tweets}
          keyExtractor={item => item.id}
          renderItem={renderTweet}
          ListEmptyComponent={
            <Text style={styles.noTweets}>There are no tweets yet.</Text>
          }
        />
      )}

      {/* floating button */}
      <FAB icon="plus" color="#fff" style={styles.fab} onPress={handleTweets} />
    </View>
  );
};

export default Home;
