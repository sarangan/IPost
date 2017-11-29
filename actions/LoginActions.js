import dispatcher from "../dispatcher";
import config from '../config/config';
import AppKeys from '../keys/appKeys';
import auth from '../auth/auth';

export function authenticate(username, password) {

    let formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);

    fetch(
        config.ENDPOINT_URL + 'auth/authenticate',
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
        type: "LOGIN_RESPONSE",
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
