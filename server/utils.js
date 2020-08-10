const fs = require("fs");
const { post } = require("jquery");

exports.authorize = function (userName, password) {
  let usersDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\users.json"));
  const user = usersDB.find(
    (user) => user.userName === userName && user.password === password
  );
  if (user) {
    user.connected = true;
    fs.writeFileSync(__dirname + "\\db\\users.json", JSON.stringify(usersDB));
    return true;
  }
};

exports.getConnectedUsers = function () {
  const usersDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\users.json"));
  const connectedUsers = usersDB.filter((user) => user.connected === true);
  return connectedUsers;
};

exports.getPostsForMe = function (userName) {
  let postsDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\posts.json"));
  let usersDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\users.json"));
  let user = usersDB.find((user) => user.userName === userName);
  let myFriends = user.friends;
  myFriends.push(userName);
  let postsForMe = [];

  for (let i = 0; i < postsDB.length; i++) {
    if (myFriends.includes(postsDB[i].writer)) {
      if (postsDB[i].writer !== user && postsDB[i].exposure === "private")
        continue;
      else postsForMe.push(postsDB[i]);
    }
  }
  return postsForMe;
};

exports.saveNewPost = function (postData) {
  let postsDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\posts.json"));
  let nextPostId = JSON.parse(
    fs.readFileSync(__dirname + "\\db\\dbConstants.json")
  ).nextPost;

  postsDB.push({
    postId: nextPostId,
    writer: postData.userName,
    photos: [],
    content: postData.content,
    time: postData.time,
    exposure: postData.exposure,
  });
  nextPostId++;
  fs.writeFileSync(__dirname + "\\db\\posts.json", JSON.stringify(postsDB));
  fs.writeFileSync(
    __dirname + "\\db\\dbConstants.json",
    JSON.stringify({ nextPost: nextPostId })
  );
  return nextPostId - 1;
};

exports.editPostExposure = function (postData) {
  let postsDB = JSON.parse(fs.readFileSync(__dirname + "\\db\\posts.json"));
  let edittedPost = postsDB.find((post) => post.postId === postData.postId);
  edittedPost.exposure = postData.exposure;
  fs.writeFileSync(__dirname + "\\db\\posts.json", JSON.stringify(postsDB));
};
