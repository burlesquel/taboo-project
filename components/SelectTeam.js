import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

window.navigator.userAgent = 'react-native';
const image = require("./src/background.png")

var team1IsEmpty = false
var team2IsEmpty = false



export default function Entry({ socket }) {

    const navigation = useNavigation()
    const route = useRoute()

    const [usersInTheRoom, setUsersInTheRoom] = useState([])
    const [usersOfTeam1, setUsersOfTeam1] = useState([])
    const [usersOfTeam2, setUsersOfTeam2] = useState([])

    function Users({ team }) {
        if (team === 1) {
            if (usersOfTeam1.length === 0) {
                return (<Text>(Empty)</Text>)
            }
            else {
                return (<FlatList
                    data={usersOfTeam1}
                    renderItem={({ item }) => (
                        <Text>{item.username}</Text>
                    )}
                />)
            }
        }
        else if (team === 2) {
            if (usersOfTeam2.length === 0) {
                return (<Text>(Empty)</Text>)
            }
            else {
                return (<FlatList
                    data={usersOfTeam2}
                    renderItem={({ item }) => (
                        <Text>{item.username}</Text>
                    )}
                />)
            }
        }
        else {
            return (<Text>ANAN</Text>)
        }
    }

    socket.on("update users", ({ users, team1, team2 }) => { // receives the teams information from the server
        setUsersOfTeam1(team1)
        setUsersOfTeam2(team2)
        setUsersInTheRoom(users)
    })

    const [loaded] = useFonts({
        Caveat: require('../assets/fonts/Caveat-VariableFont_wght.ttf'),
        Abel: require("../assets/fonts/Abel-Regular.ttf")
    });
    if (!loaded) {
        return null;
    }
    return (

        <ImageBackground source={image} resizeMode="cover" style={styles.backgroundContainer}>
            <SafeAreaView>
                <View style={styles.teamsContainer}>

                    <View style={styles.team}>
                        <View style={styles.userList}>
                            <Text style={styles.teamsTexts}>TEAM 1</Text>
                            <Users team={1} />
                        </View>

                        <View style={styles.joinInteractive}>
                            <TouchableOpacity
                                onPress={() => {
                                    socket.emit("team selected", { team: 1 })
                                    navigation.navigate("Game")
                                    
                                }}>
                                <Text style={{ fontFamily: "Abel", fontSize: 30 }}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.team}>
                        <View style={styles.userList}>
                            <Text style={styles.teamsTexts}>TEAM 2</Text>
                            <Users team={2} />
                        </View>

                        <View style={styles.joinInteractive}>
                            <TouchableOpacity
                                onPress={() => {
                                    socket.emit("team selected", { team: 2 })
                                    navigation.navigate("Game")
                                    
                                }}>

                                <Text style={{ fontFamily: "Abel", fontSize: 30 }}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </ImageBackground>


    );
}


const styles = StyleSheet.create({

    backgroundContainer: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "stretch",
        width: null,
        display: "flex"
    },
    teamsTexts: {
        fontFamily: "Caveat",
        fontSize: 40
    },
    teamsContainer: {
        flex: 0.98,
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignContent: "center",
        alignItems: "center"

    },
    team: {
        backgroundColor: "#FDDEFF",
        flex: 1,
        width: "84%",
        borderRadius: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        alignContent: "center",

    },
    userList: {
        flex: 0.6,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: 10,
    },
    joinInteractive: {
        flex: 0.3,
        backgroundColor: "green",
        alignItems: "center",
        paddingVertical: "2%",
        borderRadius: 20,
    },
    username: {
        fontFamily: "Abel",
        fontSize: 20
    }
});
