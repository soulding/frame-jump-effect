#!/bin/bash

# GitHub 上传脚本
# 使用方法：./push-to-github.sh YOUR_USERNAME REPOSITORY_NAME

set -e

USERNAME=$1
REPO=$2

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
    echo "用法：$0 <GitHub 用户名> <仓库名>"
    echo "示例：$0 yourname frame-jump-effect"
    exit 1
fi

echo "📦 准备上传到 GitHub..."
echo "用户名：$USERNAME"
echo "仓库名：$REPO"
echo ""

# 检查是否已存在 remote
if git remote -v | grep -q origin; then
    echo "⚠️  检测到已存在的 remote origin"
    read -p "是否覆盖？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
    else
        exit 1
    fi
fi

# 添加 remote
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/$USERNAME/$REPO.git

# 推送
echo "🚀 推送到 GitHub..."
echo "提示：首次推送需要输入 GitHub 用户名和 Personal Access Token"
echo ""

git push -u origin master

echo ""
echo "✅ 上传成功！"
echo "📱 访问：https://github.com/$USERNAME/$REPO"
