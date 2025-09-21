@echo off
setlocal
REM Quick start script for Cardano AI Agent
IF /I NOT "%CARDANO_NETWORK%"=="Preprod" set CARDANO_NETWORK=Preprod
IF "%AGENT_PRESET_MODE%"=="" for /f "tokens=*" %%A in ('findstr /R /C:"^AGENT_PRESET_MODE=" .env 2^>nul') do set %%A
IF NOT "%AGENT_PRESET_RESPONSE%"=="" (
	echo Using preset response from environment.
) ELSE (
	for /f "tokens=*" %%A in ('findstr /R /C:"^AGENT_PRESET_RESPONSE=" .env 2^>nul') do set %%A
	IF "%AGENT_PRESET_RESPONSE%"=="" set AGENT_PRESET_RESPONSE=Preset response: Cardano Agent operational.
)
IF NOT EXIST node_modules (echo Installing dependencies... & pnpm install || goto :error)
IF NOT EXIST dist (echo Building... & pnpm run build || goto :error)
IF NOT EXIST .env (echo WARNING: .env not found. Copy .env.example to .env and fill keys.)
ECHO CARDANO_NETWORK=%CARDANO_NETWORK%
ECHO Preset Mode: %AGENT_PRESET_MODE%
ECHO Preset: %AGENT_PRESET_RESPONSE%
ECHO Starting agent...
AGENT_PRESET_RESPONSE="%AGENT_PRESET_RESPONSE%" pnpm start
exit /b 0
:error
ECHO Failed. Check above logs.
exit /b 1
