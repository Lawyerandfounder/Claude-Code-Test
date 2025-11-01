export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const message = req.method === 'GET' ? req.query.message : req.body.message;
        const name = req.method === 'GET' ? req.query.name : req.body.name;
        const email = req.method === 'GET' ? req.query.email : req.body.email;

        if (!message) {
            return res.status(400).json({ error: 'Message parameter is required' });
        }

        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('N8N_WEBHOOK_URL environment variable not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Build URL with all parameters for n8n tracking
        const n8nUrl = `${webhookUrl}?message=${encodeURIComponent(message)}&name=${encodeURIComponent(name || '')}&email=${encodeURIComponent(email || '')}`;

        const response = await fetch(n8nUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`n8n webhook responded with status ${response.status}`);
        }

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error proxying to n8n webhook:', error);
        return res.status(500).json({
            error: 'Failed to process request',
            message: 'Please try again later'
        });
    }
}
