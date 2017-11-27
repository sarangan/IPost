/**
 * this is where the react native wix navigation takes place
 * @sara
 */
import { Navigation } from 'react-native-navigation';

import Home from './pages/Home';

Navigation.registerComponent('IPost.Home', () => Home);


const navigatorStyle = {
	  navBarTextColor: 'white',
	  navBarButtonColor: 'white',
    navBarBackgroundColor: '#839BF0',
    screenBackgroundColor: '#FFFFFF',

    navBarTranslucent: false,
    navBarTransparent: false,
    drawUnderNavBar: false,
    navBarBlur: false,
    navBarHidden: false,

    orientation: 'portrait',
    statusBarTextColorScheme: 'light',
    statusBarTextColorSchemeSingleScreen: 'light',
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
