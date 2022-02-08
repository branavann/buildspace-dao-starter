import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Importing the voting contract
const voteModule = sdk.getVoteModule("0xF886aD1Ae586D4661DdCFd770C16D381d167b42a");
// Importing $BRANU (ERC-20) contract
const tokenModule = sdk.getTokenModule("0x08c057C40474cDaF82a321535C530721A6E44adb");

(async () => {
    try {
        const mintAmount = 10_000;
        await voteModule.propose(
            "Should we mint 10,000 $BRANU to the Treasury to fund future developmental of BranavanDAO?",
            [
                {
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "mint",
                        [
                            // Address that'll recieve the newly minted tokens
                            voteModule.address,
                            // parseUnit converts "10000" to a BigNumber by multiplying it by 10^18
                            ethers.utils.parseUnits(mintAmount.toString(), 18),
                        ]
                    ),
                    toAddress: voteModule.address,
                },
            ]
        );
        console.log("✅Successfully created prosposal to mint", mintAmount,"$BRANU to the treasury");
    } catch (err) {
        console.error("❌Failed to create the proposal",err);
        process.exit(1);
    }

    try {
        const transferAmount = 420;
        const recepient = "0xb78196b3e667841047d1Bb1365AB8fB3d46aB1A8";
        await voteModule.propose(
            "Should BranavanDAO transfer Branava " + transferAmount + " $BRANU from the treasury for his creation of BranavanDAO?",
            [
                {
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "transfer",
                        [
                            recepient,
                            ethers.utils.parseUnits(transferAmount.toString(), 18),
                        ]
                    ),
                    toAddress: tokenModule.address,
                },
            ]
        );
        console.log("✅Successfully created prosposal to transfer", transferAmount, "$BRANU to", recepient);
    } catch (err) {
        console.log("❌Failed to create the transfer proposal", err);
    }
})();