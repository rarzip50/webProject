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
      suggestions: [{text: "yes"}, {text: "yes"}],
      displaySuggestions: "none"
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

  search(e) {
    const searchText = e.currentTarget.value;
    
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
            className= "searchBar"
            onChange={this.search}
          >
          </input>
          <div className="suggestions">
          {this.state.suggestions.map((suggestion) => {
            return (
              <div
                className="suggestion"
              >
                {suggestion.text}
              </div>
            );
          })}

          </div>
        </div>
        
      </div>
    );
  }
}

export default MenuBar;
