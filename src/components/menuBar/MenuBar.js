import React from "react";
import "./MenuBar.css";
import axios from "axios";
import globals from "../../globals";

class MenuBar extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      connectedUsers: null,
      user: this.props.user,
    };
    this.listRef = React.createRef();
  }

  chooseUser = () => {
    //open select box to choose the user from
    axios.get(globals.SERVER_URL + "/connectedUsers").then(
      (res) => {
        this.setState({
          connectedUsers: (
            <>
              <option value="sas">dddd</option>
              <option value="sasss">dddd</option>
            </>
          ),
        });
      },
      (reject) => {}
    );
  };

  setOptions = () => {};

  render() {
    return (
      <div className="menuBar">
        <div className="header">FaceAfeka</div>
        <select name="sss" onClick={this.chooseUser}>
          <option value="select user">Select user</option>
          {this.state.connectedUsers}
        </select>
        <div className="header">{this.state.user}</div>
      </div>
    );
  }
}

export default MenuBar;
