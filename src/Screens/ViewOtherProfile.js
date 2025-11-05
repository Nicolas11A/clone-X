import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Avatar, Card, IconButton, Button } from 'react-native-paper';
import styles from '../Styles/styles_viewProfile';
import {
  getAllTweets,
  fetchCounts,
  updateTweetLikes,
  getUserLikedTweets,
  addUserLike,
  removeUserLike,
  isFollowing,
  followUser,
  unfollowUser,
} from '../Config/firebaseServices';
import home from '../Images/home.png';
import search from '../Images/search.png';
import close from '../Images/close.png';

const ViewOtherProfile = ({ navigation, route }) => {
  const { profile, currentUser } = route.params; 
 // profile: user you are viewing 
 //currentUser: logged-in user
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [likedTweets, setLikedTweets] = useState({});
  const [isUserFollowing, setIsUserFollowing] = useState(false);

  const handleSearch = () => navigation.navigate('search', {profile: currentUser });
  const handleLogin = () => navigation.navigate('log_in');
  const handleBackHome = () => navigation.navigate('home', { profile: currentUser });

  // Load profile information
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
      
        //tweets of the user you are viewing
        const userTweets = await getAllTweets();
        const filteredTweets = userTweets.filter(
          t => t.username === profile.username
        );
        setTweets(filteredTweets);

        // followers/following counters
        const { followers, following } = await fetchCounts(profile.username);
        setFollowersCount(followers);
        setFollowingCount(following);

        // check if the current user is already following
        const followingStatus = await isFollowing(currentUser.username, profile.username);
        setIsUserFollowing(followingStatus);

        // get likes of the current user
        const likedIds = await getUserLikedTweets(currentUser.username);
        const likedMap = likedIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});
        setLikedTweets(likedMap);
      } catch (error) {
        console.error('Error loading other profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Like / Unlike tweet
  const handleLike = async tweetId => {
    try {
      const alreadyLiked = likedTweets[tweetId];
      const incrementValue = alreadyLiked ? -1 : 1;

      await updateTweetLikes(tweetId, incrementValue);

      if (alreadyLiked) {
        await removeUserLike(tweetId, currentUser.username);
      } else {
        await addUserLike(tweetId, currentUser.username);
      }

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
      console.error('Error liking tweet:', error);
    }
  };

  // Follow / Unfollow
  const handleFollowToggle = async () => {
    try {
      if (isUserFollowing) {
        await unfollowUser(currentUser.username, profile.username);
        setFollowersCount(prev => prev - 1);
      } else {
        await followUser(currentUser.username, profile.username);
        setFollowersCount(prev => prev + 1);
      }
      setIsUserFollowing(!isUserFollowing);
    } catch (error) {
      console.error('error while following:', error);
    }
  };

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
      {/* Header */}
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

      {/* Profile */}
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

        {/* Follow / Unfollow */}
        <Button
          mode={isUserFollowing ? 'contained-tonal' : 'contained'}
          onPress={handleFollowToggle}
          style={{
            backgroundColor: isUserFollowing ? '#ccc' : '#4CAF50',
            marginTop: 10,
          }}
        >
          {isUserFollowing ? 'Unfollow' : 'Follow'}
        </Button>

        {/* Seguidores */}
        <View style={styles.followContainer}>
          <Text style={styles.followText}>
            <Text style={styles.followCount}>{followingCount}</Text> following
          </Text>
          <Text style={styles.followText}>
            <Text style={styles.followCount}>{followersCount}</Text> followers
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tweets</Text>

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
    </View>
  );
};

export default ViewOtherProfile;
