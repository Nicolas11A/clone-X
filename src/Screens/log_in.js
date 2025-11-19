import React, { useState, useEffect } from 'react';
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
      Alert.alert('Warning', 'Fields marked with * are required');
      return;
    }

    getProfileByUsername(profileUser.username)
      .then(fetchedProfile => {
        if (!fetchedProfile) {
          Alert.alert('Error', 'The username or password is incorrect');
          return;
        }

        if (fetchedProfile.password === profileUser.password) {
          navigation.navigate('home', { profile: fetchedProfile });
        } else {
          Alert.alert('Error', 'The username or password is incorrect');
        }
      })
      .catch(error => {
        console.error('Error obtaining profile:', error);
        Alert.alert('Error', 'We were unable to log in.');
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
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
              textColor={'black'}
            />
            <Button mode="contained" onPress={handleLogin} style={styles.button_}>
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
                Log In
              </Text>
            </Button>
            <Button mode="text" onPress={handleSignUpNavigation} style={styles.buttonSignUp}>
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
