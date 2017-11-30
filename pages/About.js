/**
 * @sara
 * About page
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  Linking
} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export default class About extends Component{


  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  openUrl =(url) =>{

    url = encodeURI(url);

    Linking.openURL(url).catch(err => console.error('An error occurred', err));

  }

  productContent(){
    return(



            <View style={styles.fill}>

                <Image style={styles.aboutBg} source={require('../images/about_bg.jpg')} />

                <View style={styles.content}>
                  <ScrollView>
                    <Text style={styles.txt}>
                      I-Post enables users to post what they feel like to share with other people around the world. This is the first social enabled application meant to connect humans and aliens. 
                    </Text>
                    <Text style={styles.subTxt}>
                      An app by <Text style={styles.linkTxt}>Sarangan.</Text>
                    </Text>
                  </ScrollView>
                </View>

              </View>

        );
  }

  render(){
    return(
        this.productContent()
    );
  }
}


const styles = StyleSheet.create({
  fill:{
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333'
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    //backgroundColor: '#FF2B2A',
    width: SCREENWIDTH,
    height: SCREENHEIGHT,
    backgroundColor: 'transparent',
  },
  aboutBg:{
    width: SCREENWIDTH,
    height: SCREENWIDTH / 2,
    resizeMode: 'cover'
  },
  txt:{
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 23
    //fontWeight: '500',
    //textShadowColor: "#F5F5F5",
    //textShadowOffset: {width: 0.5, height: 0.5}
  },
  subTxt:{
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 23
  },
  linkTxt:{
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#e1e1e1'
  }

});
