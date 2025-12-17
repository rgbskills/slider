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

// Parse timecode (HH:MM:SS:FF) to milliseconds (assuming 25 fps)
function timecodeToMs(timecode, fps = 25) {
  const parts = timecode.split(':').map(Number);
  if (parts.length !== 4) {
    throw new Error(`Invalid timecode format: ${timecode}. Use HH:MM:SS:FF`);
  }
  const [hours, minutes, seconds, frames] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + (frames / fps) * 1000;
}

async function convertFile(filePath, options) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Converting: ${path.basename(filePath)}`);
    console.log('='.repeat(60));
    
    const args = [path.join(__dirname, 'pptx-to-srt.mjs'), filePath];
    
    if (options.startTimecode && options.endTimecode) {
      args.push('--start-timecode', options.startTimecode);
      args.push('--end-timecode', options.endTimecode);
    } else if (options.interval) {
      args.push('-d', options.interval);
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
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    filename: null,
    interval: null,
    startTimecode: null,
    endTimecode: null
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-f' || args[i] === '--file') {
      options.filename = args[++i];
    } else if (args[i] === '-s' || args[i] === '--start') {
      options.startTimecode = args[++i];
    } else if (args[i] === '-e' || args[i] === '--end') {
      options.endTimecode = args[++i];
    } else if (!args[i].startsWith('-')) {
      options.interval = args[i];
    }
  }
  
  if (!options.filename) {
    console.error('Error: Filename required. Use -f or --file to specify the file to convert.');
    console.log('\nUsage:');
    console.log('  npm run convert -- -f filename.pptx -s 00:02:43:18 -e 02:20:54:02');
    console.log('  npm run convert -- -f filename.pptx 5  (5 second interval)');
    process.exit(1);
  }
  
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
    
    // Check if file exists
    const filePath = path.join(INPUT_DIR, options.filename);
    try {
      await fs.access(filePath);
    } catch (e) {
      console.error(`Error: File '${options.filename}' not found in input/ folder.`);
      console.log('\nAvailable files:');
      const files = await fs.readdir(INPUT_DIR);
      const pptxFiles = files.filter(f => 
        f.toLowerCase().endsWith('.pptx') || f.toLowerCase().endsWith('.ppt')
      );
      pptxFiles.forEach(f => console.log(`  - ${f}`));
      process.exit(1);
    }
    
    console.log(`Converting: ${options.filename}\n`);
    
    // Convert the file
    const file = options.filename;
    try {
      
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
          await convertFile(pptxPath, options);
        } catch (e) {
          console.error(`Failed to convert ${file}: ${e.message}`);
          console.log('See CONVERSION.md for manual conversion options.');
          process.exit(1);
        }
      } else {
        await convertFile(filePath, options);
      }
    } catch (error) {
      console.error(`Error converting file: ${error.message}`);
      process.exit(1);
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✓ Conversion complete!');
    console.log(`Check the '${CONVERTED_DIR}' folder for your subtitle files.`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
