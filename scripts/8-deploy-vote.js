import sdk from "./1-initialize-sdk.js";

// Importing the app module contract
const app = sdk.getAppModule("0xb834cEf959571a4E89Ab471746196f1911107e55");

(async () => {
    try {
        const voteModule = await app.deployVoteModule({
            name: "BranavanDAO Improvement Proposals (BIP)",
            votingTokenAddress: "0x08c057C40474cDaF82a321535C530721A6E44adb",
            // Users can vote immediately on a proposal
            proposalStartWaitTimeInSeconds: 0,
            // Proposals will last for 1 day
            proposalVotingTimeInSeconds: 60 * 60 * 24,
            // Minimum % of tokens that must vote for the BIP to be passed
            votingQuorumFraction: 0,
            // Anyone can create a BIP
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log("✅ Voting module has been successful deployed to", voteModule.address);

    } catch (err) {
        console.error("❌ Failed to deploy voting module", err);
    }
})();