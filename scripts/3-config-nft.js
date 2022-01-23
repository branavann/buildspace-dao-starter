import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// Getting access to our deployed ERC1155 contract
const bundleDrop = sdk.getBundleDropModule(
    "0xC63Ba63Fc22CDbc460b55A767eDD2603e2bEA255",
);

// Setting the metadata of the NFT and minting it
(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Smolruto Uzumaki",
                description: "Access pass for BranavanDAO",
                image: readFileSync("scripts/assets/Smol.jpg"),
            },
        ]);
        console.log("✅  NFT mint was successful");
    } catch (error) {
        console.error("❌ Failed to mint the NFT", error);
    }
})()