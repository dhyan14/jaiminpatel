import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the request body
    const submission = req.body;
    
    // Validate required fields
    if (!submission.assignmentId || !submission.studentName || 
        !submission.studentId || !submission.fileData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('assignment_db');
    
    // Insert the submission
    await db.collection('submissions').insertOne({
      ...submission,
      uploadDate: new Date(submission.uploadDate)
    });
    
    return res.status(201).json({ message: 'Submission uploaded successfully' });
  } catch (error) {
    console.error('Error uploading submission:', error);
    return res.status(500).json({ error: 'Failed to upload submission' });
  }
} 