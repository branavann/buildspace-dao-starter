import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Importing the goverance contract
const voteModule = sdk.getVoteModule("0xF886aD1Ae586D4661DdCFd770C16D381d167b42a");

// Importing the $BRANU (ERC-20) contract
const tokenModule = sdk.getTokenModule("0x08c057C40474cDaF82a321535C530721A6E44adb");

(async () => {
    try {
        await tokenModule.grantRole("minter", voteModule.address);
        console.log("✅ Granted treasury permission to mint $BRANU");
    } catch(err) {
        console.error("❌Failed to grant treasury permission", err);
        // 1 refers to uncaught fatal exception
        process.exit(1);
    }

    try {
        // Retrieves the token balance from the deployment wallet
        const tokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);
        // Converting to BigNumber to overcome limitation of Javascript
        const bnTokenBalance = ethers.BigNumber.from(tokenBalance.value);
        // 80% of $BRANU tokens will be allocated to the treasury
        const treasuryAllocation = bnTokenBalance.mul(80).div(100);
        // Transferring tokens to the treasury
        await tokenModule.transfer(voteModule.address, treasuryAllocation);
        console.log("✅Successfully transfer token allocation to the treasury");
    } catch(err) {
        console.error("❌Failed to transfer token allocation to the treasury",err);
    }
})();