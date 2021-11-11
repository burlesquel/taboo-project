import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,Alert, SafeAreaView, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

window.navigator.userAgent = 'react-native';

const image = require("./src/background.png")
// const image = { uri: "https://i.imgur.com/4N3bsAT.png" }


export default function Entry({ socket}) {

  const [username, setName] = useState("")

  const navigation = useNavigation()
  const route = useRoute()

  const [loaded] = useFonts({
    Caveat: require('../assets/fonts/Caveat-VariableFont_wght.ttf'),
    Abel: require("../assets/fonts/Abel-Regular.ttf")
  });
  if (!loaded) {
    return null;
  }
  return (

    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <ImageBackground source={image} resizeMode="cover" style={styles.backgroundContainer}>

        
          <>

            <View style={styles.container}>

              <Text style={styles.text}>Select a username: </Text>

              <TextInput style={styles.input} onChangeText={(value) => { setName(value) }}></TextInput>

              <TouchableOpacity style={styles.clickButton} onPress={() => {
                console.log(username);
                if(username === "" || username === null){
                  Alert.alert("Invalid username", "Please choose a valid username.")
                }
                else{
                  socket.emit("send username", username)
                  socket.on("username confirmed",()=>{
                    navigation.navigate("CreateRoom", username)
                  })
                  socket.on("username rejected",()=>{
                    Alert.alert("Username", "This username has been taken before.")
                  })
                  
                }

              }}>
                <Text style={styles.text}>Click</Text>
              </TouchableOpacity>

            </View>
          </>

      </ImageBackground>

    // </TouchableWithoutFeedback>



  );
}

const styles = StyleSheet.create({

  container: {
    display: "flex",
    width: 280,
    flex: 1,
    backgroundColor: '#FDDEFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 35,
    marginBottom: 35,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  backgroundContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "stretch",
    width: null,
  },
  text: {
    fontSize: 40,
    fontFamily: "Caveat"
  },
  clickButton: {
    borderColor: "black",
    borderWidth: 2,
    paddingEnd: 12,
    padding: 5,
    borderStyle: "dotted",
    borderRadius: 10
  },
  input: {
    width: 200,
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
