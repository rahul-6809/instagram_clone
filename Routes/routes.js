const express = require("express");
const router = express.Router();
const AuthenticationFunc = require("../Middleware/auth");
const {
  SigIn,
  SignUp,
  UserDetail,
  Follow,
  UnFollow,
  UploadProfilePic,
} = require("../Controllers/usersController");
const {
  AllPost,
  CreatePost,
  MyPosts,
  Like,
  UnLike,
  Comment,
  DeletePost,
  MyFollwingPost,
} = require("../Controllers/createpostController");

router.post("/signup", SignUp);
router.post("/signin", SigIn);

router.get("/allposts", AuthenticationFunc, AllPost);
router.post("/createPost", AuthenticationFunc, CreatePost);
router.get("/myposts", AuthenticationFunc, MyPosts);
router.put("/like", AuthenticationFunc, Like);
router.put("/unlike", AuthenticationFunc, UnLike);
router.put("/comment", AuthenticationFunc, Comment);
router.delete("/deletePost/:postId", AuthenticationFunc, DeletePost);
router.get("/myfollwingpost", AuthenticationFunc, MyFollwingPost);

router.get("/user/:id", UserDetail);
router.put("/follow", AuthenticationFunc, Follow);
router.put("/unfollow", AuthenticationFunc, UnFollow);
router.put("/uploadProfilePic", AuthenticationFunc, UploadProfilePic);

module.exports = router;
