import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Import ThirdWeb
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";


// Option 4 is Rinkeby
const supportedChainIds = [4];

// Support injected wallets (e.g. Metamask)
const connectors = {
    injected: {},
};

// Render the App component to the DOM
// By wrapping everything within <ThirdwebWeb3Provider> we pass user data from the 
// injected wallet into app
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >  
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
