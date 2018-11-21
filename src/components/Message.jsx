import React from 'react';

class Message extends React.PureComponent {
  render() {
    const {
      username,
      userCurrent,
      message,
    } = this.props;

    return (
      <React.Fragment>
        <h1>{userCurrent ? 'Me:' : `Username: ${username}`}</h1>
        <p>{message}</p>
      </React.Fragment>
    );
  }
}

export default Message;
