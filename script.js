// Global variables
let currentQuestionIndex = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let interviewType = 'microsoft';
let cvData = null;
let startTime = null;
let timerInterval = null;
let questions = null; // Personalized questions array
let currentLanguage = 'en'; // Current language: 'en' or 'vi'
let interviewResults = []; // Store all feedback
let interviewStartTime = null;
let interviewEndTime = null;
let speechRecognition = null; // For real-time speech-to-text
let isListening = false; // For real-time speech recognition
let transcribedText = ''; // Store transcribed text
let hasAnsweredCurrentQuestion = false; // Track if current question has been answered

// Helper function to show errors
function showError(message) {
    console.error('Error:', message);
    alert(message);
}

// Debug function to test file input
function testFileInput() {
    console.log('=== TESTING FILE INPUT ===');
    const cvFileInput = document.getElementById('cvFile');
    console.log('CV file input element:', cvFileInput);
    
    if (cvFileInput) {
        console.log('File input found, triggering click...');
        cvFileInput.click();
    } else {
        console.error('CV file input not found!');
    }
}

// Global file input test function
function testFileInputDirectly() {
    console.log('=== DIRECT FILE INPUT TEST ===');
    const cvFileInput = document.getElementById('cvFile');
    
    if (cvFileInput) {
        // Create a test file
        const testFile = new File(['Test CV content'], 'test-cv.txt', { type: 'text/plain' });
        
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        
        // Set the files
        cvFileInput.files = dataTransfer.files;
        
        console.log('Test file set:', cvFileInput.files[0]);
        
        // Trigger change event manually
        const changeEvent = new Event('change', { bubbles: true });
        cvFileInput.dispatchEvent(changeEvent);
        
        console.log('Change event dispatched manually');
    } else {
        console.error('CV file input not found for direct test!');
    }
}

// Make functions globally available
window.startPractice = function() {
    console.log('startPractice called from window');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.add('hidden');
    document.getElementById('practice').classList.remove('hidden');
    document.getElementById('booking').classList.add('hidden');
    
    currentQuestionIndex = 0;
    interviewResults = []; // Reset results
    interviewStartTime = Date.now();
    startTimer();
    displayCurrentQuestion();
    updateNavigationButtons();
};

window.showCVUpload = function() {
    console.log('showCVUpload called from window');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.remove('hidden');
    document.getElementById('practice').classList.add('hidden');
    document.getElementById('booking').classList.add('hidden');
};

// Microsoft Interview Questions
const microsoftQuestions = [
    "Tell me about yourself and your background.",
    "Why do you want to work at Microsoft?",
    "What do you know about Microsoft's culture and values?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you handle working in a team environment?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "How do you stay updated with technology trends?",
    "Describe a time when you had to learn a new technology quickly.",
    "How do you handle feedback and criticism?",
    "What would you do if you disagreed with your manager?",
    "How do you prioritize your work when you have multiple deadlines?",
    "Describe a situation where you had to solve a complex problem.",
    "How do you handle stress and pressure?",
    "What are your salary expectations?"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    feather.replace();
    
    // Check browser compatibility
    checkBrowserCompatibility();
    
    checkMicrophonePermission();
    
    // Set up file input listener
    const cvFileInput = document.getElementById('cvFile');
    if (cvFileInput) {
        cvFileInput.addEventListener('change', handleCVFileSelect);
    }
    
    // Set up booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Initialize language
    updateLanguageUI();
    
    // Debug: Check if functions are available
    console.log('startPractice function:', typeof startPractice);
    console.log('showCVUpload function:', typeof showCVUpload);
});

// Check browser compatibility
function checkBrowserCompatibility() {
    const issues = [];
    
    // Check getUserMedia support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        issues.push('Microphone access not supported');
    }
    
    // Check MediaRecorder support
    if (!window.MediaRecorder) {
        issues.push('Audio recording not supported');
    }
    
    // Check for issues
    if (issues.length > 0) {
        console.warn('Browser compatibility issues:', issues);
        
        // Show warning to user
        const warningDiv = document.createElement('div');
        warningDiv.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50';
        warningDiv.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm">
                        <strong>Browser Compatibility Warning:</strong><br>
                        ${issues.join(', ')}<br>
                        Please use Chrome, Firefox, or Edge for best experience.
                    </p>
                </div>
                <div class="ml-auto pl-3">
                    <div class="-mx-1.5 -my-1.5">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-yellow-500 hover:text-yellow-700">
                            <span class="sr-only">Dismiss</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(warningDiv);
    }
}

// CV Upload Functions
function showCVUpload() {
    console.log('showCVUpload called');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.remove('hidden');
    document.getElementById('practice').classList.add('hidden');
    document.getElementById('booking').classList.add('hidden');
}

function handleCVFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const cvPreview = document.getElementById('cvPreview');
    const cvInfo = document.getElementById('cvInfo');
    const analyzeCVBtn = document.getElementById('analyzeCV');
    
    // Show file info
    cvInfo.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${file.name}</p>
                <p class="text-xs text-gray-500">${(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div class="text-green-600">
                <i data-feather="check-circle" class="w-5 h-5"></i>
            </div>
        </div>
    `;
    
    cvPreview.classList.remove('hidden');
    analyzeCVBtn.classList.remove('hidden');
    feather.replace();
}

async function analyzeCV() {
    const fileInput = document.getElementById('cvFile');
    const file = fileInput.files[0];
    const analysisResult = document.getElementById('analysisResult');
    const startInterviewBtn = document.getElementById('startInterview');
    
    if (!file) {
        alert('Vui lòng chọn file CV trước');
        return;
    }
    
    if (cvPreview) cvPreview.classList.remove('hidden');
    feather.replace();
    
    // Auto-start analysis with progress bar
    startCVAnalysis(file);

    // Check file type and process accordingly
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    console.log('Processing file type:', fileType, 'File name:', fileName);

    if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/)) {
        console.log('Processing as image file');
        processImageFile(file);
    } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        console.log('Processing as PDF file');
        processPDFFile(file);
    } else if (fileType.includes('text') || fileName.match(/\.(txt|doc|docx)$/)) {
        console.log('Processing as text file');
        processTextFile(file);
    } else {
        console.log('Unsupported file type');
        showError('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, hình ảnh, hoặc text.');
    }
}

// Start CV analysis with progress bar
async function startCVAnalysis(file) {
    try {
        console.log('Starting CV analysis with progress...');
        
        // Show progress bar
        const cvAnalysis = document.getElementById('cvAnalysis');
        const analysisResult = document.getElementById('analysisResult');
        
        if (cvAnalysis) {
            cvAnalysis.classList.remove('hidden');
            analysisResult.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-800">Analyzing CV...</span>
                        <span id="analysisProgress" class="text-sm text-blue-600">0%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div id="analysisProgressBar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                    <div class="text-xs text-blue-600">
                        <i data-feather="loader" class="w-4 h-4 inline mr-1 animate-spin"></i>
                        Processing file and extracting information...
                    </div>
                </div>
            `;
        }
        
        // Simulate progress updates
        const progressBar = document.getElementById('analysisProgressBar');
        const progressText = document.getElementById('analysisProgress');
        
        const updateProgress = (percent) => {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressText) progressText.textContent = `${percent}%`;
        };
        
        // Progress simulation
        updateProgress(10);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updateProgress(30);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        updateProgress(60);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        updateProgress(80);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        updateProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Complete analysis
        if (analysisResult) {
            analysisResult.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <i data-feather="check-circle" class="text-green-600 w-5 h-5 mr-2"></i>
                        <span class="font-medium text-green-800">Analysis Complete!</span>
                    </div>
                    <p class="text-sm text-green-700">CV has been successfully analyzed. Ready to start interview.</p>
                </div>
            `;
        }
        
        // Show start interview button
        const startInterviewBtn = document.getElementById('startInterview');
        if (startInterviewBtn) {
            startInterviewBtn.classList.remove('hidden');
        }
        
        // Add option to import different CV
        const cvUploadSection = document.getElementById('cvUpload');
        if (cvUploadSection) {
            const importNewBtn = document.createElement('button');
            importNewBtn.className = 'mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm';
            importNewBtn.innerHTML = '<i data-feather="refresh-cw" class="w-4 h-4 inline mr-1"></i>Import Different CV';
            importNewBtn.onclick = () => {
                document.getElementById('cvFile').value = '';
                document.getElementById('cvPreview').classList.add('hidden');
                document.getElementById('cvAnalysis').classList.add('hidden');
                document.getElementById('startInterview').classList.add('hidden');
                if (importNewBtn.parentNode) {
                    importNewBtn.parentNode.removeChild(importNewBtn);
                }
            };
            
            const buttonContainer = cvUploadSection.querySelector('.text-center');
            if (buttonContainer) {
                buttonContainer.appendChild(importNewBtn);
            }
        }
        
        feather.replace();
        
        // Process the file based on type
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        
        if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/)) {
            await processImageFile(file);
        } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
            await processPDFFile(file);
        } else if (fileType.includes('text') || fileName.match(/\.(txt|doc|docx)$/)) {
            await processTextFile(file);
        } else {
            showError('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, hình ảnh, hoặc text.');
        }
        
    } catch (error) {
        console.error('Error in CV analysis:', error);
        showError('Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.');
    }
}

// Process image file using OCR
async function processImageFile(file) {
    try {
        console.log('Processing image file:', file.name);
        
        // For image files, we'll show a helpful message since Azure OpenAI doesn't support image_url
        // Users should convert images to text or use text-based CVs
        const fallbackText = `Image file detected: ${file.name}

Since this is an image file, the AI analysis will be limited. For better results, please:

1. Convert your image to text format (.txt)
2. Copy and paste the text content from the image
3. Use a text-based CV format
4. Or manually type your CV information

Alternatively, you can continue with the interview practice without CV analysis.`;
        
        await analyzeCVWithAI(fallbackText);
        
    } catch (error) {
        console.error('Error processing image:', error);
        showError('Không thể xử lý file hình ảnh. Vui lòng chuyển đổi sang định dạng text hoặc sử dụng file khác.');
    }
}

// Process PDF file with OCR support
async function processPDFFile(file) {
    try {
        console.log('Processing PDF file:', file.name);
        
        // Check if Tesseract.js is available
        if (typeof Tesseract !== 'undefined') {
            console.log('Using OCR for PDF processing');
            const extractedText = await processPDFWithOCR(file);
            await analyzeCVWithAI(extractedText);
        } else {
            // Fallback to original method
            const text = await readFileAsText(file);
            
            if (text.startsWith('%PDF')) {
                console.log('Binary PDF detected, showing fallback message');
                const fallbackText = `PDF file detected: ${file.name}

Since this is a PDF file, the AI analysis will be limited. For better results, please:

1. Convert your PDF to text format (.txt)
2. Copy and paste the text content
3. Use a text-based CV format
4. Or use the OCR-enabled version of this application

Alternatively, you can continue with the interview practice without CV analysis.`;
                
                await analyzeCVWithAI(fallbackText);
            } else {
                console.log('PDF content appears to be text-based');
                await analyzeCVWithAI(text);
            }
        }
    } catch (error) {
        console.error('Error processing PDF:', error);
        showError('Không thể xử lý file PDF. Vui lòng chuyển đổi sang định dạng text hoặc sử dụng file khác.');
    }
}

// Process PDF with OCR using Tesseract.js
async function processPDFWithOCR(file) {
    try {
        console.log('Starting OCR processing for PDF:', file.name);
        
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library not loaded. Please include PDF.js for OCR processing.');
        }
        
        // Initialize PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        const totalPages = pdf.numPages;
        
        console.log(`Processing ${totalPages} pages with OCR`);
        
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            console.log(`Processing page ${pageNum}/${totalPages}`);
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({ canvasContext: context, viewport }).promise;
            
            console.log(`Running OCR on page ${pageNum}`);
            
            const { data: { text } } = await Tesseract.recognize(canvas, 'eng+vie', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            });
            
            fullText += `\n\n--- PAGE ${pageNum} ---\n\n${text}`;
            console.log(`Page ${pageNum} OCR completed, extracted ${text.length} characters`);
        }
        
        console.log('OCR processing completed, total text length:', fullText.length);
        return fullText;
        
    } catch (error) {
        console.error('OCR processing error:', error);
        throw new Error(`OCR processing failed: ${error.message}`);
    }
}

// Process text file
async function processTextFile(file) {
    try {
        console.log('Starting text file processing for:', file.name);
        const text = await readFileAsText(file);
        
        // Check if it's a PDF warning
        if (text.includes('PDF file detected')) {
            const title = currentLanguage === 'en' ? '⚠️ PDF File Detected' : '⚠️ Phát hiện file PDF';
            const message = currentLanguage === 'en' 
                ? 'Please use a text-based CV (.txt, .doc, .docx) for better analysis.'
                : 'Vui lòng sử dụng CV dạng text (.txt, .doc, .docx) để phân tích tốt hơn.';
            
            analysisResult.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 class="font-semibold text-yellow-800 mb-2">${title}</h5>
                    <p class="text-yellow-700 text-sm mb-2">${text}</p>
                    <p class="text-yellow-700 text-sm">${message}</p>
                </div>
            `;
            return;
        }
        
        // Analyze CV with AI
        const analysis = await analyzeCVWithAI(text);
        
        // Display analysis
        analysisResult.innerHTML = `
            <div class="space-y-3">
                <div>
                    <h6 class="font-semibold">📋 Thông tin cơ bản:</h6>
                    <p class="text-sm">${analysis.basicInfo}</p>
                </div>
                <div>
                    <h6 class="font-semibold">💼 Kinh nghiệm:</h6>
                    <p class="text-sm">${analysis.experience}</p>
                </div>
                <div>
                    <h6 class="font-semibold">🎓 Học vấn:</h6>
                    <p class="text-sm">${analysis.education}</p>
                </div>
                <div>
                    <h6 class="font-semibold">🔧 Kỹ năng:</h6>
                    <p class="text-sm">${analysis.skills}</p>
                </div>
                <div>
                    <h6 class="font-semibold">🎯 Vị trí phù hợp:</h6>
                    <p class="text-sm">${analysis.recommendedPosition}</p>
                </div>
            </div>
        `;
        
        // Store CV data for interview
        cvData = analysis;
        
        // Show start interview button
        startInterviewBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error('CV analysis error:', error);
        analysisResult.innerHTML = '<div class="text-red-600">❌ Lỗi phân tích CV. Vui lòng thử lại.</div>';
    }
}

async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const content = e.target.result;
            
            // Check if it's a PDF file (binary content)
            if (file.type === 'application/pdf' || content.startsWith('%PDF')) {
                // For PDF files, we'll extract text or show a message
                if (content.startsWith('%PDF')) {
                    resolve('PDF file detected. Please convert to text format or use a text-based CV for better analysis.');
                } else {
                    resolve(content);
                }
            } else {
                // For text files, use as is
                resolve(content);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function analyzeCVWithAI(cvText) {
    try {
        const response = await callAzureOpenAI(`
            You're an AI assistant helping to extract and structure CV data.

            Below is a CV file input. If it's in PDF format and contains readable text, analyze it as usual. If the content is scanned or unreadable, clearly explain the problem, and return an empty JSON template with error guidance.

            CV content:
            ${cvText}

            Please return a valid JSON response in this format:
            {
              "basicInfo": { "name": "", "age": "", "currentPosition": "" },
              "experience": "Summary of work experience",
              "education": "Education background",
              "skills": ["skill1", "skill2"],
              "recommendedPosition": "Most suitable job role",
              "note": "Any issues found with the CV (e.g., unreadable scanned file)"
            }

            Only return the JSON. No extra explanation.
        `);
        
        console.log('CV analysis response:', response);
        
        // Try to parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            console.log('Parsed CV analysis:', analysis);
            
            // Store CV data for interview with normalized structure
            cvData = {
                basicInfo: analysis.basicInfo,
                experience: analysis.experience,
                education: analysis.education,
                skills: (() => {
                    // Normalize skills to array format
                    if (Array.isArray(analysis.skills)) {
                        return analysis.skills;
                    } else if (analysis.skills && analysis.skills.mainSkills) {
                        const allSkills = [];
                        Object.values(analysis.skills.mainSkills).forEach(category => {
                            if (Array.isArray(category)) {
                                allSkills.push(...category);
                            }
                        });
                        return allSkills;
                    } else {
                        return [];
                    }
                })(),
                recommendedPosition: analysis.recommendedPosition
            };
            
            // Display analysis with better formatting
            const analysisResult = document.getElementById('analysisResult');
            const startInterviewBtn = document.getElementById('startInterview');
            const cvAnalysis = document.getElementById('cvAnalysis');
            
            if (analysisResult) {
                // Generate position suggestions based on CV
                const suggestedPositions = await suggestJobTitlesFromCV(analysis);
                
                analysisResult.innerHTML = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                        <div class="flex items-center mb-4">
                            <i data-feather="check-circle" class="text-green-600 w-6 h-6 mr-2"></i>
                            <h4 class="text-lg font-semibold text-green-800">✅ CV đã được phân tích thành công!</h4>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h6 class="font-semibold text-gray-800 mb-2">📋 Thông tin cơ bản:</h6>
                            <p class="text-sm text-gray-600">${analysis.basicInfo?.name || 'N/A'} - ${analysis.basicInfo?.currentPosition || 'N/A'}</p>
                        </div>
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h6 class="font-semibold text-gray-800 mb-2">💼 Kinh nghiệm:</h6>
                            <p class="text-sm text-gray-600">${analysis.experience?.summary || analysis.experience || 'N/A'}</p>
                        </div>
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h6 class="font-semibold text-gray-800 mb-2">🎓 Học vấn:</h6>
                            <p class="text-sm text-gray-600">${analysis.education?.background || analysis.education || 'N/A'}</p>
                        </div>
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h6 class="font-semibold text-gray-800 mb-2">🔧 Kỹ năng chính:</h6>
                            <div class="flex flex-wrap gap-2">
                                ${(() => {
                                    // Handle different skills formats
                                    if (Array.isArray(analysis.skills)) {
                                        return analysis.skills.map(skill => 
                                            `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${skill}</span>`
                                        ).join('');
                                    } else if (analysis.skills && analysis.skills.mainSkills) {
                                        // Handle nested skills structure
                                        const allSkills = [];
                                        Object.values(analysis.skills.mainSkills).forEach(category => {
                                            if (Array.isArray(category)) {
                                                allSkills.push(...category);
                                            }
                                        });
                                        return allSkills.map(skill => 
                                            `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${skill}</span>`
                                        ).join('');
                                    } else {
                                        return '<span class="text-gray-500">Kỹ năng không có sẵn</span>';
                                    }
                                })()}
                            </div>
                        </div>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h6 class="font-semibold text-blue-800 mb-2">🎯 Vị trí phù hợp tại Microsoft:</h6>
                            <div class="space-y-3">
                                <p class="text-sm text-blue-700 font-medium">${analysis.recommendedPosition || 'Software Engineer'}</p>
                                <div class="mt-3">
                                    <h7 class="font-medium text-blue-800 mb-2 block">💡 Gợi ý vị trí khác:</h7>
                                    <div class="flex flex-wrap gap-2">
                                        ${suggestedPositions.map(position => 
                                            `<button onclick="selectPosition('${position}')" class="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded hover:bg-blue-200 transition">${position}</button>`
                                        ).join('')}
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-blue-800 mb-2">Hoặc nhập vị trí tùy chỉnh:</label>
                                    <div class="flex space-x-2">
                                        <input type="text" id="customPosition" placeholder="Ví dụ: Product Manager, Data Scientist..." class="flex-1 text-sm p-2 border border-blue-200 rounded">
                                        <button onclick="selectCustomPosition()" class="bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition">Chọn</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Show analysis and start interview button
            if (cvAnalysis) cvAnalysis.classList.remove('hidden');
            if (startInterviewBtn) {
                startInterviewBtn.classList.remove('hidden');
                startInterviewBtn.innerHTML = `
                    <i data-feather="play" class="w-5 h-5 mr-2"></i>
                    Bắt đầu phỏng vấn với CV đã phân tích
                `;
            }
            
            // Show success message
            showSuccessMessage('CV đã được phân tích thành công! Bạn có thể bắt đầu phỏng vấn.');
            
            return analysis;
        } else {
            throw new Error('No JSON found in response');
        }
    } catch (error) {
        console.error('CV analysis error:', error);
        // Fallback analysis
        return {
            basicInfo: "Thông tin cơ bản từ CV",
            experience: "Kinh nghiệm làm việc",
            education: "Học vấn",
            skills: "Kỹ năng chính",
            recommendedPosition: "Software Engineer"
        };
    }
}

function startInterviewWithCV() {
    if (!cvData) {
        const message = currentLanguage === 'en' 
            ? 'Please analyze CV first'
            : 'Vui lòng phân tích CV trước';
        alert(message);
        return;
    }
    
    // Generate personalized questions based on CV
    generatePersonalizedQuestions(cvData).then(personalizedQuestions => {
        questions = personalizedQuestions;
        startPractice();
    });
}

// Generate personalized questions based on CV data
async function generatePersonalizedQuestions(cvData) {
    try {
        console.log('Generating personalized questions for CV:', cvData);
        
        const prompt = `
            Based on this candidate's CV information, generate 15 personalized Microsoft interview questions.
            
            CV Analysis:
            - Name: ${cvData.basicInfo?.name || 'Candidate'}
            - Current Position: ${cvData.basicInfo?.currentPosition || 'Software Engineer'}
            - Experience: ${cvData.experience?.summary || 'Software development'}
            - Education: ${cvData.education?.university || 'University'} - ${cvData.education?.major || 'Computer Science'}
            - Skills: ${JSON.stringify(cvData.skills) || 'Programming skills'}
            - Recommended Position: ${cvData.recommendedPosition || 'Software Engineer'}
            
            Generate questions that:
            1. Reference their specific experience and projects
            2. Test their technical skills (React, Node.js, AWS, etc.)
            3. Explore their background and education
            4. Assess cultural fit for Microsoft
            5. Include behavioral questions about their work experience
            6. Ask about their career goals and Microsoft aspirations
            
            Return only the questions as a JSON array of strings, no other text.
            Example format: ["Question 1", "Question 2", "Question 3", ...]
        `;
        
        const response = await callAzureOpenAI(prompt);
        console.log('Personalized questions response:', response);
        
        // Parse JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            return questions;
        } else {
            throw new Error('No JSON array found in response');
        }
    } catch (error) {
        console.error('Error generating personalized questions:', error);
        // Fallback to default questions
        return microsoftQuestions;
    }
}

// Interview Functions
function startPractice() {
    console.log('startPractice called');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.add('hidden');
    document.getElementById('practice').classList.remove('hidden');
    document.getElementById('booking').classList.add('hidden');
    
    currentQuestionIndex = 0;
    // Reset questions to default if no personalized questions
    if (!questions) {
        questions = microsoftQuestions;
    }
    startTimer();
    displayCurrentQuestion();
}

function displayCurrentQuestion() {
    const questionText = document.getElementById('currentQuestionText');
    const currentQuestion = document.getElementById('currentQuestion');
    const totalQuestions = document.getElementById('totalQuestions');
    const progressBar = document.getElementById('progressBar');
    
    // Use personalized questions if available, otherwise fallback to default
    const questionArray = questions || microsoftQuestions;
    let question = questionArray[currentQuestionIndex];
    
    if (cvData) {
        // Personalize question based on CV data
        question = personalizeQuestion(question, cvData);
    }
    
    questionText.textContent = question;
    currentQuestion.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = questionArray.length;
    
    const progress = ((currentQuestionIndex + 1) / questionArray.length) * 100;
    progressBar.style.width = progress + '%';
    
    // Update navigation buttons
    updateNavigationButtons();
}

function personalizeQuestion(question, cvData) {
    // Personalize questions based on CV data
    if (question.includes("Tell me about yourself")) {
        return `Tell me about yourself and your background in ${cvData.recommendedPosition}.`;
    } else if (question.includes("Why do you want to work at Microsoft")) {
        return `Why do you want to work at Microsoft as a ${cvData.recommendedPosition}?`;
    } else if (question.includes("Describe a challenging project")) {
        return `Describe a challenging project you worked on using ${cvData.skills.split(',')[0]} and how you overcame obstacles.`;
    }
    return question;
}

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            // Fallback for older browsers
            if (navigator.getUserMedia) {
                // Use old API
                const stream = await new Promise((resolve, reject) => {
                    navigator.getUserMedia({ audio: true }, resolve, reject);
                });
                return handleStream(stream);
            } else {
                throw new Error('Browser does not support microphone access. Please use a modern browser like Chrome, Firefox, or Edge.');
            }
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        
        return handleStream(stream);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showMicrophoneErrorWithOptions(error.message, error.name);
    }
}

function handleStream(stream) {
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processRecording(audioBlob);
    };
    
    mediaRecorder.start();
    isRecording = true;
    
    // Start real-time speech recognition
    startRealTimeSpeechRecognition();
    
    // Update UI
    document.getElementById('recordingStatus').classList.add('hidden');
    document.getElementById('recordingActive').classList.remove('hidden');
    document.getElementById('recordButton').textContent = 'Dừng ghi âm';
    document.getElementById('recordButton').classList.remove('bg-blue-600', 'hover:bg-blue-700');
    document.getElementById('recordButton').classList.add('bg-red-600', 'hover:bg-red-700');
}

function startRealTimeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = currentLanguage === 'en' ? 'en-US' : 'vi-VN';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            
            // Update real-time transcript display
            const transcriptDisplay = document.getElementById('realTimeTranscript');
            const transcriptText = document.getElementById('transcriptText');
            if (transcriptDisplay && transcriptText) {
                transcriptText.textContent = transcript;
                transcriptDisplay.classList.remove('hidden');
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Real-time speech recognition error:', event.error);
        };
        
        recognition.start();
        
        // Store recognition instance to stop later
        window.currentRecognition = recognition;
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        
        // Stop real-time speech recognition
        if (window.currentRecognition) {
            window.currentRecognition.stop();
            window.currentRecognition = null;
        }
        
        // Hide real-time transcript
        const transcriptDisplay = document.getElementById('realTimeTranscript');
        if (transcriptDisplay) {
            transcriptDisplay.classList.add('hidden');
        }
        
        // Update UI
        document.getElementById('recordingActive').classList.add('hidden');
        document.getElementById('recordingStatus').classList.remove('hidden');
        document.getElementById('recordButton').textContent = 'Bắt đầu ghi âm';
        document.getElementById('recordButton').classList.remove('bg-red-600', 'hover:bg-red-700');
        document.getElementById('recordButton').classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
}

async function processRecording(audioBlob) {
    // Show processing state
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    
    feedbackSection.classList.remove('hidden');
    feedbackContent.innerHTML = '<div class="flex items-center"><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>Đang chuyển đổi âm thanh thành text...</div>';
    
    try {
        // Convert audio to text
        const audioText = await convertAudioToText(audioBlob);
        
        // Show transcript
        feedbackContent.innerHTML = `
            <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                <h5 class="font-semibold text-blue-800 mb-2">🎤 Transcript:</h5>
                <p class="text-blue-700">"${audioText}"</p>
            </div>
            <div class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Đang phân tích và đánh giá...
            </div>
        `;
        
        // Generate feedback
        const feedback = await generateFeedback(audioText);
        
        // Display feedback with transcript
        feedbackContent.innerHTML = `
            <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                <h5 class="font-semibold text-blue-800 mb-2">🎤 Transcript:</h5>
                <p class="text-blue-700">"${audioText}"</p>
            </div>
            ${feedback}
        `;
        
        // Don't auto-next - let user control
        // setTimeout(() => {
        //     nextQuestion();
        // }, 8000); // Increased delay to read feedback
        
    } catch (error) {
        console.error('Error processing recording:', error);
        feedbackContent.innerHTML = '<div class="text-red-600">❌ Lỗi xử lý. Vui lòng thử lại.</div>';
    }
}

async function convertAudioToText(audioBlob) {
    try {
        // Save audio file for download
        const audioUrl = URL.createObjectURL(audioBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = `interview_answer_${Date.now()}.mp3`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(audioUrl);
        
        // Use Web Speech API for speech-to-text
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            return await convertSpeechToText(audioBlob);
        } else {
            // Fallback: Use Azure OpenAI for speech-to-text
            return await convertAudioWithAzure(audioBlob);
        }
    } catch (error) {
        console.error('Audio conversion error:', error);
        return "This is a simulated response to the interview question.";
    }
}

async function convertSpeechToText(audioBlob) {
    return new Promise((resolve, reject) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = currentLanguage === 'en' ? 'en-US' : 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            reject(new Error('Speech recognition failed'));
        };
        
        recognition.onend = () => {
            // If no result, provide fallback
            if (!recognition.result) {
                resolve("This is a simulated response to the interview question.");
            }
        };
        
        // Convert audio blob to audio element and play it for recognition
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onended = () => {
            recognition.start();
        };
        audio.play();
    });
}

async function convertAudioWithAzure(audioBlob) {
    try {
        // Convert audio blob to base64
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Send to Azure OpenAI for transcription
        const response = await callAzureOpenAI(`
            Please transcribe this audio recording to text. 
            The audio is base64 encoded: ${base64Audio}
            
            Return only the transcribed text, nothing else.
        `);
        
        return response || "This is a simulated response to the interview question.";
    } catch (error) {
        console.error('Azure transcription error:', error);
        return "This is a simulated response to the interview question.";
    }
}

async function generateFeedback(answer) {
    const currentQuestion = microsoftQuestions[currentQuestionIndex];
    
    try {
        console.log('Generating feedback for answer:', answer.substring(0, 100) + '...');
        
        const response = await callAzureOpenAI(`
You're a senior recruiter at Meta (Facebook), conducting mock interview evaluations.

You will be given:
- An interview question (as asked to the candidate)
- The candidate's response (typed or transcribed)
- The role: ${cvData?.recommendedPosition || 'Software Engineer'}

Your job:
1. **Evaluate the quality of the candidate's answer**.
2. **Judge if the response is structured (e.g., uses STAR or logical format)**.
3. **Assess English fluency, vocabulary, and grammar**.
4. **Assess technical/behavioral depth relevant to the role**.
5. **Evaluate confidence and clarity (even if answer is short)**.

Return structured feedback in this JSON format:

{
  "question": "The original question here...",
  "answer": "The candidate's response here...",
  "score": 7.5,             // From 0 to 10
  "level": "Average",       // One of: Poor, Below Average, Average, Good, Excellent
  "feedback": "Detailed recruiter-style feedback here...",
  "tips": "Specific improvement advice for the candidate"
}

Rules:
- Be critical but fair.
- Be specific. No generic advice.
- Help the candidate improve.
- Write like a Meta recruiter, not a language teacher.
- If the answer is very short or off-topic, say so clearly.
- Feedback should be constructive, professional, and helpful.
- Output only the JSON.

Question: ${questions[currentQuestionIndex] || 'Tell me about yourself.'}
Answer: ${answer}
Role: ${cvData?.recommendedPosition || 'Software Engineer'}
        `);
        
        console.log('Feedback response received');
        
        // Parse JSON response
        let feedbackData;
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                feedbackData = JSON.parse(jsonMatch[0]);
                console.log('Parsed feedback data:', feedbackData);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (error) {
            console.error('Error parsing feedback JSON:', error);
            // Use fallback feedback
            feedbackData = {
                score: 7.0,
                level: "Average",
                feedback: "Unable to parse AI feedback. Using fallback evaluation.",
                tips: "Please ensure your answer is structured and specific to the question."
            };
        }
        
        // Generate HTML feedback from JSON data
        const feedbackHtml = generateFeedbackHTML(feedbackData);
        
        // Display feedback
        const feedbackArea = document.getElementById('feedbackArea');
        const feedbackContentElement = document.getElementById('feedbackContent');
        
        if (feedbackArea) {
            feedbackArea.innerHTML = feedbackHtml;
            feedbackArea.classList.remove('hidden');
        }
        
        if (feedbackContentElement) {
            feedbackContentElement.innerHTML = feedbackHtml;
            feedbackContentElement.classList.remove('hidden');
        }
        
        console.log('Feedback HTML generated:', feedbackHtml);
        
        // Store feedback for final report
        // Mark question as answered
        hasAnsweredCurrentQuestion = true;
        
        interviewResults.push({
            question: questions[currentQuestionIndex],
            answer: answer,
            feedback: feedbackData,
            timestamp: new Date().toISOString()
        });
        
        // Show next question button
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.innerHTML = `
                <i data-feather="arrow-right" class="w-5 h-5 mr-2"></i>
                Câu hỏi tiếp theo
            `;
        }
        
        // Update progress
        updateInterviewProgress();
        
        // Return the response for use in processRecording
        return feedbackData;
    } catch (error) {
        console.error('Feedback generation error:', error);
        const fallbackFeedback = currentLanguage === 'en' 
            ? `
                <div class="text-gray-700">
                    <h5 class="font-semibold mb-2">Feedback:</h5>
                    <p>Score: 75/100</p>
                    <p><strong>Strengths:</strong> Clear and structured response</p>
                    <p><strong>Areas for improvement:</strong> Could provide more specific experience details</p>
                    <p><strong>Suggestion:</strong> Provide specific examples of projects you've worked on</p>
                </div>
            `
            : `
                <div class="text-gray-700">
                    <h5 class="font-semibold mb-2">Feedback:</h5>
                    <p>Điểm: 75/100</p>
                    <p><strong>Cần cải thiện:</strong> Có thể chi tiết hơn về kinh nghiệm cụ thể</p>
                    <p><strong>Gợi ý:</strong> Hãy đưa ra ví dụ cụ thể về dự án đã làm</p>
                </div>
            `;
        
        // Store fallback result
        const result = {
            questionIndex: currentQuestionIndex,
            question: currentQuestion,
            answer: answer,
            feedback: fallbackFeedback,
            timestamp: Date.now()
        };
        interviewResults.push(result);
        
        // Show next question button
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.innerHTML = `
                <i data-feather="arrow-right" class="w-5 h-5 mr-2"></i>
                Câu hỏi tiếp theo
            `;
        }
        
        updateInterviewProgress();
    }
}

// Generate HTML feedback from JSON data
function generateFeedbackHTML(feedbackData) {
    const { score, level, feedback, tips } = feedbackData;
    
    // Get color and icon based on level
    const getLevelStyle = (level) => {
        switch(level.toLowerCase()) {
            case 'excellent':
                return { color: 'green', icon: '🏆', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
            case 'good':
                return { color: 'blue', icon: '👍', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' };
            case 'average':
                return { color: 'yellow', icon: '⚠️', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' };
            case 'below average':
                return { color: 'orange', icon: '📉', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' };
            case 'poor':
                return { color: 'red', icon: '❌', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' };
            default:
                return { color: 'gray', icon: '📊', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
        }
    };
    
    const levelStyle = getLevelStyle(level);
    const scorePercentage = Math.round(score * 10);
    
    return `
        <div class="feedback-container bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">🎯 Meta Recruiter Feedback</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-semibold text-green-800 mb-2">📊 Overall Score</h4>
                    <p class="text-2xl font-bold text-green-600">${score}/10</p>
                    <p class="text-sm text-green-600">(${scorePercentage}%)</p>
                </div>
                <div class="${levelStyle.bg} border ${levelStyle.border} rounded-lg p-4">
                    <h4 class="font-semibold ${levelStyle.text} mb-2">${levelStyle.icon} Performance Level</h4>
                    <p class="text-lg font-medium ${levelStyle.text}">${level}</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="border-l-4 border-blue-500 pl-4">
                    <h4 class="font-semibold text-gray-800 mb-2">💬 Recruiter Feedback</h4>
                    <p class="text-sm text-gray-600">${feedback}</p>
                </div>
                
                <div class="border-l-4 border-green-500 pl-4">
                    <h4 class="font-semibold text-gray-800 mb-2">💡 Improvement Tips</h4>
                    <p class="text-sm text-gray-600">${tips}</p>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">
                    <strong>Note:</strong> This feedback is provided by Meta's AI recruiter simulation. 
                    For real interview preparation, consider working with professional career coaches.
                </p>
            </div>
        </div>
    `;
}

// Update interview progress
function updateInterviewProgress() {
    const progressBar = document.getElementById('interviewProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = `Câu ${currentQuestionIndex + 1} / ${questions.length}`;
    }
}

function nextQuestion() {
    // Only allow next if user has answered current question
    if (!hasAnsweredCurrentQuestion) {
        showWarningMessage('Vui lòng trả lời câu hỏi hiện tại trước khi chuyển sang câu tiếp theo.');
        return;
    }
    
    currentQuestionIndex++;
    hasAnsweredCurrentQuestion = false; // Reset for new question
    
    const questionArray = questions || microsoftQuestions;
    
    if (currentQuestionIndex >= questionArray.length) {
        // Interview completed
        completeInterview();
    } else {
        // Hide feedback and show next question
        document.getElementById('feedbackSection').classList.add('hidden');
        displayCurrentQuestion();
        updateNavigationButtons();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        document.getElementById('feedbackSection').classList.add('hidden');
        displayCurrentQuestion();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const completeBtn = document.getElementById('completeBtn');
    
    const questionArray = questions || microsoftQuestions;
    
    // Show/hide previous button
    if (currentQuestionIndex > 0) {
        prevBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
    }
    
    // Show/hide next vs complete button
    if (currentQuestionIndex >= questionArray.length - 1) {
        nextBtn.classList.add('hidden');
        completeBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        completeBtn.classList.add('hidden');
    }
}

function completeInterview() {
    interviewEndTime = Date.now();
    const totalTime = Math.floor((interviewEndTime - interviewStartTime) / 1000);
    
    // Generate comprehensive report
    generateInterviewReport();
    
    const practiceSection = document.getElementById('practice');
    practiceSection.innerHTML = `
        <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-feather="check-circle" class="text-green-600 w-10 h-10"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Interview Completed!</h3>
            <p class="text-gray-600 mb-4">You have completed the Microsoft interview simulation.</p>
            <p class="text-gray-600 mb-6">Total time: ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}</p>
            
            <div class="space-y-4">
                <button onclick="downloadInterviewReport()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                    📄 Download Report (PDF)
                </button>
                <button onclick="backToHome()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Back to Home
                </button>
                <button onclick="showBooking()" class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                    Book Real Interview
                </button>
            </div>
        </div>
    `;
    feather.replace();
}

function generateInterviewReport() {
    // Calculate average score
    let totalScore = 0;
    let scoreCount = 0;
    
    interviewResults.forEach(result => {
        const scoreMatch = result.feedback.match(/Score:\s*(\d+)/i);
        if (scoreMatch) {
            totalScore += parseInt(scoreMatch[1]);
            scoreCount++;
        }
    });
    
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    
    // Store report data
    window.interviewReport = {
        totalQuestions: interviewResults.length,
        averageScore: averageScore,
        totalTime: Math.floor((interviewEndTime - interviewStartTime) / 1000),
        results: interviewResults,
        cvData: cvData,
        timestamp: new Date().toISOString()
    };
}

function downloadInterviewReport() {
    if (!window.interviewReport) {
        alert('No interview report available');
        return;
    }
    
    // Create PDF content
    const report = window.interviewReport;
    const pdfContent = generatePDFContent(report);
    
    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `microsoft_interview_report_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function generatePDFContent(report) {
    // Simple HTML-based PDF content
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Microsoft Interview Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #0078d4; padding-bottom: 20px; margin-bottom: 30px; }
                .summary { background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .question { margin: 20px 0; padding: 15px; border-left: 4px solid #0078d4; background: #f9f9f9; }
                .score { font-weight: bold; color: #0078d4; }
                .feedback { margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Microsoft Interview Report</h1>
                <p>Generated on: ${new Date(report.timestamp).toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <h2>Interview Summary</h2>
                <p><strong>Total Questions:</strong> ${report.totalQuestions}</p>
                <p><strong>Average Score:</strong> <span class="score">${report.averageScore}/100</span></p>
                <p><strong>Total Time:</strong> ${Math.floor(report.totalTime / 60)}:${(report.totalTime % 60).toString().padStart(2, '0')}</p>
            </div>
            
            <h2>Detailed Feedback</h2>
            ${report.results.map((result, index) => `
                <div class="question">
                    <h3>Question ${index + 1}: ${result.question}</h3>
                    <p><strong>Your Answer:</strong> ${result.answer}</p>
                    <div class="feedback">${result.feedback}</div>
                </div>
            `).join('')}
            
            <div style="margin-top: 40px; text-align: center; color: #666;">
                <p>This report was generated by Microsoft Interview Pro</p>
            </div>
        </body>
        </html>
    `;
    
    return html;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function backToHome() {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('cvUpload').classList.add('hidden');
    document.getElementById('practice').classList.add('hidden');
    document.getElementById('booking').classList.add('hidden');
    
    // Reset interview state
    currentQuestionIndex = 0;
    questions = null;
    cvData = null;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function showBooking() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.add('hidden');
    document.getElementById('practice').classList.add('hidden');
    document.getElementById('booking').classList.remove('hidden');
}

function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        position: document.getElementById('bookingPosition').value,
        notes: document.getElementById('bookingNotes').value
    };
    
    // Simulate booking submission
    alert('Đặt hẹn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
    backToHome();
}

// Microphone Functions
async function checkMicrophonePermission() {
    try {
        // Check if getUserMedia is supported first
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Browser does not support microphone access');
            return;
        }
        
        const result = await navigator.permissions.query({ name: 'microphone' });
        if (result.state === 'denied') {
            showMicrophoneRequiredModal('Microphone bị từ chối');
        }
    } catch (error) {
        console.error('Error checking microphone permission:', error);
    }
}

function showMicrophoneRequiredModal(errorType) {
    const requiredModal = document.createElement('div');
    requiredModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    let specificHelp = '';
    if (errorType === 'Không tìm thấy microphone') {
        specificHelp = `
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-red-800 mb-2">🔧 Khắc phục:</h4>
                <ul class="text-sm text-red-700 space-y-1">
                    <li>• Kết nối microphone vào máy tính</li>
                    <li>• Kiểm tra microphone có hoạt động không</li>
                    <li>• Thử microphone khác nếu có</li>
                    <li>• Kiểm tra cài đặt âm thanh trong hệ thống</li>
                </ul>
            </div>
        `;
    } else if (errorType === 'Microphone bị từ chối') {
        specificHelp = `
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-yellow-800 mb-2">🔧 Khắc phục:</h4>
                <ul class="text-sm text-yellow-700 space-y-1">
                    <li>• Nhấp vào biểu tượng microphone trong thanh địa chỉ</li>
                    <li>• Chọn "Cho phép" hoặc "Allow"</li>
                    <li>• Làm mới trang sau khi cấp quyền</li>
                    <li>• Kiểm tra cài đặt quyền trong trình duyệt</li>
                </ul>
            </div>
        `;
    }
    
    requiredModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <i data-feather="mic-off" class="text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Microphone bắt buộc</h3>
            </div>
            <p class="text-gray-600 mb-4">Ứng dụng này yêu cầu microphone để luyện tập phỏng vấn. Vui lòng khắc phục vấn đề sau:</p>
            <p class="text-red-600 font-medium mb-4">${errorType}</p>
            
            ${specificHelp}
            
            <div class="space-y-4">
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">🎯 Tại sao cần microphone?</h4>
                    <ul class="text-purple-700 text-sm space-y-1">
                        <li>• Luyện tập phát âm và ngữ điệu</li>
                        <li>• AI phân tích giọng nói thực tế</li>
                        <li>• Feedback về phát âm và tốc độ nói</li>
                        <li>• Trải nghiệm phỏng vấn thực tế</li>
                    </ul>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">⚠ Chế độ nhập text chỉ dành cho trường hợp bất khả kháng</h4>
                    <p class="text-gray-700 text-sm">Chế độ nhập text sẽ không cung cấp feedback về phát âm và ngữ điệu.</p>
                </div>
            </div>
            
            <div class="mt-6 flex space-x-3">
                <button onclick="retryMicrophoneAccess()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    Thử lại microphone
                </button>
                <button onclick="showEmergencyTextInput()" class="flex-1 border-2 border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition">
                    Chế độ khẩn cấp (chỉ text)
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(requiredModal);
    feather.replace();
}

function showMicrophoneErrorWithOptions(errorMessage, errorType) {
    let errorTypeText = '';
    if (errorType === 'NotFoundError') {
        errorTypeText = 'Không tìm thấy microphone';
    } else if (errorType === 'NotAllowedError') {
        errorTypeText = 'Microphone bị từ chối';
    } else if (errorType === 'NotSupportedError') {
        errorTypeText = 'Trình duyệt không hỗ trợ ghi âm';
    } else {
        errorTypeText = 'Lỗi microphone';
    }
    
    showMicrophoneRequiredModal(errorTypeText);
}

function retryMicrophoneAccess() {
    // Remove modal
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
    
    // Try to access microphone again
    startRecording();
}

function showEmergencyTextInput() {
    // Remove modal
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
    
    // Show text input mode
    document.getElementById('recordingStatus').classList.add('hidden');
    document.getElementById('recordingActive').classList.add('hidden');
    document.getElementById('textInputMode').classList.remove('hidden');
    document.getElementById('textInputBanner').classList.remove('hidden');
}

function submitManualAnswer() {
    const manualAnswer = document.getElementById('manualAnswer').value;
    if (!manualAnswer.trim()) {
        alert('Vui lòng nhập câu trả lời');
        return;
    }
    
    // Process manual answer
    processManualAnswer(manualAnswer);
}

async function processManualAnswer(answer) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    
    feedbackSection.classList.remove('hidden');
    feedbackContent.innerHTML = '<div class="flex items-center"><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>Đang phân tích câu trả lời...</div>';
    
    try {
        const feedback = await generateFeedback(answer);
        feedbackContent.innerHTML = feedback;
        
        // Mark question as answered
        hasAnsweredCurrentQuestion = true;
        
        // Clear text input
        document.getElementById('manualAnswer').value = '';
        
        // Don't auto-move to next question, let user choose
        // setTimeout(() => {
        //     nextQuestion();
        // }, 5000);
        
    } catch (error) {
        console.error('Error processing manual answer:', error);
        feedbackContent.innerHTML = '<div class="text-red-600">❌ Lỗi xử lý. Vui lòng thử lại.</div>';
    }
}

function tryMicrophoneAgain() {
    document.getElementById('textInputMode').classList.add('hidden');
    document.getElementById('textInputBanner').classList.add('hidden');
    document.getElementById('recordingStatus').classList.remove('hidden');
    startRecording();
}

function showMicrophoneHelp() {
    alert('Hướng dẫn cấp quyền microphone:\n1. Nhấp vào biểu tượng microphone trong thanh địa chỉ\n2. Chọn "Cho phép" hoặc "Allow"\n3. Làm mới trang sau khi cấp quyền');
}

function checkAudioDevices() {
    // Check if getUserMedia is supported first
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        alert('Browser does not support microphone access. Please use a modern browser like Chrome, Firefox, or Edge.');
        return;
    }
    
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const audioDevices = devices.filter(device => device.kind === 'audioinput');
            let message = 'Thiết bị âm thanh tìm thấy:\n';
            audioDevices.forEach(device => {
                message += `• ${device.label || 'Microphone không tên'}\n`;
            });
            alert(message);
        })
        .catch(error => {
            alert('Không thể kiểm tra thiết bị âm thanh: ' + error.message);
        });
}

// Utility Functions
function downloadResource(filename) {
    // Simulate file download
    alert(`Tải xuống ${filename}...\n(Chức năng demo)`);
}

// Test Azure OpenAI API
async function testAzureAPI() {
    try {
        console.log('Testing Azure OpenAI API...');
        const response = await callAzureOpenAI('Hello, this is a test message.');
        console.log('Test successful:', response);
        const message = currentLanguage === 'en' 
            ? 'Azure OpenAI API test successful!'
            : 'Test API Azure OpenAI thành công!';
        alert(message);
    } catch (error) {
        console.error('Test failed:', error);
        const message = currentLanguage === 'en' 
            ? 'Azure OpenAI API test failed: '
            : 'Test API Azure OpenAI thất bại: ';
        alert(message + error.message);
    }
}

// Language management
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'vi' : 'en';
    updateLanguageUI();
    updateAllTexts();
}

function updateLanguageUI() {
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.textContent = currentLanguage === 'en' ? 'Tiếng Việt' : 'English';
    }
}

function updateAllTexts() {
    // Update header
    const headerSubtitle = document.querySelector('header p');
    if (headerSubtitle) {
        headerSubtitle.textContent = currentLanguage === 'en' 
            ? 'Practice interviews with Microsoft AI recruiter'
            : 'Luyện phỏng vấn với AI nhà tuyển dụng Microsoft';
    }

    // Update hero section
    const heroTitle = document.querySelector('#home h2');
    if (heroTitle) {
        heroTitle.innerHTML = currentLanguage === 'en'
            ? 'Practice <span class="text-blue-600">Microsoft</span> Interviews'
            : 'Luyện Phỏng Vấn <span class="text-blue-600">Microsoft</span>';
    }

    const heroDescription = document.querySelector('#home p');
    if (heroDescription) {
        heroDescription.textContent = currentLanguage === 'en'
            ? 'Prepare perfectly for Microsoft interviews with real AI recruiter. Import your CV to receive personalized interview questions.'
            : 'Chuẩn bị hoàn hảo cho phỏng vấn Microsoft với AI nhà tuyển dụng thực tế. Import CV của bạn để nhận câu hỏi phỏng vấn cá nhân hóa.';
    }

    const startButton = document.querySelector('#home button[onclick="startPractice()"]');
    if (startButton) {
        startButton.textContent = currentLanguage === 'en' ? 'Start Practice' : 'Bắt đầu luyện tập';
    }

    const importButton = document.querySelector('#home button[onclick="showCVUpload()"]');
    if (importButton) {
        importButton.textContent = currentLanguage === 'en' ? 'Import CV First' : 'Import CV trước';
    }

    // Update CV upload section
    const cvTitle = document.querySelector('#cvUpload h3');
    if (cvTitle) {
        cvTitle.textContent = currentLanguage === 'en' ? 'Import Your CV' : 'Import CV của bạn';
    }

    const cvDescription = document.querySelector('#cvUpload p');
    if (cvDescription) {
        cvDescription.textContent = currentLanguage === 'en'
            ? 'Upload your CV for AI analysis and personalized interview questions'
            : 'Tải lên CV của bạn để AI phân tích và tạo câu hỏi phỏng vấn phù hợp';
    }

    const cvFileLabel = document.querySelector('#cvUpload label p');
    if (cvFileLabel) {
        cvFileLabel.textContent = currentLanguage === 'en' ? 'Click to select CV file' : 'Nhấp để chọn file CV';
    }

    const cvFileSupport = document.querySelector('#cvUpload label p:last-child');
    if (cvFileSupport) {
        cvFileSupport.textContent = currentLanguage === 'en' ? 'Supported: PDF, DOC, DOCX, TXT' : 'Hỗ trợ: PDF, DOC, DOCX, TXT';
    }

    const cvSelected = document.querySelector('#cvPreview h5');
    if (cvSelected) {
        cvSelected.textContent = currentLanguage === 'en' ? 'Selected CV:' : 'CV đã chọn:';
    }

    const cvAnalysis = document.querySelector('#cvAnalysis h5');
    if (cvAnalysis) {
        cvAnalysis.textContent = currentLanguage === 'en' ? '📊 CV Analysis:' : '📊 Phân tích CV:';
    }

    const analyzeBtn = document.getElementById('analyzeCV');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = currentLanguage === 'en' 
            ? '<i data-feather="search" class="w-4 h-4 inline mr-2"></i>Analyze CV'
            : '<i data-feather="search" class="w-4 h-4 inline mr-2"></i>Phân tích CV';
    }

    const startInterviewBtn = document.getElementById('startInterview');
    if (startInterviewBtn) {
        startInterviewBtn.innerHTML = currentLanguage === 'en'
            ? '<i data-feather="play" class="w-4 h-4 inline mr-2"></i>Start Interview'
            : '<i data-feather="play" class="w-4 h-4 inline mr-2"></i>Bắt đầu phỏng vấn';
    }

    const downloadSampleBtn = document.querySelector('button[onclick="createSampleCV()"]');
    if (downloadSampleBtn) {
        downloadSampleBtn.innerHTML = currentLanguage === 'en'
            ? '<i data-feather="download" class="w-4 h-4 inline mr-1"></i>Download sample CV for testing'
            : '<i data-feather="download" class="w-4 h-4 inline mr-1"></i>Tải CV mẫu để test';
    }

    // Update practice interface
    const progressLabel = document.querySelector('.text-sm.text-gray-600:first-child');
    if (progressLabel) {
        progressLabel.innerHTML = currentLanguage === 'en' 
            ? 'Progress: <span id="currentQuestion">1</span>/<span id="totalQuestions">10</span>'
            : 'Tiến độ: <span id="currentQuestion">1</span>/<span id="totalQuestions">10</span>';
    }

    const timeLabel = document.querySelector('.text-sm.text-gray-600:last-child');
    if (timeLabel) {
        timeLabel.innerHTML = currentLanguage === 'en'
            ? 'Time: <span id="timer">00:00</span>'
            : 'Thời gian: <span id="timer">00:00</span>';
    }

    const questionLabel = document.querySelector('#practice h4');
    if (questionLabel) {
        questionLabel.textContent = currentLanguage === 'en' ? 'Question:' : 'Câu hỏi:';
    }

    const recordButton = document.getElementById('recordButton');
    if (recordButton) {
        recordButton.textContent = currentLanguage === 'en' ? 'Start Recording' : 'Bắt đầu ghi âm';
    }

    const recordingText = document.querySelector('#recordingStatus p');
    if (recordingText) {
        recordingText.textContent = currentLanguage === 'en' ? 'Press button to start recording' : 'Nhấn nút để bắt đầu ghi âm';
    }

    const recordingInfo = document.querySelector('#recordingStatus .text-sm');
    if (recordingInfo) {
        recordingInfo.innerHTML = currentLanguage === 'en'
            ? '<i data-feather="info" class="w-4 h-4 inline mr-1"></i>First time use, browser will request microphone permission'
            : '<i data-feather="info" class="w-4 h-4 inline mr-1"></i>Lần đầu sử dụng, trình duyệt sẽ yêu cầu cấp quyền microphone';
    }

    const recordingActive = document.querySelector('#recordingActive p');
    if (recordingActive) {
        recordingActive.textContent = currentLanguage === 'en' ? 'Recording...' : 'Đang ghi âm...';
    }

    const feedbackLabel = document.querySelector('#feedbackSection h4');
    if (feedbackLabel) {
        feedbackLabel.textContent = currentLanguage === 'en' ? 'AI Feedback:' : 'Feedback từ AI:';
    }

    const textInputLabel = document.querySelector('#textInputMode h4');
    if (textInputLabel) {
        textInputLabel.textContent = currentLanguage === 'en' ? 'Enter your answer:' : 'Nhập câu trả lời:';
    }

    const manualAnswer = document.getElementById('manualAnswer');
    if (manualAnswer) {
        manualAnswer.placeholder = currentLanguage === 'en' ? 'Type your answer here...' : 'Nhập câu trả lời của bạn...';
    }

    const submitBtn = document.querySelector('button[onclick="submitManualAnswer()"]');
    if (submitBtn) {
        submitBtn.textContent = currentLanguage === 'en' ? 'Submit Answer' : 'Gửi câu trả lời';
    }

    const tryMicBtn = document.querySelector('button[onclick="tryMicrophoneAgain()"]');
    if (tryMicBtn) {
        tryMicBtn.textContent = currentLanguage === 'en' ? 'Try Microphone Again' : 'Thử microphone lại';
    }

    // Update emergency mode banner
    const emergencyTitle = document.querySelector('#textInputBanner h5');
    if (emergencyTitle) {
        emergencyTitle.textContent = currentLanguage === 'en' ? '⚠ Emergency Mode - Text Only' : '⚠ Chế độ khẩn cấp - Chỉ nhập text';
    }

    const emergencyDesc = document.querySelector('#textInputBanner p');
    if (emergencyDesc) {
        emergencyDesc.textContent = currentLanguage === 'en' 
            ? 'Limited functionality: No pronunciation and intonation feedback'
            : 'Chức năng bị hạn chế: Không có feedback về phát âm và ngữ điệu';
    }

    // Update help buttons
    const helpBtn = document.querySelector('button[onclick="showMicrophoneHelp()"]');
    if (helpBtn) {
        helpBtn.innerHTML = currentLanguage === 'en'
            ? '<i data-feather="help-circle" class="w-4 h-4 inline mr-1"></i>Microphone permission guide'
            : '<i data-feather="help-circle" class="w-4 h-4 inline mr-1"></i>Hướng dẫn cấp quyền microphone';
    }

    const checkDevicesBtn = document.querySelector('button[onclick="checkAudioDevices()"]');
    if (checkDevicesBtn) {
        checkDevicesBtn.innerHTML = currentLanguage === 'en'
            ? '<i data-feather="settings" class="w-4 h-4 inline mr-1"></i>Check audio devices'
            : '<i data-feather="settings" class="w-4 h-4 inline mr-1"></i>Kiểm tra thiết bị âm thanh';
    }

    const orText = document.querySelector('.text-xs.text-gray-400');
    if (orText) {
        orText.textContent = currentLanguage === 'en' ? 'or' : 'hoặc';
    }

    // Re-render feather icons
    feather.replace();
}

// Create sample CV text
function createSampleCV() {
    const sampleCV = `NGUYỄN VĂN A
Software Engineer
Email: nguyenvana@email.com | Phone: 0123 456 789
LinkedIn: linkedin.com/in/nguyenvana

TÓM TẮT
Software Engineer với 3 năm kinh nghiệm phát triển ứng dụng web và mobile. Chuyên về React, Node.js, và cloud technologies. Có kinh nghiệm làm việc trong môi trường Agile và DevOps.

KINH NGHIỆM LÀM VIỆC

Software Engineer | TechCorp Vietnam | 2021 - Hiện tại
• Phát triển và maintain 5+ ứng dụng web sử dụng React, Node.js, MongoDB
• Làm việc trong team 8 người, sử dụng Agile methodology
• Tối ưu hóa performance, giảm 40% thời gian load trang
• Implement CI/CD pipeline với GitHub Actions
• Mentor 2 junior developers

Junior Developer | StartupXYZ | 2020 - 2021
• Phát triển mobile app với React Native
• Tích hợp REST APIs và third-party services
• Tham gia code review và testing
• Làm việc remote với team quốc tế

HỌC VẤN

Đại học Bách Khoa Hà Nội | 2016 - 2020
• Chuyên ngành: Công nghệ thông tin
• GPA: 3.8/4.0
• Tham gia CLB Lập trình, đạt giải 3 hackathon cấp trường

KỸ NĂNG KỸ THUẬT

Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, React Native, Vue.js, HTML5, CSS3, SASS
Backend: Node.js, Express.js, Python Flask
Database: MongoDB, MySQL, PostgreSQL
Cloud & DevOps: AWS, Docker, Kubernetes, GitHub Actions
Tools: Git, VS Code, Postman, Figma

DỰ ÁN TIÊU BIỂU

E-commerce Platform | TechCorp
• Full-stack development với React + Node.js
• Tích hợp payment gateway và inventory management
• Deploy trên AWS với Docker
• 10,000+ active users

Task Management App | Personal Project
• React Native app cho iOS và Android
• Real-time synchronization với Firebase
• Offline-first architecture
• 5,000+ downloads trên App Store

CHỨNG CHỈ
• AWS Certified Developer Associate
• MongoDB Certified Developer
• React Developer Certification

HOẠT ĐỘNG NGOẠI KHÓA
• Thành viên CLB Lập trình ĐHBK
• Mentor cho sinh viên IT
• Tham gia hackathon và coding competitions
• Đóng góp open source projects trên GitHub

NGÔN NGỮ
• Tiếng Việt: Bản ngữ
• Tiếng Anh: Thành thạo (TOEIC 850)
• Tiếng Nhật: Cơ bản (N3)

MỤC TIÊU NGHỀ NGHIỆP
• Trở thành Senior Software Engineer trong 2 năm tới
• Chuyên sâu về cloud architecture và microservices
• Tham gia phát triển sản phẩm có tác động lớn
• Mentor và đào tạo junior developers`;

    // Create a blob and download
    const blob = new Blob([sampleCV], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-cv.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    const message = currentLanguage === 'en' 
        ? 'Sample CV has been downloaded. Please upload this file to test!'
        : 'Sample CV đã được tải xuống. Hãy upload file này để test!';
    alert(message);
}

// Azure OpenAI Integration
async function callAzureOpenAI(prompt) {
    try {
        console.log('Calling Azure OpenAI with prompt:', prompt);
        
        // Determine the correct API endpoint based on current server
        const currentPort = window.location.port;
        let apiEndpoint;
        
        if (currentPort === '5555') {
            // Using Live Server, need to use server-simple.js
            apiEndpoint = 'http://localhost:5556/api/openai';
        } else if (currentPort === '5556') {
            // Using server-simple.js directly
            apiEndpoint = '/api/openai';
        } else {
            // Default to server-simple.js
            apiEndpoint = 'http://localhost:5556/api/openai';
        }
        
        console.log('Using API endpoint:', apiEndpoint);
        
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.response) {
            return data.response;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Azure OpenAI API error:', error);
        throw error;
    }
}

// Analyze CV function (called from HTML)
async function analyzeCV() {
    const fileInput = document.getElementById('cvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Vui lòng chọn file CV trước');
        return;
    }
    
    console.log('Analyze CV called for file:', file.name);
    
    // Show loading
    const analysisResult = document.getElementById('analysisResult');
    if (analysisResult) {
        analysisResult.innerHTML = '<div class="flex items-center"><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>Đang phân tích CV...</div>';
    }
    
    try {
        // Check file type and process accordingly
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        console.log('Analyzing file type:', fileType, 'File name:', fileName);

        if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/)) {
            console.log('Processing as image file');
            await processImageFile(file);
        } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
            console.log('Processing as PDF file');
            await processPDFFile(file);
        } else if (fileType.includes('text') || fileName.match(/\.(txt|doc|docx)$/)) {
            console.log('Processing as text file');
            await processTextFile(file);
        } else {
            console.log('Unsupported file type');
            showError('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, hình ảnh, hoặc text.');
        }
    } catch (error) {
        console.error('CV analysis error:', error);
        if (analysisResult) {
            analysisResult.innerHTML = '<div class="text-red-600">❌ Lỗi phân tích CV. Vui lòng thử lại.</div>';
        }
    }
}

// Start interview with CV
function startInterviewWithCV() {
    console.log('Start interview with CV called');
    if (!cvData) {
        const message = currentLanguage === 'en' 
            ? 'Please analyze CV first'
            : 'Vui lòng phân tích CV trước';
        alert(message);
        return;
    }
    
    // Generate personalized questions based on CV
    generatePersonalizedQuestions(cvData).then(personalizedQuestions => {
        questions = personalizedQuestions;
        startPractice();
    });
}

// Generate personalized questions based on CV data
async function generatePersonalizedQuestions(cvData) {
    try {
        console.log('Generating personalized questions for CV:', cvData);
        
        const prompt = `
You're an AI recruiter at Microsoft. Based on the candidate's CV, generate a list of 15 high-quality interview questions that match Microsoft's real-world interview style.

The questions should cover:
1. Behavioral questions (using STAR format)
2. Technical questions related to the candidate's experience and skills
3. Role-specific problem-solving or system design
4. Culture fit and Microsoft leadership principles
5. Career motivations, goals, and growth mindset

Return in this format:
{
  "language": "en",
  "questions": [
    {"en": "Question in English", "vi": "Translated question in Vietnamese"},
    ...
  ]
}

CV Summary:
- Name: ${cvData.basicInfo?.name || 'Candidate'}
- Position Applied: ${cvData.recommendedPosition || 'Software Engineer'}
- Current Role: ${cvData.basicInfo?.currentPosition || 'Software Developer'}
- Experience Summary: ${cvData.experience?.summary || 'Worked on multiple web applications'}
- Education: ${cvData.education?.university || 'University'} - ${cvData.education?.major || 'Computer Science'}
- Skills: ${JSON.stringify(cvData.skills || ['React', 'Node.js', 'Azure'])}

IMPORTANT: The candidate is applying for the position of "${cvData.recommendedPosition || 'Software Engineer'}". 
Please generate questions that are specifically tailored for this role, including:
- Role-specific technical questions
- Behavioral questions relevant to this position
- Industry-specific scenarios
- Microsoft culture questions appropriate for this role

Make sure:
- Each question is clearly written and relevant to the candidate's background
- Questions are realistic and could be used in a Microsoft interview
- Translate each question to Vietnamese (field: vi)
- Focus on the specific role and skills mentioned in the CV
- Include both technical and behavioral questions appropriate for the position

Return **only the JSON**, no explanation or notes.
`;
        
        const response = await callAzureOpenAI(prompt);
        console.log('Personalized questions response:', response);
        
        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            console.log('Parsed questions data:', data);
            
            // Extract questions based on current language
            let questions = [];
            if (data.questions && Array.isArray(data.questions)) {
                questions = data.questions.map(q => {
                    // Return question in current language, fallback to English
                    if (currentLanguage === 'vi' && q.vi) {
                        return q.vi;
                    } else if (q.en) {
                        return q.en;
                    } else {
                        // Fallback to English if translation not available
                        return q.en || q.vi || 'Question not available';
                    }
                });
            }
            
            console.log('Processed questions:', questions);
            console.log('Number of questions:', questions.length);
            return questions;
        } else {
            console.error('No JSON object found in response. Response:', response);
            throw new Error('No JSON object found in response');
        }
    } catch (error) {
        console.error('Error generating personalized questions:', error);
        // Fallback to default questions
        return microsoftQuestions;
    }
}

// Show CV upload function
function showCVUpload() {
    console.log('showCVUpload called');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.remove('hidden');
    document.getElementById('practice').classList.add('hidden');
    document.getElementById('booking').classList.add('hidden');
}

// Start practice function
function startPractice() {
    console.log('startPractice called');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('cvUpload').classList.add('hidden');
    document.getElementById('practice').classList.remove('hidden');
    document.getElementById('booking').classList.add('hidden');
    
    currentQuestionIndex = 0;
    // Reset questions to default if no personalized questions
    if (!questions) {
        questions = microsoftQuestions;
    }
    startTimer();
    displayCurrentQuestion();
}

// Display current question with TTS
function displayCurrentQuestion() {
    console.log('displayCurrentQuestion called');
    console.log('currentQuestionIndex:', currentQuestionIndex);
    console.log('questions:', questions);
    console.log('microsoftQuestions:', microsoftQuestions);
    
    // Reset answered status for new question
    hasAnsweredCurrentQuestion = false;
    
    const questionText = document.getElementById('currentQuestionText');
    const currentQuestion = document.getElementById('currentQuestion');
    const totalQuestions = document.getElementById('totalQuestions');
    const progressBar = document.getElementById('progressBar');
    const questionStatus = document.getElementById('questionStatus');
    
    // Use personalized questions if available, otherwise fallback to default
    const questionArray = questions || microsoftQuestions;
    console.log('questionArray:', questionArray);
    console.log('questionArray length:', questionArray.length);
    
    let question = questionArray[currentQuestionIndex];
    console.log('Current question:', question);
    
    if (cvData) {
        // Personalize question based on CV data
        question = personalizeQuestion(question, cvData);
    }
    
    if (questionText) {
        questionText.textContent = question;
        questionText.classList.add('hidden'); // Hide text by default
    }
    if (currentQuestion) currentQuestion.textContent = currentQuestionIndex + 1;
    if (totalQuestions) totalQuestions.textContent = questionArray.length;
    
    if (progressBar) {
        const progress = ((currentQuestionIndex + 1) / questionArray.length) * 100;
        progressBar.style.width = progress + '%';
    }
    
    // Auto-speak the question after a short delay
    setTimeout(() => {
        speakQuestion(question);
    }, 500);
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Personalize question based on CV data
function personalizeQuestion(question, cvData) {
    // Personalize questions based on CV data
    if (question.includes("Tell me about yourself") || question.includes("Hãy kể về bản thân")) {
        return currentLanguage === 'vi' 
            ? `Hãy kể về bản thân và kinh nghiệm của bạn trong lĩnh vực ${cvData.recommendedPosition}.`
            : `Tell me about yourself and your background in ${cvData.recommendedPosition}.`;
    } else if (question.includes("Why do you want to work at Microsoft") || question.includes("Tại sao bạn muốn làm việc tại Microsoft")) {
        return currentLanguage === 'vi'
            ? `Tại sao bạn muốn làm việc tại Microsoft với vai trò ${cvData.recommendedPosition}?`
            : `Why do you want to work at Microsoft as a ${cvData.recommendedPosition}?`;
    } else if (question.includes("Describe a challenging project") || question.includes("Mô tả một dự án thách thức")) {
        const firstSkill = Array.isArray(cvData.skills) ? cvData.skills[0] : cvData.skills?.split(',')[0] || 'technology';
        return currentLanguage === 'vi'
            ? `Mô tả một dự án thách thức bạn đã làm việc với ${firstSkill} và cách bạn vượt qua khó khăn.`
            : `Describe a challenging project you worked on using ${firstSkill} and how you overcame obstacles.`;
    }
    return question;
}

// Helper function to show success messages
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i data-feather="check-circle" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(successDiv);
    feather.replace();
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Helper function to show warning messages
function showWarningMessage(message) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    warningDiv.innerHTML = `
        <div class="flex items-center">
            <i data-feather="alert-triangle" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(warningDiv);
    feather.replace();
    
    setTimeout(() => {
        warningDiv.remove();
    }, 5000);
}

// Function to show text input mode
function showTextInput() {
    const recordingSection = document.querySelector('.recording-section');
    const textInputMode = document.getElementById('textInputMode');
    
    if (recordingSection) {
        recordingSection.classList.add('hidden');
    }
    
    if (textInputMode) {
        textInputMode.classList.remove('hidden');
    }
}

// Text-to-Speech Functions
function speakQuestion(questionText) {
    try {
        // Stop any current speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.lang = currentLanguage === 'en' ? 'en-US' : 'vi-VN';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Update UI to show speaking status
        updateSpeakingStatus(true);
        
        utterance.onend = () => {
            updateSpeakingStatus(false);
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            updateSpeakingStatus(false);
            showWarningMessage('Speech synthesis failed. Please use text mode.');
        };
        
        speechSynthesis.speak(utterance);
        
    } catch (error) {
        console.error('Speech synthesis error:', error);
        updateSpeakingStatus(false);
        showWarningMessage('Speech synthesis not supported. Please use text mode.');
    }
}

function speakCurrentQuestion() {
    const questionText = document.getElementById('currentQuestionText');
    if (questionText && questionText.textContent) {
        speakQuestion(questionText.textContent);
    }
}

function toggleQuestionText() {
    const questionText = document.getElementById('currentQuestionText');
    const questionStatus = document.getElementById('questionStatus');
    const toggleButton = document.getElementById('toggleTextButton');
    
    if (questionText && questionStatus) {
        const isHidden = questionText.classList.contains('hidden');
        
        if (isHidden) {
            // Show text
            questionText.classList.remove('hidden');
            questionStatus.classList.add('hidden');
            toggleButton.innerHTML = '<i data-feather="eye-off" class="w-4 h-4 inline mr-1"></i>Hide Text';
        } else {
            // Hide text
            questionText.classList.add('hidden');
            questionStatus.classList.remove('hidden');
            toggleButton.innerHTML = '<i data-feather="eye" class="w-4 h-4 inline mr-1"></i>Show Text';
        }
        
        feather.replace();
    }
}

function updateSpeakingStatus(isSpeaking) {
    const speakButton = document.getElementById('speakButton');
    const questionStatus = document.getElementById('questionStatus');
    
    if (speakButton) {
        if (isSpeaking) {
            speakButton.innerHTML = '<i data-feather="volume-x" class="w-4 h-4 inline mr-1"></i>Stop';
            speakButton.className = 'bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition';
            speakButton.onclick = stopSpeaking;
        } else {
            speakButton.innerHTML = '<i data-feather="volume-2" class="w-4 h-4 inline mr-1"></i>Speak';
            speakButton.className = 'bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition';
            speakButton.onclick = speakCurrentQuestion;
        }
        feather.replace();
    }
    
    if (questionStatus) {
        if (isSpeaking) {
            questionStatus.innerHTML = `
                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <i data-feather="volume-2" class="w-8 h-8 text-white"></i>
                </div>
                <p class="text-blue-600 font-medium">Speaking question...</p>
            `;
        } else {
            questionStatus.innerHTML = `
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-feather="play" class="w-8 h-8 text-blue-600"></i>
                </div>
                <p class="text-gray-600">Question will be spoken automatically</p>
            `;
        }
        feather.replace();
    }
}

function stopSpeaking() {
    speechSynthesis.cancel();
    updateSpeakingStatus(false);
}

// Suggest job titles based on CV data using AI
async function suggestJobTitlesFromCV(cvData) {
    try {
        console.log('Suggesting job titles using AI...');
        
        const suggestRolesPrompt = `
You're an AI recruiter at Microsoft.

Based on the candidate's CV summary below, suggest **3 to 5 real job titles** that would be suitable at Microsoft.

These roles should:
- Match the candidate's background, skills, and experience
- Be realistic and not overly technical if not appropriate
- Prefer roles in customer service, operations, business, or product if relevant
- Avoid suggesting technical roles (like AI Engineer, Data Scientist) unless the candidate has clear technical background

CV Summary:
- Current Position: ${cvData.basicInfo?.currentPosition || 'N/A'}
- Experience Summary: ${cvData.experience?.summary || cvData.experience || 'N/A'}
- Education: ${cvData.education?.background || cvData.education || 'N/A'}
- Skills: ${Array.isArray(cvData.skills) ? cvData.skills.join(', ') : (cvData.skills || 'N/A')}
- Recommended Position (if any): ${cvData.recommendedPosition || 'N/A'}

Return JSON array of job titles like:
["Customer Success Manager", "Product Support Lead", "Client Engagement Specialist"]

Only return the JSON array. No explanation.
`;

        const response = await callAzureOpenAI(suggestRolesPrompt);
        
        // Parse JSON response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            console.log('AI suggested roles:', suggestions);
            return suggestions;
        } else {
            console.warn('No JSON array found in AI response, using fallback');
            return getFallbackSuggestions(cvData);
        }
        
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        console.log('Using fallback suggestions');
        return getFallbackSuggestions(cvData);
    }
}

// Fallback suggestions based on simple rules
function getFallbackSuggestions(cvData) {
    const skills = Array.isArray(cvData.skills) 
        ? cvData.skills.map(s => s.toLowerCase())
        : (cvData.skills || '').toLowerCase().split(',').map(s => s.trim().toLowerCase());
    
    const experience = (cvData.experience?.summary || cvData.experience || '').toLowerCase();
    const currentPosition = (cvData.basicInfo?.currentPosition || '').toLowerCase();
    
    const titleSuggestions = [];
    
    // Customer Service / Support roles
    if (experience.includes('customer') || experience.includes('support') || 
        experience.includes('client') || currentPosition.includes('customer') ||
        skills.some(s => ['customer service', 'support', 'client'].includes(s))) {
        titleSuggestions.push("Customer Success Manager", "Client Support Lead", "Customer Experience Specialist");
    }
    
    // Sales / Business roles
    if (experience.includes('sales') || experience.includes('business') || 
        experience.includes('account') || currentPosition.includes('sales') ||
        skills.some(s => ['sales', 'business', 'account'].includes(s))) {
        titleSuggestions.push("Account Manager", "Business Development Manager", "Sales Specialist");
    }
    
    // Marketing roles
    if (experience.includes('marketing') || experience.includes('campaign') || 
        currentPosition.includes('marketing') ||
        skills.some(s => ['marketing', 'campaign', 'social media'].includes(s))) {
        titleSuggestions.push("Marketing Manager", "Digital Marketing Specialist", "Campaign Manager");
    }
    
    // HR / People roles
    if (experience.includes('hr') || experience.includes('human resource') || 
        experience.includes('recruitment') || currentPosition.includes('hr') ||
        skills.some(s => ['hr', 'recruitment', 'talent'].includes(s))) {
        titleSuggestions.push("HR Specialist", "Talent Acquisition Manager", "People Operations");
    }
    
    // Operations / Project Management
    if (experience.includes('operations') || experience.includes('project') || 
        experience.includes('coordination') || currentPosition.includes('operations') ||
        skills.some(s => ['operations', 'project management', 'coordination'].includes(s))) {
        titleSuggestions.push("Operations Manager", "Project Coordinator", "Program Manager");
    }
    
    // Technical roles (only if clearly technical background)
    if (skills.some(s => ['react', 'angular', 'vue', 'javascript', 'html', 'css'].includes(s)) || 
        experience.includes('frontend') || experience.includes('web')) {
        titleSuggestions.push("Frontend Developer", "Full Stack Developer");
    }
    
    if (skills.some(s => ['node.js', 'python', 'java', 'c#', '.net', 'spring'].includes(s)) || 
        experience.includes('backend') || experience.includes('api')) {
        titleSuggestions.push("Backend Developer", "Full Stack Developer");
    }
    
    if (skills.some(s => ['python', 'tensorflow', 'pytorch', 'machine learning', 'ai'].includes(s)) || 
        experience.includes('machine learning') || experience.includes('ai')) {
        titleSuggestions.push("AI Engineer", "Machine Learning Engineer", "Data Scientist");
    }
    
    if (skills.some(s => ['python', 'sql', 'data analysis'].includes(s)) || 
        experience.includes('data') || experience.includes('analytics')) {
        titleSuggestions.push("Data Scientist", "Data Analyst", "Business Intelligence Engineer");
    }
    
    // Product roles
    if (experience.includes('product') || experience.includes('roadmap') || 
        skills.some(s => ['agile', 'scrum', 'product management'].includes(s))) {
        titleSuggestions.push("Product Manager", "Technical Product Manager");
    }
    
    // Design roles
    if (skills.some(s => ['figma', 'sketch', 'adobe', 'ui', 'ux', 'design'].includes(s)) || 
        experience.includes('ui/ux') || experience.includes('design')) {
        titleSuggestions.push("UX Designer", "UI/UX Designer", "Product Designer");
    }
    
    // Default suggestions if no specific match
    if (titleSuggestions.length === 0) {
        titleSuggestions.push("Customer Success Manager", "Operations Specialist", "Business Analyst");
    }
    
    // Remove duplicates and limit to 5 suggestions
    const uniqueSuggestions = [...new Set(titleSuggestions)];
    return uniqueSuggestions.slice(0, 5);
}

// Select position from suggestions
function selectPosition(position) {
    console.log('Selected position:', position);
    
    // Update CV data with selected position
    if (cvData) {
        cvData.recommendedPosition = position;
    }
    
    // Show success message
    showSuccessMessage(`Đã chọn vị trí: ${position}`);
    
    // Update the display
    const positionDisplay = document.querySelector('.bg-blue-50 .text-blue-700');
    if (positionDisplay) {
        positionDisplay.textContent = position;
    }
    
    // Highlight selected position
    const buttons = document.querySelectorAll('.bg-blue-100');
    buttons.forEach(btn => {
        if (btn.textContent === position) {
            btn.classList.remove('bg-blue-100', 'text-blue-800');
            btn.classList.add('bg-green-100', 'text-green-800');
        } else {
            btn.classList.remove('bg-green-100', 'text-green-800');
            btn.classList.add('bg-blue-100', 'text-blue-800');
        }
    });
}

// Select custom position
function selectCustomPosition() {
    const customPositionInput = document.getElementById('customPosition');
    const customPosition = customPositionInput.value.trim();
    
    if (!customPosition) {
        showWarningMessage('Vui lòng nhập vị trí tùy chỉnh');
        return;
    }
    
    console.log('Selected custom position:', customPosition);
    
    // Update CV data with custom position
    if (cvData) {
        cvData.recommendedPosition = customPosition;
    }
    
    // Show success message
    showSuccessMessage(`Đã chọn vị trí tùy chỉnh: ${customPosition}`);
    
    // Update the display
    const positionDisplay = document.querySelector('.bg-blue-50 .text-blue-700');
    if (positionDisplay) {
        positionDisplay.textContent = customPosition;
    }
    
    // Clear input
    customPositionInput.value = '';
}