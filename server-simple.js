const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5556;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 InterviewPro Server running on http://localhost:${PORT}`);
    console.log(`📱 Try accessing: http://localhost:${PORT}`);
    console.log(`⚠️  Note: Microphone may not work on HTTP`);
    console.log(`💡 For microphone access, try:`);
    console.log(`   1. Use Live Server: npm run dev`);
    console.log(`   2. Access: http://localhost:8000`);
    console.log(`   3. Or deploy to hosting for HTTPS`);
}); 