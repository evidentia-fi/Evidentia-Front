# 🚀 Quick Start - Local Testing

## Super Quick Start (2 minutes)

### Option 1: Automated Setup
```bash
# Run the automated setup script
./quick-test.sh

# Choose option 1 to start all applications
# This will start everything automatically
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Start all applications
pnpm dev

# 3. Open in browser:
# Main App: http://localhost:3000
# Web App: http://localhost:3001  
# Mint App: http://localhost:3002
```

## 🧪 What to Test

### Main App (http://localhost:3000)
1. **Bridge Page** (`/bridge`)
   - ✅ Base network icon (blue icon)
   - ✅ Network selection (Ethereum, Tron, Base)
   - ✅ Wallet connection
   - ✅ Address validation

2. **Staking Page** (`/staking`)
   - ✅ Charts with proper dates (Jun 01, Jun 15, etc.)
   - ✅ No repeated month names

3. **Dashboard** (`/`)
   - ✅ Supply Chart with proper dates
   - ✅ Staking APY Chart with proper dates

### Web App (http://localhost:3001)
- ✅ Landing page loads
- ✅ Contact form works

### Mint App (http://localhost:3002)
- ✅ Mint interface loads
- ✅ Wallet connection works

## 🔍 Key Features to Verify

### ✅ Bridge Functionality
- Base network shows blue icon
- All network combinations work
- Address auto-population for EVM-to-EVM
- Form validation works

### ✅ Chart Fixes
- Charts show "Jun 01, Jun 15, Aug 01" instead of "Jun, Jun, Jun, Jul, Jul"
- Interactive tooltips work
- Responsive design

### ✅ Wallet Integration
- MetaMask connection works
- TronLink connection works (if installed)
- Network switching works

## 🐛 If Something Goes Wrong

### Port Already in Use
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Dependencies Issues
```bash
# Clean and reinstall
rm -rf node_modules
pnpm install
```

### Environment Issues
```bash
# Check environment files exist
ls apps/*/.env.local
```

## 📱 Browser Testing

### Recommended Browsers
- **Chrome**: Best compatibility
- **Firefox**: Good compatibility
- **Safari**: May have wallet limitations

### Developer Tools
- Press `F12` to open Developer Tools
- Check Console for errors
- Check Network tab for failed requests

## 🎯 Success Indicators

You'll know everything is working when:
- ✅ All apps start without errors
- ✅ Base network shows blue icon
- ✅ Charts show proper dates
- ✅ Wallet connections work
- ✅ Bridge form validates correctly

## 📞 Need Help?

1. Check `LOCAL_TESTING_GUIDE.md` for detailed instructions
2. Check browser console for error messages
3. Verify environment variables are set
4. Ensure wallet extensions are installed

---

**Ready to test!** 🧪✨
