// State management
let uploadedImages = [];
let processedCode = [];
let stream = null;

// DOM Elements
const imageUpload = document.getElementById('imageUpload');
const cameraBtn = document.getElementById('cameraBtn');
const clearBtn = document.getElementById('clearBtn');
const imagesPreview = document.getElementById('imagesPreview');
const cameraModal = document.getElementById('cameraModal');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const closeModal = document.querySelector('.close');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const codeFiles = document.getElementById('codeFiles');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const processMoreBtn = document.getElementById('processMoreBtn');

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
cameraBtn.addEventListener('click', openCamera);
clearBtn.addEventListener('click', clearAll);
captureBtn.addEventListener('click', capturePhoto);
closeCameraBtn.addEventListener('click', closeCamera);
closeModal.addEventListener('click', closeCamera);
downloadAllBtn.addEventListener('click', downloadAllFiles);
processMoreBtn.addEventListener('click', resetApp);

// Handle image upload
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            addImage(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
    e.target.value = ''; // Reset input
}

// Add image to preview
function addImage(dataUrl, name) {
    const id = Date.now() + Math.random();
    uploadedImages.push({ id, dataUrl, name });
    renderImages();
    clearBtn.style.display = 'inline-block';
}

// Render images
function renderImages() {
    imagesPreview.innerHTML = '';
    uploadedImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.innerHTML = `
            <button class="remove-btn" onclick="removeImage(${img.id})">×</button>
            <img src="${img.dataUrl}" alt="Code image ${index + 1}">
            <div class="image-info">
                <input type="text" placeholder="Filename (optional)"
                       value="${img.name.replace(/\.[^/.]+$/, '')}"
                       onchange="updateImageName(${img.id}, this.value)">
            </div>
        `;
        imagesPreview.appendChild(div);
    });

    // Add process button if images exist
    if (uploadedImages.length > 0) {
        const processBtn = document.createElement('button');
        processBtn.className = 'btn btn-success';
        processBtn.textContent = '🚀 Process All Images';
        processBtn.style.margin = '20px auto';
        processBtn.style.display = 'block';
        processBtn.onclick = processAllImages;
        imagesPreview.appendChild(processBtn);
    }
}

// Remove image
function removeImage(id) {
    uploadedImages = uploadedImages.filter(img => img.id !== id);
    renderImages();
    if (uploadedImages.length === 0) {
        clearBtn.style.display = 'none';
    }
}

// Update image name
function updateImageName(id, name) {
    const img = uploadedImages.find(i => i.id === id);
    if (img) img.name = name;
}

// Clear all
function clearAll() {
    uploadedImages = [];
    renderImages();
    clearBtn.style.display = 'none';
}

// Camera functions
async function openCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        video.srcObject = stream;
        cameraModal.style.display = 'flex';
    } catch (err) {
        alert('Unable to access camera: ' + err.message);
    }
}

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraModal.style.display = 'none';
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    addImage(dataUrl, `captured_${Date.now()}.png`);
    closeCamera();
}

// OCR Processing
async function processAllImages() {
    progressSection.style.display = 'block';
    imagesPreview.style.display = 'none';
    processedCode = [];

    for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];
        const progress = ((i + 1) / uploadedImages.length) * 100;

        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Processing image ${i + 1} of ${uploadedImages.length}...`;

        try {
            const text = await performOCR(img.dataUrl);
            const correctedCode = correctOCRErrors(text);
            const language = detectLanguage(correctedCode);
            const filename = img.name || `code_${i + 1}`;

            processedCode.push({
                filename,
                language,
                code: correctedCode,
                originalText: text
            });
        } catch (err) {
            console.error('Error processing image:', err);
            processedCode.push({
                filename: img.name || `code_${i + 1}`,
                language: 'txt',
                code: '// Error processing this image: ' + err.message,
                originalText: ''
            });
        }
    }

    progressSection.style.display = 'none';
    displayResults();
}

// Perform OCR using Tesseract.js
async function performOCR(imageData) {
    const { data: { text } } = await Tesseract.recognize(
        imageData,
        'eng',
        {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const percent = Math.round(m.progress * 100);
                    progressText.textContent = `OCR Processing: ${percent}%`;
                }
            }
        }
    );
    return text;
}

// Correct common OCR errors in code
function correctOCRErrors(text) {
    let corrected = text;

    // Common OCR mistakes in code
    const corrections = [
        // Operators and symbols
        [/\s*=\s*=\s*/g, ' == '],
        [/\s*!\s*=\s*/g, ' != '],
        [/\s*<\s*=\s*/g, ' <= '],
        [/\s*>\s*=\s*/g, ' >= '],
        [/\s*\+\s*\+\s*/g, '++'],
        [/\s*-\s*-\s*/g, '--'],
        [/\s*\+\s*=/g, ' += '],
        [/\s*-\s*=/g, ' -= '],

        // Common character confusions
        [/(?<=[a-z])O(?=[a-z])/g, '0'], // O to 0 in variable names
        [/(?<=[a-z])l(?=\s*[=;,)\]])/g, '1'], // l to 1 at end of variables
        [/\bO(?=\s*[;,)\]])/g, '0'], // O to 0 in numbers
        [/(?<=\d)O(?=\d)/g, '0'], // O to 0 between digits
        [/(?<=\d)l(?=\d)/g, '1'], // l to 1 between digits

        // Brackets and parentheses
        [/\[\s+/g, '['],
        [/\s+\]/g, ']'],
        [/\(\s+/g, '('],
        [/\s+\)/g, ')'],
        [/\{\s+/g, '{ '],
        [/\s+\}/g, ' }'],

        // Keywords (common mistakes)
        [/\bdef\s+init\s+/g, 'def __init__ '],
        [/\b1f\b/g, 'if'],
        [/\bels\s+e\b/g, 'else'],
        [/\bretum\b/g, 'return'],
        [/\bprlnt\b/g, 'print'],
        [/\bfunctlon\b/g, 'function'],
        [/\bvold\b/g, 'void'],
        [/\blnt\b/g, 'int'],
        [/\bstr1ng\b/g, 'string'],
        [/\bStrlng\b/g, 'String'],
        [/\bTnteger\b/g, 'Integer'],
        [/\bpubl1c\b/g, 'public'],
        [/\bprlvate\b/g, 'private'],
        [/\bstat1c\b/g, 'static'],
        [/\bconst\s+/g, 'const '],
        [/\blet\s+/g, 'let '],
        [/\bvar\s+/g, 'var '],

        // Indentation cleanup
        [/^[ \t]+$/gm, ''], // Remove whitespace-only lines
        [/\n{3,}/g, '\n\n'], // Max 2 consecutive newlines
    ];

    corrections.forEach(([pattern, replacement]) => {
        corrected = corrected.replace(pattern, replacement);
    });

    // Remove common OCR noise
    corrected = corrected.split('\n')
        .filter(line => line.trim().length > 0 || line === '') // Keep meaningful lines
        .join('\n');

    return corrected.trim();
}

// Detect programming language
function detectLanguage(code) {
    const lower = code.toLowerCase();

    if (lower.includes('def ') || lower.includes('import ') || lower.includes('print(')) {
        return 'py';
    } else if (lower.includes('function ') || lower.includes('const ') || lower.includes('let ') ||
               lower.includes('=>') || lower.includes('console.log')) {
        return 'js';
    } else if (lower.includes('public class ') || lower.includes('private ') ||
               lower.includes('void ') || lower.includes('system.out')) {
        return 'java';
    } else if (lower.includes('#include') || lower.includes('cout') || lower.includes('cin')) {
        return 'cpp';
    } else if (lower.includes('<?php') || lower.includes('echo ')) {
        return 'php';
    } else if (lower.includes('<html') || lower.includes('<div') || lower.includes('<body')) {
        return 'html';
    } else if (lower.includes('margin:') || lower.includes('padding:') || lower.includes('display:')) {
        return 'css';
    } else if (lower.includes('package ') && lower.includes('func ')) {
        return 'go';
    } else if (lower.includes('fn ') || lower.includes('let mut ')) {
        return 'rs';
    } else if (lower.includes('using ') || lower.includes('namespace ')) {
        return 'cs';
    }

    return 'txt';
}

// Display results
function displayResults() {
    resultsSection.style.display = 'block';
    codeFiles.innerHTML = '';

    processedCode.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'code-file';

        const extension = file.filename.includes('.') ?
            file.filename.split('.').pop() : file.language;

        div.innerHTML = `
            <div class="code-file-header">
                <input type="text" value="${file.filename}"
                       onchange="updateCodeFilename(${index}, this.value)"
                       placeholder="filename">
                <select onchange="updateCodeLanguage(${index}, this.value)">
                    ${getLanguageOptions(file.language)}
                </select>
                <button onclick="downloadSingleFile(${index})">💾 Download</button>
            </div>
            <div class="code-file-content">
                <textarea onchange="updateCodeContent(${index}, this.value)">${file.code}</textarea>
            </div>
        `;

        codeFiles.appendChild(div);
    });
}

// Get language options for select
function getLanguageOptions(selected) {
    const languages = {
        'js': 'JavaScript (.js)',
        'py': 'Python (.py)',
        'java': 'Java (.java)',
        'cpp': 'C++ (.cpp)',
        'c': 'C (.c)',
        'html': 'HTML (.html)',
        'css': 'CSS (.css)',
        'php': 'PHP (.php)',
        'go': 'Go (.go)',
        'rs': 'Rust (.rs)',
        'cs': 'C# (.cs)',
        'rb': 'Ruby (.rb)',
        'swift': 'Swift (.swift)',
        'kt': 'Kotlin (.kt)',
        'ts': 'TypeScript (.ts)',
        'txt': 'Text (.txt)'
    };

    return Object.entries(languages).map(([ext, name]) =>
        `<option value="${ext}" ${ext === selected ? 'selected' : ''}>${name}</option>`
    ).join('');
}

// Update functions
function updateCodeFilename(index, name) {
    processedCode[index].filename = name;
}

function updateCodeLanguage(index, lang) {
    processedCode[index].language = lang;
}

function updateCodeContent(index, content) {
    processedCode[index].code = content;
}

// Download single file
function downloadSingleFile(index) {
    const file = processedCode[index];
    const filename = file.filename.includes('.') ?
        file.filename : `${file.filename}.${file.language}`;

    const blob = new Blob([file.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Download all files as zip
async function downloadAllFiles() {
    const zip = new JSZip();

    processedCode.forEach(file => {
        const filename = file.filename.includes('.') ?
            file.filename : `${file.filename}.${file.language}`;
        zip.file(filename, file.code);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code_files.zip';
    a.click();
    URL.revokeObjectURL(url);
}

// Reset app
function resetApp() {
    uploadedImages = [];
    processedCode = [];
    imagesPreview.style.display = 'grid';
    resultsSection.style.display = 'none';
    clearBtn.style.display = 'none';
    renderImages();
}
