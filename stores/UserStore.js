import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.user = {};
  }

  getUser() {
    return this.user;
  }

  handleActions(action) {

    switch(action.type) {

      case "GET_USER": {
        this.user = action.data.user;
        this.emit("change");
        break;
      }

    }

  }

}

const userStore = new UserStore;
dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
