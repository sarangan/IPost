import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class PostStore extends EventEmitter {
  constructor() {
    super();
    this.posts= [];
    this.user = {};
    this.myPosts = [];
    this.isPostSuccess =  false;
    this.isToggleLikeSuccess =  false;
    this.post_id = 0;
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

  getToggleLikeStatus() {
    return this.isToggleLikeSuccess;
  }

  getPostId(){
    return this.post_id;
  }


  handleActions(action) {

    switch(action.type) {

      case "POST_TEXT": {
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){ // we got success
          this.isPostSuccess = true;
          this.isToggleLikeSuccess = false;
        }
        this.emit("change");
        break;
      }

      case "GET_ALL_POSTS": {
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){
          this.posts = action.data.posts;
          this.isPostSuccess = false;
          this.isToggleLikeSuccess = false;
        }
        this.emit("change");
        break;
      }

      case "GET_MY_POSTS":{
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){
          this.myPosts = action.data.posts;
          this.user = action.data.user;
          this.isPostSuccess = false;
          this.isToggleLikeSuccess = false;
        }
        this.emit("change");
        break;
      }

      case "TOGGLE_LIKE": {
        if(action.data.hasOwnProperty('status') &&  action.data.status == 1){
            this.isPostSuccess = false;
            this.isToggleLikeSuccess = true;
            this.post_id = action.data.post_id;
            this.myPosts = [];
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
