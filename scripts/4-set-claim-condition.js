import sdk from "./1-initialize-sdk.js";

// Initalizing variable with our contract address
const bundleDrop = sdk.getBundleDropModule("0xC63Ba63Fc22CDbc460b55A767eDD2603e2bEA255");

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        // Specifying the conditions for minting the NFT
        claimConditionFactory.newClaimPhase({
            // Date object can be used to retrieve the specific day, month, or year
            startTime: new Date(),
            maxQuantity: 100,
            maxQuantityPerTransaction: 1,
        });
        // Because this is an ERC-1155 token all of the tokens will share the same tokenID
        // Therefore, we'll have multiple NFTs that share the same tokenID - making them fungible
        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("✅ Successfully set claim condition on bundle drop:", bundleDrop.address);
    } catch (error) {
        console.log("❌ Failed to set the claim conditions", error);
    }
})()