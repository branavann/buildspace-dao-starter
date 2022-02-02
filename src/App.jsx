import { useEffect, useMemo, useState } from "react";

// Import thirdweb
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";
import { provider } from "ethers";

// Initalize the SDK with Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// Pass in our bundleDrop address
const bundleDropModule = sdk.getBundleDropModule("0xC63Ba63Fc22CDbc460b55A767eDD2603e2bEA255");
const tokenModule = sdk.getTokenModule("0x08c057c40474cdaf82a321535c530721a6e44adb");

// useState can only be used within functions not classes - must be called in the same order
const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  // Figure out how to display a user's ENS name
  console.log("👋 Address:", address)

  // Signers is an abstraction of an Ethereum account; enables us to post transactions
  const signer = provider ? provider.getSigner() : undefined;

  // First arguement is the default value, second arguement is the function to update the first arguement
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false)

  // State value that contains the number of tokens each member has
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // Array with members' addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Shortens users address for visual purposes
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length-4);
  };

  // Gathering the addresses of members that hold BranavanDOA Access Pass
  useEffect(() => {
    // Function exits if the hasClaimedNFT value is false
    if (!hasClaimedNFT) {
      return;
    }
    // BranavanDAO Access Pass has a tokenID of "0"
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Member Addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("Failed to retrieve list of members", err);
      });
  },[hasClaimedNFT]);

  // Retrieves the number of tokens held by each member
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grabbing token balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed to retrieve token amounts", err);
      });
  }, [hasClaimedNFT]);

  // useMemo caches data - only runs the function if memberAddresses or memberTokenAmounts is changed
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);
 
  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  // useEffect would run every single time we re-render
  // The second arguement [address] means useEffect will only run if the user's address changes
  useEffect(() => {
    // Function exits if the user hasn't connected their wallet
    if(!address) {
      return;
    }

    // Checking if the user has a BranavanDAO membership NFT
    return bundleDropModule
      // tokenID of membership NFT is 0
      .balanceOf(address,"0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 User has a BranavanDOA membership token");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 User does not have a BranavanDOA membership token");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.log("Failed to retrieve the user's NFT balance", error);
      });
  }, [address]);

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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1> BranavanDAO Member Page</h1>
        <p>Congratulations on being a member to the most exclusive DAO</p>
          <div>
            <div>
              <h2>Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    );
  };

  const mintNFT = () => {
    setIsClaiming(true);
    bundleDropModule
    .claim("0",1)
    .then(() => {
      setHasClaimedNFT(true);
      console.log("🌊 Successfully Minted! Welcome to BranavanDAO! Check out your access pass on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0");
    })
    .catch((error) => {
      console.log("❌ Failed to mint access token!", error)
    })
    .finally(() => {
      setIsClaiming(false);
    });
  }

  return (
    <div className="mint-nft">
      <h1>Mint your exclusive BranavanDAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNFT()}>
        {isClaiming ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default App;
