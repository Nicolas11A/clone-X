import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Avatar, Text, Button, Divider } from 'react-native-paper';
import styles from '../Styles/styles_viewProfile';
import { getProfileByUsername } from '../Config/firebaseServices';

const ViewProfile = ({ route, navigation }) => {
  const { profile } = route.params;
  const [userData, setUserData] = useState(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileByUsername(profile.username);
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    fetchProfile();
  }, [profile.username]);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        onPress: () => navigation.navigate('log_in'),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={userData.name ? userData.name[0] : '?'}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {userData.name} {userData.lastName}
        </Text>
        <Text style={styles.username}>@{userData.username}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <Divider style={styles.divider} />
          <Text style={styles.field}>Email: {userData.email}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Actividad</Text>
          <Divider style={styles.divider} />
          <Text>Publicaciones: 0</Text>
          <Text>Seguidores: 0</Text>
          <Text>Seguidos: 0</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttons}>
        {/*boton de edit_profile*
        <Button
          mode="contained"
          onPress={() => navigation.navigate('edit_profile', { profile: userData })}
          style={styles.button}
        >
          Editar perfil
        </Button>*/}

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.buttonLogout}
        >
          Cerrar sesión
        </Button>
      </View>
    </ScrollView>
  );
};

export default ViewProfile;