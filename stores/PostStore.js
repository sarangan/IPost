import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class PostStore extends EventEmitter {
  constructor() {
    super();
    this.posts= [];
    this.user = {};
    this.myPosts = [];
    this.isPostSuccess =  false;
  }

  getPostStatus() {
    return this.isPostSuccess;
  }

  getPosts(){
    return this.posts;
  }

  getUser(){
    return this.user;
  }

  getMyPosts(){
    return {posts: this.myPosts,  user:this.user};
  }


  handleActions(action) {

    switch(action.type) {

      case "POST_TEXT": {
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){ // we got success
          this.isPostSuccess = true;
        }
        this.emit("change");
        break;
      }

      case "GET_ALL_POSTS": {
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){ // we got success
          this.posts = action.data.posts;
        }
        this.emit("change");
        break;
      }

      case "GET_MY_POSTS":{
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){ // we got success
          this.myPosts = action.data.posts;
          this.user = action.data.user;
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
