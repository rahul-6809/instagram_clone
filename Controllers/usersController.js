const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config");
const UserModel = require("../Models/userModel");
const PostModel = require("../Models/postModel");

const SignUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !email || !userName || !password) {
      return res.status(422).json({ error: "Please add all the fields" })
  }
  UserModel.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
      if (savedUser) {
          return res.status(422).json({ error: "User already exist with that email or userName" })
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {

          const user = new UserModel({
              name,
              email,
              userName,
              password: hashedPassword
          })
          user.save()
              .then(user => { res.json({ message: "Registered successfully" }) })
              .catch(err => { console.log(err) })
      })
  })

}




const SigIn = async(req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password" })
  }
  UserModel.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
          return res.status(422).json({ error: "Invalid email" })
      }
      bcrypt.compare(password, savedUser.password).then((match) => {
          if (match) {
              // return res.status(200).json({ message: "Signed in Successfully" })
              const token = jwt.sign({ _id: savedUser.id }, SECRET_KEY)
              const { _id, name, email, userName } = savedUser

              res.json({ token, user: { _id, name, email, userName } })

              console.log({ token, user: { _id, name, email, userName } })
          } else {
              return res.status(422).json({ error: "Invalid password" })
          }
      })
          .catch(err => console.log(err))
  })
}

// router.post("/googleLogin", (req, res) => {
//     const { email_verified, email, name, clientId, userName, Photo } = req.body
//     if (email_verified) {
//         USER.findOne({ email: email }).then((savedUser) => {
//             if (savedUser) {
//                 const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
//                 const { _id, name, email, userName } = savedUser
//                 res.json({ token, user: { _id, name, email, userName } })
//                 console.log({ token, user: { _id, name, email, userName } })
//             } else {
//                 const password = email + clientId
//                 const user = new USER({
//                     name,
//                     email,
//                     userName,
//                     password: password,
//                     Photo
//                 })

//                 user.save()
//                     .then(user => {
//                         let userId = user._id.toString()
//                         const token = jwt.sign({ _id: userId }, Jwt_secret)
//                         const { _id, name, email, userName } = user

//                         res.json({ token, user: { _id, name, email, userName } })

//                         console.log({ token, user: { _id, name, email, userName } })
//                     })
//                     .catch(err => { console.log(err) })

//             }

//         })
//     }
// })
const UserDetail = async (req, res) => {
  UserModel.findOne({ _id: req.params.id })
      .select("-password")
      .then(user => {
          PostModel.find({ postedBy: req.params.id })
              .populate("postedBy", "_id")
              .exec((err, post) => {
                  if (err) {
                      return res.status(422).json({ error: err })
                  }
                  res.status(200).json({ user, post })
              })
      }).catch(err => {
          return res.status(404).json({ error: "User not found" })
      })
}

// to follow user
const Follow = async (req, res) => {
  UserModel.findByIdAndUpdate(req.body.followId, {
      $push: { followers: req.user._id }
  }, {
      new: true
  }, (err, result) => {
      if (err) {
          return res.status(422).json({ error: err })
      }
      UserModel.findByIdAndUpdate(req.user._id, {
          $push: { following: req.body.followId }
      }, {
          new: true
      }).then(result => {
          res.json(result)

      })
          .catch(err => { return res.status(422).json({ error: err }) })
  }
  )
}

// to unfollow user
const UnFollow = async (req, res) => {
  UserModel.findByIdAndUpdate(req.body.followId, {
      $pull: { followers: req.user._id }
  }, {
      new: true
  }, (err, result) => {
      if (err) {
          return res.status(422).json({ error: err })
      }
      UserModel.findByIdAndUpdate(req.user._id, {
          $pull: { following: req.body.followId }
      }, {
          new: true
      }).then(result => res.json(result))
          .catch(err => { return res.status(422).json({ error: err }) })
  }
  )
}

// to upload profile pic
const UploadProfilePic = async  (req, res) => {
  UserModel.findByIdAndUpdate(req.user._id, {
      $set: { Photo: req.body.pic }
  }, {
      new: true
  }).exec((err, result) => {
      if (err) {
          return res.status(422).json({ error: er })
      } else {
          res.json(result)
      }
  })
}


module.exports = {
  SigIn,
  SignUp,
  UserDetail,
  Follow,
  UnFollow,
  UploadProfilePic,
};
