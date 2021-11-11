import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent = 'react-native';

const image = require("./src/background.png")

var wordsKey = -1
var counter = 91

const keyExtractor = () => {
    wordsKey = wordsKey + 1
    return String(wordsKey)
}

export default function Entry({ socket }) {
    const navigator = useNavigation()
    const route = useRoute()

    const [usersOfTeam1, setUsersOfTeam1] = useState([])
    const [usersOfTeam2, setUsersOfTeam2] = useState([])
    const [theWord, setTheWord] = useState(null)
    const [gameStatus, setGameStatus] = useState("not enough users")
    const [scoreOfTeam1, setScoreOfTeam1] = useState("SCORE")
    const [scoreOfTeam2, setScoreOfTeam2] = useState("SCORE")
    const [totalUsers, setTotalUsers] = useState(0)
    const [numberOfVotes, setNumberOfVotes] = useState(0)
    const [startText, setStartText] = useState("START")
    const [startDisabled, setStartDisabled] = useState(false)
    const [timeCounter, setTimeCounter] = useState(90)

    useEffect(() => {
        socket.emit("game screen")
        socket.on("game can start", () => {
            socket.on("start counter", () => {
                var timer = setInterval(() => {
                    counter = counter - 1
                    setTimeCounter(counter)
                    socket.on("stop counter",()=>{
                        counter = 0
                    })
                    if (counter === 0) {
                        clearInterval(timer)
                        Alert.alert("timer done")
                        setTimeCounter(90)
                        counter = 90
                        setStartDisabled(false)
                        setGameStatus("initial screen")
                        socket.emit("game screen")
                    }
                }, 1000);
            })

            socket.on("your turn", () => {
                console.log("Game initialized.");
                socket.emit("words request")

                socket.on("send words", (receivedTheWord) => {
                    console.log("send words received");
                    setTheWord(receivedTheWord)
                    setGameStatus("your turn")
                })
            })

            socket.on("your team's turn", () => {
                setGameStatus("your team's turn")
            })

            socket.on("opposite team's turn", () => {
                setGameStatus("opposite team's turn")
            })

            socket.emit("game can start feedback")
        })
    }, []);

    console.log("Game.js: ", socket.id);

    function Users({ team }) {
        if (team === 1) {
            if (usersOfTeam1.length === 0) {
                return (<Text>(Empty)</Text>)
            }
            else {
                return (<FlatList
                    data={usersOfTeam1}
                    renderItem={({ item }) => (
                        <Text style={{ fontFamily: "Abel", fontSize: 18 }}>{item.username}</Text>
                    )}
                />)
            }
        }
        else if (team === 2) {
            if (usersOfTeam2.length === 0) {
                return (<Text style={{ fontFamily: "Abel" }}>(Empty)</Text>)
            }
            else {
                return (<FlatList
                    data={usersOfTeam2}
                    renderItem={({ item }) => (
                        <Text style={{ fontFamily: "Abel", fontSize: 20 }}>{item.username}</Text>
                    )}
                />)
            }
        }
        else {
            return (<Text style={{ fontFamily: "Abel" }}>ERROR</Text>)
        }
    }

    function MainScreen() {
        console.log("Main screen rendered");
        if (gameStatus === "your turn" || gameStatus === "opposite team's turn") {
            return (

                <View style={styles.mainWordsContainer}>

                    <View style={styles.theWordContainer}>
                        <Text style={{ fontFamily: "Abel", fontSize: 25, fontWeight: "bold" }} adjustsFontSizeToFit numberOfLines={2}>{theWord.word}</Text>
                        <Text style={{ fontFamily: "Abel", fontSize: 25 }}> {timeCounter}</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={styles.forbiddenWordsContainer}
                        data={theWord.forbiddenWords}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => (
                            <View style={{ borderColor: "black", borderWidth: 2, paddingHorizontal: 4 }}>
                                <Text style={{ fontFamily: "Abel", color: "red", fontSize: 25 }} adjustsFontSizeToFit numberOfLines={1}>{item}</Text>
                            </View>
                        )}
                    />
                </View>

            )
        }

        else if (gameStatus === "your team's turn") {
            return (
                <View style={styles.mainWordsContainerPreGame}>
                    <Text style={{ fontSize: 40 }}>YOUR TEAM'S TURN</Text>
                </View>)
        }

        else if (gameStatus === "voting screen" || gameStatus === "not enough users" || gameStatus === "pressed start screen") {
            return (
                <View style={styles.mainWordsContainerPreGame}>
                    <Text style={{ fontSize: 40 }}>{numberOfVotes} / {totalUsers}</Text>
                </View>
            )
        }

    }

    function Buttons() {

        if (gameStatus === "your turn") {
            return (<View style={styles.mainInteractiveContainer}>
                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#A4FF00" }]}
                    onPress={
                        () => {
                            socket.emit("pressed correct")
                        }
                    }
                >
                    <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>CORRECT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#DAF7A6" }]}
                    onPress={
                        () => {
                            socket.emit("pressed pass")
                        }}
                >
                    <View>
                        <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>PASS</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#8B0000" }]}
                    onPress={() => {
                        socket.emit("pressed taboo")
                    }}
                >
                    <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>TABOO</Text>
                </TouchableOpacity>
            </View>)
        }

        else if (gameStatus === "voting screen") {
            return (
                <View style={styles.mainInteractiveContainer}>
                    <TouchableOpacity
                        style={[styles.buttons, { backgroundColor: "#228B22" }]}
                        onPress={() => {
                            socket.emit("pressed start")
                        }}
                        disabled={startDisabled}
                    >
                        <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>START</Text>
                    </TouchableOpacity>
                </View>)
        }

        else if (gameStatus === "pressed start screen") {
            return (
                <View style={styles.mainInteractiveContainer}>
                    <TouchableOpacity
                        style={[styles.buttons, { backgroundColor: "#228B22" }]}
                        disabled={true}
                    >
                        <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>Waiting for other players to press start.</Text>
                    </TouchableOpacity>
                </View>)
        }

        else if (gameStatus === "your team's turn") {
            return (<View style={styles.mainInteractiveContainer}>
                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#228B22" }]}
                    disabled={true}
                >
                    <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>YOUR TEAM'S TURN</Text>
                </TouchableOpacity>
            </View>)
        }

        else if (gameStatus === "opposite team") {
            return (<View style={styles.mainInteractiveContainer}>
                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#228B22" }]}
                    disabled={true}
                >
                    <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>OPPOSITE TEAM'S TURN</Text>
                </TouchableOpacity>
            </View>)
        }
        else if (gameStatus === "not enough users") {
            return (<View style={styles.mainInteractiveContainer}>
                <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#228B22" }]}
                    disabled={true}
                >
                    <Text style={{ fontFamily: "Caveat", fontSize: 30, width: "100%", textAlign: "center" }}>Each team must contain at least 2 players to start the game.</Text>
                </TouchableOpacity>
            </View>)
        }
    }

    // ----------------------------------SOCKET CONNECTIONS------------------------------------- //



    socket.on("update users", ({ users, team1, team2 }) => { // receives the teams information from the server
        setUsersOfTeam1(team1)
        setUsersOfTeam2(team2)
    })

    socket.on("display votes", ([totalUsers, totalVote]) => {
        setTotalUsers(totalUsers)
        setNumberOfVotes(totalVote)
    })

    socket.on("update scores", ([team1Score, team2Score]) => {
        console.log("team1 score: ", team1Score);
        console.log("team2 score: ", team2Score);
        setScoreOfTeam1(team1Score)
        setScoreOfTeam2(team2Score)
    })

    socket.on("not enough users", () => {
        setGameStatus("not enough users")
    })

    socket.on("set voting screen", () => {
        setGameStatus("voting screen")
    })

    socket.on("set pressed start screen", () => {
        setGameStatus("pressed start screen")
    })



    // ----------------------------------SOCKET CONNECTIONS------------------------------------- //



    const [loaded] = useFonts({
        Caveat: require('../assets/fonts/Caveat-VariableFont_wght.ttf'),
        Abel: require("../assets/fonts/Abel-Regular.ttf"),
        MerrriWeatherBold: require("../assets/fonts/Merriweather-BoldItalic.ttf")
    });
    if (!loaded) {
        return null;
    }

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.backgroundContainer}>
            <SafeAreaView style={{ display: "flex", flex: 1, width: "100%", paddingTop: Platform.OS === 'android' ? 25 : 0 }}>

                <View style={styles.mainContainer}>

                    <View style={styles.usersContainer}>

                        <View style={styles.teamContainer}>

                            <View style={{ flex: 1.7, width: "100%", alignItems: "center", justifyContent: "center", borderBottomColor: "black", borderBottomWidth: 2 }}>
                                <Text style={{ fontFamily: "MerrriWeatherBold", fontSize: 23, fontWeight: "bold" }}>TEAM - 1</Text>
                            </View>

                            <View style={{ flex: 6, width: "100%", alignItems: "center", display: "flex", justifyContent: "space-around", paddingTop: 8 }}>
                                <Users team={1} />
                            </View>

                            <View style={[styles.scoresContainer, { flex: 1.5 }]}>
                                <Text style={{ fontSize: 16 }}>
                                    {scoreOfTeam1}
                                </Text>
                            </View>

                        </View>

                        <View style={styles.teamContainer}>

                            <View style={{ flex: 1.7, width: "100%", alignItems: "center", justifyContent: "center", borderBottomColor: "black", borderBottomWidth: 2 }}>
                                <Text style={{ fontFamily: "MerrriWeatherBold", fontSize: 23 }}>TEAM - 2</Text>
                            </View>

                            <View style={{ flex: 6, width: "100%", alignItems: "center", display: "flex", justifyContent: "space-around", paddingTop: 8 }}>
                                <Users team={2} />
                            </View>

                            <View style={[styles.scoresContainer, { flex: 1.5 }]}>
                                <Text style={{ fontSize: 16 }}>
                                    {scoreOfTeam2}
                                </Text>

                            </View>

                        </View>

                    </View>

                    <View style={styles.mainGameContainer}>

                        <MainScreen />

                        <Buttons />


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
        display: "flex",
        alignItems: "center",
        alignContent: "center"
    },
    text: {
        fontFamily: "Abel"
    },
    mainContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "space-around",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        alignContent: "center",

    },
    usersContainer: {
        flex: 0.25,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    teamContainer: {
        backgroundColor: "#e6e6fa",
        flex: 1,
        width: "100%",
        alignContent: "center",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 2,
    },
    scoresContainer: {
        width: "100%",
        borderTopColor: "black",
        borderTopWidth: 4,
        alignItems: "center",
    },
    mainGameContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 0.75,
        width: "100%",
    },
    mainWordsContainer: {
        backgroundColor: "#ffdaff",
        flex: 0.8,
        borderTopColor: "black",
        borderTopWidth: 2,
        borderRightWidth: 3,
        borderRightColor: "black",
        borderLeftWidth: 3,
        borderLeftColor: "black",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    mainWordsContainerPreGame: {
        backgroundColor: "#ffdaff",
        flex: 0.8,
        borderTopColor: "black",
        borderTopWidth: 2,
        borderRightWidth: 3,
        borderRightColor: "black",
        borderLeftWidth: 3,
        borderLeftColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    mainInteractiveContainer: {
        backgroundColor: "#f77fff",
        flex: 0.20,
        borderTopColor: "black",
        borderTopWidth: 2,
        borderRightWidth: 3,
        borderRightColor: "black",
        borderLeftWidth: 3,
        borderLeftColor: "black",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
    },
    theWordContainer: {
        flex: 0,
        alignItems: "center",
        height: "100%",
        width: "50%",
        alignContent: "center",
        justifyContent: "center",
        display: "flex"

    },
    forbiddenWordsContainer: {
        display: "flex",
        justifyContent: "space-around",
        alignContent: "center",
        alignItems: "center",
        flex: 0,
        height: "100%",
        width: "100%"
    },
    buttons: {
        flex: 1,
        backgroundColor: "blue",
        height: "100%",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        borderColor: "black",
        borderWidth: 2,
    }


});
