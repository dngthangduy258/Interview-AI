# 🎯 Meta Recruiter Feedback Prompt - Microsoft Interview Pro

## 📋 Tổng quan

Đã cải thiện prompt chấm điểm để **đóng vai nhà tuyển dụng Meta (Facebook) chuyên nghiệp**, thay vì chỉ là language teacher. Prompt mới đánh giá toàn diện về cấu trúc, nội dung, và phù hợp văn hóa.

## ✨ Prompt mới: Meta Recruiter Style

### 🎯 **Prompt Structure:**

```javascript
const prompt = `
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
`;
```

## 📊 Tiêu chí đánh giá

### 1. **Quality Evaluation**
- **Cấu trúc câu trả lời** (STAR format, logical flow)
- **Độ sâu nội dung** (technical/behavioral depth)
- **Tính cụ thể** (specific examples, metrics)

### 2. **English Assessment**
- **Fluency** (độ lưu loát)
- **Vocabulary** (từ vựng)
- **Grammar** (ngữ pháp)

### 3. **Role Relevance**
- **Technical depth** (cho technical roles)
- **Behavioral skills** (cho management roles)
- **Cultural fit** (phù hợp văn hóa Meta)

### 4. **Communication Skills**
- **Confidence** (sự tự tin)
- **Clarity** (độ rõ ràng)
- **Structure** (cấu trúc)

## 🎯 Scoring System

### **Score Scale: 0-10**
- **0-2**: Poor
- **3-4**: Below Average  
- **5-6**: Average
- **7-8**: Good
- **9-10**: Excellent

### **Level Categories:**
- **Poor**: Vague, unstructured, off-topic
- **Below Average**: Some structure, lacks detail
- **Average**: Decent structure, moderate detail
- **Good**: Well-structured, good examples
- **Excellent**: STAR format, detailed, impactful

## 📝 Ví dụ Input/Output

### **Input:**
```json
{
  "question": "Tell me about a time you had to deal with a difficult team member.",
  "answer": "Yes. There was one time my teammate didn't deliver work and I got frustrated, so I finished the task myself.",
  "role": "Product Manager"
}
```

### **Output:**
```json
{
  "question": "Tell me about a time you had to deal with a difficult team member.",
  "answer": "Yes. There was one time my teammate didn't deliver work and I got frustrated, so I finished the task myself.",
  "score": 4.5,
  "level": "Below Average",
  "feedback": "The answer lacks structure and detail. It doesn't demonstrate leadership, conflict resolution, or communication. The candidate seemed passive and didn't show initiative to solve the interpersonal issue.",
  "tips": "Use the STAR method to structure your response. Explain the situation, your actions to address the problem (e.g., direct communication, offering support), and what you learned. Recruiters value collaboration, not just task completion."
}
```

## 🎨 HTML Feedback Display

### **Visual Feedback:**
```html
<div class="feedback-container bg-white border border-gray-200 rounded-lg p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">🎯 Meta Recruiter Feedback</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 mb-2">📊 Overall Score</h4>
            <p class="text-2xl font-bold text-green-600">7.5/10</p>
            <p class="text-sm text-green-600">(75%)</p>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">👍 Performance Level</h4>
            <p class="text-lg font-medium text-blue-800">Good</p>
        </div>
    </div>
    
    <div class="space-y-4">
        <div class="border-l-4 border-blue-500 pl-4">
            <h4 class="font-semibold text-gray-800 mb-2">💬 Recruiter Feedback</h4>
            <p class="text-sm text-gray-600">Detailed feedback here...</p>
        </div>
        
        <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-semibold text-gray-800 mb-2">💡 Improvement Tips</h4>
            <p class="text-sm text-gray-600">Specific tips here...</p>
        </div>
    </div>
</div>
```

## 🧪 Test Cases

### **Poor Answer:**
```javascript
{
  question: "Tell me about a time you had to deal with a difficult team member.",
  answer: "Yes. There was one time my teammate didn't deliver work and I got frustrated, so I finished the task myself.",
  expected: { score: 4.5, level: "Below Average" }
}
```

### **Good Answer:**
```javascript
{
  question: "Tell me about a time you had to deal with a difficult team member.",
  answer: "I had a teammate who was consistently missing deadlines. I scheduled a one-on-one meeting to understand their challenges. I offered to help with workload prioritization and set up regular check-ins. This improved our collaboration and project delivery.",
  expected: { score: 8.0, level: "Good" }
}
```

### **Excellent Answer:**
```javascript
{
  question: "Describe a challenging project you worked on.",
  answer: "I led a team of 5 developers to build a real-time chat application using React and Node.js. The main challenge was handling 10,000+ concurrent users. I implemented Redis caching and WebSocket optimization, reducing latency by 60%.",
  expected: { score: 9.0, level: "Excellent" }
}
```

## 🚀 Benefits

### ✅ **Professional Evaluation:**
- **Meta recruiter perspective**: Đánh giá như nhà tuyển dụng thực thụ
- **Role-specific feedback**: Phù hợp với từng vị trí cụ thể
- **Constructive criticism**: Feedback xây dựng, không chỉ trích

### ✅ **Structured Output:**
- **JSON format**: Dữ liệu có cấu trúc, dễ xử lý
- **Consistent scoring**: Hệ thống điểm nhất quán
- **Visual feedback**: Hiển thị đẹp với colors và icons

### ✅ **Comprehensive Assessment:**
- **Multiple criteria**: Đánh giá nhiều khía cạnh
- **STAR method focus**: Tập trung vào cấu trúc STAR
- **Cultural fit**: Phù hợp văn hóa Meta

## 📁 Files đã cập nhật

### **Core Files:**
- `script.js`: Cập nhật `generateFeedback()` với prompt mới, thêm `generateFeedbackHTML()`

### **Demo Files:**
- `feedback-prompt-test.html`: Demo test prompt chấm điểm mới

### **Documentation:**
- `META_FEEDBACK_PROMPT.md`: Hướng dẫn chi tiết

## 🎯 Kết quả

### **Trước đây:**
```
Prompt: "Evaluate this interview answer for a Microsoft position..."
Output: Generic HTML feedback
Focus: Language teacher perspective
```

### **Bây giờ:**
```
Prompt: "You're a senior recruiter at Meta (Facebook)..."
Output: Structured JSON with detailed feedback
Focus: Professional recruiter perspective
```

Với cải tiến này, hệ thống đã:

✅ **Professional evaluation** - Đánh giá như Meta recruiter thực thụ  
✅ **Structured feedback** - JSON format với scoring rõ ràng  
✅ **Role-specific assessment** - Phù hợp với từng vị trí  
✅ **Constructive tips** - Gợi ý cải thiện cụ thể  
✅ **Visual display** - Hiển thị feedback đẹp và dễ hiểu  

Bây giờ học viên sẽ nhận được feedback chuyên nghiệp như từ một nhà tuyển dụng Meta thực thụ! 🎉 