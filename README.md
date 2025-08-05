# 🚀 Microsoft Interview Pro

**Practice Microsoft interviews with real AI recruiter feedback - CV Analysis, OCR, TTS, Speech Recognition**

## ✨ Features

### 🎯 **Core Features**
- **CV Analysis with OCR** - Extract text from scanned PDFs using Tesseract.js
- **Meta Recruiter Feedback** - Professional feedback like real Meta recruiters
- **Text-to-Speech** - AI reads interview questions aloud
- **Speech Recognition** - Real-time voice input and transcription
- **Personalized Questions** - AI generates questions based on your CV
- **Role Suggestions** - Smart job title recommendations
- **Progress Tracking** - Monitor interview performance

### 🛠 **Technical Features**
- **OCR Integration** - Tesseract.js for PDF text extraction
- **PDF Processing** - PDF.js for document handling
- **Azure OpenAI API** - Advanced AI analysis and feedback
- **Web Speech API** - Browser-based TTS and speech recognition
- **Responsive Design** - Tailwind CSS for modern UI

## 🚀 Quick Start

### **Option 1: Development**
```bash
# Clone repository
git clone https://github.com/your-username/microsoft-interview-pro.git
cd microsoft-interview-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Option 2: Production Build**
```bash
# Build for production
npm run build

# Start production server
cd dist
npm install
npm start
```

### **Option 3: Direct HTML**
```bash
# Open index.html directly in browser
open index.html
```

## 📦 Build Process

### **Development Build**
```bash
npm run build:check    # Syntax check
npm run build:copy     # Copy static files
npm run build:minify   # Minify JavaScript
```

### **Production Build**
```bash
npm run build          # Full production build
```

### **Build Output**
- ✅ Creates `./dist/` directory
- ✅ Copies all static files
- ✅ Optimizes package.json for production
- ✅ Generates deployment instructions
- ✅ Creates build info and metadata

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file:
```env
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_API_KEY=your_api_key
```

### **Azure OpenAI Setup**
1. Create Azure OpenAI resource
2. Get endpoint and API key
3. Add to environment variables
4. Test with `npm run test`

## 🧪 Testing

### **Syntax Check**
```bash
npm run test:lint      # Check JavaScript syntax
npm run test:build     # Test build process
```

### **Feature Testing**
- Open `feedback-prompt-test.html` to test Meta recruiter feedback
- Open `test-build.html` to verify build status
- Use `demo.html` for feature demonstrations

## 📊 Project Structure

```
microsoft-interview-pro/
├── index.html                 # Main application
├── script.js                  # Core JavaScript logic
├── server-simple.js           # Production server
├── styles.css                 # Styling
├── build.js                   # Build script
├── package.json               # Dependencies
├── dist/                      # Production build
│   ├── index.html
│   ├── script.js
│   ├── server-simple.js
│   └── package.json
└── docs/                      # Documentation
    ├── META_FEEDBACK_PROMPT.md
    └── BUILD_STATUS.md
```

## 🎯 Usage Guide

### **1. Import CV**
- Upload PDF, DOC, DOCX, or TXT files
- AI analyzes your background and experience
- Get personalized job role suggestions

### **2. Start Interview**
- AI generates questions based on your CV
- Questions are read aloud with TTS
- Answer using voice or text input

### **3. Get Feedback**
- Meta recruiter-style evaluation
- Detailed scoring and improvement tips
- Track progress across questions

### **4. Review Results**
- Comprehensive interview report
- Performance analytics
- Downloadable results

## 🔍 Technical Details

### **AI Integration**
- **Azure OpenAI GPT-4** for CV analysis
- **Custom Meta recruiter prompt** for feedback
- **Multi-language support** (English/Vietnamese)

### **OCR & Document Processing**
- **Tesseract.js** for image-to-text conversion
- **PDF.js** for PDF rendering and text extraction
- **Fallback handling** for unsupported formats

### **Speech Processing**
- **Web Speech API** for TTS and speech recognition
- **Real-time transcription** during interviews
- **Cross-browser compatibility** handling

### **UI/UX Features**
- **Responsive design** with Tailwind CSS
- **Progressive Web App** capabilities
- **Accessibility** features for screen readers
- **Dark/light mode** support

## 🚀 Deployment

### **Vercel Deployment**
```bash
npm run deploy
```

### **Manual Deployment**
```bash
npm run build
cd dist
npm install --production
npm start
```

### **Docker Deployment**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY dist/ .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

### **Load Times**
- Initial load: ~2-3 seconds
- CV analysis: ~5-10 seconds
- Feedback generation: ~3-5 seconds

### **Browser Support**
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: See `/docs` folder
- **Demo**: Open `demo.html` for feature overview

---

**🎉 Ready to ace your Microsoft interview!** 