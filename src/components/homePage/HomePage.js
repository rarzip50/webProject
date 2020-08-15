import React from "react";
import MenuBar from "../menuBar/MenuBar";
import Feed from "../feed/Feed";
import Login from "../login/Login";
import axios from "axios";
import globals from "../../globals";
import "./HomePage.css";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      homeContent: null, //TODO check on server who is connected. if a few are - than show the first. do as a function
      user: null,
    };
    this.listRef = React.createRef();
  }

  async checkConnectedUsers() {
    let cookie = this.getCookie("email");
    if (cookie === "") {
      this.setState({ homeContent: <Login /> });
    } else {
      axios
        .get(globals.SERVER_URL + "/users/searchByEmail", {
          params: { email: cookie },
        })
        .then((res) => {
          console.log(res);
          this.setState({
            homeContent: (
              <Feed
                user={res.data.name}
                token={res.data.token}
                email={res.data.email}
              />
            ),
          });
        });
    }
    console.log(cookie);
    //http to server to check if someone is connected. return the first from the list of connected users return its feed. if no one, than return the login screen
    // const t = $.get(globals.SERVER_URL + "/connectedUsers");
    // t.then((res) => {
    //   console.log(res);
    //   if (res.length !== 0) {
    //     this.setState({
    //       homeContent: <Feed user={res[0].userName} />,
    //     });
    //   } else {
    //   }
    // });
  }

  componentDidMount() {
    this.checkConnectedUsers();
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

  login() {
    if (this.state.userDate === {}) {
      this.setState({ userData: { name: "ofir" } });
    } else alert("you are already logged in");
  }

  render() {
    return (
      <>
        <MenuBar />
        {this.state.homeContent}
      </>
    );
  }
}

export default HomePage;
