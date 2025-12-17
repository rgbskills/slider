#!/usr/bin/env node

import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';
import path from 'path';

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    inputFile: null,
    outputBase: 'subtitles',
    defaultDuration: 3000, // ms (changed from 4000 to 3000)
    startOffset: 0,
    minDuration: 500, // ms
    lang1: 'ro',
    lang2: 'en',
    output: 'separate', // 'separate' or 'bilingual'
    debug: false,
    outputDir: 'converted', // Output directory
    startTimecode: null,
    endTimecode: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--out' || arg === '-o') {
      config.outputBase = args[++i];
    } else if (arg === '--default-duration' || arg === '--interval' || arg === '-d') {
      config.defaultDuration = parseFloat(args[++i]) * 1000; // convert to ms
    } else if (arg === '--start-offset-ms') {
      config.startOffset = parseInt(args[++i], 10);
    } else if (arg === '--min-duration-ms') {
      config.minDuration = parseInt(args[++i], 10);
    } else if (arg === '--lang1') {
      config.lang1 = args[++i];
    } else if (arg === '--lang2') {
      config.lang2 = args[++i];
    } else if (arg === '--output') {
      config.output = args[++i];
    } else if (arg === '--start-timecode') {
      config.startTimecode = args[++i];
    } else if (arg === '--end-timecode') {
      config.endTimecode = args[++i];
    } else if (arg === '--debug') {
      config.debug = true;
    } else if (!arg.startsWith('-')) {
      config.inputFile = arg;
    }
  }

  if (!config.inputFile) {
    console.error('Error: Input file required');
    printHelp();
    process.exit(1);
  }

  return config;
}

function printHelp() {
  console.log(`
Usage: node pptx-to-srt.mjs <input.pptx> [options]

Options:
  --out, -o <name>              Output base name (default: subtitles)
  -d, --interval <seconds>      Interval between subtitles in seconds (default: 3)
  --default-duration <seconds>  Same as --interval (alias)
  --start-offset-ms <ms>        Global start offset in ms (default: 0)
  --min-duration-ms <ms>        Minimum duration per slide (default: 500)
  --lang1 <code>                Language code for white text (default: ro)
  --lang2 <code>                Language code for yellow text (default: en)
  --output <mode>               Output mode: separate|bilingual (default: separate)
  --debug                       Print debug information
  --help, -h                    Show this help message

Examples:
  node pptx-to-srt.mjs file.pptx -d 5                    # 5 second intervals
  node pptx-to-srt.mjs file.pptx --interval 4 --debug   # 4 second intervals with debug
  node pptx-to-srt.mjs file.pptx --out subtitles --default-duration 4 --output separate
  `);
}

// XML Parser configuration
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  trimValues: true,
  removeNSPrefix: true
});

// Parse timecode (HH:MM:SS:FF) to milliseconds (assuming 25 fps)
function timecodeToMs(timecode, fps = 25) {
  const parts = timecode.split(':').map(Number);
  if (parts.length !== 4) {
    throw new Error(`Invalid timecode format: ${timecode}. Use HH:MM:SS:FF`);
  }
  const [hours, minutes, seconds, frames] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + (frames / fps) * 1000;
}

// Color matching helpers
function normalizeColor(color) {
  if (!color) return null;
  // Remove '#' if present and convert to uppercase
  return color.replace('#', '').toUpperCase();
}

function isWhiteColor(color) {
  const normalized = normalizeColor(color);
  if (!normalized) return false;
  // White is FFFFFF or very close to it
  return normalized === 'FFFFFF' || normalized === 'FFF';
}

function isYellowColor(color) {
  const normalized = normalizeColor(color);
  if (!normalized) return false;
  // Yellow variations: FFFF00, FFC000, etc.
  return normalized.startsWith('FFFF') || 
         normalized.startsWith('FFC0') || 
         normalized.startsWith('FFD7') ||
         normalized === 'FFFF00' ||
         normalized === 'FFC000';
}

// Extract color from text run properties
function extractColor(run) {
  try {
    // Check for direct color in run properties
    if (run.rPr) {
      const rPr = run.rPr;
      
      // Check solidFill with srgbClr
      if (rPr.solidFill?.srgbClr) {
        return rPr.solidFill.srgbClr['@_val'];
      }
      
      // Check latin font color (alternative path)
      if (rPr.latin?.['@_color']) {
        return rPr.latin['@_color'];
      }
      
      // Check for scheme color (theme colors)
      if (rPr.solidFill?.schemeClr) {
        const scheme = rPr.solidFill.schemeClr['@_val'];
        // Map common theme colors
        if (scheme === 'lt1' || scheme === 'bg1') return 'FFFFFF'; // white
        if (scheme === 'accent6') return 'FFC000'; // often yellow
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
}

// Extract text content from a text run
function extractTextFromRun(run) {
  if (typeof run === 'string') return run;
  if (run.t) {
    // Handle cases where run.t might be an object or array
    if (typeof run.t === 'string') return run.t;
    if (Array.isArray(run.t)) return run.t.join('');
    if (typeof run.t === 'object' && run.t['#text']) return run.t['#text'];
    return String(run.t); // Fallback: convert to string
  }
  if (run.br) return '\n'; // Line break
  return '';
}

// Parse a single slide
async function parseSlide(slideXml, slideNum, config) {
  const slide = xmlParser.parse(slideXml);
  
  let lang1Text = []; // White text (Romanian)
  let lang2Text = []; // Yellow text (English)
  
  try {
    const shapes = slide?.sld?.cSld?.spTree?.sp;
    if (!shapes) {
      if (config.debug) {
        console.log(`Slide ${slideNum}: No shapes found`);
      }
      return { lang1: '', lang2: '', duration: config.defaultDuration };
    }
    
    const shapeArray = Array.isArray(shapes) ? shapes : [shapes];
    
    for (const shape of shapeArray) {
      if (!shape.txBody) continue;
      
      const paragraphs = shape.txBody.p;
      const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
      
      for (const para of paraArray) {
        if (!para.r) continue;
        
        const runs = Array.isArray(para.r) ? para.r : [para.r];
        
        for (const run of runs) {
          const text = extractTextFromRun(run);
          if (!text || typeof text !== 'string' || !text.trim()) continue;
          
          const color = extractColor(run);
          
          if (isWhiteColor(color)) {
            lang1Text.push(text);
          } else if (isYellowColor(color)) {
            lang2Text.push(text);
          } else if (config.debug && color) {
            console.log(`Slide ${slideNum}: Unknown color ${color} for text: ${text.substring(0, 30)}`);
          }
        }
      }
    }
  } catch (e) {
    console.error(`Error parsing slide ${slideNum}:`, e.message);
  }
  
  // Extract timing if available
  let duration = config.defaultDuration;
  try {
    const timing = slide?.sld?.timing;
    if (timing?.tnLst?.par?.cTn?.['@_dur']) {
      const dur = parseInt(timing.tnLst.par.cTn['@_dur'], 10);
      if (dur > 0) {
        duration = dur; // Duration is already in milliseconds
      }
    }
  } catch (e) {
    // Use default duration
  }
  
  return {
    lang1: lang1Text.join(' ').trim(),
    lang2: lang2Text.join(' ').trim(),
    duration: Math.max(duration, config.minDuration)
  };
}

// Format timestamp for SRT
function formatSrtTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

// Generate SRT content
function generateSrt(subtitles) {
  let srt = '';
  subtitles.forEach((sub, index) => {
    if (!sub.text || !sub.text.trim()) return;
    
    srt += `${index + 1}\n`;
    srt += `${formatSrtTime(sub.start)} --> ${formatSrtTime(sub.end)}\n`;
    srt += `${sub.text}\n\n`;
  });
  return srt;
}

// Main function
async function main() {
  const config = parseArgs();
  
  // Get base filename without extension
  const inputBasename = path.basename(config.inputFile, path.extname(config.inputFile));
  
  // Ensure output directory exists
  try {
    await fs.mkdir(config.outputDir, { recursive: true });
  } catch (e) {
    // Directory might already exist
  }
  
  console.log(`Converting: ${config.inputFile}`);
  console.log(`Output mode: ${config.output}`);
  console.log(`Default duration: ${config.defaultDuration}ms`);
  console.log(`Output directory: ${config.outputDir}`);
  
  // Read PPTX file
  const data = await fs.readFile(config.inputFile);
  const zip = await JSZip.loadAsync(data);
  
  // Read presentation.xml to get slide order
  const presentationXml = await zip.file('ppt/presentation.xml')?.async('string');
  if (!presentationXml) {
    // Check if this might be an old .ppt file
    const ext = path.extname(config.inputFile).toLowerCase();
    if (ext === '.ppt') {
      console.error('\n❌ Error: This appears to be an older .ppt file (binary format).');
      console.error('This tool requires the modern .pptx format (Office Open XML).\n');
      console.error('Please convert your file first. See CONVERSION.md for options:');
      console.error('  - Upload to Google Slides and download as .pptx');
      console.error('  - Open in PowerPoint and Save As .pptx format');
      console.error('  - Use LibreOffice: soffice --headless --convert-to pptx file.ppt\n');
      process.exit(1);
    }
    throw new Error('Invalid PPTX: presentation.xml not found');
  }
  
  const presentation = xmlParser.parse(presentationXml);
  const slideIds = presentation?.presentation?.sldIdLst?.sldId;
  
  if (!slideIds) {
    throw new Error('No slides found in presentation');
  }
  
  const slideIdArray = Array.isArray(slideIds) ? slideIds : [slideIds];
  
  // Calculate duration per slide if timecodes are provided
  let calculatedDuration = config.defaultDuration;
  if (config.startTimecode && config.endTimecode) {
    const startMs = timecodeToMs(config.startTimecode);
    const endMs = timecodeToMs(config.endTimecode);
    const totalDuration = endMs - startMs;
    calculatedDuration = totalDuration / slideIdArray.length;
    
    console.log(`Spreading ${slideIdArray.length} slides from ${config.startTimecode} to ${config.endTimecode}`);
    console.log(`Duration per slide: ${(calculatedDuration / 1000).toFixed(2)}s\n`);
    
    config.startOffset = startMs;
    config.defaultDuration = calculatedDuration;
  }
  
  // Read relationships to map slide IDs to file names
  const relsXml = await zip.file('ppt/_rels/presentation.xml.rels')?.async('string');
  if (!relsXml) {
    throw new Error('Invalid PPTX: presentation.xml.rels not found');
  }
  
  const rels = xmlParser.parse(relsXml);
  const relationships = rels?.Relationships?.Relationship;
  const relArray = Array.isArray(relationships) ? relationships : [relationships];
  
  const relMap = {};
  relArray.forEach(rel => {
    relMap[rel['@_Id']] = rel['@_Target'];
  });
  
  // Process slides in order
  const lang1Subtitles = [];
  const lang2Subtitles = [];
  const bilingualSubtitles = [];
  
  let currentTime = config.startOffset;
  
  for (let i = 0; i < slideIdArray.length; i++) {
    const slideId = slideIdArray[i];
    const rId = slideId['@_id'] || slideId['@_r:id'] || slideId['@_rid'];
    const slidePath = relMap[rId];
    
    if (!slidePath) {
      console.warn(`Warning: Could not find slide file for ID ${rId}`);
      continue;
    }
    
    const fullPath = `ppt/${slidePath}`;
    const slideXml = await zip.file(fullPath)?.async('string');
    
    if (!slideXml) {
      console.warn(`Warning: Slide file not found: ${fullPath}`);
      continue;
    }
    
    const slideData = await parseSlide(slideXml, i + 1, config);
    
    if (config.debug) {
      console.log(`\nSlide ${i + 1}:`);
      console.log(`  ${config.lang1}: ${slideData.lang1 || '(empty)'}`);
      console.log(`  ${config.lang2}: ${slideData.lang2 || '(empty)'}`);
      console.log(`  Duration: ${slideData.duration}ms`);
    }
    
    const start = currentTime;
    const end = currentTime + slideData.duration;
    
    if (slideData.lang1) {
      lang1Subtitles.push({ start, end, text: slideData.lang1 });
    }
    
    if (slideData.lang2) {
      lang2Subtitles.push({ start, end, text: slideData.lang2 });
    }
    
    if (slideData.lang2 || slideData.lang1) {
      bilingualSubtitles.push({
        start,
        end,
        text: `${slideData.lang2 || ''}\n${slideData.lang1 || ''}`.trim()
      });
    }
    
    currentTime = end;
  }
  
  console.log(`\nProcessed ${slideIdArray.length} slides`);
  console.log(`${config.lang1} subtitles: ${lang1Subtitles.length}`);
  console.log(`${config.lang2} subtitles: ${lang2Subtitles.length}`);
  
  // Write output files
  if (config.output === 'separate') {
    const lang1File = path.join(config.outputDir, `${inputBasename}.${config.lang1}.srt`);
    const lang2File = path.join(config.outputDir, `${inputBasename}.${config.lang2}.srt`);
    
    await fs.writeFile(lang1File, generateSrt(lang1Subtitles), 'utf8');
    await fs.writeFile(lang2File, generateSrt(lang2Subtitles), 'utf8');
    
    console.log(`\nCreated: ${lang1File}`);
    console.log(`Created: ${lang2File}`);
  } else if (config.output === 'bilingual') {
    const bilingualFile = path.join(config.outputDir, `${inputBasename}.srt`);
    
    await fs.writeFile(bilingualFile, generateSrt(bilingualSubtitles), 'utf8');
    
    console.log(`\nCreated: ${bilingualFile}`);
  }
  
  console.log('\n✓ Conversion complete!');
}

// Run
main().catch(err => {
  console.error('Error:', err.message);
  if (process.env.DEBUG) {
    console.error(err.stack);
  }
  process.exit(1);
});
