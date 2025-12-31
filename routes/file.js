const express = require('express');
const router = express.Router();
const multer = require('multer');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const fileService = require('../services/fileService');
const archiveUtils = require('../utils/archiveUtils');

const upload = multer({ dest: 'uploads/' });

router.use(fileUpload());

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const result = fileService.processFile(req.file);
  
  res.json({
    message: 'File uploaded successfully',
    file: result
  });
});

router.post('/upload-formidable', (req, res) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const file = files.file;
    const result = fileService.saveFile(file);
    
    res.json({
      message: 'File uploaded',
      file: result
    });
  });
});

router.post('/upload-express', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const file = req.files.file;
  const uploadPath = path.join(__dirname, '../uploads', file.name);
  
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      message: 'File uploaded',
      path: uploadPath
    });
  });
});

router.post('/extract-tar', upload.single('archive'), async (req, res) => {
  try {
    const archivePath = req.file.path;
    const extractPath = path.join(__dirname, '../extracted', Date.now().toString());
    
    await tar.extract({
      file: archivePath,
      cwd: extractPath
    });
    
    res.json({
      message: 'Archive extracted',
      path: extractPath
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/read', (req, res) => {
  const { filepath } = req.query;
  
  const fullPath = path.join(__dirname, '..', filepath);
  
  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ content: data });
  });
});

router.post('/write', (req, res) => {
  const { filepath, content } = req.body;
  
  const fullPath = path.join(__dirname, '..', filepath);
  
  fs.writeFile(fullPath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ message: 'File written successfully' });
  });
});

router.post('/compress', (req, res) => {
  const { files } = req.body;
  
  const result = archiveUtils.createArchive(files);
  
  res.json({
    message: 'Files compressed',
    archive: result
  });
});

router.post('/decompress', upload.single('archive'), (req, res) => {
  const archivePath = req.file.path;
  
  const extracted = archiveUtils.extractArchive(archivePath);
  
  res.json({
    message: 'Archive decompressed',
    files: extracted
  });
});

module.exports = router;

