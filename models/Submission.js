// This is a simple schema definition for the submission
// You can use this as a reference when working with the data

const SubmissionSchema = {
  id: String,
  assignmentId: String,
  studentName: String,
  studentId: String,
  fileName: String,
  fileSize: Number,
  fileType: String,
  uploadDate: Date,
  fileData: String // Base64 encoded file data
};

export default SubmissionSchema; 