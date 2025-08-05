@echo off
echo Starting Microsoft Interview Pro Development Servers...
echo.

echo Starting API Server (server-simple.js) on port 5556...
start "API Server" cmd /k "npm run start-simple"

echo Waiting 3 seconds for API server to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Live Server) on port 5555...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Frontend: http://localhost:5555
echo API: http://localhost:5556/api/openai
echo.
echo Press any key to close this window...
pause > nul 