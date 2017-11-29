import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class PostStore extends EventEmitter {
  constructor() {
    super();
    this.isPostSuccess =  false;
  }

  getPostStatus() {
    return this.isPostSuccess;
  }


  handleActions(action) {

    switch(action.type) {

      case "POST_TEXT": {
        if(action.data.status == 1){ // we got success
          this.isPostSuccess = true;
        }
        this.emit("change");
        break;
      }

    }

  }

}

const postStore = new PostStore;
dispatcher.register(postStore.handleActions.bind(postStore));

export default postStore;
