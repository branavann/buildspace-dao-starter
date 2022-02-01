import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xb834cEf959571a4E89Ab471746196f1911107e55");

(async() => {
    try {
        // Deploying an ERC20 token smart contract
        const tokenModule = await app.deployTokenModule({
            name: "BranavanDAO Governance Token",
            symbol: "BRANU",
        });
        console.log("✅ Successfully deployed token module, address:", tokenModule.address);
    } catch (error) {
        console.log("❌ Failed to deploy token module", error);
    }
})();