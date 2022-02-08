import { useEffect, useMemo, useState } from "react";

// Import thirdweb
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";
import { provider } from "ethers";
import { UnsupportedChainIdError } from "@web3-react/core";

// Initalize the SDK with Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// Pass in our bundleDrop address
const bundleDropModule = sdk.getBundleDropModule("0xC63Ba63Fc22CDbc460b55A767eDD2603e2bEA255");
const tokenModule = sdk.getTokenModule("0x08c057c40474cdaf82a321535c530721a6e44adb");
const voteModule = sdk.getVoteModule("0xF886aD1Ae586D4661DdCFd770C16D381d167b42a");

// useState can only be used within functions not classes - must be called in the same order
const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  // Figure out how to display a user's ENS name
  console.log("👋 Address:", address)

  // Signers is an abstraction of an Ethereum account; enables us to post transactions
  const signer = provider ? provider.getSigner() : undefined;

  // NFT state variables
  // First argument is the default value, second arguement is the function to update the first arguement
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false)

  // Token state variables
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // Array with members' addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Voting state variables
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

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

  // Gathers all proposals
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    voteModule
      .getAll()
      .then((proposals) => {
        // Updating the state of proposals with an array of all proposals
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      })
      .catch((err) => {
        console.error("❌ Unable to grab proposals", err);
      });
  }, [hasClaimedNFT]);

  // Checks if the user has already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Exits if the proposals haven't been retrieved yet
    if (!proposals.length) {
      return;
    }

    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        if(hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      })
      .catch((err) => {
        console.error("❌ Unable to retrieve information about the user", err);
      });
  }, [hasClaimedNFT, proposals, address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to the Rinkeby Network</h2>
        <p>
          BranavanDAO has been deployed to Rinkeby to ensure the inclusivity of all DAO participants. Please switch your network within you wallet.
        </p>
      </div>
    );
  }

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
            <div>
              <h2>Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setIsVoting(true);

                  const votes = proposals.map((proposal) => {
                    let voteResult = {
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      );

                      if (elem.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });

                  try {
                    // Checking if the user has delegated their tokens
                    const delegation = await tokenModule.getDelegationOf(address);
                    // If the delegation address is equivalent to 0x0 it means the user hasn't delegated their tokens
                    if (delegation === ethers.constants.AddressZero) {
                      // Tokens must be delegated prior to voting
                      await tokenModule.delegateTo(address);
                    }
                    // Get the user to vote on proposal
                    try {
                      await Promise.all(
                        votes.map(async (vote) => {
                          // Gathering information about the proposal
                          const proposal = await voteModule.get(vote.proposalId);
                          // Checking if the proposal is open for voting
                          if (proposal.state === 1) {
                            return voteModule.vote(vote.proposalId, vote.vote);
                          }
                          // If the proposal is closed we'll exit
                          return;
                        })
                      );
                      try {
                        // Checking which proposals are ready to be executed
                        await Promise.all(
                          votes.map(async (vote) => {
                            const proposal = await voteModule.get(vote.proposalId);
                            // Checking if the proposal is ready to be executed
                            if (proposal.state === 4) {
                              return voteModule.execute(vote.proposalId);
                            }
                          })
                        );
                        // Updating the hasVoted state variable
                        setHasVoted(true);
                        console.log("✅ Successfully voted!")
                      } catch (err) {
                        console.error("❌ Failed to execute vote", err);
                      }
                    } catch (err) {
                      console.error("❌ Failed to vote", err);
                    }
                  } catch (err) {
                    console.error("❌ Failed to delegate tokens",err)
                  } finally {
                    // By setting the setVoting state variable to false we enable the button again
                    setIsVoting(false);
                  }
                }}
                >
                  {proposals.map((proposal, index) => (
                    <div key={proposal.proposalId} className="card">
                      <h5>{proposal.description}</h5>
                      <div>
                        {proposal.votes.map((vote) => (
                          <div key={vote.type}>
                            <input
                              type="radio"
                              id={proposal.proposalId + "-" + vote.type}
                              name={proposal.proposalId}
                              value={vote.type}
                              defaultChecked={vote.type === 2}
                            />
                            <label htmlFor={proposal.proposalId + "-" + vote.type}>
                              {vote.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button disabled={isVoting || hasVoted} type="submit">
                    {isVoting
                      ? "Voting..."
                      : hasVoted
                        ? "You have already voted"
                        : "Submit Votes"}
                  </button>
                  <small>
                    This will trigger multiple transactions that you will need to sign.
                  </small>
                </form>
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
