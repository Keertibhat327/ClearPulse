const fs = require('fs');

async function verify() {
    // Clear file first
    try {
        fs.writeFileSync('verify_output.txt', '');
    } catch (e) {
    }
    const log = (msg) => {
        console.log(msg); // Also log to console for visibility
        try {
            fs.appendFileSync('verify_output.txt', msg + '\n');
        } catch (e) {
            // ignore
        }
    };

    log("Starting verification...");

    try {
        // Check if fetch is available
        if (typeof fetch === 'undefined') {
            log("Error: fetch is not defined (Node version to old?)");
            return;
        }

        const response = await fetch("https://afhtz3nj.us-west.insforge.app/functions/medical-chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.INSFORGE_SERVICE_KEY || process.env.INSFORGE_ANON_KEY || ''}`
            },
            body: JSON.stringify({
                patient_wallet: "0x1111111111111111111111111111111111111111",
                message: "Hello"
            })
        });

        const status = response.status;
        const text = await response.text();

        log(`Status: ${status}`);
        log(`Body: ${text}`);

    } catch (err) {
        log(`Error: ${err.message}`);
        if (err.cause) log(`Cause: ${err.cause}`);
    }
}
verify();
