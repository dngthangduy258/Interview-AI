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
    
    // Show loading
    analysisResult.innerHTML = '<div class="flex items-center"><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>Đang phân tích CV...</div>';
    
    try {
        // Read file content
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
            Analyze this CV and return information in JSON format:
            
            CV: ${cvText}
            
            Return JSON with these fields:
            - basicInfo: Basic information (name, age, current position)
            - experience: Work experience (summary)
            - education: Education background
            - skills: Main skills
            - recommendedPosition: Suitable position at Microsoft
            
            Return only JSON, no other text.
        `);
        
        console.log('CV analysis response:', response);
        
        // Try to parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
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
        const feedback = await callAzureOpenAI(`
            You are a Microsoft recruiter. Evaluate the candidate's answer to this interview question.
            
            Question: ${currentQuestion}
            Candidate's answer: ${answer}
            ${cvData ? `CV Information: ${JSON.stringify(cvData)}` : ''}
            
            Provide detailed feedback including:
            1. Score from 0-100
            2. Strengths (3-4 points)
            3. Areas for improvement (2-3 points)
            4. Specific improvement suggestions
            5. Better answer example
            
            Respond in ${currentLanguage === 'en' ? 'English' : 'Vietnamese'}, HTML format.
        `);
        
        // Store result
        const result = {
            questionIndex: currentQuestionIndex,
            question: currentQuestion,
            answer: answer,
            feedback: feedback,
            timestamp: Date.now()
        };
        interviewResults.push(result);
        
        return feedback;
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
        
        return fallbackFeedback;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    
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
        
        // Clear text input
        document.getElementById('manualAnswer').value = '';
        
        // Move to next question after delay
        setTimeout(() => {
            nextQuestion();
        }, 5000);
        
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
        
        const response = await fetch(`${AZURE_CONFIG.ENDPOINT}openai/deployments/${AZURE_CONFIG.DEPLOYMENT}/chat/completions?api-version=${AZURE_CONFIG.API_VERSION}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_CONFIG.API_KEY
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Microsoft recruiter. Provide detailed and helpful feedback in Vietnamese.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from Azure OpenAI');
        }
    } catch (error) {
        console.error('Azure OpenAI API error:', error);
        throw error;
    }
}