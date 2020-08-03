import React from "react";
import MenuBar from "../menuBar/MenuBar";
import Post from "../post/Post";
import $ from "jquery";
import axios from "axios";
import "./Feed.css";
import globals from "../../globals";
import PostUpload from "../PostUpload/PostUpload";
import moment from "moment";

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      content: null,
    };
    this.listRef = React.createRef();
    this.postContent = this.postContent.bind(this);
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
        .post(globals.SERVER_URL + "/saveNewPost", { data: data })
        .then((res) => {
          let posts = this.state.content;
          posts.push(
            <Post
              writer={data.userName}
              time={data.time}
              content={data.content}
              exposure={exposure}
              user={this.state.user}
              postId={res.data.postId}
            />
          );
          this.setState({ content: posts, uu: "dd" });
        });
  }

  componentDidMount() {
    const t = $.get(globals.SERVER_URL + "/postsForMe", {
      user: this.state.user,
    });
    t.then((res) => {
      console.log(res);
      if (res.length !== 0) {
        this.setState({
          content: res.map((postContent, index) => {
            return (
              <Post
                name={postContent.writer}
                time={postContent.time}
                content={postContent.content}
                exposure={postContent.exposure}
                user={this.state.user}
                postId={postContent.postId}
              />
            );
          }),
        });
      } else {
      }
    });
  }

  render() {
    return (
      <>
        <MenuBar user={this.state.user} />
        <div className="feed">
          <PostUpload userName={this.state.user} onUpload={this.postContent} />
          {this.state.content}
        </div>
      </>
    );
  }
}

export default Feed;
