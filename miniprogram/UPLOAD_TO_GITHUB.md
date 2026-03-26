# 上传到 GitHub 指南

## 方式一：使用 HTTPS（推荐新手）

### 1. 创建 GitHub 仓库

访问 https://github.com/new 创建新仓库：
- Repository name: `frame-jump-effect` 或 `跃出相框`
- Description: 微信小程序 - 照片跃出相框 3D 效果
- 选择 Public 或 Private
- **不要**勾选 "Initialize with README"（我们已经有了）

### 2. 关联远程仓库并推送

```bash
cd /root/.openclaw/workspace-dev/miniprogram

# 替换为你的 GitHub 用户名和仓库名
git remote add origin https://github.com/YOUR_USERNAME/frame-jump-effect.git

# 推送到 GitHub
git push -u origin master
```

### 3. 输入凭证

- Username: 你的 GitHub 用户名
- Password: 你的 GitHub Personal Access Token（不是登录密码）

**获取 Token:**
1. 访问 https://github.com/settings/tokens
2. Generate new token (classic)
3. 勾选 `repo` 权限
4. 生成后复制 token（只显示一次）

---

## 方式二：使用 SSH（推荐常用用户）

### 1. 生成 SSH Key（如果没有）

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 一路回车即可
```

### 2. 添加 SSH Key 到 GitHub

```bash
# 查看并复制公钥
cat ~/.ssh/id_ed25519.pub
```

访问 https://github.com/settings/keys
- 点击 "New SSH key"
- 粘贴公钥内容
- 保存

### 3. 创建仓库并推送

```bash
cd /root/.openclaw/workspace-dev/miniprogram

# 替换为你的 GitHub 用户名
git remote add origin git@github.com:YOUR_USERNAME/frame-jump-effect.git

# 推送
git push -u origin master
```

---

## 方式三：使用 GitHub CLI（最方便）

### 1. 安装 gh（如果未安装）

```bash
# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# macOS
brew install gh
```

### 2. 登录 GitHub

```bash
gh auth login
# 按提示操作
```

### 3. 创建仓库并推送

```bash
cd /root/.openclaw/workspace-dev/miniprogram

# 创建仓库并推送
gh repo create frame-jump-effect --public --source=. --remote=origin --push
```

---

## 验证上传

推送成功后：

1. 访问你的 GitHub 仓库页面
2. 确认所有文件都已上传
3. 检查 README.md 是否正常显示

---

## 后续更新

代码修改后，提交并推送：

```bash
cd /root/.openclaw/workspace-dev/miniprogram

# 提交更改
git add -A
git commit -m "描述你的更改"

# 推送到 GitHub
git push
```

---

## 邀请协作者（可选）

1. 进入仓库 Settings
2. Collaborators and teams
3. Add people
4. 输入对方 GitHub 用户名

---

## 启用 Issues（可选）

1. 进入仓库 Settings
2. Features
3. 勾选 Issues
4. 设置 Issue 模板

---

## 添加开源许可证（推荐）

```bash
cd /root/.openclaw/workspace-dev/miniprogram

# 添加 MIT 许可证
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 OpenClaw Developer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "docs: add MIT license"
git push
```
