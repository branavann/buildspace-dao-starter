import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

// Initalizing the variable with the address of the $BRANU token
const tokenModule = sdk.getTokenModule("0x08c057C40474cDaF82a321535C530721A6E44adb");

(async () => {
    try {
        const amount = 1_000_000;
        // Convert uint into a string with 18 decimal places - enables users to send extremely small units of our token
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(),18);
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // Printing out token information
        console.log(
            "There are",
            ethers.utils.formatUnits(totalSupply,18),
            "$BRANU in circulation",
        );
    } catch (error) {
        console.log('Failed to mint $BRANU tokens', error);
    }
})();