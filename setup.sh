#!/bin/bash

# Quick Setup Script for Indian Languages Learning App
# This script sets up git, GitHub, and Netlify deployment

echo "🌟 Indian Languages Learning App Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "app.jsx" ]; then
    echo "❌ Error: app.jsx not found!"
    echo "Please run this script from the project directory."
    exit 1
fi

# Step 1: Initialize Git
echo "📝 Step 1: Initializing Git repository..."
git init
git add .
git commit -m "Initial commit: Kannada-Hindi learning app"
echo "✅ Git repository initialized"
echo ""

# Step 2: GitHub Setup
echo "🌐 Step 2: Setting up GitHub..."
echo "What's your GitHub username?"
read -p "Username: " github_username

echo ""
echo "What do you want to name your repository?"
read -p "Repository name [learn-indian-languages]: " repo_name
repo_name=${repo_name:-learn-indian-languages}

echo ""
echo "Choose setup method:"
echo "1) GitHub CLI (gh) - Recommended if installed"
echo "2) Manual setup - You'll create repo on GitHub.com"
read -p "Enter choice (1 or 2): " github_choice

if [ "$github_choice" = "1" ]; then
    # Check if gh is installed
    if command -v gh &> /dev/null; then
        echo "Creating GitHub repository..."
        gh repo create $repo_name --public --source=. --push
        echo "✅ Repository created and pushed to GitHub!"
    else
        echo "❌ GitHub CLI not found. Install it with: brew install gh"
        echo "Or choose option 2 for manual setup."
        exit 1
    fi
else
    echo ""
    echo "📋 Manual Setup Instructions:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a repository named: $repo_name"
    echo "3. DO NOT initialize with README"
    echo "4. After creating, run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/$github_username/$repo_name.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    read -p "Press Enter when you've completed these steps..."
fi

echo "✅ GitHub setup complete"
echo ""

# Step 3: Netlify Setup
echo "🚀 Step 3: Setting up Netlify deployment..."
echo "Choose Netlify setup method:"
echo "1) Netlify CLI - Recommended if installed"
echo "2) Manual setup - Use Netlify.com dashboard"
read -p "Enter choice (1 or 2): " netlify_choice

if [ "$netlify_choice" = "1" ]; then
    # Check if netlify is installed
    if command -v netlify &> /dev/null; then
        echo "Logging into Netlify..."
        netlify login
        
        echo "Initializing Netlify site..."
        netlify init
        
        echo "✅ Netlify deployment configured!"
        echo ""
        echo "Opening your site..."
        netlify open:site
    else
        echo "❌ Netlify CLI not found."
        echo "Install it with: npm install -g netlify-cli"
        echo "Then run: netlify init"
        exit 1
    fi
else
    echo ""
    echo "📋 Manual Netlify Setup Instructions:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Choose GitHub and select your repository: $repo_name"
    echo "4. Build settings:"
    echo "   - Build command: (leave empty)"
    echo "   - Publish directory: ."
    echo "5. Click 'Deploy site'"
    echo ""
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📍 Your repository: https://github.com/$github_username/$repo_name"
echo "🌐 Your Netlify site will be live shortly!"
echo ""
echo "Next steps:"
echo "1. Check your Netlify dashboard for the live URL"
echo "2. Open the site on iPad Safari"
echo "3. Add to home screen (Share → Add to Home Screen)"
echo "4. Link from your personal website"
echo "5. Start adding more languages! (Gujarati is next)"
echo ""
echo "To make updates:"
echo "  git add ."
echo "  git commit -m 'Your message'"
echo "  git push"
echo ""
echo "Happy learning! 🎈"
