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

import ImagePicker from 'react-native-image-crop-picker';

import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';


import * as PostActions from "../actions/PostActions";
import PostStore from "../stores/PostStore";


export default class CreatePost extends Component<{}> {

  static navigatorButtons = {
     rightButtons: [
       {
         title: 'Close',
         id: 'cancel'
       }
     ],
   };


  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      body: '',
      type: 1,
      img_url: '',
      loading: false
    };

    this.getPostStatus = this.getPostStatus.bind(this);

  }

  //navigator button actions
  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if(event.id == 'cancel'){

        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });

      }

    }
  }

  componentWillMount() {
    PostStore.on("change", this.getPostStatus);
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar();
    PostStore.removeListener("change", this.getPostStatus);
  }

  componentDidMount(){
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  // check the post text status
  getPostStatus(){

   let status = PostStore.getPostStatus();

   if(status){ // is posted
     this.setState({
       loading: false,
       body: '',
       type: 1,
       img_url: ''
     }, ()=>{
       this.doMessage("Successfully posted", "INFO");
       PostActions.getAllPosts();
     });

   }

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

  doPost = () =>{

    if(!this.state.body){
      this.doMessage("Please provide text body!", "ERROR");
    }
    else{

      this.setState({
        loading: true,

      }, ()=>{
        PostActions.postText(this.state.body, this.state.img_url, this.state.type);
      });

    }

  }

  //open camera
  openCamera = () =>{

      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: false
      }).then(image => {
        console.log(image);
        this.setState({
          img_url: image.path,
          type: 2,
        });
      });

  }


  openPhotoLib = () =>{

    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: false
      }).then(image => {
        console.log(image);//
        this.setState({
          img_url: image.path,
          type: 2,
        });
    });

  }

  // remove image from state
  DeleteImg = () =>{
    this.setState({
      img_url: '',
      type: 1,
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

  getClearBtn = () =>{
    let img = null;

    if(this.state.type == 2){
      img = <TouchableHighlight style={
          {
            flex:0,
            padding: 5,
            position: 'absolute',
            top: '5%',
            right: '2%'
          }
        }
        underlayColor='transparent' onPress={()=>this.DeleteImg()}>
        <Image
          source={require('../images/close.png')}
          style = {{width: 20, height: 20, resizeMode: 'contain',}}
        />
      </TouchableHighlight>

    }

    return (img);

  }


  render() {
    return (
      <View style={styles.fill}>
        <ScrollView>

          <TextInput
            style={[styles.txtInput, {height: 150, textAlignVertical: "top"}]}
            onChangeText={(text) => this.setState({body:text})}
            placeholder="What are you thinking about?"
            placeholderTextColor="#A9ACBC"
            multiline = {true}
            numberOfLines = {5}
            value={this.state.body}
            underlineColorAndroid='transparent'
          />

          <View style={styles.camWrapper}>
              {this.getImage()}
              { this.getClearBtn()}

          </View>

        </ScrollView>

        <MessageBarAlert ref='alert' />

            <View style={{
              flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 15, backgroundColor: '#F7F7F9', width: SCREENWIDTH,
              padding: 20,
            }}>

              <View style={{flex: 0, flexDirection: 'row', width: 60, alignItems: 'center', justifyContent: 'flex-start', }}>

                  <TouchableHighlight underlayColor="transparent" style={{flex: 0, alignSelf: 'flex-start'}} onPress={()=>this.openPhotoLib()}>
                    <Image
                      source={require('../images/photos-lib.png')}
                      style = {{width: 30, height: 30, resizeMode: 'contain', }}
                    />
                  </TouchableHighlight>

                  <TouchableHighlight underlayColor="transparent" style={{flex: 0, alignSelf: 'flex-start'}} onPress={()=>this.openCamera()}>
                    <Image
                      source={require('../images/camera.png')}
                      style = {{width: 30, height: 30, resizeMode: 'contain', }}
                    />
                  </TouchableHighlight>

              </View>

                <TouchableHighlight style={{ flex: 0, backgroundColor: '#6875E4', borderRadius: 3, padding: 8, width: 70 }} onPress={()=>this.doPost()}>
                  <Text style={{color:'#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Post</Text>
                </TouchableHighlight>

            </View>

            {this.state.loading &&
              <View style={styles.overlayLoading}>
                <ActivityIndicator animating  size='large' />
              </View>
            }


      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  divTxt:{
    backgroundColor: "#F7F7F9",
    width: SCREENWIDTH,
    padding: 10,
  },
  txtInput:{
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    width: SCREENWIDTH - 10,
    marginTop: 10,
    fontSize: 15,
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
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
