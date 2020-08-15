const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const auth = require("../middleware/auth");
const router = new express.Router();

// create a new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.send({ user: user.getPublicProfile(), token });
    // res.send()
  } catch (e) {
    res.status(400).send();
  }
});

// logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// logout user of all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// get logged user's profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user.getPublicProfile());
});

// update user's proflie
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update fields." });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// get logged user's feed
router.get("/users/me/feed", auth, async (req, res) => {
  const relevantUsers = [...req.user.friends, req.user._id];

  try {
    const feed = await Post.find({ creator: relevantUsers, public: true });
    res.send(feed);
  } catch (e) {
    res.status(400).send(e); // ???
  }
});

// create friend requset
router.post("/users/me/friends", auth, async (req, res) => {
  try {
    let destUser = await User.findById(req.body.dest_user_id);

    const pendingUserIds = destUser.pending.map((pd_user) => pd_user.pd_user);

    if (pendingUserIds.includes(req.user._id)) {
      res.status(400).send({ error: "Friend request already pending." });
    }

    destUser.pending = [...destUser.pending, { pd_user: req.user._id }];
    destUser.save();
    res.send(destUser);
  } catch (e) {
    console.log(e);
    res.status(400).send(e); // ???
  }
});

// confirm pending friend request
router.patch("/users/me/friends", auth, async (req, res) => {
  try {
    req.user.confirmPendingFriendRequet(req.body.pd_user_id);
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    req.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// search user by name
// router.get("users/search", async (req, res) => {
//   try {
//     const user = await User.searchUserByName(req.body.name);
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.get("/users/searchByEmail", async (req, res) => {
  try {
    const user = await User.searchUserByEmail(req.query.email);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/all", async (req, res) => {
  const allUsers = await User.findOne({});
  res.send(allUsers);
});

module.exports = router;
