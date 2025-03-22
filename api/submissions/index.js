import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('assignment_db');
    
    // Get all submissions but exclude the file data to reduce payload size
    const submissions = await db
      .collection('submissions')
      .find({})
      .project({ fileData: 0 }) // Exclude the file data
      .sort({ uploadDate: -1 })
      .toArray();
    
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
} 