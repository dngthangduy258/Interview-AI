# 🚀 Hướng Dẫn Nhanh - Microsoft Interview Pro

## ✅ Cách chạy ứng dụng đúng

### 🔧 Phương pháp 1: Server với API Support (Khuyến nghị)

```bash
# Terminal 1: Chạy server với API
npm run start-simple

# Terminal 2: Chạy Live Server cho frontend
npm run dev
```

**Truy cập ứng dụng:**
- Frontend: `http://localhost:5555`
- API: `http://localhost:5556/api/openai`

### 🔧 Phương pháp 2: HTTPS Server (Cho microphone)

```bash
# Cài đặt SSL certificates
npm run setup

# Chạy HTTPS server
npm start
```

**Truy cập:** `https://localhost:5557`

### 🔧 Phương pháp 3: Chỉ Live Server (Không có API)

```bash
npm run dev
```

**Truy cập:** `http://localhost:5555`

**Lưu ý:** Phương pháp này sẽ không có AI feedback vì Live Server không hỗ trợ API routes.

## 🎤 Test Microphone:

### Bước 1: Mở ứng dụng
- Mở trình duyệt
- Truy cập: `http://localhost:5555` (Live Server) hoặc `https://localhost:5557` (HTTPS)
- **Lưu ý**: Sử dụng `localhost` thay vì `127.0.0.1`

### Bước 2: Test API
- Nhấn nút "Test API" để kiểm tra kết nối Azure OpenAI
- Đảm bảo server-simple.js đang chạy trên port 5556

### Bước 3: Bắt đầu luyện tập
- Nhấn "Bắt đầu luyện tập"
- Import CV để có câu hỏi cá nhân hóa
- Chọn loại phỏng vấn (Microsoft)
- Nhấn "Bắt đầu ghi âm"

### Bước 4: Cấp quyền microphone
- Khi trình duyệt hỏi, chọn "Cho phép" hoặc "Allow"
- Nếu không thấy popup, nhấp vào biểu tượng microphone trong thanh địa chỉ

### Bước 5: Test ghi âm
- Nhấn nút microphone để bắt đầu ghi âm
- Nói câu trả lời
- Nhấn dừng để kết thúc
- Xem feedback từ AI

## 🔍 Nếu gặp vấn đề:

### Lỗi API 405 (Method Not Allowed)
- **Nguyên nhân**: Live Server không hỗ trợ API routes
- **Giải pháp**: Sử dụng phương pháp 1 (server-simple.js + Live Server)

### Lỗi microphone "Requested device not found"
- **Nguyên nhân**: Không có HTTPS hoặc localhost đặc biệt
- **Giải pháp**: Sử dụng HTTPS server hoặc deploy

### Lỗi "Permission denied"
- **Nguyên nhân**: Chưa cấp quyền microphone
- **Giải pháp**: Nhấp vào biểu tượng microphone trong thanh địa chỉ và chọn "Cho phép"

## 📱 Test trên điện thoại:

### Cách 1: Cùng mạng WiFi
1. Tìm IP máy tính: `ipconfig` (Windows)
2. Trên điện thoại: `http://[IP_MÁY_TÍNH]:5555`
3. Ví dụ: `http://192.168.1.100:5555`

### Cách 2: Deploy lên hosting
- Sử dụng Vercel, Netlify, hoặc GitHub Pages
- Tự động có HTTPS
- Microphone hoạt động tốt hơn

## ✅ Kết quả mong đợi:

- ✅ API hoạt động và có thể test
- ✅ Microphone hoạt động
- ✅ Có thể ghi âm
- ✅ AI phân tích và đưa feedback
- ✅ Trải nghiệm luyện tập phỏng vấn hoàn chỉnh

## 🆘 Nếu vẫn gặp vấn đề:

1. **Kiểm tra server**: Đảm bảo cả Live Server và server-simple.js đang chạy
2. **Kiểm tra API**: Nhấn "Test API" để kiểm tra kết nối
3. **Deploy lên hosting**: Vercel, Netlify để test
4. **Thử trình duyệt khác**: Chrome, Firefox, Edge
5. **Xem chi tiết**: `MICROPHONE_SETUP.md`

---

**Lưu ý**: Để có trải nghiệm tốt nhất, sử dụng phương pháp 1 (server-simple.js + Live Server) hoặc deploy lên hosting. 