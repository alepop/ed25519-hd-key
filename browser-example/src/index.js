// Import the ed25519-hd-key library
const { derivePath, getMasterKeyFromSeed, getPublicKey } = require('ed25519-hd-key');

// Test vectors from the original test suite
const vector_1_seed = '000102030405060708090a0b0c0d0e0f';
const vector_2_seed = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542';

// Test results container
const results = [];

function runTest(name, testFn) {
  try {
    testFn();
    results.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.message });
    console.error(`✗ ${name}: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

// Run the tests
function runAllTests() {
  console.log('Testing ed25519-hd-key in browser environment...\n');
  
  // Test 1: Basic functionality
  runTest('Basic key derivation from seed', () => {
    const { key, chainCode } = getMasterKeyFromSeed(vector_1_seed);
    assertEqual(
      key.toString('hex'),
      '2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7',
      'Master key mismatch'
    );
    assertEqual(
      chainCode.toString('hex'),
      '90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb',
      'Chain code mismatch'
    );
  });

  // Test 2: Derivation path
  runTest('Derivation path m/0\'', () => {
    const { key, chainCode } = derivePath("m/0'", vector_1_seed);
    assertEqual(
      key.toString('hex'),
      '68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3',
      'Derived key mismatch'
    );
    assertEqual(
      chainCode.toString('hex'),
      '8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69',
      'Derived chain code mismatch'
    );
  });

  // Test 3: Public key generation
  runTest('Public key generation', () => {
    const { key } = derivePath("m/0'", vector_1_seed);
    const publicKey = getPublicKey(key);
    assertEqual(
      publicKey.toString('hex'),
      '008c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c',
      'Public key mismatch'
    );
  });

  // Test 4: Vector 2 test
  runTest('Vector 2 master key', () => {
    const { key, chainCode } = getMasterKeyFromSeed(vector_2_seed);
    assertEqual(
      key.toString('hex'),
      '171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012',
      'Vector 2 master key mismatch'
    );
    assertEqual(
      chainCode.toString('hex'),
      'ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b',
      'Vector 2 chain code mismatch'
    );
  });

  // Test 5: Complex derivation path
  runTest('Complex derivation path m/0\'/2147483647\'', () => {
    const { key, chainCode } = derivePath("m/0'/2147483647'", vector_2_seed);
    assertEqual(
      key.toString('hex'),
      'ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4',
      'Complex path key mismatch'
    );
    assertEqual(
      chainCode.toString('hex'),
      '138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f',
      'Complex path chain code mismatch'
    );
  });

  // Display results
  displayResults();
}

function displayResults() {
  const container = document.getElementById('results');
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  
  let html = `
    <div class="summary ${failCount === 0 ? 'success' : 'failure'}">
      <h2>Test Results Summary</h2>
      <p><strong>Passed:</strong> ${passCount}</p>
      <p><strong>Failed:</strong> ${failCount}</p>
      <p><strong>Total:</strong> ${results.length}</p>
    </div>
  `;
  
  html += '<div class="test-details"><h3>Test Details</h3>';
  
  results.forEach(result => {
    html += `
      <div class="test-result ${result.status.toLowerCase()}">
        <span class="status">${result.status === 'PASS' ? '✓' : '✗'}</span>
        <span class="name">${result.name}</span>
        ${result.error ? `<div class="error">Error: ${result.error}</div>` : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  if (failCount === 0) {
    html += `
      <div class="success-message">
        <h3>🎉 Browser compatibility verified!</h3>
        <p>The ed25519-hd-key library is working correctly in the browser environment with the configured polyfills.</p>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Browser environment detected. Library configuration complete.');
  runAllTests();
});