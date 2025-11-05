import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import styles from '../Styles/styles_viewProfile';
import {
  getAllTweets,
  fetchCounts,
  updateTweetLikes,
  getUserLikedTweets,
  addUserLike,
  removeUserLike,
} from '../Config/firebaseServices';
import home from '../Images/home.png';
import search from '../Images/search.png';
import close from '../Images/close.png';

const ViewProfile = ({ navigation, route }) => {
  const { profile } = route.params;
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [likedTweets, setLikedTweets] = useState({});

  const handleFollowers = () => navigation.navigate('followers', { profile });
  const handleFollows = () => navigation.navigate('follows', { profile });
  const handleSearch = () => navigation.navigate('search', { profile });
  const handleLogin = () => navigation.navigate('log_in');
  const handleBackHome = () => navigation.navigate('home', { profile });

  // Load the user's tweets and likes.
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const userTweets = await getAllTweets();
        const filteredTweets = userTweets.filter(
          t => t.username === profile.username
        );
        setTweets(filteredTweets);

        const { followers, following } = await fetchCounts(profile.username);
        setFollowersCount(followers);
        setFollowingCount(following);

        // Get likes from the logged-in user
        const likedIds = await getUserLikedTweets(profile.username);
        const likedMap = likedIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});
        setLikedTweets(likedMap);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);


  const handleLike = async tweetId => {
    try {
      const alreadyLiked = likedTweets[tweetId];
      const incrementValue = alreadyLiked ? -1 : 1;

      // update likes count
      await updateTweetLikes(tweetId, incrementValue);

      // Register or remove like
      if (alreadyLiked) {
        await removeUserLike(tweetId, profile.username);
      } else {
        await addUserLike(tweetId, profile.username);
      }

      // update local state
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
      console.error('Error updating like:', error);
    }
  };

  // date format
  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      {/* Header*/}
      <View style={styles.header}>
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

      {/* User profile*/}
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={profile.name.charAt(0).toUpperCase()}
          style={styles.avatar}
          color="#fff"
        />
        <Text style={styles.name}>
          {profile.name} {profile.lastName}
        </Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        <View style={styles.followContainer}>
          <TouchableOpacity onPress={handleFollows}>
            <Text style={styles.followText}>
              <Text style={styles.followCount}>{followingCount}</Text> following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFollowers}>
            <Text style={styles.followText}>
              <Text style={styles.followCount}>{followersCount}</Text> followers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tweets</Text>

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
            <Text style={styles.noTweets}>There are no tweet yet .</Text>
          }
        />
      )}
    </View>
  );
};

export default ViewProfile;
