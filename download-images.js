/**
 * Portrait Image Downloader
 * This script downloads all the portrait images from remote URLs and saves them locally.
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create portraits directory if it doesn't exist
const portraitsDir = path.join(__dirname, 'portraits');
if (!fs.existsSync(portraitsDir)) {
    fs.mkdirSync(portraitsDir);
    console.log('Created portraits directory');
}

// Extract portrait data from scripts.js
const scriptsPath = path.join(__dirname, 'scripts.js');
let scriptsContent = fs.readFileSync(scriptsPath, 'utf8');

// Extract portrait data using regex
const portraitDataRegex = /const portraitData = \[([\s\S]*?)\];/;
const match = scriptsContent.match(portraitDataRegex);

if (!match) {
    console.error('Could not find portraitData in scripts.js');
    process.exit(1);
}

// Parse the portrait data
let portraitDataText = match[1];
let portraitData = [];

// Extract each portrait entry
const portraitEntryRegex = /{[^}]*}/g;
const portraitEntries = portraitDataText.match(portraitEntryRegex);

if (!portraitEntries) {
    console.error('Could not parse portrait entries');
    process.exit(1);
}

// Process each portrait entry
portraitEntries.forEach(entry => {
    // Extract id, image URL, name
    const idMatch = entry.match(/id:\s*(\d+)/);
    const imageMatch = entry.match(/image:\s*'([^']+)'/);
    const nameMatch = entry.match(/name:\s*'([^']+)'/);
    
    if (idMatch && imageMatch && nameMatch) {
        portraitData.push({
            id: parseInt(idMatch[1]),
            originalUrl: imageMatch[1],
            name: nameMatch[1]
        });
    }
});

console.log(`Found ${portraitData.length} portrait entries`);

// Function to download an image and save it locally
function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Download all images and update portraitData
async function downloadAllImages() {
    console.log('Starting to download images...');
    
    // Track all download promises
    const downloads = [];
    
    // Process each portrait
    for (const portrait of portraitData) {
        // Generate a filename based on the ID and gender
        const isWoman = portrait.originalUrl.includes('/women/');
        const gender = isWoman ? 'woman' : 'man';
        const imageNumber = portrait.originalUrl.match(/\/(\d+)\.jpg$/)[1];
        
        // The new local filename
        const localFilename = `portrait_${gender}_${imageNumber}.jpg`;
        const localPath = path.join(portraitsDir, localFilename);
        
        // Store the new local path in the portrait object
        portrait.localPath = `portraits/${localFilename}`;
        
        // Download the image
        console.log(`Downloading: ${portrait.originalUrl} -> ${localPath}`);
        downloads.push(
            downloadImage(portrait.originalUrl, localPath)
                .then(() => console.log(`Downloaded: ${localFilename}`))
                .catch(err => console.error(`Error downloading ${localFilename}:`, err))
        );
    }
    
    // Wait for all downloads to complete
    await Promise.all(downloads);
    console.log('All images downloaded successfully!');
    
    // Update the portraitData in scripts.js
    updatePortraitData();
}

// Update the portraitData in scripts.js
function updatePortraitData() {
    console.log('Updating portraitData in scripts.js...');
    
    // Read the scripts.js file again to make sure we have the latest version
    let scriptsContent = fs.readFileSync(scriptsPath, 'utf8');
    
    // For each portrait, replace the image URL with the local path
    portraitData.forEach(portrait => {
        const originalUrlPattern = new RegExp(`(image:\\s*)'${portrait.originalUrl}'`, 'g');
        scriptsContent = scriptsContent.replace(
            originalUrlPattern, 
            `$1'${portrait.localPath}'`
        );
    });
    
    // Write the updated content back to scripts.js
    fs.writeFileSync(scriptsPath, scriptsContent, 'utf8');
    console.log('Updated scripts.js with local image paths');
    
    // Create a portrait-paths.json file for reference
    const portraitPaths = portraitData.map(p => ({
        id: p.id,
        name: p.name,
        originalUrl: p.originalUrl,
        localPath: p.localPath
    }));
    
    fs.writeFileSync(
        path.join(__dirname, 'portrait-paths.json'),
        JSON.stringify(portraitPaths, null, 2),
        'utf8'
    );
    console.log('Created portrait-paths.json for reference');
}

// Execute the download and update process
downloadAllImages().catch(err => {
    console.error('Error in download process:', err);
    process.exit(1);
});
