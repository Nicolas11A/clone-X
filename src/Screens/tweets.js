import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../Styles/styles_tweets';
import { createTweet, uploadTweetImage } from '../Config/firebaseServices';

const Tweets = ({ navigation, route }) => {
  const { profile } = route.params;
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  
  //Pick image from gallery
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }
        
        if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
          Alert.alert('Error', 'Could not select the image');
          return;
        }
        
        if (response.assets && response.assets[0]) {
          console.log('Image selected:', response.assets[0]);
          setImage(response.assets[0]);
        }
      },
    );
  };

  const handlePublish = async () => {
    // Validations
    if (!content.trim() && !image) {
      Alert.alert('Error', 'The tweet cannot be empty');
      return;
    }
    
    if (content.length > 280) {
      Alert.alert('Error', 'Maximum 280 characters');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      
      let imageUrl = null;

      // Upload image if selected
      if (image) {
        console.log('Uploading image...');
        
        imageUrl = await uploadTweetImage(
          image,
          profile.username,
          (progress) => {
            console.log(`Progress: ${progress}%`);
            setUploadProgress(progress);
          }
        );
        
        console.log('Image uploaded:', imageUrl);
      }

      // Create tweet
      console.log('Creating tweet...');
      await createTweet({
        name: profile.name,
        lastName: profile.lastName,
        username: profile.username,
        content: content.trim(),
        imageUrl,
      });

      console.log('Tweet created successfully');

      Alert.alert(
        'Success',
        'Tweet published successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              setContent('');
              setImage(null);
              setUploadProgress(0);
              navigation.navigate('home', { profile });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error publishing tweet:', error);
      
      let errorMessage = 'Could not publish the tweet';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Tweet</Text>

      <Card style={styles.card}>
        <Card.Content>
          {/* Tweet Input */}
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

          {/* Image Preview */}
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 10,
                marginBottom: 15,
                marginTop: 10,
              }}
              resizeMode="cover"
            />
          )}

          {/* Pick Image Button */}
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {image ? 'Change Image' : 'Add Image'}
            </Text>
          </TouchableOpacity>

          {/* Publish */}
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

          {/* Cancel */}
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('home', { profile })}
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
