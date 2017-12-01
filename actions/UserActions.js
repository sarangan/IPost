import dispatcher from "../dispatcher";
import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';

export function register({email, password, confirmPassword, username, first_name, last_name, contact, got_img} ) {

  let formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("confirmPassword", confirmPassword);
  formData.append("username", username);
  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("contact", contact);
  formData.append("got_img", got_img);
  if(got_img == 1){
    formData.append('photo', {uri: img_url, type: 'image/jpg', name: 'image.jpg'});
  }

  fetch(
      config.ENDPOINT_URL + 'auth/register',
      {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/octet-stream',
                'Content-Type': 'multipart/form-data',
                'Origin': '',
                'Host': 'propertyground.co.uk',
                'timeout': 10 * 60
      },
      body: formData
  })
  .then((response) => response.json())
  .then((responseJson) => {

    console.log(responseJson);
    dispatcher.dispatch({
      type: "USER_REGISTER",
      data: responseJson,
    });


  })
  .catch((error) => {
    console.error(error);

  });

}

export function updateProfile({first_name, last_name, contact, got_img} ) {

  let formData = new FormData();
  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("contact", contact);
  formData.append("got_img", got_img);
  if(got_img == 1){
    formData.append('photo', {uri: img_url, type: 'image/jpg', name: 'image.jpg'});
  }

  fetch(
      config.ENDPOINT_URL + 'post/updateuser',
      {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/octet-stream',
                'Content-Type': 'multipart/form-data',
                'Origin': '',
                'Host': 'propertyground.co.uk',
                'timeout': 10 * 60,
                'Authorization': auth.AUTHTOKEN
      },
      body: formData
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log('update user ');
    console.log(responseJson);
    dispatcher.dispatch({
      type: "UPDATE_USER",
      data: responseJson,
    });


  })
  .catch((error) => {
    console.error(error);

  });

}
