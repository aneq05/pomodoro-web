@echo off
setlocal

rem Go to project folder
cd /d "C:\Users\ankap\projekty\my-project"

rem Install dependencies if missing
if not exist node_modules (
  echo Installing dependencies...
  npm install
)

rem Start dev server
echo Starting focus app...
start "" http://localhost:5173
npm run dev

endlocal
