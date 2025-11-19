import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Card, FAB, IconButton } from 'react-native-paper';
import {
  getAllTweets,
  updateTweetLikes,
  getUserLikedTweets,
  addUserLike,
  removeUserLike,
} from '../Config/firebaseServices';
import styles from '../Styles/styles_home';
import logo from '../Images/logo.png';
import home from '../Images/home.png';
import search from '../Images/search.png';
import close from '../Images/close.png';

const Home = ({ navigation, route }) => {
  const { profile } = route.params || {}; // protect against undefined route.params

  // avoid rendering if profile is not loaded yet
  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#666', fontSize: 16 }}>Cargando perfil...</Text>
      </View>
    );
  }

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedTweets, setLikedTweets] = useState({});
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      try {
        const fetchedTweets = await getAllTweets();
        setTweets(fetchedTweets);

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
  }, [profile.username]);

  // Navigation
  const handleSearch = () => navigation.navigate('search', { profile });
  const handleProfile = () => navigation.navigate('view_Profile', { profile });
  const handleTweets = () => navigation.navigate('tweets', { profile });
  const handleLogin = () => navigation.navigate('log_in');
  const handleBackHome = () => navigation.navigate('home', { profile });
  const handleUserPress = user => {
    if (user.username === profile.username) {
      navigation.navigate('view_Profile', { profile });
    } else {
      navigation.navigate('ViewOtherProfile', {
        profile: user,
        currentUser: profile,
      });
    }
  };
  // Like / Unlike
  const handleLike = async tweetId => {
    try {
      const alreadyLiked = likedTweets[tweetId];
      const incrementValue = alreadyLiked ? -1 : 1;

      await updateTweetLikes(tweetId, incrementValue);

      if (alreadyLiked) {
        await removeUserLike(tweetId, profile.username);
      } else {
        await addUserLike(tweetId, profile.username);
      }

      setLikedTweets(prev => ({
        ...prev,
        [tweetId]: !alreadyLiked,
      }));

      setTweets(prevTweets =>
        prevTweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, likes: tweet.likes + incrementValue }
            : tweet,
        ),
      );
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  // format date
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

  // Pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTweets = tweets.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < tweets.length) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  // Render tweet
  const renderTweet = ({ item }) => (
    <Card style={styles.tweetCard}>
      <View>
        <TouchableOpacity
          onPress={() =>
            handleUserPress({
              name: item.name,
              lastName: item.lastName,
              username: item.username,
            })
          }
        >
          <Text style={styles.tweetAuthor}>
            {item.name} {item.lastName} @{item.username}
          </Text>
        </TouchableOpacity>

        <Text style={styles.tweetDate}>{formatDate(item.createdAt)}</Text>

        {/* Tweet text */}
        <Text style={styles.tweetText}>{item.content}</Text>

        {/* Show image if exists */}
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: '100%',
              height: 300,
              borderRadius: 12,
              marginTop: 8,
            }}
            resizeMode="cover"
          />
        )}

        {/* Likes */}
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

      {/* Header */}
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

      {/* Tweets */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          <FlatList
            data={paginatedTweets}
            keyExtractor={item => item.id}
            renderItem={renderTweet}
            ListEmptyComponent={
              <Text style={styles.noTweets}>There are no tweets yet.</Text>
            }
          />

          {/* Pagination controls */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              disabled={page === 1}
              onPress={prevPage}
              style={{
                backgroundColor: page === 1 ? '#ccc' : '#4CAF50',
                padding: 10,
                borderRadius: 8,
                flex: 0.45,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={endIndex >= tweets.length}
              onPress={nextPage}
              style={{
                backgroundColor: endIndex >= tweets.length ? '#ccc' : '#4CAF50',
                padding: 10,
                borderRadius: 8,
                flex: 0.45,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Floating Button */}
      <FAB icon="plus" color="#fff" style={styles.fab} onPress={handleTweets} />
    </View>
  );
};

export default Home;
