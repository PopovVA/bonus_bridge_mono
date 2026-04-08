# shellcheck shell=sh
# Load nvm and activate Node from repo root `.nvmrc` (call after `cd` to repo root).
if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
  nvm use
fi
