import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import styles from '../Styles/styles_signup';
import logo from '../Images/logo.png';
import { createProfile, checkEmailExists, checkUsernameExists } from '../Config/firebaseServices';

const sign_up = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      name.trim() !== '' &&
      lastName.trim() !== '' &&
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      email.includes('@');
    setFormValid(isValid);
  }, [name, lastName, email, username, password]);

  const handleSave = async () => {
    if (!formValid) {
      Alert.alert('Advertencia', 'Todos los campos con * son obligatorios y el correo debe contener "@"');
      return;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert('Error', 'Este correo ya está registrado. Intenta con otro.');
        return;
      }
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        Alert.alert('Error', 'Este nombre de usuario ya está en uso. Elige otro.');
        return;
      }

      const profileUser = { name, lastName, email, username, password };
      await createProfile(profileUser);

      Alert.alert('Éxito', 'Perfil creado con éxito', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('log_in', { profile: profileUser });
            //navigation.navigate('main_menu', { profile: profileUser });
          },
        },
      ]);
    } catch (error) {
      console.error('Error creando perfil:', error);
      Alert.alert('Error', 'No se pudo crear el perfil.');
    }
  };

  const handleBackLogin = () => {
    navigation.navigate('log_in');
  }

  return (
    <View>
      <ScrollView>
        <View>
          <Image source={logo} style={styles.image} />
          <Text style={styles.title}>Crear Cuenta</Text>
        </View>

        <Card style={styles.Card}>
          <Card.Content>
            <TextInput
              label="* Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              textColor='black'
            />
            <TextInput
              label="* Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              mode="outlined"
              textColor='black'
            />
            <TextInput
              label="* Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              textColor='black'
            />
            <TextInput
              label="* Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              textColor='black'
            />
            <TextInput
              label="* Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              style={styles.input}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={hidePassword ? 'eye-off' : 'eye'}
                  onPress={() => setHidePassword(!hidePassword)} // 👁 alternar visibilidad
                />
              }
              textColor='black'
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Save Profile</Text>
            </Button>
            <Button
              mode="text"
              onPress={handleBackLogin}
              style={styles.buttonLogIn}
            >
              <Text style={styles.buttonTextLogIn}>Back to Login</Text>
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default sign_up;