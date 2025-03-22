import dbConnect from '../../../lib/mongodb';
import Submission from '../../../models/Submission';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse the request body
    const submission = req.body;
    
    // Validate required fields
    if (!submission.assignmentId || !submission.studentName || 
        !submission.studentId || !submission.fileData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create a new submission document
    const newSubmission = new Submission({
      id: submission.id,
      assignmentId: submission.assignmentId,
      studentName: submission.studentName,
      studentId: submission.studentId,
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      fileType: submission.fileType,
      uploadDate: new Date(submission.uploadDate),
      fileData: submission.fileData
    });
    
    // Save the submission to MongoDB
    await newSubmission.save();
    
    return res.status(201).json({ message: 'Submission uploaded successfully' });
  } catch (error) {
    console.error('Error uploading submission:', error);
    return res.status(500).json({ error: 'Failed to upload submission', details: error.message });
  }
} 