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
import PersonalDetails from "../components/PersonalDetails";

import * as UserActions from "../actions/UserActions";
import UserStore from "../stores/UserStore";



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

    this.getRegisterStatus = this.getRegisterStatus.bind(this);

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


  componentWillMount() {
    UserStore.on("change", this.getRegisterStatus);
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar();
    UserStore.removeListener("change", this.getRegisterStatus);
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

  // check register user status response
  getRegisterStatus(){

   let responseJson = UserStore.getRegisterStatus();

   if( responseJson.hasOwnProperty("status") && responseJson.status == 1 ){

     this.doMessage("Brahmi Account successfully created", "INFO");

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
         'Brahmi',
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

     console.log('account create success');

   }
   else{
       this.doMessage("Could not update the details!", "ERROR");
   }


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

          UserActions.register(this.state);

        //   {
        //     email: this.state.email,
        //     password: this.state.password,
        //     confirmPassword: this.state.confirmPassword,
        //     username: this.state.username,
        //
        //   }
        // formData.append("", );
        // formData.append("", );
        // formData.append("", );
        // formData.append("", );
        // formData.append("first_name", this.state.first_name);
        // formData.append("last_name", this.state.last_name);
        // formData.append("contact", this.state.contact);
        // formData.append("got_img", this.state.got_img);


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
