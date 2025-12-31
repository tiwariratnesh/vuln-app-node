# SCA Scanner Test Scenarios

## Quick Start Testing Guide

### Build and Run

```bash
# Clone the repository
git clone https://github.com/tiwariratnesh/vuln-app-node.git
cd vuln-app-node

# Install dependencies (will install vulnerable packages)
npm install

# Run locally
npm start

# Or with Docker
docker build -t vuln-app-node .
docker run -p 3000:3000 vuln-app-node

# Or with docker-compose (includes databases)
docker-compose up -d
```

### Verify Installation

```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "message": "Vulnerable Node.js Application - SCA Scanner Test",
  "version": "1.0.0",
  "endpoints": {...},
  "vulnerabilities": {...}
}
```

## SCA Scanner Test Cases

### Test Case 1: Direct Reachable CVE Detection
**Objective**: Verify scanner detects reachable direct dependencies

**Package**: `lodash@4.17.19`  
**CVE**: CVE-2020-8203  
**Location**: `routes/user.js:12` (_.merge())

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/users/update \
  -H "Content-Type: application/json" \
  -d '{"__proto__":{"isAdmin":true}}'
```

**Expected Scanner Output**:
- ✅ Detects lodash@4.17.19
- ✅ Identifies CVE-2020-8203
- ✅ Marks as REACHABLE
- ✅ Shows usage in routes/user.js, services/userService.js, utils/dataProcessor.js

---

### Test Case 2: Transitive CVE Chain Detection
**Objective**: Verify scanner traces transitive dependencies

**Package Chain**: `axios@0.21.1` → `follow-redirects@1.13.1`  
**CVEs**: CVE-2021-3749, CVE-2022-0155  
**Location**: `routes/api.js:12`

**Test Command**:
```bash
curl -X GET "http://localhost:3000/api/external/fetch-data?url=http://example.com"
```

**Expected Scanner Output**:
- ✅ Detects axios@0.21.1 (direct)
- ✅ Detects follow-redirects@1.13.1 (transitive)
- ✅ Links both CVEs
- ✅ Marks entire chain as REACHABLE

---

### Test Case 3: Non-Reachable CVE Exclusion
**Objective**: Verify scanner correctly identifies non-reachable vulnerabilities

**Package**: `jquery@3.4.1`  
**CVE**: CVE-2020-11022, CVE-2020-11023  
**Status**: Imported in package.json but NEVER used in code

**Test Method**: Search entire codebase for `require('jquery')` or `import.*jquery`

**Expected Scanner Output**:
- ✅ Detects jquery@3.4.1
- ✅ Identifies CVEs
- ✅ Marks as NON-REACHABLE or UNUSED
- ✅ No usage locations shown

---

### Test Case 4: Critical RCE Detection
**Objective**: Verify detection of critical remote code execution vulnerabilities

**Package**: `jsonwebtoken@8.5.1`  
**CVEs**: CVE-2022-23529, CVE-2022-23539, CVE-2022-23540, CVE-2022-23541  
**Location**: `routes/auth.js:44` (algorithm confusion)

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Expected Scanner Output**:
- ✅ Detects jsonwebtoken@8.5.1
- ✅ Identifies ALL 4 CVEs
- ✅ Marks as CRITICAL severity
- ✅ Shows reachability across routes/auth.js, services/authService.js, utils/tokenUtils.js

---

### Test Case 5: Template Injection Chain
**Objective**: Verify detection of SSTI vulnerabilities across multiple engines

**Packages**: 
- `ejs@3.1.5` (CVE-2022-29078)
- `handlebars@4.7.6` (CVE-2021-23369, CVE-2021-23383)
- `pug@3.0.0` (CVE-2021-21353)
- `dot@1.1.2` (CVE-2021-23449)
- `mustache@4.0.1` (CVE-2021-32819)

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/templates/render-ejs \
  -H "Content-Type: application/json" \
  -d '{"template":"<%= 1+1 %>","data":{}}'
```

**Expected Scanner Output**:
- ✅ Detects ALL 5 template engines
- ✅ Identifies ALL template injection CVEs
- ✅ Marks as CRITICAL/HIGH severity
- ✅ Shows cross-file usage: routes/template.js → services/templateService.js

---

### Test Case 6: Command Injection Detection
**Objective**: Verify detection of command injection vulnerabilities

**Package**: `shelljs@0.8.4`  
**CVE**: CVE-2022-0144  
**Location**: `services/fileService.js:19`, `utils/archiveUtils.js`

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/files/write \
  -H "Content-Type: application/json" \
  -d '{"filepath":"test.txt","content":"test"}'
```

**Expected Scanner Output**:
- ✅ Detects shelljs@0.8.4
- ✅ Identifies CVE-2022-0144
- ✅ Marks as CRITICAL
- ✅ Shows usage in multiple files

---

### Test Case 7: XXE Vulnerability Detection
**Objective**: Verify detection of XML External Entity vulnerabilities

**Package**: `xml2js@0.4.23`  
**CVE**: CVE-2023-0842  
**Location**: `routes/data.js:15`, `services/dataService.js`, `utils/parserUtils.js`

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/data/parse-xml \
  -H "Content-Type: application/json" \
  -d '{"xmlData":"<root><test>value</test></root>"}'
```

**Expected Scanner Output**:
- ✅ Detects xml2js@0.4.23
- ✅ Identifies CVE-2023-0842 (XXE)
- ✅ Marks as HIGH severity
- ✅ Shows cross-file usage chain

---

### Test Case 8: Path Traversal in Archives
**Objective**: Verify detection of archive-related path traversal

**Package**: `tar@4.4.13`  
**CVEs**: CVE-2021-32803, CVE-2021-32804, CVE-2021-37701, CVE-2021-37712, CVE-2021-37713  
**Location**: `routes/file.js:62`, `services/fileService.js:28`, `utils/archiveUtils.js`

**Test Command**:
```bash
# Create test tar file first
echo "test" > /tmp/test.txt
tar -czf /tmp/test.tar.gz -C /tmp test.txt

# Upload and extract
curl -X POST http://localhost:3000/api/files/extract-tar \
  -F "archive=@/tmp/test.tar.gz"
```

**Expected Scanner Output**:
- ✅ Detects tar@4.4.13
- ✅ Identifies ALL 5 path traversal CVEs
- ✅ Marks as HIGH severity
- ✅ Shows usage across 3 files

---

### Test Case 9: Prototype Pollution Multi-Package
**Objective**: Verify detection of prototype pollution across multiple packages

**Packages**:
- `lodash@4.17.19` (CVE-2020-8203)
- `ini@1.3.5` (CVE-2020-7788)
- `xmldom@0.5.0` (CVE-2021-21366)
- `minimist@1.2.5` (CVE-2021-44906 - transitive)
- `express-fileupload@1.2.0` (CVE-2020-7699)

**Test Commands**:
```bash
# Test 1: lodash
curl -X POST http://localhost:3000/api/users/update \
  -d '{"__proto__":{"polluted":true}}'

# Test 2: ini
curl -X POST http://localhost:3000/api/data/parse-ini \
  -d '{"iniData":"[section]\n__proto__.polluted=true"}'
```

**Expected Scanner Output**:
- ✅ Detects ALL packages with prototype pollution
- ✅ Identifies different attack vectors
- ✅ Shows both direct and transitive cases
- ✅ Marks all as HIGH/CRITICAL

---

### Test Case 10: SSRF Vulnerability Detection
**Objective**: Verify detection of Server-Side Request Forgery

**Packages**:
- `axios@0.21.1` (CVE-2021-3749)
- `request@2.88.2` (CVE-2023-28155)
- `node-fetch@2.6.1` (CVE-2022-0235)
- `cross-fetch@3.0.4` (CVE-2022-1365)

**Test Command**:
```bash
curl -X GET "http://localhost:3000/api/external/fetch-data?url=http://169.254.169.254/latest/meta-data/"
```

**Expected Scanner Output**:
- ✅ Detects ALL HTTP client libraries
- ✅ Identifies SSRF CVEs
- ✅ Marks as MEDIUM/HIGH severity
- ✅ Shows usage in routes/api.js and services/apiService.js

---

## Automated Testing Script

```bash
#!/bin/bash

echo "=== SCA Scanner Test Suite ==="
echo "Testing vuln-app-node..."
echo ""

# Start the application
docker-compose up -d
sleep 10

# Test 1: Reachable CVE
echo "Test 1: Reachable CVE (lodash)"
curl -s -X POST http://localhost:3000/api/users/update \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' | jq .

# Test 2: JWT Vulnerability
echo "Test 2: JWT Algorithm Confusion"
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}' | jq .

# Test 3: SSRF
echo "Test 3: SSRF via axios"
curl -s -X GET "http://localhost:3000/api/external/fetch-data?url=http://httpbin.org/get" | jq .

# Test 4: Template Injection
echo "Test 4: Template Injection"
curl -s -X POST http://localhost:3000/api/templates/render-ejs \
  -H "Content-Type: application/json" \
  -d '{"template":"<%= 2+2 %>","data":{}}' | jq .

# Test 5: XML Parsing
echo "Test 5: XML Parsing (XXE)"
curl -s -X POST http://localhost:3000/api/data/parse-xml \
  -H "Content-Type: application/json" \
  -d '{"xmlData":"<root><test>data</test></root>"}' | jq .

echo ""
echo "=== All functional tests completed ==="
echo "Now run your SCA scanner against this application"
```

## Expected SCA Scanner Metrics

### Minimum Requirements for "Good" Scanner:
- ✅ Detect at least 80 CVEs (out of 100+)
- ✅ Correctly identify 90%+ of reachable vulnerabilities
- ✅ Correctly identify 80%+ of non-reachable vulnerabilities
- ✅ Trace at least 3 transitive dependency chains
- ✅ Show file locations for reachable CVEs
- ✅ Identify at least 3 cross-file vulnerability chains

### Excellent Scanner Should:
- ✅ Detect 95+ CVEs
- ✅ 95%+ accuracy on reachability
- ✅ Complete call graph for all reachable vulnerabilities
- ✅ Identify ALL transitive chains
- ✅ Show line numbers for vulnerability usage
- ✅ Aggregate risk scores for vulnerability chains
- ✅ Prioritize critical reachable over non-reachable

## Scanner Comparison Matrix

| Feature | Poor Scanner | Good Scanner | Excellent Scanner |
|---------|--------------|--------------|-------------------|
| CVEs Detected | <60 | 80-90 | 95+ |
| Reachability Accuracy | <70% | 85-95% | >95% |
| Transitive Detection | Partial | Most | All |
| Cross-File Tracing | No | Some | Complete |
| Line Number Precision | No | Sometimes | Always |
| False Positives | High | Medium | Low |
| False Negatives | High | Low | Very Low |

---

**Repository**: https://github.com/tiwariratnesh/vuln-app-node  
**Total Test Cases**: 10  
**Coverage**: All major vulnerability categories  
**Complexity**: Production-grade patterns

