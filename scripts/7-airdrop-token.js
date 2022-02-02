import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// ERC-1155: BranavanDAO Access Pass contract
const bundleDropModule = sdk.getBundleDropModule("0xC63Ba63Fc22CDbc460b55A767eDD2603e2bEA255");
// ERC-20: $BRANU token contract
const tokenModule = sdk.getTokenModule("0x08c057C40474cDaF82a321535C530721A6E44adb");

(async () => {
    try {
        // Retrieving the addresses with BranavanDAO Access Pass - tokenID is "0"
        const walletAddress = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddress.length === 0) {
            console.log("There are no addresses that have claimed BranavanDAO access pass yet!");
            process.exit(0);
        }

        const airdropRecipients = walletAddress.map((address) => {
            // Picks a random number for the airdrip
            const randomAirDrop = Math.floor(Math.random() * (10000 - 1000 + 1) + 1);
            console.log("✅ Airdrop of", randomAirDrop, "tokens to", address, "has been sent!");

            const airdropRecipient = {
                address,
                amount: ethers.utils.parseUnits(randomAirDrop.toString(),18),
            };

            return airdropRecipient;
        });

        // Batch transfer of tokens using tokenModule.transferBatch()
        console.log("🌈 Starting airdrop...");
        await tokenModule.transferBatch(airdropRecipients);
        console.log("✅ $BRANU has been successfully airdropped to holders of BranavanDOA access pass");
    
    } catch (err) {
    console.error("Failed to airdrop tokens", err);
    }
})();