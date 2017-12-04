/**
 * @sara
 * Image light box to show larger image
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TouchableHighlight,
  Share
} from 'react-native';

import TImage from 'react-native-transformable-image';
// import Swiper from 'react-native-swiper';
//import Simage from "./Simage";

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export default class ImageLightBox extends  Component<{}> {
  static navigatorButtons = {
    rightButtons: [
     {
       icon: require('../images/share_img.png'),
       id: 'share'
     }
   ],
   };

  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state ={
      // images: JSON.parse(this.props.images),
      // index: this.props.index? this.props.index: 0,
      // pageIndex: this.props.index? this.props.index: 0,
    };


  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if(event.id == 'cancel'){

        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });

      }
      else if(event.id == 'share'){
        this.shareImg();
      }

    }
  }


  //share image
  shareImg=()=>{


    Share.share({
      message: 'Shared via Brahmi',
      title: 'Snappar',
      url: this.props.imagePath
    }, {
      dialogTitle: 'Brahmi - Share image',
    })
    .then(
        this._showResult
    )
    .catch(err => console.log(err))


  }



  render() {


    return (
      <View style={styles.container}>


            <TImage
                          source={{ uri: this.props.imagePath}}
                          style={{width:  SCREENWIDTH - 50, height:  SCREENHEIGHT - 100, }}
                        >
                        </TImage>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREENHEIGHT,
    backgroundColor: '#333333'
    //flexDirection: 'column',
  },

});
