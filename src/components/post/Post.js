import React from "react";
import "./Post.css";
import axios from "axios";
import globals from "../../globals";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: null,
    };
    this.listRef = React.createRef();
    this.changePostExposure = this.changePostExposure.bind(this);
  }

  componentDidMount() {
    if (this.props.name === this.props.user) {
      this.setState({
        select: (
          <select onChange={this.changePostExposure} id={this.props.postId}>
            <option>public</option>
            <option>private</option>
          </select>
        ),
      });
    }
  }

  changePostExposure() {
    const content = document.getElementsByName("postContent")[0].value;
    let exposure = document.getElementById(this.props.postId);
    console.log(exposure.selectedIndex);
    const selectedExposure = exposure.options[exposure.selectedIndex].text;
    axios
      .post(globals.SERVER_URL + "/editExposure", {
        data: {
          exposure: selectedExposure,
          postId: this.props.postId,
        },
      })
      .then();
  }

  render() {
    return (
      <div className="post">
        <div className="postData">
          {this.props.name}&nbsp; ({this.props.time}) &nbsp;{this.state.select}{" "}
          <br></br>
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Post;
