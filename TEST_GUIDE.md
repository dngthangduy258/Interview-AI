# 🧪 Hướng Dẫn Test Microsoft Interview Pro

## ✅ Trạng thái hiện tại

### 🖥️ Servers đang chạy:
- **Frontend**: `http://localhost:5555` (Live Server)
- **API**: `http://localhost:5556/api/openai` (server-simple.js)
- **Test Page**: `http://localhost:5555/test-app.html`

## 🚀 Cách test nhanh

### 1. Test tổng quan
Truy cập: `http://localhost:5555/test-app.html`
- ✅ Test API connection
- ✅ Test microphone
- ✅ Test CV upload
- ✅ Check server status

### 2. Test ứng dụng chính
Truy cập: `http://localhost:5555`
- ✅ Import CV (sử dụng `sample-cv.txt`)
- ✅ Test API button
- ✅ Bắt đầu luyện tập
- ✅ Test microphone recording

## 📋 Checklist test chi tiết

### 🔌 API Test
- [ ] Nhấn "Test API" trong ứng dụng chính
- [ ] Kiểm tra response từ Azure OpenAI
- [ ] Test API endpoint trực tiếp: `http://localhost:5556/api/openai`

### 📄 CV Upload Test
- [ ] Upload `sample-cv.txt` (hỗ trợ tốt nhất)
- [ ] Upload file PDF (hỗ trợ hạn chế)
- [ ] Upload file hình ảnh (không hỗ trợ)
- [ ] Kiểm tra AI phân tích CV

### 🎤 Microphone Test
- [ ] Nhấn "Bắt đầu ghi âm"
- [ ] Cho phép quyền microphone
- [ ] Nói câu trả lời
- [ ] Nhấn dừng ghi âm
- [ ] Kiểm tra AI feedback

### 💬 Interview Test
- [ ] Bắt đầu luyện tập
- [ ] Chọn vị trí (Software Engineer)
- [ ] Trả lời câu hỏi
- [ ] Nhận feedback từ AI
- [ ] Chuyển câu hỏi tiếp theo

## 🔧 Troubleshooting

### Lỗi API 405 (Method Not Allowed)
**Nguyên nhân**: Live Server không hỗ trợ API routes
**Giải pháp**: 
1. Đảm bảo server-simple.js đang chạy trên port 5556
2. Sử dụng script đã sửa trong script.js

### Lỗi PDF/Image processing
**Nguyên nhân**: Azure OpenAI không hỗ trợ image_url
**Giải pháp**: 
1. Sử dụng file text (.txt) thay vì PDF
2. Chuyển đổi PDF sang text
3. Copy-paste nội dung CV

### Lỗi Microphone
**Nguyên nhân**: Không có HTTPS hoặc quyền
**Giải pháp**:
1. Sử dụng `localhost` thay vì `127.0.0.1`
2. Cho phép quyền microphone
3. Sử dụng HTTPS server nếu cần

## 📊 Kết quả mong đợi

### ✅ API Working
```
Response: 200 OK
Content: AI feedback in Vietnamese
```

### ✅ CV Analysis
```
- Basic Info: Tên, tuổi, vị trí
- Experience: Kinh nghiệm làm việc
- Skills: Kỹ năng chính
- Recommended Position: Vị trí phù hợp
```

### ✅ Microphone Recording
```
- Permission granted
- Audio stream obtained
- Recording starts/stops
- AI processes audio
```

### ✅ Interview Feedback
```
- Score: 0-100
- Strengths: 3-4 điểm
- Improvements: 2-3 điểm
- Suggestions: Hướng dẫn cụ thể
```

## 🆘 Nếu gặp vấn đề

### 1. Kiểm tra servers
```bash
# Kiểm tra port 5556 (API)
netstat -an | findstr :5556

# Kiểm tra port 5555 (Frontend)
netstat -an | findstr :5555
```

### 2. Restart servers
```bash
# Terminal 1: API Server
npm run start-simple

# Terminal 2: Frontend Server
npm run dev
```

### 3. Test API trực tiếp
```powershell
Invoke-WebRequest -Uri "http://localhost:5556/api/openai" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"prompt":"Test"}'
```

### 4. Check environment variables
- Đảm bảo file `.env` có Azure OpenAI config
- Hoặc sử dụng mock response (đã có sẵn)

## 📝 Ghi chú

- **File hỗ trợ tốt nhất**: `.txt`, `.doc`, `.docx`
- **File hỗ trợ hạn chế**: `.pdf`
- **File không hỗ trợ**: Hình ảnh
- **Microphone**: Hoạt động tốt trên localhost
- **API**: Sử dụng mock response nếu không có Azure OpenAI

---

**Lưu ý**: Ứng dụng đã được sửa để xử lý các lỗi phổ biến và cung cấp fallback options cho người dùng. 