import dispatcher from "../dispatcher";
import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';

export function postText(body, img_url, got_img) {

    let formData = new FormData();
    formData.append("body", body);
    formData.append("got_img", got_img);
    if(got_img == 1){
      formData.append('photo', {uri: img_url, type: 'image/jpg', name: 'image.jpg'});
    }

    fetch(
        config.ENDPOINT_URL + 'auth/posttext',
        {
        method: 'POST',
        headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                  'Origin': '',
                  'Host': 'propertyground.co.uk',
                  'timeout': 10 * 60
        },
        body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("login success call ");
      console.log(responseJson);

      dispatcher.dispatch({
        type: "POST_TEXT",
        data: responseJson,
      });

    })
    .catch((error) => {
        console.error(error);

        this.setState({
          isSending: false
        });

    });

}
