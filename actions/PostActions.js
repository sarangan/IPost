import dispatcher from "../dispatcher";
import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';


export function postText(body, img_url, type=1) {//type 1 is text 2 is image and 3 location and so on

    let formData = new FormData();
    formData.append("body", body);
    formData.append("type", type);


    if(type == 2){
      formData.append('photo', {uri: img_url, type: 'image/jpg', name: 'image.jpg'});
    }

    fetch(
        config.ENDPOINT_URL + 'post/posttext',
        {
        method: 'POST',
        headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                  'Origin': '',
                  'Host': 'propertyground.co.uk',
                  'timeout': 10 * 60,
                  'Authorization': auth.AUTHTOKEN
        },
        body: formData,

    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);

      dispatcher.dispatch({
        type: "POST_TEXT",
        data: responseJson,
      });

    })
    .catch((error) => {
        console.error(error);


    });

}

//get all posts for home page
export function getAllPosts(page=1){

  let formData = new FormData();
  formData.append("page", page);

  fetch(
      config.ENDPOINT_URL + 'post/getposts',
      {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Origin': '',
                'Host': 'propertyground.co.uk',
                'timeout': 10 * 60,
                'Authorization': auth.AUTHTOKEN
      },
      body: formData,

  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);

    dispatcher.dispatch({
      type: "GET_ALL_POSTS",
      data: responseJson,
    });

  })
  .catch((error) => {
      console.error(error);

  });

}

//get all posts for home page
export function getMyPosts(page=1, user_id){

  let formData = new FormData();
  formData.append("page", page);
  formData.append("user_id", user_id);

  fetch(
      config.ENDPOINT_URL + 'post/getmyposts',
      {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Origin': '',
                'Host': 'propertyground.co.uk',
                'timeout': 10 * 60,
                'Authorization': auth.AUTHTOKEN
      },
      body: formData,

  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);

    dispatcher.dispatch({
      type: "GET_MY_POSTS",
      data: responseJson,
    });

  })
  .catch((error) => {
      console.error(error);

  });

}
