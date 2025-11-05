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
      Alert.alert('Warning', 'All fields marked with * are required and the email must contain "@"');
      return;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert('Error', 'This email is already registered. Try another one.');
        return;
      }
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        Alert.alert('Error', 'This username is already taken. Please choose another one.');
        return;
      }

      const profileUser = { name, lastName, email, username, password };
      await createProfile(profileUser);

      Alert.alert('Success', 'Profile created successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('log_in', { profile: profileUser });
            navigation.navigate('home', { profile: profileUser });
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Profile could not be created.');
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
          <Text style={styles.title}>Create account</Text>
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
                  onPress={() => setHidePassword(!hidePassword)}
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