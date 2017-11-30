import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.data = {};
    this.userUpdate = {}
  }

  getRegisterStatus() {
    return this.data;
  }

  getUpdateProfileStatus() {
    return this.data;
  }

  handleActions(action) {

    switch(action.type) {

      case "USER_REGISTER": {
        this.data = action.data;
        this.emit("change");
        break;
      }

      case "UPDATE_USER": {
        this.userUpdate = action.data;
        this.emit("change");
        break;
      }

    }

  }

}

const userStore = new UserStore;
dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
