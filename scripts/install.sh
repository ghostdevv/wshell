echo "Building..."
pnpm bundle &>/dev/null

echo "Updating permissions..."
sudo chmod +x wshell

echo "Copying files..."
sudo cp wshell /usr/local/bin/wshell

echo "Adding systemd files..."
cp systemd/wshell.service $HOME/.config/systemd/user/wshell.service
systemctl --user daemon-reload
systemctl --user enable --now wshell.service
