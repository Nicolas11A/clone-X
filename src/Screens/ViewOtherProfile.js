import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Card, Avatar, Button, Divider } from 'react-native-paper';
import { db } from '../Config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import styles from '../Styles/styles_viewOtherProfile';

const ViewOtherProfile = ({ route, navigation }) => {
  const { user, currentUser } = route.params; // currentUser = usuario logeado
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfFollowing();
  }, []);

  const checkIfFollowing = async () => {
    try {
      const q = query(
        collection(db, 'followers'),
        where('followerId', '==', currentUser.id),
        where('followingId', '==', user.id)
      );
      const snapshot = await getDocs(q);
      setIsFollowing(!snapshot.empty);
    } catch (err) {
      console.log('Error verificando seguimiento:', err);
    }
  };

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // dejar de seguir
        const q = query(
          collection(db, 'followers'),
          where('followerId', '==', currentUser.id),
          where('followingId', '==', user.id)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          await deleteDoc(doc(db, 'followers', snapshot.docs[0].id));
        }

        setIsFollowing(false);
        Alert.alert('you have followed', `@${user.username}`);
      } else {
        // seguir usuario
        await addDoc(collection(db, 'followers'), {
          followerId: currentUser.id,
          followingId: user.id,
        });

        setIsFollowing(true);
        Alert.alert('Ahora sigues a', `@${user.username}`);
      }
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={user.name ? user.name[0].toUpperCase() : '?'}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user.name} {user.lastName}
        </Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Información</Text>
          <Divider style={styles.divider} />
          <Text style={styles.field}>Correo: {user.email}</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          loading={loading}
          onPress={handleFollow}
          style={[styles.button, { backgroundColor: isFollowing ? '#e53935' : '#4CAF50' }]}
        >
          {isFollowing ? 'Dejar de seguir' : 'Seguir'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.buttonBack}
          textColor="#4CAF50"
        >
          Volver
        </Button>
      </View>
    </ScrollView>
  );
};

export default ViewOtherProfile;
