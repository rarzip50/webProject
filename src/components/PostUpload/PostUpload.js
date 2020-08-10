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
        <select name="exposure">
          <option>public</option>
          <option>private</option>
        </select>
      </div>
    );
  }
}

export default PostUpload;
