import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent = 'react-native';

const image = require("./src/background.png")
const enterRoomImage = require("./src/enter-room.jpg")
const createRoomImage = require("./src/create-room.jpg")

export default function Entry({ socket }) {
  const navigator = useNavigation()
  const route = useRoute()

  console.log("Createroom.js: ", socket.id);

  const [roomName, setRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")



  function enterRoomHandler() {
    if (roomName === "") {
      console.log("Invalid room name.");
      Alert.alert("Invalid room name", "Room name cannot be an empty string.")
    }
    else {
      socket.emit("enter room", { roomName, roomPassword })
      socket.on("enter room confirmation", () => {
        navigator.navigate("SelectTeam")
      })
      socket.on("wrong room name", () => {
        Alert.alert("Invalid room name", "No room has been found with this room name.")
      })

      socket.on("wrong password", () => {
        Alert.alert("Invalid password")
      })

      socket.on("game already started in this room", () => {
        Alert.alert("Warning", "You can't join this room since the game has already started.")
      })
    }
  }

  function createRoomHandler() {

    console.log("pressed create room handler");

    if (roomName === "") {
      console.log("Invalid room name.");
      Alert.alert("Invalid room name", "Room name cannot be an empty string.")
    }
    else {
      socket.emit("create room", { roomName, roomPassword })
      socket.on("create room confirmation", () => {
        console.log("Navigation to the game screen...");
        navigator.navigate("SelectTeam")
      })
    }
  }

  const [loaded] = useFonts({
    Caveat: require('../assets/fonts/Caveat-VariableFont_wght.ttf'),
    Abel: require("../assets/fonts/Abel-Regular.ttf")
  });
  if (!loaded) {
    return null;
  }

  return (

    <ImageBackground source={image} resizeMode="cover" style={styles.backgroundContainer}>

      <KeyboardAwareScrollView style={styles.keyboardAwareView}>

        <View style={styles.createAndEnterView}>

          <View style={styles.enterRoom}>

            <Text style={{ fontFamily: "Caveat", fontSize: 40 }}>Enter Room</Text>

            <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
              <Text style={{ fontFamily: "Caveat", fontSize: 30, }}>Room Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => { setRoomName(text) }}
              />
            </View>

            <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
              <Text style={{ fontFamily: "Caveat", fontSize: 30, marginRight: 22 }}>Password:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => { setRoomPassword(text) }}
              />
            </View>

            <TouchableOpacity onPress={enterRoomHandler} style={{ backgroundColor: "green", borderRadius: 20, padding: 6, width: 70, alignItems: "center", }}>

              <Text style={{ fontSize: 20, fontFamily: "Abel", color: "white" }}>Enter</Text>

            </TouchableOpacity>

          </View>

          <View style={styles.createRoom}>
            <Text style={{ fontFamily: "Caveat", fontSize: 40, color: "white" }}>Create Room</Text>

            <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
              <Text style={{ fontFamily: "Caveat", fontSize: 30, color: "white" }}>Room Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => { setRoomName(text) }}
              />
            </View>

            <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
              <Text style={{ fontFamily: "Caveat", fontSize: 30, marginRight: 22, color: "white" }}>Password:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => { setRoomPassword(text) }}
              />
            </View>

            <TouchableOpacity onPress={createRoomHandler} style={{ backgroundColor: "green", borderRadius: 20, padding: 6, width: 70, alignItems: "center", }}>

              <Text style={{ fontSize: 20, fontFamily: "Abel", color: "white" }}>Create</Text>

            </TouchableOpacity>
          </View>

        </View>

      </KeyboardAwareScrollView>

    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
    width: null,
  },
  createAndEnterView: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 13,
    flex: 1
  },
  keyboardAwareView: {
    width: "100%",
    height: "100%"
  },
  text: {
    fontFamily: "Abel"
  },
  enterRoom: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FDDEFF",
    width: 280,
    height: 290,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 4,
  },

  createRoom: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#543d7c",
    width: 280,
    height: 290,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 4,
  },
  input: {
    width: 130,
    height: 30,
    backgroundColor: "#FFF6FE",
    textAlign: "center",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 20,
    fontFamily: "Abel"
  }
});
