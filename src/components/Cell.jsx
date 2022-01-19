import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Cross from "./Cross";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell === "o" && <View style={styles.circle} />}
      {cell === "x" && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
  },
  circle: {
    width: "80%",
    height: "80%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    borderWidth: 10,
    borderColor: "white",
  },
});

export default Cell;
