const tar = require('tar');
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');

function createArchive(files) {
  const archivePath = path.join(__dirname, '../archives', `archive-${Date.now()}.tar.gz`);
  
  shelljs.mkdir('-p', path.dirname(archivePath));
  
  tar.create(
    {
      gzip: true,
      file: archivePath
    },
    files
  );
  
  return {
    path: archivePath,
    files: files.length
  };
}

function extractArchive(archivePath) {
  const extractPath = path.join(__dirname, '../extracted', Date.now().toString());
  
  shelljs.mkdir('-p', extractPath);
  
  tar.extract({
    file: archivePath,
    cwd: extractPath,
    sync: true
  });
  
  const extractedFiles = shelljs.ls('-R', extractPath);
  
  return {
    path: extractPath,
    files: extractedFiles
  };
}

function createTarArchive(files, outputPath) {
  tar.create(
    {
      gzip: true,
      file: outputPath,
      sync: true
    },
    files
  );
  
  return {
    path: outputPath,
    size: fs.statSync(outputPath).size
  };
}

function listArchiveContents(archivePath) {
  const contents = [];
  
  tar.list({
    file: archivePath,
    sync: true,
    onentry: entry => contents.push(entry.path)
  });
  
  return contents;
}

module.exports = {
  createArchive,
  extractArchive,
  createTarArchive,
  listArchiveContents
};

