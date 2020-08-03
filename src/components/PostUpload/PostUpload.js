import React from "react";
import $ from "jquery";
import "./PostUpload.css";
import globals from "../../globals";
import moment from "moment";
import axios from "axios";

class PostUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
    };
    this.listRef = React.createRef();
    this.postContent = this.postContent.bind(this);
  }

  postContent() {
    const user = this.state.userName;
    const content = document.getElementsByName("postContent")[0].value;
    let currentTime = moment(Date.now()).format("HH:mm");
    const data = {
      content: content,
      userName: user,
      time: currentTime,
    };
    if (content !== "")
      // $.ajax({
      //   type: "post",
      //   url: globals.SERVER_URL + "/saveNewPost",
      //   contentType: "application/json",
      //   processData: true,
      //   data: JSON.stringify(data),
      //   xhrFields: {
      //     withCredentials: false,
      //   },
      //   headers: {},
      //   success: () => {
      //     this.render();
      //   },
      // });
      axios
        .post(globals.SERVER_URL + "/saveNewPost", { data: data })
        .then(() => {
          console.log("yes");
        });
  }

  render() {
    return (
      <div className>
        <textarea
          type="text"
          placeholder="write something"
          name="postContent"
          required
        ></textarea>
        <button onClick={this.props.onUpload} type="submit">
          post
        </button>
      </div>
    );
  }
}

export default PostUpload;
