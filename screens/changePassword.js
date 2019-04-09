import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';
import axios from 'axios';
import Config from '../config';


config = new Config();

export default class ChangePassword extends React.Component {

   constructor(props){
    super(props);
    this.state = {
      password: '',
      cnfpassword: ''
    } 
  }



  changePassword(data){
    console.log("in change");
    email = this.props.navigation.state.params.email
    console.log('email',email);
    body = {email: email, password: data.password}
    console.log(data);
    console.log(body);
    console.log(config.getBaseUrl()+'user/changePassword');
    if(data.password == data.cnfpassword){
      axios.post(config.getBaseUrl()+'user/changePassword',body)
     .then(res=>{
       alert('password changed successfully');
       this.props.navigation.navigate('LogIn');
     },err=>{
         alert(err);
     })
    }
  }
  
  render() {
    return (     
      <View style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.change}>Change Password</Text>
      </View> 
      <View  style={styles.inputContainer}>
      <TextInput style={styles.inputs} 
              placeholder="Enter New Password"
              underlineColorAndroid='transparent'
              onChangeText={(text)=>this.setState({password: text})}/>
      </View>          
      <View style={styles.inputContainer}>
      <TextInput style={styles.inputs}
              placeholder="Confirm Password"
              underlineColorAndroid='transparent'
              onChangeText={(text)=>this.setState({cnfpassword: text})}/>
      </View>        
         <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}  onPress = {()=>{this.changePassword(this.state)}}>
         <Text style={styles.loginText}>Change Password</Text>
      </TouchableHighlight>                      
      </View>   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
   textInput: {
    color:'#fff',
    height: 30,
    width: 200, 
    borderColor: '#ffffff',
    borderWidth: 1 
  },
inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
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
  change:{
    fontSize: 30,
    color: '#00b5ec'
  },
  header:{
    alignItems: 'center',
    justifyContent: 'center'
  }
});
