import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import axios from 'axios';
import Config from '../config';

config = new Config();
class SignUp extends React.Component {

  static navigationOptions = {
    title: 'SignUp',
  }
    signUp = (text) => {
      console.log("in signup");
      console.log(text);
      if (text.name=="") {
        alert("Enter First Name");
      } 
      else if(text.password == ""){
        alert("Enter Password");       
      }
      else if(text.email == ""){
        alert("Enter email");       
      }
      else {
        console.log('in else');
        var body = {name: text.name,email: text.user_name,password: text.password}
        axios.post(config.getBaseUrl()+'user/signup',body)
        .then(res=>{          
            this.props.navigation.navigate('LogIn')
          },err=>{
            alert(err);
        }) 
      }      
    }

  state = {
    name:"",
    email: "",   
    password: "",
  } 

  render() {

    return (
      <View style={styles.container}>

      <View style={styles.inputContainer}>    
      <TextInput style={styles.inputs}
      placeholder="Name"
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({name: text})}/>
      </View>

      <View style={styles.inputContainer}>    
      <TextInput style={styles.inputs}
      placeholder="Email"
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({email: text})}/>
      </View>

      

      <View style={styles.inputContainer}>    
      <TextInput style={styles.inputs}
      placeholder="Password"              
      underlineColorAndroid='transparent'
      secureTextEntry={true} 
      onChangeText={(text)=>this.setState({password: text})}/>
      </View>

      
      <View style={styles.btn}>
      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={()=>this.signUp(this.state)}>
      <Text style={styles.loginText}>Register</Text>
      </TouchableHighlight>                 
      </View>  

      </View>
      );
  }
}



  
export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    color: '#ffffff', 
    marginTop: 10   
  },

  textMain: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  textInput: {
    color:'#fff',
    height: 30,
    width: 200, 
    borderColor: '#ffffff',
    borderWidth: 1 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:250,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
    height:45,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  }
  
});                


