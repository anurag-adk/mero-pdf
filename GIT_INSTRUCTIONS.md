# Git & GitHub Instructions

A quick guide for working with Git and GitHub on the **mero_pdf** project.

---

## 🔧 Initial Setup (One-time)

### Configure Git Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Clone the Repository

```bash
git clone <repository-url>
cd mero_pdf
```

---

## 🌿 Working with Branches

### View All Branches

```bash
# List local branches
git branch

# List all branches (including remote)
git branch -a
```

### Create a New Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or using the newer syntax
git switch -c feature/your-feature-name
```

### Switch Between Branches

```bash
# Switch to an existing branch
git checkout branch-name

# Or using the newer syntax
git switch branch-name

# Switch back to main branch
git checkout main
```

### Delete a Branch

```bash
# Delete a local branch (after merging)
git branch -d branch-name

# Force delete a local branch
git branch -D branch-name

# Delete a remote branch
git push origin --delete branch-name
```

---

## 📝 Making Changes

### Check Status

```bash
git status
```

### Stage Changes

```bash
# Stage a specific file
git add filename.py

# Stage all changes
git add .

# Stage all changes in a specific folder
git add backend/
```

### Commit Changes

```bash
# Commit with a message
git commit -m "Your descriptive commit message"

# Stage and commit in one command
git commit -am "Your message"
```

### View Commit History

```bash
# View commit log
git log

# View compact log
git log --oneline

# View log with graph
git log --oneline --graph --all
```

---

## 🚀 Pushing Changes

### Push to Remote

```bash
# Push current branch to remote
git push origin your-branch-name

# Push and set upstream (first time pushing a new branch)
git push -u origin your-branch-name

# After setting upstream, you can simply use
git push
```

### Pull Latest Changes

```bash
# Pull changes from remote
git pull origin main

# Pull changes for current branch
git pull
```

---

## 🔄 Complete Workflow Example

Here's a typical workflow for working on a new feature:

### Step 1: Update Main Branch

```bash
git checkout main
git pull origin main
```

### Step 2: Create Feature Branch

```bash
git checkout -b feature/add-pdf-parser
```

### Step 3: Make Your Changes

Edit your files, then check what changed:

```bash
git status
git diff
```

### Step 4: Stage and Commit

```bash
git add .
git commit -m "Add PDF parser functionality"
```

### Step 5: Push to Remote

```bash
git push -u origin feature/add-pdf-parser
```

### Step 6: Create Pull Request on GitHub

1. Go to the repository on GitHub
2. Click **"Compare & pull request"** button
3. Add a title and description
4. Select reviewers (if applicable)
5. Click **"Create pull request"**

### Step 7: After PR is Merged

```bash
# Switch back to main
git checkout main

# Pull the latest changes
git pull origin main

# Delete your local feature branch
git branch -d feature/add-pdf-parser
```

---

## 🏷️ Branch Naming Conventions

Use descriptive branch names with prefixes:

| Prefix | Usage | Example |
|--------|-------|---------|
| `feature/` | New features | `feature/pdf-upload` |
| `bugfix/` | Bug fixes | `bugfix/fix-parsing-error` |
| `hotfix/` | Urgent fixes | `hotfix/security-patch` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/cleanup-utils` |

---

## 💬 Commit Message Guidelines

Write clear, descriptive commit messages:

**Good Examples:**
- `Add PDF text extraction feature`
- `Fix memory leak in document parser`
- `Update dependencies to latest versions`
- `Refactor query processing logic`

**Bad Examples:**
- `fix`
- `update`
- `wip`
- `asdfgh`

---

## 🔀 Merging & Rebasing

### Merge Main into Your Branch

```bash
# While on your feature branch
git checkout feature/your-feature
git merge main
```

### Rebase Your Branch (Alternative)

```bash
# While on your feature branch
git checkout feature/your-feature
git rebase main
```

> ⚠️ **Note:** Only rebase branches that haven't been pushed, or coordinate with your team if rebasing shared branches.

---

## 🛠️ Useful Commands

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Discard Local Changes

```bash
# Discard changes in a specific file
git checkout -- filename.py

# Discard all local changes
git checkout -- .
```

### Stash Changes Temporarily

```bash
# Save changes for later
git stash

# List stashed changes
git stash list

# Apply stashed changes
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### View Remote Repository Info

```bash
git remote -v
```

---

## ❌ Common Mistakes & Fixes

### Committed to Wrong Branch

```bash
# Undo the commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit there
git commit -m "Your message"
```

### Need to Update Commit Message

```bash
# Amend the last commit message
git commit --amend -m "New commit message"
```

### Forgot to Add a File to Last Commit

```bash
git add forgotten-file.py
git commit --amend --no-edit
```

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## Need Help?

If you're stuck, don't hesitate to ask the team! Git mistakes are recoverable in most cases.
