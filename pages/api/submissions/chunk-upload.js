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
    const { chunk, chunkIndex, totalChunks, submissionId, metadata } = req.body;
    
    // For the first chunk, create a new submission document
    if (chunkIndex === 0) {
      // Create a new submission document with empty fileData
      const newSubmission = new Submission({
        id: submissionId,
        assignmentId: metadata.assignmentId,
        studentName: metadata.studentName,
        studentId: metadata.studentId,
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        uploadDate: new Date(metadata.uploadDate),
        fileData: chunk, // Store the first chunk
        chunksReceived: 1,
        totalChunks: totalChunks
      });
      
      // Save the submission to MongoDB
      await newSubmission.save();
      
      return res.status(201).json({ 
        message: 'First chunk received', 
        submissionId: submissionId 
      });
    } 
    // For subsequent chunks, append to existing submission
    else {
      // Find the submission
      const submission = await Submission.findOne({ id: submissionId });
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Append the chunk to fileData
      submission.fileData += chunk.replace(/^data:application\/pdf;base64,/, '');
      submission.chunksReceived = chunkIndex + 1;
      
      // Save the updated submission
      await submission.save();
      
      // If this is the last chunk, mark as complete
      if (submission.chunksReceived === submission.totalChunks) {
        return res.status(200).json({ 
          message: 'Upload complete', 
          submissionId: submissionId 
        });
      }
      
      return res.status(200).json({ 
        message: `Chunk ${chunkIndex + 1} of ${totalChunks} received`,
        progress: Math.round(((chunkIndex + 1) / totalChunks) * 100)
      });
    }
  } catch (error) {
    console.error('Error processing chunk:', error);
    return res.status(500).json({ 
      error: 'Failed to process chunk', 
      details: error.message 
    });
  }
} 