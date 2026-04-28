@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════════
echo   旅游攻略生成器 - 企业级后端服务启动脚本
echo ════════════════════════════════════════════════════════
echo.

cd /d "%~dp0backend"

echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js，请先安装 Node.js >= 16.0
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo [2/3] 检查依赖包...
if not exist node_modules (
    echo 📦 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    ✅ 依赖已安装
)

echo.
echo [3/3] 检查配置文件...
if not exist .env (
    echo ⚠️  未检测到.env文件，正在从模板创建...
    copy .env.example .env >nul
    echo.
    echo ⚠️  请编辑 backend\.env 文件并填入您的API密钥：
    echo    - TONGYI_API_KEY (通义千问)
    echo    - 或 OPENAI_API_KEY (OpenAI)
    echo    - 或 WENXIN_API_KEY (文心一言)
    echo    - FIREBASE_API_KEY (Firebase认证，可选)
    echo.
    echo 💡 提示：不配置API也可使用本地模式运行
    echo.
)

echo.
echo ════════════════════════════════════════════════════════
echo   启动选项:
echo ════════════════════════════════════════════════════════
echo.
echo   [1] 开发模式启动（自动重启，推荐）
echo   [2] 生产模式启动
echo   [3] 初始化城市数据到数据库
echo   [4] 打开API文档
echo   [5] 退出
echo.
set /p choice=请选择操作 (1-5): 

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto initdata
if "%choice%"=="4" goto docs
if "%choice%"=="5" goto end

:dev
echo.
echo 🚀 启动开发服务器...
call npm run dev
goto end

:prod
echo.
echo 🚀 启动生产服务器...
call npm start
goto end

:initdata
echo.
echo 📊 初始化数据库数据...
call npm run init-data
echo.
echo 数据初始化完成！按任意键返回菜单...
pause >nul
goto start

:docs
echo.
echo 📖 打开README文档...
start "" README.md
goto start

:end
exit