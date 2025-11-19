import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {PaperProvider} from 'react-native-paper';
import sign_up from './src/Screens/sign_up';
import log_in from './src/Screens/log_in';
import search from './src/Screens/search';
import view_Profile from './src/Screens/view_Profile';
import home from './src/Screens/home';
import tweets from './src/Screens/tweets';
import ViewOtherProfile from './src/Screens/ViewOtherProfile';
import followers from './src/Screens/followers';
import follows from './src/Screens/follows';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="log_in">
          <Stack.Screen
            name="log_in"
            component={log_in}
            options={{ title: 'login' }}
          />
          <Stack.Screen
            name="sign_up"
            component={sign_up}
            options={{ title: 'Create profile' }}
          />
          <Stack.Screen
            name="home"
            component={home}
            options={{ title: 'Home' }}
          />
          <Stack.Screen
            name="tweets"
            component={tweets}
            options={{ title: 'Tweets' }}
          />
          <Stack.Screen
            name="search"
            component={search}
            options={{ title: 'search user' }}
          />
          <Stack.Screen
            name="ViewOtherProfile"
            component={ViewOtherProfile}
            options={{ title: 'another users profile' }}
          />
          <Stack.Screen
            name="view_Profile"
            component={view_Profile}
            options={{ title: 'user profile' }}
          />
          <Stack.Screen
            name="followers"
            component={followers}
            options={{ title: 'Followers' }}
          />
          <Stack.Screen
            name="follows"
            component={follows}
            options={{ title: 'Follows' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );

}