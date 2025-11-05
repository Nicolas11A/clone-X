import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Card } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Config/firebase';
import styles from '../Styles/styles_search'; 

const Search = ({ navigation, route }) => {
  const { profile } = route.params;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // search users when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'profiles');

        // Search by username or name
        const q1 = query(usersRef, where('username', '>=', searchTerm), where('username', '<=', searchTerm + '\uf8ff'));
        const q2 = query(usersRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));

        const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const users = [...snapshot1.docs, ...snapshot2.docs].map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Remove duplicates
        const uniqueUsers = users.filter(
          (user, index, self) => index === self.findIndex(u => u.username === user.username)
        );

        setResults(uniqueUsers);
      } catch (error) {
        console.error('Error buscando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(fetchUsers, 400);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // when user presses on a user card
  const handleUserPress = (user) => {
    if (user.username === profile.username) {
      // If it's the logged-in user → view their own profile
      navigation.navigate('view_Profile', { profile });
    } else {
      // If it's another user → view their profile
      navigation.navigate('ViewOtherProfile', { profile: user, currentUser: profile });
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <Card style={styles.cardUser}>
        <View>
          <Text style={styles.userName}>{item.name} {item.lastName}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Users</Text>

      <TextInput
        placeholder="Search by name or username"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
        placeholderTextColor="#999"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          ListEmptyComponent={
            searchTerm.trim() !== '' && (
              <Text style={styles.noResults}>No users found</Text>
            )
          }
        />
      )}
    </View>
  );
};

export default Search;
