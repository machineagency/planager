import React, { Component } from "react";

const GlobalContext = React.createContext();

class GlobalProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      global: {
        workflowLinks: [],
        workflowActions: [],
      },
    };

  }

  // Method for updating the global state
  setGlobal = (newGlobal) => {
    this.setState({ global: newGlobal });
  };

  render() {
    const { children } = this.props;
    const { global } = this.state;
    const { setGlobal } = this;

    return (
      <GlobalContext.Provider
        value={{
          global,
          setGlobal,
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
}

export default GlobalContext;

export { GlobalProvider };
