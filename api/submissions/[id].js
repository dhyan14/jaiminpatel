import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Submission ID is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('assignment_db');
    const submissionsCollection = db.collection('submissions');

    if (req.method === 'GET') {
      // Get a specific submission including file data
      const submission = await submissionsCollection.findOne({ id });
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      return res.status(200).json(submission);
    } 
    else if (req.method === 'DELETE') {
      // Delete a submission
      const result = await submissionsCollection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      return res.status(200).json({ message: 'Submission deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(`Error with submission ${id}:`, error);
    return res.status(500).json({ error: 'Server error' });
  }
} 