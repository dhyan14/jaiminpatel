import dbConnect from '../../lib/mongodb';
import Submission from '../../models/Submission';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Get all submissions but exclude the file data to reduce payload size
    const submissions = await Submission
      .find({})
      .select('-fileData') // Exclude the file data
      .sort({ uploadDate: -1 });
    
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
  }
} 