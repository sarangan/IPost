import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class LoginStore extends EventEmitter {
  constructor() {
    super();
    this.data = {};
    this.successLogin = false;

  }

  getLoginDetails() {
    return this.data;
  }

  isLogin() {
    return this.successLogin;
  }

  handleActions(action) {

    switch(action.type) {

      case "LOGIN_RESPONSE": {
        this.data = action.data;
        this.successLogin = true;
        this.emit("change");
        break;
      }

    }

  }

}

const loginStore = new LoginStore;
dispatcher.register(loginStore.handleActions.bind(loginStore));

export default loginStore;
