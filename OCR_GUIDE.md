# 🔍 OCR CV Analysis Guide

## 📋 Tổng quan

Hệ thống Microsoft Interview Pro đã được nâng cấp với khả năng **OCR (Optical Character Recognition)** để xử lý CV dạng PDF scan hoặc hình ảnh.

## ✨ Tính năng mới

### 🔧 OCR Processing
- **PDF Scan**: Xử lý PDF dạng scan (ảnh) bằng OCR
- **Image Files**: Xử lý file hình ảnh (PNG, JPG, JPEG)
- **Multi-language**: Hỗ trợ tiếng Anh và tiếng Việt
- **Real-time Progress**: Hiển thị tiến trình xử lý

### 📊 AI Analysis
- **Enhanced Prompt**: Prompt tối ưu cho OCR text
- **Error Handling**: Xử lý lỗi và fallback gracefully
- **Structured Output**: JSON format chuẩn

## 🚀 Cách sử dụng

### 1. Upload CV với OCR
```html
<!-- File upload với OCR support -->
<input type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx">
```

### 2. Xử lý tự động
- **PDF Text**: Xử lý trực tiếp nếu có text layer
- **PDF Scan**: Sử dụng OCR để extract text
- **Images**: OCR để nhận dạng text
- **Text Files**: Đọc trực tiếp

### 3. AI Analysis
```javascript
// Prompt tối ưu cho OCR
const prompt = `
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
`;
```

## 🛠️ Technical Implementation

### Dependencies
```html
<!-- Tesseract.js for OCR -->
<script src="https://unpkg.com/tesseract.js@v4.1.1/dist/tesseract.min.js"></script>

<!-- PDF.js for PDF processing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
```

### PDF Processing Flow
```javascript
async function processPDFWithOCR(file) {
    // 1. Load PDF with PDF.js
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // 2. Render each page to canvas
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        // 3. OCR with Tesseract.js
        const { data: { text } } = await Tesseract.recognize(canvas, 'eng+vie');
        fullText += text;
    }
    
    return fullText;
}
```

### Image Processing
```javascript
async function processImageWithOCR(file) {
    const { data: { text } } = await Tesseract.recognize(file, 'eng+vie');
    return text;
}
```

## 📁 Files đã cập nhật

### Core Files
- `script.js`: Thêm OCR processing functions
- `index.html`: Thêm OCR libraries
- `test-app.html`: Thêm OCR test functionality

### Demo Files
- `ocr-cv-demo.html`: Demo OCR hoàn chỉnh
- `test-ocr.html`: Test OCR đơn giản

## 🧪 Testing

### 1. Test OCR Functionality
```bash
# Mở file test
open test-ocr.html
# hoặc
open test-app.html
```

### 2. Test với file thực
- Upload PDF scan
- Upload hình ảnh CV
- Kiểm tra kết quả OCR

### 3. Debug OCR Issues
```javascript
// Check OCR progress
Tesseract.recognize(file, 'eng+vie', {
    logger: m => {
        console.log(`OCR Status: ${m.status}, Progress: ${m.progress}`);
    }
});
```

## ⚠️ Limitations

### OCR Accuracy
- **Quality Dependent**: Kết quả phụ thuộc vào chất lượng scan
- **Font Recognition**: Một số font đặc biệt có thể khó nhận dạng
- **Layout Complex**: Bố cục phức tạp có thể ảnh hưởng accuracy

### Performance
- **Processing Time**: OCR mất thời gian hơn text extraction
- **Memory Usage**: Xử lý PDF lớn có thể tốn nhiều memory
- **Browser Support**: Cần browser hiện đại

## 🔧 Troubleshooting

### Common Issues

#### 1. OCR không hoạt động
```javascript
// Check if libraries are loaded
if (typeof Tesseract === 'undefined') {
    console.error('Tesseract.js not loaded');
}
if (typeof pdfjsLib === 'undefined') {
    console.error('PDF.js not loaded');
}
```

#### 2. PDF processing lỗi
```javascript
// Check PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
```

#### 3. OCR accuracy thấp
- Tăng scale factor: `scale: 3.0` thay vì `2.0`
- Thử language khác: `'eng'` thay vì `'eng+vie'`
- Pre-process image: tăng contrast, remove noise

### Fallback Strategy
```javascript
// Nếu OCR fail, fallback về text extraction
if (typeof Tesseract !== 'undefined') {
    // Use OCR
    extractedText = await processPDFWithOCR(file);
} else {
    // Fallback to text extraction
    extractedText = await readFileAsText(file);
}
```

## 🎯 Best Practices

### 1. File Preparation
- **High Quality**: Scan với độ phân giải cao (300 DPI+)
- **Good Contrast**: Đảm bảo text rõ ràng
- **Clean Layout**: Tránh bố cục phức tạp

### 2. User Experience
- **Progress Indicator**: Hiển thị tiến trình xử lý
- **Error Handling**: Thông báo lỗi rõ ràng
- **Fallback Options**: Cung cấp alternatives

### 3. Performance
- **Page Limits**: Giới hạn số trang xử lý
- **Async Processing**: Không block UI
- **Memory Management**: Cleanup resources

## 📈 Future Improvements

### 1. Enhanced OCR
- **Multiple Engines**: Tích hợp nhiều OCR engines
- **Language Detection**: Auto-detect language
- **Layout Analysis**: Better table/form recognition

### 2. Cloud Integration
- **Google Vision API**: Higher accuracy
- **Azure Computer Vision**: Microsoft ecosystem
- **AWS Textract**: Enterprise solution

### 3. User Interface
- **Real-time Preview**: Show OCR results live
- **Manual Correction**: Allow user to fix OCR errors
- **Batch Processing**: Handle multiple files

---

## 🎉 Kết luận

OCR integration đã giải quyết vấn đề xử lý PDF scan và hình ảnh CV. Hệ thống hiện tại có thể:

✅ **Xử lý PDF scan** với OCR  
✅ **Hỗ trợ đa ngôn ngữ** (Anh + Việt)  
✅ **Fallback gracefully** khi OCR fail  
✅ **Real-time progress** tracking  
✅ **Enhanced AI analysis** với prompt tối ưu  

Với những cải tiến này, người dùng có thể upload CV ở bất kỳ định dạng nào và nhận được phân tích chính xác từ AI. 