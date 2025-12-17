#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory (parent of program/)
const PROJECT_ROOT = path.join(__dirname, '..');
const INPUT_DIR = path.join(PROJECT_ROOT, 'input');
const CONVERTED_DIR = path.join(PROJECT_ROOT, 'converted');

async function convertFile(filePath, interval) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Converting: ${path.basename(filePath)}`);
    console.log('='.repeat(60));
    
    const args = [path.join(__dirname, 'pptx-to-srt.mjs'), filePath];
    if (interval) {
      args.push('-d', interval);
    }
    
    const process = spawn('node', args, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Conversion failed with code ${code}`));
      }
    });
  });
}

async function main() {
  // Get interval from command line argument (optional)
  const interval = process.argv[2];
  
  try {
    // Check if input directory exists
    try {
      await fs.access(INPUT_DIR);
    } catch (e) {
      console.error(`Error: Input directory '${INPUT_DIR}' not found.`);
      console.log(`\nPlease create the '${INPUT_DIR}' folder and add your PPTX files to it.`);
      process.exit(1);
    }
    
    // Ensure converted directory exists
    await fs.mkdir(CONVERTED_DIR, { recursive: true });
    
    // Read all files from input directory
    const files = await fs.readdir(INPUT_DIR);
    
    // Filter for PPTX files
    const pptxFiles = files.filter(file => 
      file.toLowerCase().endsWith('.pptx') || file.toLowerCase().endsWith('.ppt')
    );
    
    if (pptxFiles.length === 0) {
      console.log(`No PPTX files found in '${INPUT_DIR}' directory.`);
      console.log(`\nPlace your PowerPoint files (.pptx or .ppt) in the '${INPUT_DIR}' folder.`);
      process.exit(0);
    }
    
    console.log(`Found ${pptxFiles.length} file(s) to convert:\n`);
    pptxFiles.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file}`);
    });
    
    // Convert each file
    for (const file of pptxFiles) {
      const filePath = path.join(INPUT_DIR, file);
      
      // Check if it's a .ppt file and convert it first
      if (file.toLowerCase().endsWith('.ppt')) {
        console.log(`\n⚠️  Converting .ppt to .pptx format...`);
        const pptxPath = filePath.replace(/\.ppt$/i, '.pptx');
        
        try {
          const { spawn } = await import('child_process');
          await new Promise((resolve, reject) => {
            const convert = spawn('/Applications/LibreOffice.app/Contents/MacOS/soffice', [
              '--headless',
              '--convert-to',
              'pptx',
              filePath,
              '--outdir',
              INPUT_DIR
            ]);
            
            convert.on('close', (code) => {
              if (code === 0) {
                console.log(`✓ Converted to PPTX format`);
                resolve();
              } else {
                reject(new Error('Conversion failed'));
              }
            });
          });
          
          // Now convert the PPTX file
          await convertFile(pptxPath, interval);
        } catch (e) {
          console.error(`Failed to convert ${file}: ${e.message}`);
          console.log('See CONVERSION.md for manual conversion options.');
        }
      } else {
        await convertFile(filePath, interval);
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✓ All conversions complete!');
    console.log(`Check the '${CONVERTED_DIR}' folder for your subtitle files.`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
