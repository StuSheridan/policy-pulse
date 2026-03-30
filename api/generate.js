// Vercel serverless function — placeholder for production deployment
// In development, the Express server at server/index.js handles /api/generate
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.status(501).json({
    error: 'Serverless function not yet implemented. Use npm run dev for local development.'
  })
}
