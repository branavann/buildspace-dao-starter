import { useEffect, useMemo, useState } from "react";

// Import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  // Figure out how to display a user's ENS name
  console.log("👋 Address:", address)

  // If the user hasn't connected their wallet the button enables them to connect
  // onClick={() => xxx()} enables use to reference a function without envoking it; anonymous function
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BranavanDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  return (
    <div className="landing">
      <h1>Welcome to My DAO</h1>
    </div>
  );
};

export default App;
