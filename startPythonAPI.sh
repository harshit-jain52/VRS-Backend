# Description: This script is used to start the python API for the movie recommendation system.

python3 -m venv pyenv
source pyenv/bin/activate
pip install -r pymodules.txt
python3 movieRec.py