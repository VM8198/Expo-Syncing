import React from "react"
import { StyleSheet, Text, View, Image, Button, AsyncStorage } from "react-native";
import Container from './screens/stackNavigator'


export default class App extends React.Component {
  
  // componentDidMount = async () => {
  //   const {  Permissions } = Expo;
  //   const { status } = await Permissions.askAsync(Permissions.WRITE_EXTERNAL_STORAGE);
  //   if (status === 'granted') {
  //     console.log(status);
  //   } else {
  //     console.log(status);
  //     console.log('not granted')
  //   }
  // }


  render() {    
    return (
      <>
      <View style={styles.header}>
      </View>
      <Container/>
      </>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    height: 20,
    backgroundColor: 'grey'
    // fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
})

