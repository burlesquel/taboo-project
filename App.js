import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateRoom from "./components/CreateRoom"
import Game from "./components/Game"
import Entry from "./components/Entry"
import SelectTeam from "./components/SelectTeam"

const Stack = createNativeStackNavigator();

import io from 'socket.io-client/dist/socket.io';

window.navigator.userAgent = 'react-native';

const connectionConfig = {
  jsonp: false,
  reconnection: true,
  transports: ['websocket'],
};

export default function App({ navigation }) {


  // socket = io("https://taboo-react-server.herokuapp.com", connectionConfig);
  socket = io("http://13.1.0.230:3000", connectionConfig)

  socket.on('connect', function () {
    console.log('Socket connected! (App.js)', socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected! (App.js):", socket.id);
  });

  const EntryWithSocket = () => (<Entry socket={socket} />)
  const CreateRoomWithSocket = () => (<CreateRoom socket={socket} />)
  const GameWithSocket = () => (<Game socket={socket} />)
  const SelectTeamWithSocket = () => (<SelectTeam socket={socket} />)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen
          name="Entry"
          component={EntryWithSocket}
          options={{
            title: "Welcome",
             headerStyle: {
              backgroundColor: '#FFCCFA'
            },
            
            
          }}

        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomWithSocket}
          options={{
            title: "Create Room",
            headerStyle: {
              backgroundColor: '#FFCCFA'
            }
          }}
          

        />
        <Stack.Screen
          name="SelectTeam"
          component={SelectTeamWithSocket}
          options={{
            headerShown:false,
            gestureEnabled: false
          }}

        />
        <Stack.Screen
          name="Game"
          component={GameWithSocket}
          options={{
            headerShown:false,
            gestureEnabled: false
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

