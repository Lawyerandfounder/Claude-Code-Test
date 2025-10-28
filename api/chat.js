export default async function handler(req, 
  res) {
      res.setHeader('Access-Control-Allow-Ori
  gin', '*');
      res.setHeader('Access-Control-Allow-Met
  hods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Hea
  ders', 'Content-Type');

      if (req.method === 'OPTIONS') {
          res.status(200).end();
          return;
      }

      if (req.method !== 'GET' && req.method
  !== 'POST') {
          return res.status(405).json({
  error: 'Method not allowed' });
      }

      try {
          const message = req.method ===
  'GET' ? req.query.message :
  req.body.message;

          if (!message) {
              return res.status(400).json({
  error: 'Message parameter is required' });
          }

          const webhookUrl =
  process.env.N8N_WEBHOOK_URL;

          if (!webhookUrl) {
              console.error('N8N_WEBHOOK_URL 
  environment variable not set');
              return res.status(500).json({
  error: 'Server configuration error' });
          }

          const n8nUrl = `${webhookUrl}?messa
  ge=${encodeURIComponent(message)}`;

          const response = await
  fetch(n8nUrl, {
              method: 'GET',
              headers: {
                  'Content-Type':
  'application/json'
              }
          });

          if (!response.ok) {
              throw new Error(`n8n webhook 
  responded with status ${response.status}`);
          }

          const data = await response.json();

          return res.status(200).json(data);

      } catch (error) {
          console.error('Error proxying to 
  n8n webhook:', error);
          return res.status(500).json({
              error: 'Failed to process 
  request',
              message: 'Please try again 
  later'
          });
      }
  }
