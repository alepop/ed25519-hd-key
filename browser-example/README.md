# Browser Example for ed25519-hd-key

This directory contains a complete working example demonstrating how to use `ed25519-hd-key` in a browser environment.

## 🎯 Purpose

This example serves as:
- **Proof of browser compatibility** - Shows that the library works correctly in browsers
- **Reference implementation** - Demonstrates proper webpack configuration with Node.js polyfills
- **Working test suite** - Runs the same tests as the Node.js version to verify functionality

## 🚀 Quick Start

### Prerequisites
- Node.js (for building the example)
- npm

### Running the Example

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build and serve (opens browser automatically):**
   ```bash
   npm run dev
   ```

   Or build for production:
   ```bash
   npm run build
   ```

3. **Open the example:**
   - Development server: http://localhost:9000
   - Or open `index.html` directly after building

## 📁 File Structure

```
browser-example/
├── src/
│   └── index.js          # Main test script
├── dist/                 # Built files (generated)
├── index.html           # Test page
├── webpack.config.js    # Webpack configuration with polyfills
└── package.json         # Dependencies and scripts
```

## ⚙️ Webpack Configuration

The `webpack.config.js` demonstrates the exact configuration needed for browser compatibility:

```javascript
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "string_decoder": require.resolve("string_decoder/"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "process": require.resolve("process/browser")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  // ... rest of config
};
```

## 🧪 Tests Included

The browser example runs these tests to verify functionality:

1. **Basic key derivation from seed** - Validates master key generation
2. **Derivation path m/0'** - Tests hardened key derivation
3. **Public key generation** - Verifies public key creation from private keys
4. **Vector 2 master key** - Additional test vector validation
5. **Complex derivation path** - Tests deep derivation paths

All tests use the same test vectors as the official Node.js test suite.

## ✅ Expected Output

When working correctly, you should see:
- ✓ All tests passing (green checkmarks)
- "Browser compatibility verified!" success message
- No errors in the browser console

## 🔧 Customizing

To use this configuration in your own project:

1. Copy the webpack configuration
2. Install the required polyfill packages:
   ```bash
   npm install --save-dev crypto-browserify buffer stream-browserify string_decoder util assert process
   ```
3. Import and use ed25519-hd-key as shown in `src/index.js`

## 📚 Related Documentation

- [Main README - Browser Usage section](../README.md#browser-usage)
- [Webpack polyfills documentation](https://webpack.js.org/configuration/resolve/#resolvefallback)
- [ed25519-hd-key API documentation](../README.md#usage)