/**
 * User creation
 * @sara
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var ImagePicker = require('react-native-image-picker');


import * as UserActions from "../actions/UserActions";
import UserStore from "../stores/UserStore";
import PersonalDetails from "../components/PersonalDetails";


export default class UserProfile extends Component<{}> {

  static navigatorButtons = {
     rightButtons: [
       {
         title: 'Post',
         id: 'post'
       }
     ],
      leftButtons:[
        {
          title: 'Cancel',
          id: 'cancel'
        }
      ]

   };



  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {


    };

  }

  //navigator button actions
  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'post') {
        this.doSave();

      }
      else if(event.id == 'cancel'){

        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });

      }

    }
  }

  componentWillUnmount () {
    // Remove the alert located on this master page from te manager
    MessageBarManager.unregisterMessageBar();
 }

  componentDidMount(){

    MessageBarManager.registerMessageBar(this.refs.alert);

  }

  doMessage = (msg) =>{

    MessageBarManager.showAlert({
          message: msg,
          alertType: 'success',
          animationType: 'SlideFromTop',
          position: 'top',
          shouldHideOnTap: true,
          stylesheetSuccess : { backgroundColor : '#ea5c5c', strokeColor : '#ea5c5c' },
          messageStyle: {color: '#ffffff', fontWeight: '700', fontSize: 15 },
          duration: 700,
          durationToShow: 0,
          durationToHide: 300

        });

  }

  doSave = () =>{



  }

  //open camera
  openCamera = () =>{
    var options = {
      title: 'Add media',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      //allowsEditing: true
    };

      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          //console.log('User tapped custom button: ', response.customButton);
        }
        else {

          this.setState({
            img_url: response.uri,
            type: 2
          });

        }
      });

  }



  getImage = () =>{
    let img = null;
    if(this.state.img_url){
      img = <Image source={{ uri: this.state.img_url }} style={{width: SCREENWIDTH, height: SCREENWIDTH * 0.75, resizeMode: 'cover'}}>

      </Image>
    }

    return (img);
  }


  render() {
    return (
      <View style={styles.fill}>
        <ScrollView>

          <TextInput
            style={[styles.txtInput, {height: SCREENHEIGHT - 400}]}
            onChangeText={(text) => this.setState({comment:text, startEdit: true})}
            placeholder="What are you thinking about?"
            placeholderTextColor="#A9ACBC"
            multiline = {true}
            numberOfLines = {10}
            value={this.state.body}
            underlineColorAndroid='transparent'
          />

          <View style={styles.camWrapper}>
              {this.getImage()}
          </View>

        </ScrollView>

        <MessageBarAlert ref='alert' />

        <TouchableHighlight style={styles.roundBox} underlayColor='#AA9BFC' onPress={()=>this.openCamera()}>
          <Image
            source={require('../images/photo-camera.png')}
            style = {styles.genIcons}
          />
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  divTxt:{
    backgroundColor: "#F7F7F9",
    width: SCREENWIDTH,
    padding: 10,
  },
  txtInput:{
    height: 45,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
    width: SCREENWIDTH - 10,
    marginTop: 10,
    fontSize: 15,
  },
  divider:{
    marginLeft: 25,
    marginRight: 25,
    height: 1,
    backgroundColor: 'rgba(99,175,203,0.3)',
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
  camWrapper:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera_img:{
    width: 120,
    resizeMode: "contain",
  },

});
