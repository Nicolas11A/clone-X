import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Config/firebase';
import styles from '../Styles/styles_search'; 

const search = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar usuarios a medida que el texto cambia
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'profiles');

        // Buscar por username y por nombre
        const q1 = query(usersRef, where('username', '>=', searchTerm), where('username', '<=', searchTerm + '\uf8ff'));
        const q2 = query(usersRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));

        const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const users = [...snapshot1.docs, ...snapshot2.docs].map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Eliminar duplicados
        const uniqueUsers = users.filter(
          (user, index, self) => index === self.findIndex(u => u.username === user.username)
        );

        setResults(uniqueUsers);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(fetchUsers, 400); // Espera breve al escribir
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleUserPress = (user) => {
    //ver el perfil del usuario seleccionado
    navigation.navigate('view_Otherprofile', { user });
    Alert.alert('User Selected', `You selected ${user.name} (@${user.username})`);
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

export default search;
