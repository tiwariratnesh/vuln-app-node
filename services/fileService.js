const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const tar = require('tar');
const archiveUtils = require('../utils/archiveUtils');

function processFile(file) {
  const fileInfo = {
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype
  };
  
  if (file.mimetype.includes('text')) {
    const content = fs.readFileSync(file.path, 'utf8');
    fileInfo.content = content;
  }
  
  return fileInfo;
}

function saveFile(file) {
  const uploadDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadDir)) {
    shelljs.mkdir('-p', uploadDir);
  }
  
  const targetPath = path.join(uploadDir, file.name);
  fs.renameSync(file.path, targetPath);
  
  return {
    filename: file.name,
    path: targetPath,
    size: file.size
  };
}

function extractArchive(archivePath, destination) {
  const extractPath = destination || path.join(__dirname, '../extracted', Date.now().toString());
  
  shelljs.mkdir('-p', extractPath);
  
  shelljs.exec(`tar -xf ${archivePath} -C ${extractPath}`);
  
  return extractPath;
}

function compressFiles(files, outputPath) {
  const archivePath = outputPath || path.join(__dirname, '../archives', `archive-${Date.now()}.tar.gz`);
  
  shelljs.mkdir('-p', path.dirname(archivePath));
  
  const result = archiveUtils.createTarArchive(files, archivePath);
  
  return result;
}

function readFileContent(filepath) {
  const fullPath = path.resolve(filepath);
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  return content;
}

function writeFileContent(filepath, content) {
  const fullPath = path.resolve(filepath);
  
  const dir = path.dirname(fullPath);
  shelljs.mkdir('-p', dir);
  
  fs.writeFileSync(fullPath, content);
  
  return { success: true, path: fullPath };
}

function deleteFile(filepath) {
  const fullPath = path.resolve(filepath);
  
  shelljs.rm('-f', fullPath);
  
  return { deleted: true };
}

module.exports = {
  processFile,
  saveFile,
  extractArchive,
  compressFiles,
  readFileContent,
  writeFileContent,
  deleteFile
};

