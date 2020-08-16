import React from "react";
import MenuBar from "../menuBar/MenuBar";
import Post from "../post/Post";
import axios from "axios";
import "./Feed.css";
import globals from "../../globals";
import PostUpload from "../PostUpload/PostUpload";
import moment from "moment";
import { post } from "jquery";

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      email: this.props.email,
      token: this.props.token,
      content: [],
    };
    this.listRef = React.createRef();
    this.postContent = this.postContent.bind(this);
    this.post2 = this.post2.bind(this);
  }

  postContent() {
    const user = this.state.user;
    const content = document.getElementsByName("postContent")[0].value;
    const exposure = document.getElementsByName("exposure")[0];
    const selectedExposure = exposure.options[exposure.selectedIndex].text;

    let currentTime = moment(Date.now()).format("HH:mm");
    const data = {
      content: content,
      userName: user,
      time: currentTime,
      exposure: selectedExposure,
    };
    if (content !== "")
      axios
        .post(globals.SERVER_URL + "/savePost", { data: data })
        .then((res) => {
          let posts = this.state.content;
          posts.push({
            writer: data.userName,
            time: data.time,
            content: data.content,
            exposure: data.exposure,
            postId: res.data.postId,
            user: this.state.user,
          });
          this.setState({ content: posts });
        });
  }

  post2() {
    const user = this.state.user;
    const content = document.getElementsByName("postContent")[0].value;
    const exposure = document.getElementsByName("exposure")[0];
    const selectedExposure = exposure.options[exposure.selectedIndex].text;
    axios
      .post(
        globals.SERVER_URL + "/posts/savePost",
        { text: content, creator: user, public: true },
        {
          headers: {
            Authorization: `Bearer ${this.getCookie("auth_token")}`,
          },
        }
      )
      .then((res) => {
        let posts = this.state.content;
        posts.push({
          writer: user,
          time: new Date(),
          content: content,
          exposure: exposure,
          user: this.state.user,
        });
        this.setState({ content: posts });
      });
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  componentDidMount() {
    axios
      .get(globals.SERVER_URL + "/users/me/feed", {
        headers: {
          Authorization: `Bearer ${this.getCookie("auth_token")}`,
        },
      })
      .then((res) => {
        let results = [];
        for (let post of res.data) {
          results.push({
            creator: post.creator,
            date: post.date,
            public: post.public,
            comments: post.comments,
            text: post.text,
          });
        }
        this.setState({ content: results });
      });
    // const t = $.get(globals.SERVER_URL + "/postsForMe", {
    //   user: this.state.user,
    // });
    // t.then((res) => {
    //   if (res.length !== 0) {
    //     this.setState({ content: res });
    //     console.log(res);
    //   } else {
    //   }
    // });
  }

  render() {
    return (
      <>
        <MenuBar
          user={this.state.user}
          email={this.state.email}
          token={this.state.token}
        />
        <div className="feed">
          <PostUpload userName={this.state.user} onUpload={this.post2} />
          {this.state.content.map((postContent, index) => {
            return (
              <Post
                name={postContent.creator}
                time={postContent.date}
                content={postContent.text}
                exposure={postContent.public}
                user={this.state.user}
                postId={postContent.postId}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Feed;
