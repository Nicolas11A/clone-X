import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {PaperProvider} from 'react-native-paper';
import sign_up from './src/Screens/sign_up';
import log_in from './src/Screens/log_in';
import search from './src/Screens/search';
import ViewProfile from './src/Screens/view_Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="log_in">
          <Stack.Screen
            name="log_in"
            component={log_in}
            options={{ title: 'Iniciar Sesion' }}
          />
          <Stack.Screen
            name="sign_up"
            component={sign_up}
            options={{ title: 'Crear Perfil' }}
          />
          <Stack.Screen
            name="search"
            component={search}
            options={{ title: 'Buscar Usuarios' }}
          />
          <Stack.Screen
            name="view_Profile"
            component={ViewProfile}
            options={{ title: 'Perfil de Usuario' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );

}