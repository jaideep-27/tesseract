@echo off
setlocal
cd /d %~dp0\masumi-services-dev-quickstart || (echo Repo folder missing & exit /b 1)
IF NOT EXIST .env (
  echo Creating .env from example...
  copy /Y .env.example .env >nul
  echo NOTE: Edit masumi-services-dev-quickstart\.env and fill required keys before first full use.
)
where docker >nul 2>&1 || (echo Docker not found in PATH. Install Docker Desktop and retry.& exit /b 1)
ECHO Starting Masumi services...
docker compose up -d || (echo docker compose failed & exit /b 1)
echo Done. Health endpoints:
echo  http://localhost:3000/api/v1/health
cecho  http://localhost:3001/api/v1/health
exit /b 0
