/**
 * home screen
 * @sara
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native';

import auth from '../auth/auth';
import AppKeys from '../keys/appKeys';

export default class Home extends Component<{}> {


  constructor(props){
    super(props);

    this.state = {

    };

  }

  componentWillMount(){

    // let keys = [AppKeys.LOGINKEY];
    // AsyncStorage.multiRemove(keys, (err) => {
    //
    // });
    this.checkAuth();
  }

  checkAuth =()=>{

   AsyncStorage.getItem(AppKeys.LOGINKEY, (err, result) => {
     console.log('get login details');
     console.log(JSON.parse(result));
     if(result){
       //user already saved in store
       console.log('got something');
       console.log(result);

       let tempAuth = JSON.parse(result) || {};

       if(tempAuth.hasOwnProperty("user") && tempAuth.hasOwnProperty("token") ){
         auth["AUTHTOKEN"] = tempAuth.token;
         auth["ISLOGIN"] =  true;
         auth["USER"] =  tempAuth.user;


       }
       else{

         this.props.navigator.showModal({
             screen: "IPost.Login",
             title: 'IPost',
             animationType: 'slide-up',
             navigatorStyle:{
               navBarHidden: true,
             },
             passProps: {
              }
         });

       }


     }
     else{
       console.log("no login yet ");

       this.props.navigator.showModal({
           screen: "IPost.Login",
           title: 'IPost',
           animationType: 'slide-up',
           navigatorStyle:{
             navBarHidden: true,
           },
           passProps: {
            }
       });

     }
   });

 }

  addPost = () => {

    // this.props.navigator.push({
    //   screen: 'IPost.UserProfile',
    //   title: 'Create Account',
    //   animated: true,
    //   //animationType: 'fade',
    //   backButtonTitle: "Back",
    //   passProps: {}
    // });

    this.props.navigator.showModal({
        screen: "IPost.CreatePost",
        title: "",
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



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>

        <TouchableHighlight style={styles.roundBox} underlayColor='#AA9BFC' onPress={()=>this.addPost()}>
          <Image
            source={require('../images/write.png')}
            style = {styles.genIcons}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  roundBox:{
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6875E4',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
    right: '2%'
  },
  genIcons:{
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

});
