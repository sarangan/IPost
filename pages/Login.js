/**
 * login screen
 * @sara
 */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
  AsyncStorage
} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';


import * as LoginActions from "../actions/LoginActions";
import LoginStore from "../stores/LoginStore";

export default class Login extends Component<{}> {


  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      isSending: false
    };


    this.getLoginStatus = this.getLoginStatus.bind(this);

  }

  componentWillMount() {
    LoginStore.on("change", this.getLoginStatus);
  }

  componentWillUnmount() {
    LoginStore.removeListener("change", this.getLoginStatus);
  }


  // login response 
  getLoginStatus(){

    let responseJson = LoginStore.getLoginDetails();

    var keys = Object.keys(responseJson).map(function(x){ return x.toUpperCase() });

    if( keys.indexOf( ("token").toUpperCase() )  != -1 ){

      let userDetails = {
          user_id : responseJson.user.id,
          email :  responseJson.user.email,
          img_url : config.SERVER_IMAGE_PATH + 'users/'+ responseJson.user.img_url,
          thumb_url: config.SERVER_IMAGE_PATH + 'users/300_'+ responseJson.user.img_url,
          first_name : responseJson.user.first_name,
          last_name : responseJson.user.last_name,
          contact : responseJson.user.contact,
      };

      auth["AUTHTOKEN"] = 'Bearer ' + responseJson.token;
      auth["ISLOGIN"] =  true;
      auth["USER"] =  userDetails;

      let ipauth = {
        token: 'Bearer ' + responseJson.token,
        isLogin: true,
        user: userDetails
      };

      console.log("ipauth");
      console.log(ipauth);


      AsyncStorage.setItem(AppKeys.LOGINKEY, JSON.stringify(ipauth), () => {
        console.log('login token stored');

        this.setState({
          isSending: false
        });

        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });

      });

    }
    else{

      this.setState({
        isSending: false
      });

    }



  }

  registerUser = () =>{

    this.props.navigator.showModal({
        screen: "IPost.UserProfile",
        title: "Create Account",
        animationType: 'slide-up',
       navigatorStyle:{
         navBarTextColor: '#6875E4',
         navBarButtonColor: '#6875E4',
         navBarBackgroundColor: '#FFFFFF',//'#839BF0',
         screenBackgroundColor: '#FFFFFF',
         navBarBlur: false,
          screenBackgroundColor: '#FFFFFF',
          navBarTransparent: false,
       },
        passProps: {

        },
    });

  }

  doLogin=()=>{

    console.log("login");

    if(this.state.username && this.state.password){

      this.setState({
        isSending: true
      }, ()=>{
        LoginActions.authenticate(this.state.username, this.state.password);
      });



    }
    else{
        Alert.alert(
         'I-Post',
         'Username or password cannot be blank!'
        );
    }


  }


  render() {
    return (
        <ScrollView>
          <View style={styles.fill}>

                <Image source={require('../images/ipost_logo.png')} style={styles.ip_logo}/>
                <Text style={styles.inventoryTxt}>I-Post</Text>
                <Text style={styles.helpTxt}>I-Post Login</Text>
                <TextInput
                  style={styles.txtInput}
                  onChangeText={(text) => this.setState({username:text})}
                  returnKeyType="done"
                  placeholder="Enter your email"
                  placeholderTextColor="#757575"
                  clearButtonMode="while-editing"
                  onSubmitEditing={this.doLogin}
                  keyboardType="email-address"
                  underlineColorAndroid='transparent'
                />
                <TextInput
                  style={styles.txtInput}
                  onChangeText={(text) => this.setState({password:text})}
                  returnKeyType="done"
                  placeholder="Enter password"
                  placeholderTextColor="#757575"
                  clearButtonMode="while-editing"
                  onSubmitEditing={this.doLogin}
                  secureTextEntry= {true}
                  underlineColorAndroid='transparent'
                />
                <TouchableHighlight  underlayColor='#93A3E0' style={styles.loginWrapper} onPress={this.doLogin}>
                  <Text style={styles.loginBtn}>Login</Text>
                </TouchableHighlight>



                {this.state.isSending &&
                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: SCREENWIDTH }} >
                    <ActivityIndicator animating  size='small' />
                  </View>
                }


                <View style={styles.otherActionsBtnWrapper}>
                  <TouchableHighlight  underlayColor='transparent' onPress={()=>this.registerUser()}><Text style={styles.otherActionsBtn}>Don't have an account? Sign up here</Text></TouchableHighlight>
                 {/*<TouchableHighlight  underlayColor='transparent'><Text style={styles.otherActionsBtn}>Forgot password</Text></TouchableHighlight>*/}
                </View>

              </View>
          </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fill:{
   flex: 1,
   flexDirection: "column",
   justifyContent: 'flex-start',
   alignItems: 'center',
   paddingTop: 30,
   paddingBottom: 30,
   backgroundColor: '#FFFFFF',
 },
 txtInput: {
   height: 40,
   borderWidth: 1,
   borderColor: 'rgba(0,0,0,0.16)',
   borderRadius: 10,
   paddingLeft: 25,
   paddingRight: 25,
   backgroundColor: '#FFFFFF',
   width: SCREENWIDTH - 50,
   marginTop: 10,
   marginBottom: 10
 },
 ip_logo:{
   width: 100,
   height: 100,
   resizeMode: "contain",
   marginTop: 30
 },
 inventoryTxt:{
   fontSize: 45,
   fontWeight: '700',
   color: "#333333",
   marginBottom: 40
 },
 helpTxt:{
   color: "grey"
 },
 loginWrapper:{
   // marginTop: 20,
   width: SCREENWIDTH - 50,
   backgroundColor: '#6875E4',
   borderRadius: 5,
   padding: 12,
   margin: 30,
   alignItems: 'center',
   justifyContent: 'center'
 },
 loginBtn:{
   color: "#ffffff",
   // backgroundColor: "#6875E4",
   // padding: 10,
   textAlign: "center",
    fontSize: 16,
   fontWeight: "700"
 },
 otherActionsBtnWrapper:{
   flex: 1,
   flexDirection: "column",
   alignItems: "center",
   justifyContent: "center",
   // position: "absolute",
   // bottom: 0,
   // left: 0,
   padding: 20,
   width: SCREENWIDTH - 50
 },
 otherActionsBtn:{
   color: "#333333",
    marginTop: 20,
   // marginRight: 20
 }
});
