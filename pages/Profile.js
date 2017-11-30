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
  AsyncStorage,
  FlatList,
  Dimensions,
  Button,
  ActivityIndicator
} from 'react-native';

import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';

import * as PostActions from "../actions/PostActions";
import PostStore from "../stores/PostStore";
import Simage from "../components/Simage";
import ParallaxScrollView from 'react-native-parallax-scroll-view';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 40;
const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;

export default class Profile extends Component<{}> {



  constructor(props){
    super(props);

    this.state = {
      posts: [],
      loading: false,
      page: 1,
      error: null,
      pageSize: 30,
      totalRecords: 0,
      user_id: this.props.user_id
    };

    this.getMyPosts = this.getMyPosts.bind(this);

  }


  componentWillMount(){

    PostStore.on("change", this.getMyPosts);
  }

  componentWillUnmount() {
    PostStore.removeListener("change", this.getMyPosts);
  }

  componentDidMount(){
    this.setState({
      loading: true,
    }, ()=>{
        PostActions.getMyPosts(this.state.page, this.state.user_id);
    });
  }


 // get user posts
 getMyPosts(){

  let {posts, user} = PostStore.getMyPosts();

  if(posts.length > 0){ //get all posts
    console.log(posts);
    console.log(user);

    this.setState({
      loading: false,
      posts: this.state.page === 1 ? posts : [...this.state.posts, ...responseJson.posts],
      totalRecords: posts.length,
      user: user
    });

  }

 }


  openLightBox = (img) =>{

    this.props.navigator.showLightBox({
      screen: "IPost.ImageLightBox",
        passProps: {
          imagePath: img,
          images: JSON.stringify([img]),
          index: 0
        },
        style: {
         backgroundBlur: "dark",
          //backgroundColor: "#ff000080",
          backgroundColor: "#333333",
          tapBackgroundToDismiss: true
       }
    });

  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          //marginTop: 20,
        }}
      >
        <ActivityIndicator animating />
      </View>
    );
  };

  renderSeparator = () => {
   return (
     <View
       style={{
          height: 5,
          alignSelf: 'flex-end',
          width: '100%',
          marginBottom: 2,
          marginTop: 2,
          //backgroundColor: '#E8F0F6'
       }}
     />
   );
 };

 renderHeader = () => {
   return null;
 }

 handleRefresh = () => {
   this.setState(
     {
       loading: true,
       posts: [],
       page: 1
     },
     () => {
       PostActions.getMyPosts(this.state.page, this.state.user_id); // login check ok to get all posts

     }
   );
 };

 // infitie scroll
 handleLoadMore = () =>{
   console.log('reached end')
   //let pages = Math.floor( this.state.totalRecords / 30);  // records per page
   if(this.state.totalRecords >=  30){
     this.setState({
       page : this.state.page + 1,
       loading: true,
     }, ()=>{
       PostActions.getMyPosts(this.state.page, this.state.user_id);
     })
   }

 }

 renderEmptyData = () =>{
    return(
      <View style={{ flex: 1, width: SCREENWIDTH,  alignContent:'center', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} >
        <Image style={{ width: 80, height: 80, marginTop: SCREENHEIGHT / 3 }} source={require('../images/no_data.png')} />
      </View>
    );
  }

  // get user full name
  getTitle = (item) =>{
    let fullname = item.first_name + ' ' +  item.last_name;
    let title = fullname.length > 30? fullname.substring(0, 30) : fullname;
    return title;
  }

  // list view avatar
  getUserAvatar = (avatar_url) =>{

    let avatar = <Image style={ styles.usericon } source={require('../images/darth-vader.png')} />
    if(avatar_url){
      avatar =  <Image style={ styles.usericon } source={ {uri:  config.SERVER_IMAGE_PATH + 'users/300_'+ avatar_url}} />
    }
    return avatar;

  }

  // user profile avatar
  getProfileAvatar = () =>{

    let avatar = <Image style={ styles.avatar } source={require('../images/darth-vader.png') } />
    if(this.state.user && this.state.user.hasOwnProperty('img_url') && this.state.user.img_url){

      return (
        <TouchableHighlight underlayColor="transparent" onPress={()=>this.openLightBox(config.SERVER_IMAGE_PATH + 'users/300_'+ this.state.user.img_url)}>
        <Image style={ styles.avatar } source={{
          uri: config.SERVER_IMAGE_PATH + 'users/300_'+ this.state.user.img_url
        }}/>
        </TouchableHighlight>
      );
    }
      return avatar;

  }

  //small sticky avatar
  getProfileStickyAvatar = () =>{

    let avatar = <Image style={ styles.stickyavatar } source={require('../images/darth-vader.png') } />
    if(this.state.user && this.state.user.hasOwnProperty('img_url') && this.state.user.img_url){
      avatar = <Image style={ styles.stickyavatar } source={{
        uri: config.SERVER_IMAGE_PATH + 'users/300_'+ this.state.user.img_url
      }}/>
    }
    return avatar;

  }

  getUsername =() =>{
    let username = '';
    if(this.state.user && this.state.user.hasOwnProperty('username') && this.state.user.username){
        username =  this.state.user.username;
    }

    return username;
  }

  getFullname =() =>{
    let fullname = '';
    if(this.state.user && this.state.user.hasOwnProperty('first_name') && this.state.user.first_name){
        fullname =  this.state.user.first_name + ' ' + this.state.user.last_name;
    }

    return fullname;
  }

  _renderItem = ({item}) => (

    <TouchableHighlight  underlayColor='transparent' aspectRatio={1} >
        <View style={styles.wrapper}>

          <View style={styles.header}>

                {this.getUserAvatar(item.avatar_url)}

  					  <View style={styles.header_item}>
  						      <Text style={styles.header_text} numberOfLines={1}>{this.getTitle(item)} <Text style={styles.header_text_symbol} numberOfLines={1}>▸</Text>
                      <Text style={styles.header_text_sub} numberOfLines={1}>{item.username}</Text>
                    </Text>
                    <Text style={styles.header_data_text} numberOfLines={1}>{item.postdate}</Text>
  					  </View>

  				</View>

          {item.img_url &&

            <TouchableHighlight underlayColor="transparent" onPress={()=>this.openLightBox(config.SERVER_IMAGE_PATH + 'posts/600_'+ item.img_url )} >

              <View style={styles.body} >

                  <Simage
                  source={config.SERVER_IMAGE_PATH + 'posts/600_'+ item.img_url}
                  imgstyle={styles.bodyImage}
                  navigator={this.props.navigator}
                  />

      				</View>
            </TouchableHighlight>
          }

  				<View style={styles.body}>
            <Text style={styles.news_item_text}>{item.body}</Text>
  				</View>


          <View style={styles.actionwrapper}>


  				</View>

  			</View>

    </TouchableHighlight>
  );


  renderList(){
     let _keyExtractor = (item, index) => index;
     return(
       <FlatList
         contentContainerStyle={styles.list}
         data={this.state.posts}
         keyExtractor={_keyExtractor}
         renderItem={this._renderItem}
         ListFooterComponent={this.renderFooter}
         ItemSeparatorComponent={this.renderSeparator}
         extraData={this.state}
         //ListHeaderComponent={this.renderHeader}
         //onEndReached={this.handleLoadMore}
         //onEndReachedThreshold={10}
         refreshing={this.state.loading}
         onRefresh={this.handleRefresh}
         ListEmptyComponent={this.renderEmptyData}
         //horizontal={false}
       />
     );
   }



  render() {

    let _keyExtractor = (item, index) => index;

    return(
      <View style={styles.fill}>

          <ParallaxScrollView

            onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + 20 > e.nativeEvent.contentSize.height){
                        if (!this.overThreshold) {
                            console.log("on read end");
                            this.handleLoadMore();
                            this.overThreshold = true;
                        }
                    }else {
                        if (this.overThreshold) this.overThreshold = false;
                    }


           }}

            headerBackgroundColor="#F9F9F9"
            backgroundColor="#F9F9F9"
            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
            backgroundSpeed={10}
            // backgroundColor="#e8e8e8"
             contentBackgroundColor="#F9F9F9"

            renderBackground={() => (

              <View key="background">
                <Image style={{
                  width: SCREENWIDTH,
                  height: PARALLAX_HEADER_HEIGHT }} source={require('../images/blur.jpg')} />

                <View style={{position: 'absolute',
                              top: 0,
                              width: SCREENWIDTH,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
              </View>

            )}

            renderForeground={() => (
              <View key="parallax-header" style={ styles.parallaxHeader }>

                  {this.getProfileAvatar()}

                <Text style={ styles.sectionTitleText }>
                  {this.getFullname()}
                </Text>
                <Text style={ styles.sectionUserIdText }>
                  {this.getUsername()}
                </Text>
              </View>
            )}

            renderStickyHeader={() => (
              <View key="sticky-header" style={styles.stickySection}>
                {this.getProfileStickyAvatar()}
                 <Text style={styles.stickySectionText}>{this.getFullname()}</Text>
              </View>
            )}

            >
            <View style={{ alignItems: 'flex-start', flex: 1 }}>
              <Text style={styles.divTxt}>Posts</Text>
              {this.renderList()}

            </View>
        </ParallaxScrollView>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4'
  },
  rowWrapper:{
    paddingLeft: 5,
    paddingRight: 0,
    paddingTop: 5,
    paddingBottom: 5,
    width: SCREENWIDTH,
    backgroundColor: '#FFFFFF'
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'column',
    width: SCREENWIDTH
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

  wrapper: {
   flex: 1,
   marginBottom: 0,
   backgroundColor:'#ffffff',
 },
 header: {
   backgroundColor: '#FFFFFF',
   paddingTop: 10,
   paddingBottom: 20,
   flex: 1,
   justifyContent: 'flex-start',
   flexDirection: 'row'
 },
 body: {
   flex: 9,
 },
header_item: {
 paddingLeft: 10,
 paddingRight: 5,
 justifyContent: 'flex-start',
  flex: 1
},
header_text: {
 color: '#64696F',
  fontSize: 15,
  //lineHeight: 14,
  flex: 0,
  height: 20
},
header_text_symbol: {
  fontSize: 15,
  color: '#64696F',
  textAlignVertical: 'center',
  lineHeight: 15,
  paddingLeft: 5,
  marginLeft: 3
},
header_text_sub: {
  marginLeft: 3,
  fontSize: 14,
  color: '#93A3E0',
},
usericon:{
  width: 40,
  height: 40,
  borderRadius: 20,
  marginLeft: 10,
  //resizeMode: 'contain'
},
header_data_text:{
  color: '#9E9E9E',
  fontSize: 10,
},
news_item_text: {
 color: '#9E9E9E',
 fontSize: 13,
 paddingTop: 10,
 paddingBottom: 20,
 paddingRight: 5,
 paddingLeft: 5
},
divider: {
  flex: 1,
  height: 1,
  backgroundColor: '#EEEEEE',
  marginBottom: 10
},
actionwrapper:{
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexDirection: 'row',
  marginBottom: 10,
  paddingLeft: 10,
  paddingRight: 10
},
  bodyImage:{
    width: SCREENWIDTH,
    height: SCREENWIDTH * 0.75,
    flex: 1,
    //resizeMode: 'cover',
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE
  },
  stickyavatar:{
    borderRadius: 30 / 2,
    width: 30,
    height: 30,
    paddingTop: 3,
    marginRight: 3
  },
  sectionUserIdText:{
    fontSize: 16,
    color: '#93A3E0'
  },
  sectionTitleText:{
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  stickySection:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start'
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

});
