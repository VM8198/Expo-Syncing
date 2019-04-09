import React from 'react';
import { StyleSheet, Text, View,ActivityIndicator, TouchableOpacity,Button, ScrollView } from 'react-native';
import { Constants, Contacts } from 'expo';
import { Permissions } from 'expo';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import axios from 'axios';
import { FileSystem } from 'expo';

import * as _ from 'lodash';


let contacts = []
let counter = 0;
var defaultheader = function () {
  return {
    method: null,
    body: null,
    crossDomain: true,
    cache: false,
    async: false,
    timeout: 3000,
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Access-Control-Allow-Headers":"*",
      "Access-Control-Allow-Headers":"*",
      "X-Requested-With":"XMLHttpRequest",
      "GData-Version": "3.0",
      // 'scopes': 'https://www.googleapis.com/auth/contacts.readonly',
    },
  };
};
function transformRequest(obj){
 
  var str = [];
  for (var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

export default class Contact extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      myContacts: [{
        name: '',
        number: ''
      }],
      fetching: false
    }
  }

  async componentDidMount() {

  this.setState({fetching: true})
  const permission = await Permissions.askAsync(Permissions.CONTACTS);

  if (permission.status !== 'granted') {
    return;
  }

  contacts = await Contacts.getContactsAsync({
    fields: [
      Contacts.PHONE_NUMBERS,
      Contacts.EMAILS,
    ],
    pageSize: 400,
    pageOffset: 0,
  })
  
  for(let i = 0 ; i < contacts.data.length; i++){    
    if(contacts.data[i].phoneNumbers === undefined){
    }else{
      this.setState(prevState => ({
      myContacts: [...prevState.myContacts,{name: contacts.data[i].name,number: contacts.data[i].phoneNumbers[0].number}]  
    }))
    }    
  }
  this.state.myContacts.splice(0,1)
  this.setState({fetching: false})
}

wait(){
  if(this.state.fetching == true){
    return(
      <ActivityIndicator
               animating = {true}
               color = '#bc2b78'
               size = "large"
               style = {styles.activityIndicator}/>
      )
  }
}

removeDuplicates(arr){  
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}

sort(arr){
  arr.sort(function(a, b){
    var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
    if (nameA < nameB) 
      return -1;
    if (nameA > nameB)
      return 1;
    return 0; 
  });
}


showContact  (){
  if(this.state.fetching == false){
    if(this.state.myContacts == null){
    }
    this.state.myContacts = this.removeDuplicates(this.state.myContacts);
    this.state.myContacts.sort(function(a, b){
      if(a.firstname < b.firstname) { return -1; }
      if(a.firstname > b.firstname) { return 1; }
      return 0;
    })
    this.sort(this.state.myContacts)
    
      return(
      this.state.myContacts.map((item)=>
          <Card>
            <CardItem>
              <Body>
              <View style={{flexDirection: 'column'}}>
                <Text>
                  Name : {item.name}
                </Text>
                <Text>
                  Number : {item.number}
                </Text>
                </View>
              </Body>
            </CardItem>
          </Card>
        )
      )
  }
  
}


getContactsFromGoole =  (token) => {
  this.setState({fetching: true})
  console.log('-----------------------------------in contacts---------------------------------------');
  const header = defaultheader();
  let params={
    "alt":"json",
    "max-results":1000,
    "access_token":token        
  };
  header.method='GET';
  header.headers["Authorization"]= 'Bearer '+token;
  // console.log("header", header);
  let url="https://www.google.com/m8/feeds/contacts/default/full?";
  var suburl=transformRequest(params);
  url=url+suburl;
  // console.log('url',url  );
  fetch(url)
  .then((response) => {
    // setTimeout(() => {let a=0;}, 0);
    // console.log("response===========================",response);
    return response.json()
  })
  .then((responseJson) => {
    var contact = responseJson;
    // console.log(responseJson);
    _.forEach(contact.feed.entry, con=>{
      if(con.gd$phoneNumber === undefined){
      }else{
      this.setState(prevState => ({
        myContacts: [...prevState.myContacts,{name: con.title.$t, number: con.gd$phoneNumber[0].$t}]  
      }))        
      }

    })
    this.setState({fetching: false})
    this.state.myContacts = this.removeDuplicates(this.state.myContacts);
    this.showContact()
  })
  .catch((error) => {
    console.log("An error occurred.Please try again",error);
  });      
}

export = () => {
  let body = this.state.myContacts;
  axios.post(config.getBaseUrl()+'user/createFile',body)
  .then(res=>{
    if(res.status == 200){
      console.log(FileSystem.documentDirectory);
      FileSystem.downloadAsync(
        config.getBaseUrl()+'all.vcf',
        FileSystem.documentDirectory + 'abc.vcf'
        )
      .then(({ uri }) => {
        console.log('Finished downloading to ', uri);
      })
      .catch(error => {
        console.error(error);
      });
    }
  },err=>{
    console.log(err);
  })
}

create(){
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'contacts', { intermediates: true })
}

  render() {
    return (
      <>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Contacts</Text>
        <TouchableOpacity onPress={()=>{this.getContactsFromGoole(this.props.navigation.state.params.token)}}>
        <View style={{backgroundColor: '#000', height: 30, width: 80, alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'white'}}>Import</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.export()}}>
        <View style={{backgroundColor: '#000', height: 30, width: 80, alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'white'}}>Export</Text>
        </View>
        </TouchableOpacity>
      </View>      
        <ScrollView>
        {this.wait()}
        {this.showContact()}        
        </ScrollView>
        </>
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
  card:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
    padding: 5,
    margin: 5
  },
  activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   },
   header:{
     // flex: 1,
     height: 45,
     justifyContent: 'space-around',
     alignItems: 'center',
     flexDirection: 'row',
     backgroundColor: 'blue'
   },
   headerText:{
     fontSize: 25,
     color: 'white'
   }

});



// fbSecret : 59c2e1a869577aa23569e284d64a4611