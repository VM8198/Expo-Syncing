import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, TouchableHighlight,TouchableOpacity,KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Communications from 'react-native-communications';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from '../config';
import Google from "expo";
import DialogInput from 'react-native-dialog-input';
import { LoginButton } from 'react-native-fbsdk';
import {Facebook} from 'expo';

config = new Config();



class LogIn extends React.Component {

  static navigationOptions = {
    header: null,
    // title: 'My Contacts',
  };

  constructor(props){
    super(props);
    this.state = {
      user: "",
      pwd: "",
      email: '',
      forgot: false,
      otp: false,
      recoveryEmail: '',
      name: ''
    } 
  }

    logIn = (text) => {
      console.log("in login");
      if(text.email == ""){
        alert("Enter user name");       
      }
      else if(text.pwd == ""){
        alert("Enter Password");       
      }      
      else {
        console.log(config.getBaseUrl());
        var body = {email: text.user,password: text.pwd}
        console.log("body",body);
        axios.get(config.getBaseUrl()+'user/login',body)
        .then(res=>{                        
             this.props.navigation.navigate('contacts');                   
        },err=>{         
             alert(err);         
        })         
      }      
    }

    handleEmail = (body) => {
        axios.post(config.getBaseUrl()+'user/sendEmail',body)
        .then(res=>{
          console.log(res);
        },err=>{
          console.log(err);
        })
    }

    checkOTPmethod(otp){
        axios.post(config.getBaseUrl()+'user/checkOTP',otp)
        .then(res=>{
          if(res.status == 200){
            this.props.navigation.navigate('ChangePassword',{email: this.state.recoveryEmail})
          }
        },err=>{
          console.log(err);
        })
    }

    forgotPassword(){
      if(this.state.forgot == true){
        return(
          <View style={styles.container}>
          <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Enter Recovery Email"}
          hintInput ={"Email"}
          submitInput={ (inputText) => {this.handleEmail({email: inputText}),this.setState({forgot: false,recoveryEmail: inputText}),this.setState({otp: true})}}
          closeDialog={ () => {this.setState({forgot: false})}}>
          </DialogInput>
          </View>
          )
      }
    }

    checkOTP(){
      if(this.state.otp == true){
        return(
          <View style={styles.container}>
          <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"OTP sent to your registered email Id"}
          message={"Enter OTP"}
          hintInput ={"OTP"}
          submitInput={ (inputText) => {this.checkOTPmethod({otp: inputText}),this.setState({otp: false})}}
          closeDialog={ () => {this.setState({otp: false})}}>
          </DialogInput>
          </View>
          )
      }
    }  

    signInWithGoogle = async () => {
      console.log('in sin');
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: "316640383619-i93qoa1te6q220cm07i4e8h4eo8t2ac1.apps.googleusercontent.com",
          scopes: ["https://www.google.com/m8/feeds/", "https://www.googleapis.com/auth/drive"]
        })
        if (result.type === "success") {
          console.log(result);
          this.setState({name: result.user.name, email: result.user.email,pwd: result.user.id})          
          var body = {name: this.state.name,email: this.state.email,password: this.state.pwd}
          this.props.navigation.navigate('contacts',{token: result.accessToken});   
          // axios.post(config.getBaseUrl()+'user/signup',body)
          // .then((res)=>{
          // },err=>{
          //   alert(err);
          // })

          // this.getContacts(result.accessToken)
        } else {
          console.log("cancelled")
        }
      } catch (e) {
        console.log("error", e)
      }
    }

  signInWithFB = async () => {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('2819729094919286', {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email,name`)
      // alert('Logged in!', `Hi ${(await response.json()).name}!`);
      const res = await response.json();
      console.log("res",res);
      // console.log("----  --------",res._bodyInit);
      this.setState({email: res.email,name: res.name});
      this.setState({pwd: res.id})

      // var body = {name: this.state.name,email: this.state.email,password: this.state.pwd}
      //   // console.log("body",body);
      //   axios.post(config.getBaseUrl()+'user/signup',body)
      //   .then(res=>{                        
      //        this.props.navigation.navigate('contacts');                   
      //   },err=>{         
      //        alert(err);         
      //   })         
    } else {
      alert(type);
    }
  try {
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}

  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
     {this.forgotPassword()}
     {this.checkOTP()}
      <View style={styles.container}>      
        <View style={styles.dataContainer}>  
              
      <View style={styles.inputContainer}>
      <Icon name='email' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs}
              placeholder="Email"
              underlineColorAndroid='transparent'
              onChangeText={(text)=>this.setState({email: text})}/>
      </View>          
      <View style={styles.inputContainer}>
      <Icon name='lock' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(text)=>this.setState({pwd: text})}/>
      </View>
      <View style={styles.btn}>
      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}  onPress = {()=>{this.logIn(this.state)}}>
         <Text style={styles.loginText}>Login</Text>
      </TouchableHighlight> 

       <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.setState({forgot: true})}}>
            <Text>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.signInWithGoogle()}}>
        <View style={styles.googleLogIn}>
        <Image source={require('../assets/google.png')} style={{height: 45, width: 50, marginLeft: -14}}/>
            <Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>Sign In With Google</Text>
        </View>
        </TouchableOpacity>

         <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.signInWithFB()}}>
        <View style={styles.fbLogIn}>
        <Image source={require('../assets/facebook.png')} style={{height: 45, width: 50, marginLeft: -8}}/>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Sign In With Facebook</Text>
        </View>
        </TouchableOpacity>         
                
      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress = {()=>this.props.navigation.navigate('SignUp')}>  
      <Text style={styles.loginText}>Register here</Text>
        </TouchableHighlight>      
      </View> 
      </View>            
      </View>   
      </KeyboardAvoidingView>   
      );
   }
}



 

export default LogIn

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
  image:{
    height: 100,
    width: 100,
    borderRadius: 100
  },
  header:{
    fontSize: 30,
    color: '#00b5ec',
    fontWeight: 'bold'
  },
  dataContainer:{
    marginTop: 10
  },
  googleLogIn:{
    backgroundColor: 'white',
    height: 45 ,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  fbLogIn:{
    backgroundColor: 'blue',
    height: 45 ,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
  
});                

