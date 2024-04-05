@echo off
REM Description: This script is used to start the python API for the movie recommendation system.

python -m venv pyenv
pyenv\Scripts\activate
pip install -r pymodules.txt
python movieRec.py

REM Optional: Pause the script execution so the command prompt window doesn't close immediately after execution
pause
