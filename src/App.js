import React from "react";
import './App.css';
import Login from "./components/Login";
import UserDetails from "./components/UserDetails";

class App extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = 
    {
      showLogin: true, 
      showUserDetails: false, 
      showIsWrongPassword: false,
      userFullname: null,
      userCountryName: null
    };
    this.token = null;
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onGetData()
  {
    var dice = 3;
    var sides = 6;
    var query = `query RollDice($dice: Int!, $sides: Int) {
      rollDice(numDice: $dice, numSides: $sides)
    }`;
    
    fetch('//localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { dice, sides },
      })
    })
      .then(r => r.json())
      .then(data => console.log('data returned:', data));
  }

  async onLogin(email, password)
  {
    let resHttp = await fetch('//localhost:8080/userLogin/' + email + "/" + password, 
    {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    });
    let resJson = await resHttp.json();
    let newState = {showIsWrongPassword: true};

    if (resJson && resJson.id)
    {
      resJson = await this.getUserByIdWithCountry(resJson.id, resJson.token);
      if (resJson != null)
      {
        newState =
        {
          showLogin: false, 
          showUserDetails: true, 
          showIsWrongPassword: false,
          userFullname: resJson.data.getUserByIdWithCountry.fullName,
          userCountryName: resJson.data.getUserByIdWithCountry.countryName
        };
      }
    }

    this.setState(newState);
  }

  async getUserByIdWithCountry(id, token)
  {
    let resJson = null;
    const query = "query { getUserByIdWithCountry(id:" + id + ") { fullName, countryName } }";
    
    const resHttp = await fetch('//localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        query,
        variables: { id },
      })
    })
    if (resHttp && resHttp.status && resHttp.status === 200)
    {
      resJson = await resHttp.json();
    }

    return resJson;
  }

  onLogout()
  {
    this.setState({showLogin: true, showUserDetails: false});
  }

  render() 
  {
    return (
      <div className="App">
        <img src="logo.svg"></img>
        <Login onLogin={this.onLogin} visible={this.state.showLogin}></Login>
        <UserDetails onLogout={this.onLogout} visible={this.state.showUserDetails} 
          userFullname={this.state.userFullname} userCountryName={this.state.userCountryName}></UserDetails>
        <div hidden={!this.state.showIsWrongPassword}>Wrong Password. Try again or reset.</div>
      </div>
    );
  }
}

export default App;
