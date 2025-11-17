@echo off
echo Démarrage de l'application Bibliothèque...

echo [1/3] MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="%USERPROFILE%\mongodb-data"
timeout /t 5

echo [2/3] Backend...
cd backend
start "Backend" cmd /k "npm run dev"
timeout /t 3

echo [3/3] Frontend...
cd ..
start "Frontend" cmd /k "npm run dev"

echo ✅ Terminé! Ouvrez: http://localhost:5173
echo.
pause