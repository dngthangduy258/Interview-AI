# 🚀 Prompt Upgrade - Microsoft Interview Questions

## 📋 Tổng quan

Prompt đã được nâng cấp để tạo câu hỏi phỏng vấn Microsoft **chuyên nghiệp hơn** với hỗ trợ **song ngữ Anh-Việt** và **cá nhân hóa theo CV**.

## ✨ Tính năng mới

### 🎯 Professional Microsoft Style
- **Behavioral questions** với STAR format
- **Technical questions** liên quan đến skills thực tế
- **System design** cho từng vai trò cụ thể
- **Culture fit** theo Microsoft leadership principles
- **Career growth** và motivation questions

### 🌐 Bilingual Support
- **English questions** làm primary
- **Vietnamese translation** cho mỗi câu hỏi
- **Language switching** real-time
- **Fallback handling** khi translation không có

### 📊 CV Personalization
- **Role-specific** questions theo position
- **Skill-based** technical questions
- **Experience-focused** behavioral questions
- **Education-aware** background questions

## 🔄 Prompt Comparison

### ❌ Prompt cũ:
```javascript
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
```

### ✅ Prompt mới:
```javascript
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

Make sure:
- Each question is clearly written and relevant to the candidate's background
- Questions are realistic and could be used in a Microsoft interview
- Translate each question to Vietnamese (field: vi)
- Focus on the specific role and skills mentioned in the CV
- Include both technical and behavioral questions appropriate for the position

Return **only the JSON**, no explanation or notes.
`;
```

## 📊 Response Format

### ❌ Format cũ:
```json
[
  "Tell me about yourself and your background.",
  "Why do you want to work at Microsoft?",
  "Describe a challenging project you worked on."
]
```

### ✅ Format mới:
```json
{
  "language": "en",
  "questions": [
    {
      "en": "Tell me about a time you had to resolve a conflict within your team.",
      "vi": "Hãy kể về một lần bạn phải giải quyết mâu thuẫn trong nhóm."
    },
    {
      "en": "How would you design a scalable notification system for Microsoft Teams?",
      "vi": "Bạn sẽ thiết kế một hệ thống thông báo có thể mở rộng cho Microsoft Teams như thế nào?"
    },
    {
      "en": "Describe a situation where you had to learn a new technology quickly.",
      "vi": "Mô tả một tình huống bạn phải học công nghệ mới nhanh chóng."
    }
  ]
}
```

## 🛠️ Technical Implementation

### 1. Response Processing
```javascript
// Parse JSON from response
const jsonMatch = response.match(/\{[\s\S]*\}/);
if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    
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
                return q.en || q.vi || 'Question not available';
            }
        });
    }
    
    return questions;
}
```

### 2. Language Switching
```javascript
function switchLanguage() {
    currentLanguage = document.getElementById('languageSelect').value;
    displayQuestions();
}

function displayQuestions() {
    const language = document.getElementById('languageSelect').value;
    
    currentQuestions.forEach((q, index) => {
        const questionText = language === 'vi' ? (q.vi || q.en) : (q.en || q.vi);
        // Display question in selected language
    });
}
```

### 3. Personalization Enhancement
```javascript
function personalizeQuestion(question, cvData) {
    if (question.includes("Tell me about yourself") || question.includes("Hãy kể về bản thân")) {
        return currentLanguage === 'vi' 
            ? `Hãy kể về bản thân và kinh nghiệm của bạn trong lĩnh vực ${cvData.recommendedPosition}.`
            : `Tell me about yourself and your background in ${cvData.recommendedPosition}.`;
    }
    // ... more personalization logic
    return question;
}
```

## 📁 Files đã cập nhật

### Core Files
- `script.js`: Cập nhật prompt và response processing
- `prompt-test.html`: Demo test prompt mới

### Demo Files
- `prompt-test.html`: Test prompt với UI đẹp

## 🧪 Testing

### 1. Test Prompt Demo
```bash
# Mở file test prompt
open prompt-test.html
```

### 2. Test trong App chính
```bash
# Mở app chính
open index.html
# Upload CV và test câu hỏi mới
```

### 3. Test Language Switching
```bash
# Trong prompt-test.html
# Thay đổi language dropdown
# Kiểm tra câu hỏi chuyển đổi
```

## 🎯 Question Categories

### 1. Behavioral Questions (STAR Format)
- **Situation**: Mô tả tình huống cụ thể
- **Task**: Nhiệm vụ cần thực hiện
- **Action**: Hành động đã thực hiện
- **Result**: Kết quả đạt được

### 2. Technical Questions
- **Role-specific**: Theo position (Software Engineer, Data Scientist...)
- **Skill-based**: Dựa trên skills trong CV
- **System design**: Thiết kế hệ thống
- **Problem-solving**: Giải quyết vấn đề kỹ thuật

### 3. Culture Fit Questions
- **Microsoft values**: Leadership principles
- **Team collaboration**: Làm việc nhóm
- **Growth mindset**: Phát triển bản thân
- **Innovation**: Sáng tạo và đổi mới

### 4. Career Questions
- **Motivation**: Động lực làm việc tại Microsoft
- **Goals**: Mục tiêu nghề nghiệp
- **Learning**: Khả năng học hỏi
- **Adaptation**: Thích ứng với thay đổi

## 📈 Benefits

### ✅ So với prompt cũ:

| Tính năng                    | Cũ | Mới |
| ---------------------------- | -- | -- |
| Microsoft interview style    | ❌ | ✅ |
| Bilingual support           | ❌ | ✅ |
| Role-specific questions     | ⚠️ | ✅ |
| STAR format behavioral      | ❌ | ✅ |
| System design questions     | ❌ | ✅ |
| Culture fit focus           | ⚠️ | ✅ |
| Professional tone           | ⚠️ | ✅ |
| Structured response format  | ❌ | ✅ |

### 🎯 Quality Improvements:

1. **More Realistic**: Câu hỏi giống thật hơn với Microsoft
2. **Better Personalization**: Cá nhân hóa theo role và skills
3. **Bilingual Support**: Hỗ trợ tiếng Anh và tiếng Việt
4. **Professional Format**: JSON structure chuẩn
5. **Comprehensive Coverage**: Đầy đủ các loại câu hỏi

## 🔧 Troubleshooting

### Common Issues

#### 1. Response format không đúng
```javascript
// Check response structure
if (data.questions && Array.isArray(data.questions)) {
    // Process questions
} else {
    // Fallback to default questions
    return microsoftQuestions;
}
```

#### 2. Translation missing
```javascript
// Fallback logic
const questionText = language === 'vi' ? (q.vi || q.en) : (q.en || q.vi);
```

#### 3. Language switching không hoạt động
```javascript
// Ensure currentLanguage is updated
function switchLanguage() {
    currentLanguage = document.getElementById('languageSelect').value;
    displayQuestions();
}
```

## 🚀 Future Enhancements

### 1. Advanced Personalization
- **Project-specific**: Câu hỏi dựa trên dự án cụ thể
- **Company-specific**: Câu hỏi theo công ty trước đó
- **Industry-specific**: Câu hỏi theo ngành nghề

### 2. Enhanced Translation
- **Quality check**: Kiểm tra chất lượng dịch
- **Context-aware**: Dịch theo ngữ cảnh
- **Technical terms**: Thuật ngữ kỹ thuật chính xác

### 3. Question Categories
- **Difficulty levels**: Câu hỏi theo độ khó
- **Time estimates**: Thời gian trả lời dự kiến
- **Scoring criteria**: Tiêu chí đánh giá

---

## 🎉 Kết luận

Prompt upgrade đã tạo ra câu hỏi phỏng vấn Microsoft **chuyên nghiệp hơn** với:

✅ **Microsoft interview style** - Bám sát phong cách thực tế  
✅ **Bilingual support** - Hỗ trợ Anh-Việt  
✅ **Role-specific questions** - Cá nhân hóa theo position  
✅ **STAR format** - Behavioral questions chuẩn  
✅ **System design** - Technical questions nâng cao  
✅ **Culture fit** - Microsoft leadership principles  
✅ **Professional tone** - Giọng điệu chuyên nghiệp  

Với những cải tiến này, hệ thống có thể tạo ra câu hỏi phỏng vấn Microsoft chất lượng cao và phù hợp với từng ứng viên! 🚀 