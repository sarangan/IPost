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
import config from '../config/config';

import * as UserActions from "../actions/UserActions";
import UserStore from "../stores/UserStore";
import PersonalDetails from "../components/PersonalDetails";


export default class UserProfile extends Component<{}> {

  static navigatorButtons = {
     rightButtons: [
       {
         title: 'Close',
         id: 'cancel'
       }
     ],
    //  leftButtons:[
    //    {
    //      title: 'Cancel',
    //      id: 'cancel'
    //    }
    //  ]

   };


  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      first_name: '',
      last_name: '',
      contact: '',
      img_url: '',
      got_img: 0,
      loading: false,
      error: ''

    };

  }

  //navigator button actions
  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      // if (event.id == 'save') {
      //   this.doSave();
      //
      // }
      if(event.id == 'cancel'){

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

  handleInputChange=(name, value)=>{

     console.log(value);
     console.log(name);


     this.setState({
         [name]: value
     });

     console.log(this.state);
  }

  doMessage = (msg, type) =>{
    let myStyle = { backgroundColor : '#FAE07F', strokeColor : '#FAE07F' };
    if(type == "INFO"){
      myStyle = { backgroundColor : '#A1DBB5', strokeColor : '#A1DBB5' };
    }
    MessageBarManager.showAlert({
          message: msg,
          alertType: 'success',
          animationType: 'SlideFromTop',
          position: 'top',
          shouldHideOnTap: true,
          stylesheetSuccess : myStyle,
          messageStyle: {color: '#ffffff', fontWeight: '700', fontSize: 15 },
          duration: 1400,
          durationToShow: 0,
          durationToHide: 300

        });

  }

  doSave = () =>{

    if(!this.state.email || !this.state.password || !this.state.confirmPassword || !this.state.username){
      this.doMessage("Please provide details!", "ERROR");
    }
    else if(this.state.password !=  this.state.confirmPassword ){
      this.doMessage("Password does not match!");
    }
    else{

      this.setState({
        loading: true
      }, ()=>{


        let formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        formData.append("confirmPassword", this.state.confirmPassword);
        formData.append("username", this.state.username);
        formData.append("first_name", this.state.first_name);
        formData.append("last_name", this.state.last_name);
        formData.append("contact", this.state.contact);
        formData.append("got_img", this.state.got_img);
        if(this.state.got_img == 1){
          formData.append('photo', {uri: this.state.img_url, type: 'image/jpg', name: 'image.jpg'});
        }

        fetch(
            config.ENDPOINT_URL + 'auth/register',
            {
            method: 'POST',
            headers: {
                      'Accept': 'application/json',
                      //'Content-Type': 'application/octet-stream',
                      'Content-Type': 'multipart/form-data',
                      'Origin': '',
                      'Host': 'propertyground.co.uk',
                      'timeout': 10 * 60
            },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log(responseJson);

          if( responseJson.hasOwnProperty("status") && responseJson.status == 1 ){

            this.doMessage("I-Post Account successfully created", "INFO");
            // Alert.alert(
            //   'I-Post',
            //   'Please login to post a text!'
            //  );


            this.setState({
              loading: false,
              email: '',
              password: '',
              confirmPassword: '',
              username: '',
              first_name: '',
              last_name: '',
              contact: '',
              img_url: '',
              got_img: 0,
              loading: false,
              error: ''

            }, ()=>{

              Alert.alert(
                'I-Post',
                'Success!, Please login to post a text.',
                [
                  {text: 'OK', onPress: () => {
                    console.log('OK Pressed');
                    this.props.navigator.dismissModal({
                      animationType: 'slide-down'
                    });
                    }
                  },
                ],
                { cancelable: false }
              )





            } );

            console.log('login success');

          }
          else{
              this.doMessage("Could not update the details!", "ERROR");
          }

        })
        .catch((error) => {
          console.error(error);
          this.doMessage("Error!", "ERROR");
          this.setState({
            loading: false,
            error: error
          });
        });


      });


    }


  }

  //open camera
  openCamera = () =>{
    var options = {
      title: 'Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      //allowsEditing: true
    };

      ImagePicker.showImagePicker(options, (response) => {
        //console.log('Response = ', response);

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
          console.log(response.uri);

          this.setState({
            img_url: response.uri,
            got_img: 1
          });

        }
      });

  }



  getImage = () =>{
    let img = <Image source={require('../images/darth-vader.png')} style={styles.camera_img}/>;
    if(this.state.img_url){

      img = <Image source={{ uri: this.state.img_url }} style={styles.camera_img} />
    }

    return (img);
  }


  render() {
    return (
      <View style={styles.fill}>
        <ScrollView>


          <View style={{ flex: 1 , alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20}}>

              <TouchableHighlight underlayColor='transparent' style={styles.profileImgWrapper} onPress={()=>this.openCamera()}>
                <View>
                  {this.getImage()}
                  <TouchableHighlight underlayColor='#AA9BFC' style={styles.cameraIconWrapper} onPress={()=>this.openCamera()}>
                    <Image source={require('../images/photo-camera.png')} style={styles.camera_icon_img}/>
                  </TouchableHighlight>
                </View>
              </TouchableHighlight>

          </View>



          <Text style={styles.divTxt}>Account details</Text>

          <TextInput
            style={styles.txtInput}
            onChangeText={(text) => this.setState({email:text})}
            placeholder="Email"
            placeholderTextColor="#A9ACBC"
            ref={component => this.email = component}
            underlineColorAndroid='transparent'
            keyboardType="email-address"
          />

           <View style={styles.divider}></View>

           <TextInput
             style={styles.txtInput}
             onChangeText={(text) => this.setState({password:text})}
             placeholder="Password"
             placeholderTextColor="#A9ACBC"
             ref={component => this.password = component}
             underlineColorAndroid='transparent'
             secureTextEntry= {true}
           />

            <View style={styles.divider}></View>

            <TextInput
              style={styles.txtInput}
              onChangeText={(text) => this.setState({confirmPassword:text})}
              placeholder="Confirm Password"
              placeholderTextColor="#A9ACBC"
              ref={component => this.confirmPassword = component}
              underlineColorAndroid='transparent'
              secureTextEntry= {true}
            />

             <View style={styles.divider}></View>

             <TextInput
               style={styles.txtInput}
               onChangeText={(text) => this.setState({username:text})}
               placeholder="Username"
               placeholderTextColor="#A9ACBC"
               ref={component => this.username = component}
               underlineColorAndroid='transparent'
             />

            <PersonalDetails first_name={this.state.first_name} last_name={this.state.last_name} contact={this.state.contact} handleInputChange={this.handleInputChange}/>


            <TouchableHighlight underlayColor='#AA9BFC'  onPress={()=>this.doSave()} style={styles.btnUpdate}>
              <Text style={{color: '#FFFFFF'}}>Create Account</Text>
            </TouchableHighlight>

        </ScrollView>


        {this.state.loading &&
          <View style={styles.overlayLoading}>
            <ActivityIndicator animating  size='large' />
          </View>
        }

        <MessageBarAlert ref='alert' />

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
    color: "#696E74",
    fontSize: 15,
    fontWeight: "600",
    width: SCREENWIDTH,
    textAlign: "left",
    padding: 10,
  },
  txtInput:{
    height: 45,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#FFFFFF',
    width: SCREENWIDTH - 10,
    marginTop: 10,
    fontSize: 15,
  },
  divider:{
    marginLeft: 25,
    marginRight: 25,
    height: 1,
    backgroundColor: 'rgba(131,155,240,0.3)',
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
  helpTxt:{
    color: '#8ED0D6',
    fontSize: 13,
  },
  profileImgWrapper: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  camera_img:{
    width: 140,
    height: 140,
    resizeMode: 'cover'
  },
  cameraIconWrapper:{
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E083FC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -15,
    bottom: 7
  },
  camera_icon_img:{
    width: 22,
    height: 22,
    resizeMode: 'cover'
  },
  btnUpdate:{
    backgroundColor: '#93A3E0',
    borderRadius: 5,
    padding: 12,
    margin: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(131,155,240,0.5)'
  },

});
