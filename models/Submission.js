// This is a simple schema definition for the submission
// You can use this as a reference when working with the data

import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  assignmentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileData: {
    type: String,
    required: true
  }
});

// Check if the model already exists to prevent overwriting
const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);

export default Submission; 