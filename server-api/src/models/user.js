const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  friends: [
    {
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
  pending: [
    {
      pd_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "creator",
});

// function is created as a regular function so that we can use 'this' binding inside of the function to get the id of current user instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const secret = "Julie";
  const token = jwt.sign({ _id: user._id.toString() }, secret);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// hiding private profile data such as password and tokens
// could be done with toJSON instead
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.confirmPendingFriendRequet = async function (pdUserId) {
  const user = this;

  // remove from pending list
  user.pending = user.pending.filter((pd_user) => {
    pd_user.pd_user !== pdUserId;
  });

  // add to friends list
  user.friends = [...user.friends, { friend: pdUserId }];

  await user.save();

  // add self to friends list of the user that sent the friend request
  let pdUser = await User.findById(pdUserId);
  pdUser.friends = [...pdUser.friends, { friend: user._id }];

  await pdUser.save();
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Unable to login.");
  }

  return user;
};

userSchema.statics.searchUserByName = async (name) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error("Could'nt find user by that name.");
  }

  return user;
};

userSchema.statics.searchUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Could'nt find user by that email.");
  }

  return user;
};

// Hash plain text password with bycrypt before saving
userSchema.pre("save", async function (next) {
  // we use regular function because the 'this' binding is needed
  const user = this;

  if (user.isModified("password")) {
    // true when user is created and when user's password is updated
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
