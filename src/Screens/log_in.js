import React, { useState, useEffect, use } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Alert } from 'react-native';
import { Card, Avatar, TextInput, Button } from 'react-native-paper';
import styles from '../Styles/styles_login';
import logo from '../Images/logo.png';
import { getProfileByUsername } from '../Config/firebaseServices';

const log_in = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formValid, setformValid] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const profileUser = { name: '', lastName: '', email, username, password };

  useEffect(() => {
    const isValid =
      profileUser.username.trim() !== '' && profileUser.password.trim() !== '';
    setformValid(isValid);
  }, [profileUser.username, profileUser.password]);

  const handleLogin = () => {
    if (!formValid) {
      Alert.alert('Advertencia', 'los campos con * son obligatorios', [
        { text: 'OK' },
      ]);
      return;
    }
    //comprobar si el email y password coinciden con los del perfil creado
    //y si es asi, navegar al menu principal

    getProfileByUsername(profileUser.username)
      .then(fetchedProfile => {
        if (!fetchedProfile) {
          // Caso: el correo no existe en la base de datos
          Alert.alert('Error', 'El correo o contraseña son incorrectos', [
            { text: 'OK' },
          ]);
          return;
        }

        if (fetchedProfile.password === profileUser.password) {
          //navegar al menu principal
          navigation.navigate('home', { profile: fetchedProfile });
        } else {
          Alert.alert('Error', 'El correo o contraseña son incorrectos', [{ text: 'OK' }]);
        }
      })
      .catch(error => {
        console.error('Error obteniendo perfil:', error);
        Alert.alert('Error', 'No se pudo iniciar sesión.', [{ text: 'OK' }]);
      });
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('sign_up');
  };

  return (
    <View>
      <ScrollView>
        <View>
          <Image source={logo} style={styles.image} />
          <Text style={styles.title}>Log in</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label={'* Username'}
              value={profileUser.username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              textColor={'black'}
            />
            <TextInput
              label={'* Password'}
              value={profileUser.password}
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
              textColor={'black'}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button_}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
                Log In
              </Text>
            </Button>
            <Button
              mode="text"
              onPress={handleSignUpNavigation}
              style={styles.buttonSignUp}
            >
              <Text style={styles.buttonTextSignUp}>
                Don't have an account? Sign Up
              </Text>
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};
export default log_in;
