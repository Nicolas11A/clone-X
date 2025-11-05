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
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [likedTweets, setLikedTweets] = useState({});
  const [isUserFollowing, setIsUserFollowing] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleSearch = () => navigation.navigate('search', { profile: currentUser });
  const handleLogin = () => navigation.navigate('log_in');
  const handleBackHome = () => navigation.navigate('home', { profile: currentUser });
  const handleFollowers = () =>
    navigation.navigate('followers', { profile, currentUser });
  const handleFollows = () =>
    navigation.navigate('follows', { profile, currentUser });

  // Load profile data
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

        const followingStatus = await isFollowing(currentUser.username, profile.username);
        setIsUserFollowing(followingStatus);

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

  // Like / Unlike
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
      console.error('Error following/unfollowing:', error);
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

  // Pagination logic
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTweets = tweets.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < tweets.length) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
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

      {/* Profile information */}
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

        {/*  Follow / Unfollow */}
        <Button
          mode={isUserFollowing ? 'contained-tonal' : 'contained'}
          onPress={handleFollowToggle}
          style={{
            backgroundColor: isUserFollowing ? '#ccc' : '#4CAF50',
            marginTop: 10,
          }}
          textColor="#fff"
        >
          {isUserFollowing ? 'Unfollow' : 'Follow'}
        </Button>

        {/* Followers / Follows */}
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

      {/* List of tweets with pagination */}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
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
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Previous</Text>
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
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ViewOtherProfile;
