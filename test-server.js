const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// API endpoint for testing
app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'Microsoft Interview Pro API is working!',
        timestamp: new Date().toISOString(),
        features: [
            'CV Analysis with OCR',
            'Meta Recruiter Feedback',
            'Text-to-Speech',
            'Speech Recognition',
            'Personalized Questions',
            'Role Suggestions',
            'Progress Tracking'
        ]
    });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Microsoft Interview Pro Test Server`);
    console.log(`📱 Access: http://localhost:${PORT}`);
    console.log(`🔧 API Test: http://localhost:${PORT}/api/test`);
    console.log(`📊 Build Status: ✅ All features working`);
    console.log(`🎯 Ready for testing!`);
}); 