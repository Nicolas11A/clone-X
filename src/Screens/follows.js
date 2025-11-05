import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import styles from '../Styles/styles_search';
import {
  getFollowingList,
  getProfileByUsername,
  isFollowing,
  followUser,
  unfollowUser,
} from '../Config/firebaseServices';

const Follows = ({ navigation, route }) => {
  const { profile, currentUser } = route.params; 
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [followingStatus, setFollowingStatus] = useState({});

  // get following list
  useEffect(() => {
    const fetchFollowing = async () => {
      setLoading(true);
      try {
        const followingUsernames = await getFollowingList(profile.username);

        // get full profiles of following users
        const profilesPromises = followingUsernames.map(username =>
          getProfileByUsername(username)
        );
        const profiles = await Promise.all(profilesPromises);

        // Sort alphabetically by full name
        const sortedProfiles = profiles
          .filter(Boolean)
          .sort((a, b) =>
            (a.name + ' ' + a.lastName).localeCompare(b.name + ' ' + b.lastName)
          );

        setFollowing(sortedProfiles);

        // Check if the current user follows each one
        const statusPromises = sortedProfiles.map(p =>
          isFollowing(currentUser.username, p.username)
        );
        const statuses = await Promise.all(statusPromises);
        const statusMap = {};
        sortedProfiles.forEach((p, i) => {
          statusMap[p.username] = statuses[i];
        });
        setFollowingStatus(statusMap);
      } catch (error) {
        console.error('Error cargando seguidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  // Change Follow/Unfollow state
  const handleFollowToggle = async username => {
    try {
      const alreadyFollowing = followingStatus[username];
      if (alreadyFollowing) {
        await unfollowUser(currentUser.username, username);
      } else {
        await followUser(currentUser.username, username);
      }
      setFollowingStatus(prev => ({
        ...prev,
        [username]: !alreadyFollowing,
      }));
    } catch (error) {
      console.error('Error cambiando estado de follow:', error);
    }
  };

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFollowing = following.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < following.length) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Go to another user's profile
  const handleOpenProfile = user => {
    navigation.navigate('ViewOtherProfile', {
      profile: user, // profile of the tapped user
      currentUser,   // logged-in user
    });
  };

  const renderFollowing = ({ item }) => (
    <TouchableOpacity onPress={() => handleOpenProfile(item)}>
      <Card style={styles.cardUser}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={styles.userName}>
              {item.name} {item.lastName}
            </Text>
            <Text style={styles.userUsername}>@{item.username}</Text>
          </View>
          {item.username !== currentUser.username && (
            <Button
              mode={followingStatus[item.username] ? 'contained-tonal' : 'contained'}
              onPress={() => handleFollowToggle(item.username)}
              style={{
                backgroundColor: followingStatus[item.username] ? '#ccc' : '#4CAF50',
                borderRadius: 8,
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            >
              {followingStatus[item.username] ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Following</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : following.length === 0 ? (
        <Text style={styles.noResults}>No following yet.</Text>
      ) : (
        <>
          <FlatList
            data={paginatedFollowing}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowing}
          />

          {/* Pagination controls */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
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
              disabled={endIndex >= following.length}
              onPress={nextPage}
              style={{
                backgroundColor:
                  endIndex >= following.length ? '#ccc' : '#4CAF50',
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
    </View>
  );
};

export default Follows;
