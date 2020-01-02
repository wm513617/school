#!/bin/bash

# 卸载之前可能安装的 node.js 
sudo rpm -e --nodeps nodejs-8.2.1-1nodesource.el7.centos.x86_64.rpm;
sudo rpm -e --nodeps nsolid-dubnium-3.4.4-nodesource_systemd1.x86_64.rpm;
sudo rpm -e --nodeps nsolid-console-3.4.4-nodesource_systemd1.x86_64.rpm;

# 删除软链接
sudo rm -rf /usr/local/bin/node;
sudo rm -rf /usr/local/bin/npm;

# 设定安装路径
basepath="/usr/local/lib/nodejs"

# 解压 node.js 安装包
# 创建软链接，使 node / npm 命令全局可用
sudo mkdir -p $basepath && sudo tar -xvJf ./node-v10.15.3-linux-x64.tar.xz -C $basepath && sudo ln -s $basepath/node-v10.15.3-linux-x64/bin/node /usr/local/bin/node && sudo ln -s $basepath/node-v10.15.3-linux-x64/bin/npm /usr/local/bin/npm