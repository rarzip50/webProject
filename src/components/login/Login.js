import React from "react";
import "./Login.css";
import axios from "axios";
import globals from "../../globals";
import { timers } from "jquery";
import Feed from "../feed/Feed";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: "block",
      feed: null,
    };
    this.listRef = React.createRef();
    this.login = this.login.bind(this);
  }

  login() {
    let userName = document.getElementsByName("uname")[0].value;
    let password = document.getElementsByName("psw")[0].value;
    axios
      .post(globals.SERVER_URL + "/users/login", {
        email: userName,
        password: password,
      })
      .then(
        (res) => {
          console.log(res.data.token);
          document.cookie = `email=${res.data.user.email}`;
          document.cookie = `auth_token=${res.data.token}`;
          this.setState({
            feed: (
              <Feed
                user={res.data.user.name}
                token={res.data.token}
                email={res.data.user.email}
              />
            ),
            showLogin: "none",
          });
        },
        (reject) => {
          alert("could not log you in because\n" + reject);
        }
      );
  }

  render() {
    return (
      <>
        <div className="login" style={{ display: this.state.showLogin }}>
          <div className="loginData">
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              required
            ></input>
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
            ></input>
            <button onClick={this.login} type="submit">
              Login
            </button>
          </div>
        </div>
        {this.state.feed}
      </>
    );
  }
}

export default Login;
