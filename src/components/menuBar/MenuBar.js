import React from "react";
import "./MenuBar.css";
import axios from "axios";
import globals from "../../globals";

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedUsers: null,
      user: this.props.user,
      email: this.props.email,
      token: this.props.token,
      suggestions: [],
      displaySuggestions: "none",
    };
    this.listRef = React.createRef();
    this.search = this.search.bind(this);
    this.logOut = this.logOut.bind(this);
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

  logOut() {
    console.log(this.state);
  }

  search(e) {
    let searchText = e.currentTarget.value;
    if (searchText !== "") {
      axios.get(globals.SERVER_URL + "/users/all").then(
        (res) => {
          console.log(res.data);
          let results = [];
          for (var aa of res.data) {
            if (aa.name.includes(searchText)) {
              results.push({ text: aa.name });
            }
          }
          this.setState({ suggestions: results });
        },
        (rej) => {
          this.setState({ suggetions: [] });
        }
      );
    } else {
      this.setState({ suggestions: [] });
    }
  }

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
        <div className="searchDiv">
          <input
            type="text"
            placeholder="Enter Username"
            name="search"
            className="searchBar"
            onChange={this.search}
          ></input>
        </div>
        <button onClick={this.logOut} className="header">
          logout
        </button>
        <div className="suggestions">
          {this.state.suggestions.map((suggestion) => {
            return <div className="suggestion">{suggestion.text}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default MenuBar;
