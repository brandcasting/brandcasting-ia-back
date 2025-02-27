cd /home/ubuntu/app
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
if ! command -v pm2 &> /dev/null; then
  echo "pm2 no está instalado, instalándolo..."
  sudo npm install -g pm2
fi
rm -rf node_modules
npm install
pm2 restart all || pm2 start dist/main.js --name nest-app