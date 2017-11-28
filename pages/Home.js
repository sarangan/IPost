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
  Image
} from 'react-native';


export default class Home extends Component<{}> {


  constructor(props){
    super(props);

    this.state = {};

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
