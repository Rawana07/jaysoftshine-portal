import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
});

// Upload files
router.post('/', upload.array('files', 10), (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
    }));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;