import React from "react";

class UserDetails extends React.Component 
{
  constructor(props) {
    super(props);
    //this.state = {date: new Date()};
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() 
  {
    if (this.props.onLogout)
    {
      this.props.onLogout();
    }
  }

  render() 
  {
    let html="";

    if (this.props.visible)
    {
      return (
        <div className="dlg">
          <h1>User Details</h1>
          <span className="field"><label>Full Name</label><input type="text" value={this.props.userFullname}></input></span>
          <span className="field"><label>Country</label><input type="text" value={this.props.userCountryName}></input></span>
          <button className="longBtn" onClick={this.onLogout}>Log Out</button>
        </div>
      );
    }

    return html
  }
}

export default UserDetails;