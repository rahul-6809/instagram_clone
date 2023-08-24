const PostModel = require("../Models/postModel");

const AllPost = async (req, res) => {
  let limit = req.query.limit
  let skip = req.query.skip
  PostModel.find()
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort("-createdAt")
      .then(posts => res.json(posts))
      .catch(err => console.log(err))
}

const CreatePost = async (req, res) => {
  const { body, pic } = req.body;
  console.log(pic)
  if (!body || !pic) {
      return res.status(422).json({ error: "Please add all the fields" })
  }
  console.log(req.user)
  const post = new PostModel({
      body,
      photo: pic,
      postedBy: req.user
  })
  post.save().then((result) => {
      return res.json({ post: result })
  }).catch(err => console.log(err))
}

const MyPosts = async (req, res) => {
  PostModel.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt")
      .then(myposts => {
          res.json(myposts)
      })
}

const Like = async (req, res) => {
  PostModel.findByIdAndUpdate(req.body.postId, {
      $push: { likes: req.user._id }
  }, {
      new: true
  }).populate("postedBy", "_id name Photo")
      .exec((err, result) => {
          if (err) {
              return res.status(422).json({ error: err })
          } else {
              res.json(result)
          }
      })
}

const UnLike = async (req, res) => {
  PostModel.findByIdAndUpdate(req.body.postId, {
      $pull: { likes: req.user._id }
  }, {
      new: true
  }).populate("postedBy", "_id name Photo")
      .exec((err, result) => {
          if (err) {
              return res.status(422).json({ error: err })
          } else {
              res.json(result)
          }
      })
}


const Comment= async (req, res) => {
  const comment = {
      comment: req.body.text,
      postedBy: req.user._id
  }
  PostModel.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment }
  }, {
      new: true
  })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name Photo")
      .exec((err, result) => {
          if (err) {
              return res.status(422).json({ error: err })
          } else {
              res.json(result)
          }
      })
}

// Api to delete post
const DeletePost = async (req, res) => {
  PostModel.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
          if (err || !post) {
              return res.status(422).json({ error: err })
          }

          if (post.postedBy._id.toString() == req.user._id.toString()) {

              post.remove()
                  .then(result => {
                      return res.json({ message: "Successfully deleted" })
                  }).catch((err) => {
                      console.log(err)
                  })
          }
      })
}

// to show following post
const MyFollwingPost = async (req, res) => {
  PostModel.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .then(posts => {
          res.json(posts)
      })
      .catch(err => { console.log(err) })
}

module.exports = {
  AllPost,
  CreatePost,
  MyPosts,
  Like,
  UnLike,
  Comment,
  DeletePost,
  MyFollwingPost,
};

