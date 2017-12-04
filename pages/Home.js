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

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;


import * as PostActions from "../actions/PostActions";
import PostStore from "../stores/PostStore";
import Simage from "../components/Simage";

export let homeNavigator = null; // to use in drawer


export default class Home extends Component<{}> {

  static navigatorButtons = {

    leftButtons: [
      {
        icon: require('../images/hamburger_menu.png'),
        id: 'menu'
      }
    ],
    rightButtons: [
     {
       icon: require('../images/refresh.png'),
       id: 'refresh'
     }
   ],

 };


  constructor(props){
    super(props);
    homeNavigator = this.props.navigator;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      posts: [],
      loading: false,
      page: 1,
      error: null,
      pageSize: 30,
      totalRecords: 0
    };

    this.getPosts = this.getPosts.bind(this);
    this.getToggleLikeStatus = this.getToggleLikeStatus.bind(this); // to toggle like

  }

  onNavigatorEvent(event) {
   if (event.type == 'NavBarButtonPress') {

     if (event.id == 'refresh') {

       this.setState(
         {
           loading: true,
           posts: [],
           page: 1,
           totalRecords: 0
         },
         () => {
           PostActions.getAllPosts(this.state.page);
         }
       );

     }
     else if (event.id == 'menu') {

       this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });

     }
   }
 }

  componentWillMount(){

    // let keys = [AppKeys.LOGINKEY];
    // AsyncStorage.multiRemove(keys, (err) => {
    //
    // });

    AsyncStorage.getItem(AppKeys.SHOWGUIDE, (err, result) => {
      console.log('show guide');
      console.log(result);
      if(result){
        //user already saw it
        this.checkAuth();
      }
      else{
        this.checkAuth();
        this.showGuide();
      }
    });



    PostStore.on("change", this.getPosts);
    PostStore.on("change", this.getToggleLikeStatus);

  }

  componentWillUnmount () {
    PostStore.removeListener("change", this.getPosts);
    PostStore.removeListener("change", this.getToggleLikeStatus);
  }

  showGuide = () =>{

    this.props.navigator.showModal({
       screen: "IPost.Guide",
       title: '',
       animationType: 'slide-up',
       navigatorStyle:{
         navBarHidden: true,
       },
   });

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

         console.log('auth');
         console.log(auth);

         this.setState({
           loading: true,
         }, ()=>{
             PostActions.getAllPosts(this.state.page); // login check ok to get all posts
         });




       }
       else{

         this.props.navigator.showModal({
             screen: "IPost.Login",
             title: 'Brahmi',
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

       this.props.navigator.showModal({
           screen: "IPost.Login",
           title: 'Brahmi',
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

 // check the post text status
 getPosts(){

  let posts = PostStore.getPosts();

  if(posts.length > 0){ //get all posts
    console.log(posts);

    this.setState({
      loading: false,
      posts: this.state.page === 1 ? posts : [...this.state.posts, ...responseJson.posts], // concat posts when doing pagination
      totalRecords: posts.length
    });

  }
  else{
    this.setState({
      loading: false,
    });

  }

 }

  //listing toggle like
  getToggleLikeStatus(){
    let status = PostStore.getToggleLikeStatus();
    console.log('status toggle success');


    if(status){
      let posts = this.state.posts;
      let post_id = PostStore.getPostId();
      console.log('post id', post_id);

      for(let i=0 , l = posts.length; i < l; i++){
        if(post_id == posts[i].post_id){
          //this this object to toggle
          let post_like = posts[i].ilike;
          posts[i].ilike =  (post_like == 1 ? 0 : 1);
          posts[i].count_likes =  (post_like == 1 ? (Number(posts[i].count_likes) - 1) : (Number(posts[i].count_likes) + 1) );
          console.log('my ost id', posts[i].post_id);
          break;
        }
      }

      this.setState({
        posts
      })

    }

  }

  addPost = () => {

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


  // get likes
  getLikes = (item) =>{

    let heart = <Image style={ styles.heart_icon } source={require('../images/nolike.png')} />

    //check whether i like the post or not
    if(item.ilike > 0){
      heart =  <Image style={ styles.heart_icon } source={require('../images/liked.png')} />
    }

    return heart;

  }

  togglelike = (item) =>{

    PostActions.toggleLike(item.post_id);
  }

  //image light box
  openLightBox = (img) =>{

    // this.props.navigator.showLightBox({
    //   screen: "IPost.ImageLightBox",
    //     passProps: {
    //       imagePath: img,
    //       images: JSON.stringify([img]),
    //       index: 0
    //     },
    //     style: {
    //      backgroundBlur: "dark",
    //       //backgroundColor: "#ff000080",
    //       backgroundColor: "#333333",
    //       tapBackgroundToDismiss: true
    //    }
    // });

    this.props.navigator.showModal({
        screen: "IPost.ImageLightBox",
        title: "",
        animationType: 'slide-up',
        navigatorStyle:{
          navBarTextColor: '#6875E4',
          navBarButtonColor: '#6875E4',
          navBarBackgroundColor: '#333333',//'#839BF0',
          screenBackgroundColor: '#FFFFFF',
          navBarBlur: false,
          screenBackgroundColor: '#FFFFFF',
          navBarTransparent: false,
       },
        passProps: {
           imagePath: img,
        },
    });



  }

  // open user profile
  openProfile = (user_id) =>{

    this.props.navigator.push({
      screen: 'IPost.Profile',
      title: 'Profile',
      animated: true,
      //animationType: 'fade',
      backButtonTitle: "Back",
      passProps: {
        user_id,
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
       PostActions.getAllPosts(this.state.page); // login check ok to get all posts

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
       PostActions.getAllPosts(this.state.page);
     })
   }

 }


 //ref stackoverflow
 timeSince = (date) => {

  var seconds = Math.floor((new Date() - new Date(date) ) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
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

  getUserAvatar = (avatar_url) =>{

    let avatar = <Image style={ styles.usericon } source={require('../images/darth-vader.png')} />
    if(avatar_url){
      avatar =  <Image style={ styles.usericon } source={ {uri:  config.SERVER_IMAGE_PATH + 'users/300_'+ avatar_url}} />
    }
    return avatar;

  }

  _renderItem = ({item}) => (

    <TouchableHighlight  underlayColor='transparent' aspectRatio={1} >
        <View style={styles.wrapper}>

          <View style={styles.header}>
              <TouchableHighlight underlayColor="transparent" onPress={()=>this.openProfile(item.user_id)}>
                {this.getUserAvatar(item.avatar_url)}
              </TouchableHighlight>

  					  <View style={styles.header_item}>
  						      <Text style={styles.header_text} numberOfLines={1} onPress={()=>this.openProfile(item.user_id)}>{this.getTitle(item)} <Text style={styles.header_text_symbol} numberOfLines={1}>▸</Text>
                      <Text style={styles.header_text_sub} numberOfLines={1}>{item.username}</Text>
                    </Text>
                    <Text style={styles.header_data_text} numberOfLines={1}>{this.timeSince(item.createdAt)}</Text>
  					  </View>

  				</View>



  				<View style={styles.body}>
            <Text style={styles.news_item_text}>{item.body}</Text>
  				</View>

          {item.img_url &&

            <TouchableHighlight underlayColor="transparent" onPress={()=>this.openLightBox(config.SERVER_IMAGE_PATH + 'posts/600_'+ item.img_url )} >

              <View style={styles.body}>

                  <Simage
                  source={config.SERVER_IMAGE_PATH + 'posts/600_'+ item.img_url}
                  imgstyle={styles.bodyImage}
                  navigator={this.props.navigator}
                  />

      				</View>
            </TouchableHighlight>
          }


          <View style={styles.actionwrapper}>

            {item.count_likes > 0 &&
              <Text style={{color: '#8EABF5'}}> {item.count_likes} likes</Text>
            }
            {item.count_likes == 0 &&
              <Text style={{padding: 1}}></Text>
            }
            <TouchableHighlight underlayColor="transparent" onPress={()=>this.togglelike(item)} >
              {this.getLikes(item)}
            </TouchableHighlight>
          </View>

  			</View>

    </TouchableHighlight>
  );




  render() {

    let _keyExtractor = (item, index) => index;

    return(
      <View style={styles.fill}>

        <FlatList
          contentContainerStyle={styles.list}
          data={this.state.posts}
          keyExtractor={_keyExtractor}
          renderItem={this._renderItem}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          extraData={this.state}
          //ListHeaderComponent={this.renderHeader}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={10}
          refreshing={this.state.loading}
          onRefresh={this.handleRefresh}
          ListEmptyComponent={this.renderEmptyData}
          //horizontal={false}
        />

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
   fontSize: 14,
   paddingTop: 2,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  bodyImage:{
    width: SCREENWIDTH,
    height: SCREENWIDTH * 0.75,
    flex: 1,
  },
  heart_icon:{
    width: 30,
    height: 30,
  }

});
