import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button, Card } from 'react-native-paper';
import styles from '../Styles/styles_tweets';
import { createTweet } from '../Config/firebaseServices';

const Tweets = ({ navigation, route }) => {
  const { profile } = route.params; // usuario conectado
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (content.trim() === '') {
      Alert.alert('Advertencia', 'El tweet no puede estar vacío');
      return;
    }

    if (content.length > 280) {
      Alert.alert('Advertencia', 'El tweet no puede exceder los 280 caracteres');
      return;
    }

    try {
      setLoading(true);

      const tweetData = {
        name: profile.name,
        lastName: profile.lastName,
        username: profile.username,
        content,
      };

      await createTweet(tweetData);
      Alert.alert('Éxito', 'Tu tweet ha sido publicado');
      setContent('');
      navigation.navigate('home', { profile });
    } catch (error) {
      console.error('Error publicando tweet:', error);
      Alert.alert('Error', 'No se pudo publicar el tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.navigate('home', { profile });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Tweet</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.textInput}
            placeholder="What’s happening?"
            multiline
            numberOfLines={6}
            maxLength={280}
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{content.length}/280</Text>

          <Button
            mode="contained"
            onPress={handlePublish}
            style={styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Publishing...' : 'Publish'}
            </Text>
          </Button>

          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Tweets;
