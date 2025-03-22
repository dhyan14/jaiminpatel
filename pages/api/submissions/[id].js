import dbConnect from '../../../lib/mongodb';
import Submission from '../../../models/Submission';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Submission ID is required' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    if (req.method === 'GET') {
      // Get a specific submission including file data
      const submission = await Submission.findOne({ id });
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      return res.status(200).json(submission);
    } 
    else if (req.method === 'DELETE') {
      // Delete a submission
      const result = await Submission.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      return res.status(200).json({ message: 'Submission deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(`Error with submission ${id}:`, error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
} 