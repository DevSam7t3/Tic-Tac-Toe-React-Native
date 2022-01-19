import React from "react";
import { Text, TouchableOpacity } from "react-native";
import GradiantBackground from "../gradient-background/gradient-backgrount";
import styles from "./Button.style";

export default function Button({ title, style, ...props }) {
  return (
    <TouchableOpacity {...props} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
