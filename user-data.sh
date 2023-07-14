#!/bin/bash -ex
# output user data logs into a separate file for debugging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
# download nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# source nvm
. /.nvm/nvm.sh
# install node
nvm install --lts
nvm use --lts
#export NVM dir
export NVM_DIR="/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 


#upgrade yum
sudo yum upgrade
#install git
sudo yum install git -y
# set credentials
# git config --global user.name "tars003"
# git config --global user.email "sharmaajay2kuu@gmail.com"

cd /home/ec2-user
# get source code from githubt
git clone https://github.com/tars003/bio-digester-server
#get in project dir
cd bio-digester-server
#give permission
sudo chmod -R 755 .
#install node module
npm install
#export env variables
export PORT='5000'
export DB_URL='mongodb+srv://ajay:ajay@cluster0.9ljycxo.mongodb.net/v4?retryWrites=true&w=majority'
# start the app
node server.js > server.out.log 2> server.err.log < /dev/null &