import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./home.styles";
import Button from "../../components/button/Button";
import GradientText from "../../components/gradient-text/GradientText";
import GradiantBackground from "../../components/gradient-background/gradient-backgrount";

const Home = ({ navigation }) => {
  return (
    <GradiantBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <GradientText text="TIC - TAC - TOE" />
        <View style={styles.buttons}>
          <Button
            onPress={() => {
              navigation.navigate("SinglePlayerGame", { value: "LOCAL" });
            }}
            style={styles.button}
            title="Local Game"
          />
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate("SinglePlayerGame", { value: "BOT_EASY" });
            }}
            title="Bot Easy"
          />
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate("SinglePlayerGame", { value: "BOT_MEDIUM" });
            }}
            title="Bot Medium"
          />
        </View>
      </ScrollView>
    </GradiantBackground>
  );
};

export default Home;
