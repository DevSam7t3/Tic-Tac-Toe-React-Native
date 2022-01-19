import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import bg from "../../assets/bg.jpeg";
import Cell from ".././components/Cell";

const emptyMap = [
  ["", "", ""], // 1st row
  ["", "", ""], // 2nd row
  ["", "", ""], // 3rd row
];

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};

export default function App({ route }) {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM;
  const [modalVisible, setModalVisible] = useState(false);
  const [win, setWin] = useState(""); // O-Win, X-Win, Tie

  useEffect(() => {
    setGameMode(route.params.value);
  }, []);

  useEffect(() => {
    if (currentTurn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  const onPress = (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === "x" ? "o" : "x");
  };

  const getWinner = (winnerMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every((cell) => cell === "x");
      const isRowOWinning = winnerMap[i].every((cell) => cell === "o");

      if (isRowXWinning) {
        setWin("X-Win");
        return "x";
      }
      if (isRowOWinning) {
        setWin("O-Win");
        return "o";
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (winnerMap[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        setWin("X-Win");
        return "x";
      }
      if (isColumnOWinner) {
        setWin("O-Win");
        return "o";
      }
    }

    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }

      if (winnerMap[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      setWin("O-Win");
      return "o";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      setWin("X-Win");
      return "x";
    }
  };

  const checkTieState = () => {
    if (!map.some((row) => row.some((cell) => cell === ""))) {
      setModalVisible(true);
      resetGame();
      setWin("Tie");
    }
  };

  const gameWon = (player) => {
    setModalVisible(true);
    resetGame();
  };

  const resetGame = () => {
    setMap([
      ["", "", ""], // 1st row
      ["", "", ""], // 2nd row
      ["", "", ""], // 3rd row
    ]);
    setCurrentTurn("x");
  };

  const botTurn = () => {
    // collect all possible options
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let chosenOption;

    if (gameMode === "BOT_MEDIUM") {
      // Attack
      possiblePositions.forEach((possiblePosition) => {
        const mapCopy = copyArray(map);

        mapCopy[possiblePosition.row][possiblePosition.col] = "o";

        const winner = getWinner(mapCopy);
        if (winner === "o") {
          // Attack that position
          chosenOption = possiblePosition;
        }
      });

      if (!chosenOption) {
        // Defend
        // Check if the opponent WINS if it takes one of the possible Positions
        possiblePositions.forEach((possiblePosition) => {
          const mapCopy = copyArray(map);

          mapCopy[possiblePosition.row][possiblePosition.col] = "x";

          const winner = getWinner(mapCopy);
          if (winner === "x") {
            // Defend that position
            chosenOption = possiblePosition;
          }
        });
      }
    }

    // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  const ModalContent = () => {
    return (
      <>
        <View style={styles.modalContainer}>
          <View style={styles.modalRestartContainer}>
            <Text style={styles.modalWinText}>Game Result</Text>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>Player Won :</Text>
              <Text style={[styles.modalText, { color: "grey" }]}>{win}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    gameWon();
                    setModalVisible(false);
                  }}
                  style={{
                    marginBottom: 60,
                    backgroundColor: "black",
                    alignItems: "center",
                    padding: 13,
                    borderRadius: 30,
                    width: 300,
                    position: "relative",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>Restart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {ModalContent()}
      </Modal>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text style={styles.dispalyTurn}>
          Current Turn: {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, columnIndex)}
                />
              ))}
            </View>
          ))}
        </View>

        {/* <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.button,
              { backgroundColor: gameMode === "LOCAL" ? "#4F5686" : "#191F24" },
            ]}
          >
            Local
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            Easy Bot
          </Text>
          <Text
            onPress={() => setGameMode("BOT_MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            Medium Bot
          </Text>
        </View> */}
      </ImageBackground>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242d34",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalRestartContainer: {
    backgroundColor: "white",
    padding: 16,
    height: 500,
    borderWidth: 1,
  },
  modalWinText: {
    textAlign: "center",
    fontSize: 30,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: "700",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  modalTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalText: {
    textAlign: "left",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },
  map: {
    width: "80%",
    aspectRatio: 1,
  },
  dispalyTurn: {
    position: "absolute",
    fontSize: 30,
    fontWeight: "bold",
    color: "#46b9ff",
    top: 100,
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "white",
    margin: 10,
    fontSize: 16,
    backgroundColor: "#191F24",
    padding: 10,
    paddingHorizontal: 15,
  },
});
