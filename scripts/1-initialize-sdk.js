import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

// Importing and configuring the .env file
import dotenv from "dotenv";
dotenv.config();

// Checking the variables from the .env file
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
    console.log("🛑 Private key not found.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
    console.log("🛑 Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
    console.log("🛑 Alchemy API URL not found.")
}

// Initalized the SDK
const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        // getDefaultProvider refer to the Ethereum node we'll be communicating with
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

(async () => {
    try {
        const apps = await sdk.getApps();
        console.log("Your application address is:", apps[0].address);
    } catch (err) {
        console.error("Failed to get application from the sdk", err);
        // Refers to uncaught fatal error
        process.exit(1);
    }
})()

export default sdk;