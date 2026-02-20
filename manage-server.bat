@echo off
echo Portfolio Server Management
echo ===========================
echo.
echo 1. Start Server
echo 2. Stop Server  
echo 3. Restart Server
echo 4. View Logs
echo 5. View Status
echo 6. Exit
echo.
set /p choice="Choose option (1-6): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto exit

:start
echo Starting server...
cd /d "C:\integ\server"
pm2 start server.js --name "portfolio-server"
echo Server started!
pause
goto menu

:stop
echo Stopping server...
pm2 stop portfolio-server
echo Server stopped!
pause
goto menu

:restart
echo Restarting server...
pm2 restart portfolio-server
echo Server restarted!
pause
goto menu

:logs
echo Viewing logs...
pm2 logs portfolio-server
pause
goto menu

:status
echo Server status:
pm2 list
pause
goto menu

:exit
echo Goodbye!
exit /b

:menu
cls
goto start