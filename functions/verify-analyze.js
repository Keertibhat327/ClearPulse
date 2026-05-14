// Native fetch is available in Node 18+
async function verify() {
    try {
        console.log("Testing analyze-report...");
        const response = await fetch("https://afhtz3nj.us-west.insforge.app/functions/analyze-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.INSFORGE_SERVICE_KEY || process.env.INSFORGE_ANON_KEY || ''}`
            },
            body: JSON.stringify({
                patient_wallet: "0x1111111111111111111111111111111111111111",
                // Missing file_url/key to trigger 400 if working, or 500 if crashing
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log(`Status: ${status}`);
        console.log(`Body: ${text}`);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

verify();
