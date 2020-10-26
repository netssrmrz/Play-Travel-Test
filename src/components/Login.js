import React from "react";

class Login extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {email: "", password: ""};
    this.onLogin = this.onLogin.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  /*componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }*/

  /*componentWillUnmount() {
    clearInterval(this.timerID);
  }*/

  onLogin() 
  {
    if (this.props.onLogin)
    {
      this.props.onLogin(this.state.email, this.state.password);
    }
  }

  onEmailChange(event)
  {
    this.setState({email: event.target.value});
  }

  onPasswordChange(event)
  {
    this.setState({password: event.target.value});
  }

  render() 
  {
    let html="";

    if (this.props.visible)
    {
      html = (
        <div className="dlg">
          <h1>Log in to your account</h1>
          <span className="field"><label>Email</label><input type="text" value={this.email} onChange={this.onEmailChange} placeholder="Enter your Email"></input></span>
          <span className="field"><label>Password</label><input type="text" value={this.password} onChange={this.onPasswordChange} placeholder="Enter your Password"></input></span>
          <span>Forgot your password? <a>Reset</a></span>
          <button onClick={this.onLogin} className="longBtn">Log in</button>
        </div>
      );
    }

    return html;
  }
}

export default Login;