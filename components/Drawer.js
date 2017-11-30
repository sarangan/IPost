/**
 * @sara
 * left side drawer menu
 */
import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
	Linking,
  AsyncStorage
} from 'react-native';

import {homeNavigator} from '../pages/Home';
import auth from '../auth/auth';
import AppKeys from '../keys/appKeys';


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export default class Drawer extends Component {
	constructor(props) {
		super(props);

    this.state = {
      menu: [
        {
          name: 'Profile',
          type: 'PAGE',
					action: 'PROFILE',
					icon: require('../images/menu_profile.png')
        },
        {
          name: 'Edit Profile',
          type: 'PAGE',
					action: 'EDITPROFILE',
					icon: require('../images/menu_edituser.png')
        },
        // {
        //   name: 'Search',
        //   type: 'PAGE',
				// 	action: 'SEARCH',
				// 	icon: require('../images/menu_search.png')
        // },
        {
          name: 'About',
          type: 'PAGE',
					action: 'ABOUT',
					icon: require('../images/menu_about.png')
        },
        {
          name: 'Privacy Policy',
          type: 'URL',
					action: 'http://www.google.com',
					icon: require('../images/menu_keyhole.png')
        },
        {
          name: 'Terms and Conditions',
					type: 'URL',
					action: 'http://www.google.com',
					icon: require('../images/menu_lock.png')
        },
				// {
        //   name: 'Help',
        //   type: 'PAGE',
				// 	action: 'HELP',
				// 	icon: require('../images/menu_question.png')
        // },
        {
          name: 'Contact us',
          type: 'MAIL',
					action: 'CONTACT',
					icon: require('../images/menu_message.png')
        },
        {
          name: 'Logout',
          type: 'ACTION',
					action: 'LOGOUT',
					icon: require('../images/menu_logout.png')
        }

      ],

    };
	}



	_toggleDrawer() {
		this.props.navigator.toggleDrawer({
			to: 'closed',
			side: 'left',
			animated: true
		});
	}


	takeAction(menu){

		if(menu.type == "URL" ){
			this._toggleDrawer();
			let url = encodeURI(menu.action);

			Linking.openURL(url).catch(err => console.error('An error occurred', err));

		}
		else if(menu.type == "MAIL"){

			this._toggleDrawer();
			let url = encodeURI("mailto:sarangan12@gmail.com?subject=I-Post");

			Linking.openURL(url).catch(err => console.error('An error occurred', err));

		}
		else if(menu.type == "PAGE"){
			this._toggleDrawer();
			if(menu.action ==  "PROFILE"){
				homeNavigator.push({
	        screen: 'IPost.Profile',
	        title: 'Profile',
	        animated: true,
	        //animationType: 'fade',
	        passProps: { user_id: auth.USER.user_id},
	      });

			}
      else if(menu.action == "EDITPROFILE"){
        homeNavigator.push({
          screen: 'IPost.EditProfile',
          title: 'Edit Profile',
          animated: true,
          //animationType: 'fade',
          passProps: { },
        });
      }
			else if(menu.action == "SEARCH"){
				homeNavigator.push({
	        screen: 'IPost.Search',
	        title: 'Search',
	        animated: true,
	        //animationType: 'fade',
	        passProps: { },
	      });
			}
			else if(menu.action == "ABOUT"){
				homeNavigator.push({
	        screen: 'IPost.About',
	        title: 'About us',
	        animated: true,
	        //animationType: 'fade',
	        passProps: { },
	      });
			}
			else if(menu.action == "HELP"){

				this.props.navigator.showModal({
	          screen: "IPost.Guide",
	          title: '',
	          animationType: 'slide-up',
	          navigatorStyle:{
							navBarHidden: true,
	          },
	          passProps: {
	           }
	      });

			}

		}
    else if(menu.type == "ACTION"){

        Alert.alert(
            'I-Post',
            'Do you want to logout?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'YES', onPress: () =>{

                let keys = [AppKeys.LOGINKEY];
                AsyncStorage.multiRemove(keys, (err) => {
                  auth["AUTHTOKEN"] = '';
                  auth["ISLOGIN"] =  false;
                  auth["USER"] =  {};

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

                });

              }},
            ],
            { cancelable: false }
          )

    }

	}

  getMenus(){
    let menus = [];
    for(let i =0, l = this.state.menu.length; i < l; i++){
      menus.push(
        <TouchableHighlight underlayColor="transparent" onPress={this.takeAction.bind(this, this.state.menu[i]) } key={i}>
						<View style={styles.drawerListItem}>
							<Image style={ styles.menuIcon } source={ this.state.menu[i].icon } />
	            <Text style={styles.drawerListItemText}>
	              {this.state.menu[i].name}
	            </Text>
	          </View>
        </TouchableHighlight>
      )
    }
    return(
      menus
    );
  }

	render() {

		return (

        <View style={styles.container}>
          <View style={styles.drawerList}>

            {
              this.getMenus()
            }

          </View>

					<View style={styles.applogopowerwrapper}>

						<View style={styles.appNameWrapper}>

							<Image style={styles.ipostLogo} source={require('../images/ipost_logo.png')} />
							<Text style={styles._version}>
	              Version 1.0
	            </Text>

	          </View>

						<View style={styles.powertxtWrapper}>
							<Text style={styles.powertxt}>
								Developed by Sara
							</Text>
						</View>

					</View>


        </View>


		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    height: SCREENHEIGHT,
    paddingTop: 50,
    paddingBottom: 30,
    flexDirection: 'column',
    backgroundColor: '#333333'
  },
  drawerList: {
    justifyContent: 'flex-start',
  },
  drawerListIcon: {
    width: 27
  },
  drawerListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
    paddingTop: 20,
		paddingBottom: 30,
		marginLeft: 15,
		marginRight: 15,
		// borderBottomWidth: 0.5,
		// borderColor: '#f7f7f7'
  },
  drawerListItemText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 15,
    flex: 1,
    flexDirection: 'row',

  },
  linearGradient: {
    // top: 0,
    // left: 0,
    // right: 0,
    // height: 248,
    // position: 'absolute'
    flex: 1
  },

	appNameWrapper:{
		//flex: 1,
		flexDirection: 'row',
		alignContent: 'flex-start',
		alignItems: 'center',
	},
	appNameS:{
		color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    paddingLeft: 15,
    backgroundColor: 'transparent',
    //marginBottom: 2,
		//paddingTop: 6,
	},
  appName:{
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    paddingLeft: 0,
    backgroundColor: 'transparent',
    marginBottom: 2,
		letterSpacing: 0.5
  },
  _version: {
    color: '#FAFAFA',
    fontSize: 10,
		fontWeight: '600',
    //paddingLeft: 3,
    backgroundColor: 'transparent',
		paddingTop: 12
  },
	menuIcon:{
		width: 22,
		height: 22,
	},
	applogopowerwrapper:{
		flexDirection: 'column',
		alignContent: 'flex-start',
		alignItems: 'flex-start',
		alignSelf: 'flex-start',
	},
	powertxtWrapper:{
		paddingLeft: 15,
	},
	powertxt: {
    color: '#FAFAFA',
    fontSize: 9,
		fontWeight: '600',
    paddingLeft: 3,
    backgroundColor: 'transparent',
  },
	ipostLogo:{
    width: 50,
		height: 50,
    resizeMode: 'contain',
		marginLeft: 15,
  }
});
