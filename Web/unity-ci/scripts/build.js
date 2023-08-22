const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

function generateFolderStructure(dirPath, depth = 0) {
    if(depth >= 2) {
        return [];
    }
    const folders = [];

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if(depth === 1){
            folders.push(file);
            return folders;
        }
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const subFolders = generateFolderStructure(filePath, depth + 1);
            folders.push({
                name: file,
                subfolders: subFolders,
            });
        }
    }

    return folders;
}

const dotCoverPath = path.join(__dirname, "../../..", 'dotCover'); // Update the path accordingly
const folderStructure = generateFolderStructure(dotCoverPath);

const outputFilePath = path.join(__dirname, "../src", 'folder-structure.json');
fs.writeFileSync(outputFilePath, JSON.stringify(folderStructure, null, 2));

console.log('Folder structure JSON generated successfully.');
function copyFolderWithExclusions(sourceDir, targetDir, excludedExtensions, excludedFilenames) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    const files = fs.readdirSync(sourceDir);

    files.forEach(file => {
        const sourceFilePath = path.join(sourceDir, file);
        const targetFilePath = path.join(targetDir, file);

        const fileStats = fs.statSync(sourceFilePath);

        if (fileStats.isDirectory()) {
            copyFolderWithExclusions(sourceFilePath, targetFilePath, excludedExtensions, excludedFilenames);
        } else {
            const fileExtension = path.extname(file);
            const fileName = path.basename(file);

            if (!excludedExtensions.includes(fileExtension) && !excludedFilenames.includes(fileName)) {
                fse.copyFileSync(sourceFilePath, targetFilePath);
            }
        }
    });
}

const sourceDirectory = dotCoverPath;
const targetDirectory = path.join(__dirname, "../public", 'dotCover');
const excludedExtensions = ['.editmode', '.log', '.both', ".playmode", ".raw", ".ps1", ".sh", ".yaml"]; // Add more extensions as needed
const excludedFilenames = ['.gitignore']; // Add more filenames as needed

copyFolderWithExclusions(sourceDirectory, targetDirectory, excludedExtensions, excludedFilenames);