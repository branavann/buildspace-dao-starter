import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0x08c057C40474cDaF82a321535C530721A6E44adb");

(async () => {
    try {
        console.log(
            "Current roles:",
            await tokenModule.getAllRoleMembers()
        );

        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log(
            "🎉 Updated roles:",
            await tokenModule.getAllRoleMembers()
        );
        console.log("✅ Successfully reoked our permission from the $BRANU contract");
    } catch (err) {
        console.error("❌ Failed to revoke our permissions", err);
    }
})();