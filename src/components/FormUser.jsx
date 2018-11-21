import React from 'react';

class FormUser extends React.PureComponent {
  render() {
    const {
      handleSubmitUser,
      messageCountUser,
      username,
      handleChangeInput,
      handleFocusInput,
      handleBlurInput,
    } = this.props;

    return (
      <form onSubmit={handleSubmitUser}>
        <h1>{messageCountUser}</h1>
        <input
          name="username"
          type="text"
          value={username}
          onChange={handleChangeInput}
          onFocus={handleFocusInput}
          onBlur={handleBlurInput}
        />
      </form>
    );
  }
}

export default FormUser;
