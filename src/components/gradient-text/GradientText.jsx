import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text } from "react-native";

export default function GradientText({ text }) {
  return (
    <MaskedView
      maskElement={
        <Text style={{ fontSize: 50, backgroundColor: "transparent" }}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["blue", "red"]}
      >
        <Text style={{ fontSize: 50, opacity: 0 }}>TIC - TAC - TOE</Text>
      </LinearGradient>
    </MaskedView>
  );
}
