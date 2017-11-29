/**
 * this is where the react native wix navigation takes place
 * @sara
 */
import { Navigation } from 'react-native-navigation';

import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';

Navigation.registerComponent('IPost.Login', () => Login);
Navigation.registerComponent('IPost.Home', () => Home);
Navigation.registerComponent('IPost.UserProfile', () => UserProfile);
Navigation.registerComponent('IPost.CreatePost', () => CreatePost);


const navigatorStyle = {
	  navBarTextColor: '#6875E4',
	  navBarButtonColor: '#6875E4',
    navBarBackgroundColor: '#FFFFFF',//'#839BF0',
    screenBackgroundColor: '#FFFFFF',

    navBarTranslucent: false,
    navBarTransparent: false,
    drawUnderNavBar: false,
    navBarBlur: false,
    navBarHidden: false,

    orientation: 'portrait',
    statusBarTextColorScheme: 'dark',
    statusBarTextColorSchemeSingleScreen: 'dark',
    statusBarHideWithNavBar: false,
    statusBarHidden: false,
  };


  Navigation.startSingleScreenApp({
    screen: {
      screen: 'IPost.Home',
      animated: true,
      title: 'Ipost',
      navigatorStyle
    },
    // drawer: {
  	// 	left: {
  	// 		screen: 'Snappar.Drawer'
  	// 	},
    //   style: {
    //     drawerShadow: 'NO'
    //   },
    //   disableOpenGesture: true,
  	// }
  });
