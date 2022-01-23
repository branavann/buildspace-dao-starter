import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xb834cEf959571a4E89Ab471746196f1911107e55");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            // Providing the metadata for our project
            name: "BranavanDAO Access Pass",
            description: "For fans of Branavan's greatest degen moments",
            image: readFileSync("scripts/assets/Smol.jpg"),
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });
        // Printing address of our collection
        console.log(
            "✅  Successfully deployed at", 
            bundleDropModule.address,
        );
        // Printing metadata of our collection
        console.log(
            "✅ bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );

    } catch (error) {
        console.log("Deployment has failed", error);
    }
}) ()