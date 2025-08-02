@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo RideShare Appium Test Setup - Windows
echo ==========================================

:: Colors for output
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:: Check Node.js
call :print_status "Checking Node.js installation..."
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Node.js is not installed. Please install Node.js v18 or higher."
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_success "Node.js is installed: !NODE_VERSION!"
)

:: Check npm
call :print_status "Checking npm installation..."
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "npm is not installed. Please install npm."
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_success "npm is installed: !NPM_VERSION!"
)

:: Check Appium
call :print_status "Checking Appium installation..."
appium --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "Appium is not installed. Installing Appium..."
    npm install -g appium
    if %errorlevel% neq 0 (
        call :print_error "Failed to install Appium. Please check your internet connection."
        pause
        exit /b 1
    )
    call :print_success "Appium installed successfully"
) else (
    for /f "tokens=*" %%i in ('appium --version') do set APPIUM_VERSION=%%i
    call :print_success "Appium is installed: !APPIUM_VERSION!"
)

:: Install Appium drivers
call :print_status "Installing Appium drivers..."
call :print_status "Installing UiAutomator2 driver..."
appium driver install uiautomator2
if %errorlevel% neq 0 (
    call :print_warning "Failed to install UiAutomator2 driver. You may need to install it manually."
)

call :print_success "Appium drivers installation completed"

:: Install project dependencies
call :print_status "Installing project dependencies..."
npm install
if %errorlevel% neq 0 (
    call :print_error "Failed to install project dependencies."
    pause
    exit /b 1
)
call :print_success "Project dependencies installed successfully"

:: Create environment file
call :print_status "Setting up environment configuration..."
if not exist .env (
    if exist env.example (
        copy env.example .env >nul
        call :print_success "Created .env file from template"
        call :print_warning "Please update .env file with your device configuration"
    ) else (
        call :print_warning "env.example not found. Please create .env file manually"
    )
) else (
    call :print_success ".env file already exists"
)

:: Check Android setup
call :print_status "Checking Android setup..."
where adb >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "ADB not found. Please install Android SDK and add it to PATH"
    call :print_warning "Make sure ANDROID_HOME is set in environment variables"
) else (
    call :print_success "ADB is available"
    
    :: Check for connected devices
    adb devices | findstr /v "List of devices" | findstr /v "^$" >nul
    if %errorlevel% equ 0 (
        call :print_success "Found connected Android device(s)"
        adb devices
    ) else (
        call :print_warning "No Android devices connected. Please connect a device or start an emulator"
    )
)

:: Create screenshots directory
call :print_status "Creating screenshots directory..."
if not exist screenshots mkdir screenshots
call :print_success "Screenshots directory created"

:: Build Android app
call :print_status "Building Android app..."
if exist "..\android" (
    cd ..\android
    if exist gradlew.bat (
        call :print_status "Building debug APK..."
        call gradlew.bat assembleDebug
        if %errorlevel% equ 0 (
            call :print_success "Android app built successfully"
        ) else (
            call :print_warning "Failed to build Android app. Please check your Android setup"
        )
    ) else (
        call :print_warning "Gradle wrapper not found. Please run 'gradle wrapper' in android directory"
    )
    cd ..\appium-tests
) else (
    call :print_warning "Android directory not found. Please build the app manually"
)

echo ==========================================
call :print_success "Setup completed successfully!"
echo ==========================================
echo.
echo Next steps:
echo 1. Update .env file with your device configuration
echo 2. Connect your device or start an emulator
echo 3. Start Appium server: appium
echo 4. Run tests: npm test
echo.
echo For more information, see README.md
echo.
pause 