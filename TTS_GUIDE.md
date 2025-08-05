# 🎤 Text-to-Speech (TTS) Integration Guide

## 📋 Tổng quan

Hệ thống Microsoft Interview Pro đã được tích hợp **Text-to-Speech (TTS)** để tạo trải nghiệm phỏng vấn thật hơn, với câu hỏi được đọc bằng giọng nói và text ẩn/hiện theo nhu cầu.

## ✨ Tính năng TTS

### 🎙️ Core Features
- **Auto-speak questions**: Tự động đọc câu hỏi khi bắt đầu
- **Manual speak**: Nút để đọc lại câu hỏi
- **Text toggle**: Ẩn/hiện text câu hỏi
- **Multi-language**: Hỗ trợ tiếng Anh và tiếng Việt
- **Voice controls**: Điều chỉnh tốc độ, pitch, volume

### 🎯 User Experience
- **Realistic interview**: Giống phỏng vấn thật
- **Accessibility**: Text ẩn nhưng có thể hiện khi cần
- **Visual feedback**: Hiển thị trạng thái đang nói
- **Error handling**: Fallback khi TTS không hoạt động

## 🚀 Cách hoạt động

### 1. Question Display Flow
```javascript
// Khi load câu hỏi mới
function displayCurrentQuestion() {
    // 1. Hiển thị câu hỏi (ẩn text)
    questionText.textContent = question;
    questionText.classList.add('hidden');
    
    // 2. Auto-speak sau 500ms
    setTimeout(() => {
        speakQuestion(question);
    }, 500);
}
```

### 2. TTS Processing
```javascript
function speakQuestion(questionText) {
    // 1. Stop current speech
    speechSynthesis.cancel();
    
    // 2. Create utterance
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = currentLanguage === 'en' ? 'en-US' : 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // 3. Update UI
    updateSpeakingStatus(true);
    
    // 4. Handle events
    utterance.onend = () => updateSpeakingStatus(false);
    utterance.onerror = () => showWarningMessage('TTS failed');
    
    // 5. Speak
    speechSynthesis.speak(utterance);
}
```

### 3. Text Toggle
```javascript
function toggleQuestionText() {
    const isHidden = questionText.classList.contains('hidden');
    
    if (isHidden) {
        // Show text
        questionText.classList.remove('hidden');
        questionStatus.classList.add('hidden');
        toggleButton.innerHTML = 'Hide Text';
    } else {
        // Hide text
        questionText.classList.add('hidden');
        questionStatus.classList.remove('hidden');
        toggleButton.innerHTML = 'Show Text';
    }
}
```

## 🛠️ Technical Implementation

### HTML Structure
```html
<!-- Question Display with TTS -->
<div class="bg-gray-50 rounded-lg p-6 mb-6 relative">
    <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold text-gray-800">Question:</h4>
        <div class="flex items-center space-x-2">
            <button id="speakButton" onclick="speakCurrentQuestion()">
                🎤 Speak
            </button>
            <button id="toggleTextButton" onclick="toggleQuestionText()">
                👁️ Show Text
            </button>
        </div>
    </div>
    
    <div id="questionTextContainer" class="relative">
        <p id="currentQuestionText" class="text-xl text-gray-700 hidden">
            Question text here...
        </p>
        <div id="questionStatus" class="text-center py-8">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-feather="play" class="w-8 h-8 text-blue-600"></i>
            </div>
            <p class="text-gray-600">Question will be spoken automatically</p>
        </div>
    </div>
</div>
```

### JavaScript Functions
```javascript
// Core TTS functions
function speakQuestion(questionText) { /* ... */ }
function speakCurrentQuestion() { /* ... */ }
function toggleQuestionText() { /* ... */ }
function updateSpeakingStatus(isSpeaking) { /* ... */ }
function stopSpeaking() { /* ... */ }
```

## 📁 Files đã cập nhật

### Core Application
- `index.html`: Thêm UI controls cho TTS
- `script.js`: Thêm TTS functions

### Demo & Testing
- `tts-demo.html`: Demo TTS hoàn chỉnh
- `test-app.html`: Thêm TTS test

## 🧪 Testing

### 1. Test TTS Demo
```bash
# Mở file demo TTS
open tts-demo.html
```

### 2. Test trong App chính
```bash
# Mở test app
open test-app.html
# Click "Test TTS"
```

### 3. Test trong Interview
```bash
# Mở app chính
open index.html
# Start interview và test TTS
```

## ⚙️ Configuration

### Voice Settings
```javascript
// Default settings
utterance.lang = 'en-US';        // Language
utterance.rate = 0.9;            // Speed (0.5-2.0)
utterance.pitch = 1.0;           // Pitch (0.5-2.0)
utterance.volume = 1.0;          // Volume (0-1)
```

### Language Support
```javascript
// English
utterance.lang = 'en-US';

// Vietnamese
utterance.lang = 'vi-VN';

// Auto-detect based on current language
utterance.lang = currentLanguage === 'en' ? 'en-US' : 'vi-VN';
```

## 🎯 User Experience Flow

### 1. Interview Start
```
User clicks "Start Interview"
↓
Load first question
↓
Hide question text
↓
Auto-speak question (500ms delay)
↓
Show speaking animation
↓
User listens to question
```

### 2. Question Navigation
```
User answers question
↓
Click "Next Question"
↓
Load new question
↓
Auto-speak new question
↓
Repeat process
```

### 3. Text Toggle
```
User clicks "Show Text"
↓
Display question text
↓
Hide status animation
↓
User can read while listening
```

## ⚠️ Browser Compatibility

### Supported Browsers
- ✅ Chrome 33+
- ✅ Firefox 49+
- ✅ Safari 7+
- ✅ Edge 79+

### Known Issues
- **Safari**: May require user interaction before TTS
- **Mobile**: Limited voice options
- **Firefox**: Different voice quality

### Fallback Strategy
```javascript
try {
    speechSynthesis.speak(utterance);
} catch (error) {
    // Fallback to text-only mode
    showWarningMessage('TTS not supported. Using text mode.');
    showQuestionText();
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. TTS không hoạt động
```javascript
// Check browser support
if ('speechSynthesis' in window) {
    console.log('TTS supported');
} else {
    console.log('TTS not supported');
}
```

#### 2. Voice không rõ
```javascript
// Adjust settings
utterance.rate = 0.8;    // Slower
utterance.pitch = 1.2;   // Higher pitch
utterance.volume = 0.9;  // Slightly lower volume
```

#### 3. Language không đúng
```javascript
// Check available voices
speechSynthesis.getVoices().forEach(voice => {
    console.log(voice.name, voice.lang);
});
```

### Debug Functions
```javascript
// List available voices
function listVoices() {
    const voices = speechSynthesis.getVoices();
    voices.forEach(voice => {
        console.log(`${voice.name} (${voice.lang})`);
    });
}

// Test TTS with specific voice
function testVoice(voiceName) {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
        const utterance = new SpeechSynthesisUtterance('Test');
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
    }
}
```

## 🎯 Best Practices

### 1. User Experience
- **Auto-speak**: Tự động đọc câu hỏi
- **Manual control**: Cho phép đọc lại
- **Visual feedback**: Hiển thị trạng thái
- **Text fallback**: Luôn có text backup

### 2. Performance
- **Stop previous**: Cancel speech trước khi nói mới
- **Error handling**: Graceful fallback
- **Memory management**: Cleanup resources

### 3. Accessibility
- **Text toggle**: Ẩn/hiện text theo nhu cầu
- **Keyboard navigation**: Hỗ trợ keyboard
- **Screen readers**: Compatible với screen readers

## 📈 Future Enhancements

### 1. Advanced TTS
- **Multiple voices**: Nhiều giọng đọc khác nhau
- **Emotion detection**: Giọng đọc theo cảm xúc
- **Custom voices**: Upload voice riêng

### 2. Enhanced UX
- **Voice selection**: Cho phép chọn giọng đọc
- **Speed control**: Điều chỉnh tốc độ real-time
- **Pause/Resume**: Tạm dừng/tiếp tục

### 3. Integration
- **Azure Speech**: Tích hợp Azure Speech Service
- **Google TTS**: Sử dụng Google Cloud TTS
- **Amazon Polly**: AWS Polly integration

---

## 🎉 Kết luận

TTS integration đã tạo ra trải nghiệm phỏng vấn thật hơn với:

✅ **Auto-speak questions** - Tự động đọc câu hỏi  
✅ **Text toggle** - Ẩn/hiện text theo nhu cầu  
✅ **Multi-language** - Hỗ trợ Anh + Việt  
✅ **Visual feedback** - Hiển thị trạng thái nói  
✅ **Error handling** - Fallback khi TTS fail  
✅ **Accessibility** - Hỗ trợ người khuyết tật  

Với tính năng này, người dùng có thể trải nghiệm phỏng vấn Microsoft như thật với câu hỏi được đọc bằng giọng nói chuyên nghiệp! 