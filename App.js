/**
 * this is where the react native wix navigation takes place
 * @sara
 */
import { Navigation } from 'react-native-navigation';

import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import ImageLightBox from './components/ImageLightBox';
import Drawer from './components/Drawer';
import Guide from './pages/Guide';

Navigation.registerComponent('IPost.Login', () => Login);
Navigation.registerComponent('IPost.Home', () => Home);
Navigation.registerComponent('IPost.Profile', () => Profile);
Navigation.registerComponent('IPost.EditProfile', () => EditProfile);
Navigation.registerComponent('IPost.UserProfile', () => UserProfile);
Navigation.registerComponent('IPost.CreatePost', () => CreatePost);
Navigation.registerComponent('IPost.ImageLightBox', ()=> ImageLightBox);
Navigation.registerComponent('IPost.Drawer', () => Drawer);
Navigation.registerComponent('IPost.About', () => About);
Navigation.registerComponent('IPost.Guide', () => Guide);




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
      title: 'Brahmi',
      navigatorStyle
    },
    drawer: {
  		left: {
  			screen: 'IPost.Drawer'
  		},
      style: {
        drawerShadow: 'NO'
      },
      disableOpenGesture: true,
  	}
  });
