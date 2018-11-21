import React from 'react';

class FormMessage extends React.PureComponent {
  render() {
    const {
      handleSubmitMessage,
      messageCountUser,
      message,
      handleChangeInput,
      handleFocusInput,
      handleBlurInput,
    } = this.props;

    return (
      <form onSubmit={handleSubmitMessage}>
        <h1>{messageCountUser}</h1>
        <input
          name="message"
          type="text"
          value={message}
          onChange={handleChangeInput}
          onFocus={handleFocusInput}
          onBlur={handleBlurInput}
        />
      </form>
    );
  }
}

export default FormMessage;
