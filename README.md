# Vulnerable Node.js Application - SCA Scanner Test Suite

⚠️ **WARNING: This application contains INTENTIONAL security vulnerabilities. DO NOT deploy in production!**

## Overview

This is a comprehensive vulnerable Node.js application designed specifically for testing Software Composition Analysis (SCA) scanners, particularly their reachability analysis capabilities. The application includes multiple types of vulnerabilities across direct and transitive dependencies.

## Vulnerability Categories

### Direct Dependencies with Known CVEs (Reachable)

#### 1. **lodash@4.17.19**
- **CVEs**: CVE-2020-8203 (Prototype Pollution)
- **Reachability**: ✅ REACHABLE
- **Locations**: 
  - `routes/user.js` - `_.merge()`, `_.filter()`, `_.orderBy()`
  - `services/userService.js` - `_.find()`, `_.merge()`
  - `services/apiService.js` - `_.mapValues()`, `_.isObject()`
  - `utils/dataProcessor.js` - `_.merge()`, `_.filter()`, `_.orderBy()`
- **Attack Vector**: Prototype pollution through merge operations
- **Severity**: High

#### 2. **axios@0.21.1**
- **CVEs**: CVE-2021-3749 (SSRF)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/api.js` - Direct HTTP requests to user-controlled URLs
  - `services/apiService.js` - Multiple fetch operations
- **Attack Vector**: Server-Side Request Forgery
- **Severity**: Medium

#### 3. **jsonwebtoken@8.5.1**
- **CVEs**: CVE-2022-23529 (Algorithm Confusion), CVE-2022-23539, CVE-2022-23540, CVE-2022-23541
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/auth.js` - JWT signing with 'none' algorithm
  - `services/authService.js` - Session creation
  - `utils/tokenUtils.js` - Token generation and validation
- **Attack Vector**: JWT algorithm confusion, signature bypass
- **Severity**: Critical

#### 4. **xml2js@0.4.23**
- **CVEs**: CVE-2023-0842 (XXE - XML External Entity)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - XML parsing endpoint
  - `services/dataService.js` - XML data processing
  - `utils/parserUtils.js` - XML parsing utilities
- **Attack Vector**: XML External Entity injection
- **Severity**: High

#### 5. **ejs@3.1.5**
- **CVEs**: CVE-2022-29078 (Server-Side Template Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/template.js` - Template rendering endpoint
  - `services/templateService.js` - Template compilation
- **Attack Vector**: SSTI through template rendering
- **Severity**: Critical

#### 6. **handlebars@4.7.6**
- **CVEs**: CVE-2021-23369, CVE-2021-23383 (Prototype Pollution, RCE)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/template.js` - Handlebars template rendering
  - `services/templateService.js` - Template compilation
- **Attack Vector**: Remote Code Execution via template injection
- **Severity**: Critical

#### 7. **dot@1.1.2**
- **CVEs**: CVE-2021-23449 (Code Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/template.js` - doT template rendering
  - `services/templateService.js` - Template engine
- **Attack Vector**: Code injection through template compilation
- **Severity**: Critical

#### 8. **pug@3.0.0**
- **CVEs**: CVE-2021-21353 (Code Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/template.js` - Pug template rendering
  - `services/templateService.js` - Template processing
- **Attack Vector**: Remote code execution via template
- **Severity**: High

#### 9. **marked@1.2.7**
- **CVEs**: CVE-2022-21680, CVE-2022-21681 (XSS, ReDoS)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - Markdown rendering
  - `services/dataService.js` - Markdown processing
- **Attack Vector**: Cross-Site Scripting, Regular Expression DoS
- **Severity**: Medium

#### 10. **js-yaml@3.13.1**
- **CVEs**: CVE-2020-14343 (Code Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - YAML parsing
  - `services/dataService.js` - YAML data processing
- **Attack Vector**: Arbitrary code execution via YAML deserialization
- **Severity**: Critical

#### 11. **serialize-javascript@3.1.0**
- **CVEs**: CVE-2020-7660 (XSS)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - Data serialization/deserialization
  - `services/dataService.js` - Using eval() with serialized data
  - `utils/dataProcessor.js` - Data export functionality
- **Attack Vector**: XSS via unsafe deserialization with eval()
- **Severity**: High

#### 12. **node-forge@0.10.0**
- **CVEs**: CVE-2022-24771, CVE-2022-24772, CVE-2022-24773 (Signature verification bypass)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `services/authService.js` - API key generation, encryption
  - `utils/tokenUtils.js` - RSA key generation
- **Attack Vector**: Cryptographic signature bypass
- **Severity**: High

#### 13. **tar@4.4.13**
- **CVEs**: CVE-2021-32803, CVE-2021-32804, CVE-2021-37701, CVE-2021-37712, CVE-2021-37713 (Path Traversal)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/file.js` - Archive extraction endpoint
  - `services/fileService.js` - Archive operations
  - `utils/archiveUtils.js` - Tar file handling
- **Attack Vector**: Arbitrary file write via path traversal
- **Severity**: High

#### 14. **shelljs@0.8.4**
- **CVEs**: CVE-2022-0144 (Command Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `services/fileService.js` - Shell command execution
  - `utils/archiveUtils.js` - File operations with shell commands
- **Attack Vector**: Command injection via shell execution
- **Severity**: Critical

#### 15. **xmldom@0.5.0**
- **CVEs**: CVE-2021-21366, CVE-2021-32796 (Prototype Pollution)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - DOM parsing
  - `utils/parserUtils.js` - XML DOM tree processing
- **Attack Vector**: Prototype pollution via XML parsing
- **Severity**: High

#### 16. **minimist@1.2.5**
- **CVEs**: CVE-2021-44906 (Prototype Pollution)
- **Reachability**: ⚠️ PARTIALLY REACHABLE (Transitive)
- **Used By**: Multiple dependencies
- **Severity**: Critical

#### 17. **ini@1.3.5**
- **CVEs**: CVE-2020-7788 (Prototype Pollution)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/data.js` - INI file parsing
- **Attack Vector**: Prototype pollution
- **Severity**: High

#### 18. **ws@7.4.0**
- **CVEs**: CVE-2021-32640 (ReDoS)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/websocket.js` - WebSocket server
  - `services/wsService.js` - Message handling
- **Attack Vector**: Regular Expression Denial of Service
- **Severity**: Medium

#### 19. **socket.io@2.3.0**
- **CVEs**: CVE-2020-36048, CVE-2022-2421 (CORS, XSS)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `routes/websocket.js` - Socket.IO implementation
  - `services/wsService.js` - Real-time messaging
- **Attack Vector**: CORS bypass, XSS
- **Severity**: High

#### 20. **express@4.17.1**
- **CVEs**: CVE-2022-24999 (Open Redirect)
- **Reachability**: ✅ REACHABLE
- **Locations**: Core application server
- **Attack Vector**: Open redirect vulnerability
- **Severity**: Medium

### Non-Reachable Vulnerabilities (Imported but Not Used)

#### 21. **jquery@3.4.1**
- **CVEs**: CVE-2020-11022, CVE-2020-11023 (XSS)
- **Reachability**: ❌ NOT REACHABLE
- **Status**: Imported but never used in code
- **Severity**: Medium

#### 22. **bootstrap@4.5.3**
- **CVEs**: CVE-2019-8331 (XSS)
- **Reachability**: ❌ NOT REACHABLE
- **Status**: Imported but never used
- **Severity**: Low

#### 23. **underscore@1.12.0**
- **CVEs**: CVE-2021-23358 (Arbitrary Code Execution)
- **Reachability**: ❌ NOT REACHABLE
- **Status**: Imported as alternative to lodash but not used
- **Severity**: High

#### 24. **ua-parser-js@0.7.22**
- **CVEs**: CVE-2021-27292 (ReDoS)
- **Reachability**: ❌ NOT REACHABLE
- **Status**: Imported but never invoked
- **Severity**: High

### Transitive Dependencies with CVEs

#### 25. **request@2.88.2** (Deprecated)
- **CVEs**: CVE-2023-28155 (SSRF)
- **Reachability**: ✅ REACHABLE
- **Locations**: `routes/api.js` - Proxy requests
- **Transitive Dependencies**: tough-cookie, http-signature, form-data, etc.
- **Severity**: Medium

#### 26. **moment@2.29.1**
- **CVEs**: CVE-2022-24785, CVE-2022-31129 (Path Traversal, ReDoS)
- **Reachability**: ✅ REACHABLE
- **Locations**:
  - `services/userService.js` - Date formatting
  - `services/wsService.js` - Timestamp generation
- **Severity**: High

#### 27. **formidable@1.2.2**
- **CVEs**: CVE-2022-29622 (Arbitrary File Upload)
- **Reachability**: ✅ REACHABLE
- **Locations**: `routes/file.js` - File upload handling
- **Attack Vector**: Unrestricted file upload
- **Severity**: High

#### 28. **multer@1.4.2**
- **CVEs**: CVE-2022-24434 (ReDoS)
- **Reachability**: ✅ REACHABLE
- **Locations**: `routes/file.js` - Multipart form handling
- **Severity**: High

#### 29. **express-fileupload@1.2.0**
- **CVEs**: CVE-2020-7699 (Prototype Pollution)
- **Reachability**: ✅ REACHABLE
- **Locations**: `routes/file.js` - File upload middleware
- **Severity**: Critical

#### 30. **mustache@4.0.1**
- **CVEs**: CVE-2021-32819 (Code Injection)
- **Reachability**: ✅ REACHABLE
- **Locations**: `routes/template.js` - Template rendering
- **Severity**: High

## Cross-File Vulnerability Chains

### Chain 1: Authentication Bypass → SQL Injection → Data Exfiltration
1. `routes/auth.js` - JWT with 'none' algorithm (CVE-2022-23529)
2. `routes/auth.js` - SQL injection in login endpoint
3. `services/authService.js` - Weak crypto (MD5 hashing)
4. `utils/tokenUtils.js` - Deprecated crypto functions

### Chain 2: File Upload → Path Traversal → RCE
1. `routes/file.js` - Unrestricted file upload (formidable, multer)
2. `services/fileService.js` - Shell command execution (shelljs)
3. `utils/archiveUtils.js` - Tar extraction vulnerability (CVE-2021-32803)

### Chain 3: Template Injection → Code Execution
1. `routes/template.js` - Multiple template engines
2. `services/templateService.js` - Unsafe template compilation
3. Cross-engine vulnerabilities (ejs, handlebars, pug, dot, mustache)

### Chain 4: Data Parsing → Deserialization → RCE
1. `routes/data.js` - Multiple parsers (XML, YAML, JSON)
2. `services/dataService.js` - eval() usage with deserialization
3. `utils/dataProcessor.js` - Unsafe data import
4. `utils/parserUtils.js` - XXE vulnerabilities

### Chain 5: API Proxy → SSRF → Internal Network Access
1. `routes/api.js` - Unvalidated URL fetching
2. `services/apiService.js` - axios with user-controlled URLs
3. `utils/requestUtils.js` - Request building without validation

## API Endpoints for Testing

### Authentication Endpoints
- `POST /api/auth/register` - SQL injection vulnerability
- `POST /api/auth/login` - SQL injection + JWT 'none' algorithm
- `POST /api/auth/verify-token` - JWT algorithm confusion
- `GET /api/auth/user/:id` - SQL injection in parameter
- `POST /api/auth/postgres-login` - PostgreSQL SQL injection
- `POST /api/auth/reset-password` - SQL injection

### User Management Endpoints
- `GET /api/users/search` - Prototype pollution via lodash
- `POST /api/users/update` - Prototype pollution via merge
- `GET /api/users/profile/:username` - Cross-file data flow
- `POST /api/users/merge-profiles` - Deep merge vulnerability

### File Upload Endpoints
- `POST /api/files/upload` - Multer file upload
- `POST /api/files/upload-formidable` - Formidable upload
- `POST /api/files/upload-express` - Express-fileupload
- `POST /api/files/extract-tar` - Tar path traversal
- `GET /api/files/read` - Path traversal
- `POST /api/files/write` - Arbitrary file write
- `POST /api/files/decompress` - Archive extraction

### External API Endpoints
- `GET /api/external/fetch-data` - SSRF via axios
- `POST /api/external/proxy-request` - SSRF via request
- `POST /api/external/fetch-api` - SSRF via node-fetch
- `POST /api/external/cross-fetch` - SSRF via cross-fetch
- `POST /api/external/batch-requests` - Multiple SSRF
- `POST /api/external/webhook` - SSRF to webhooks

### Data Processing Endpoints
- `POST /api/data/parse-xml` - XXE vulnerability
- `POST /api/data/parse-yaml` - YAML code injection
- `POST /api/data/render-markdown` - XSS via marked
- `POST /api/data/serialize` - Unsafe serialization
- `POST /api/data/deserialize` - eval() with user input
- `POST /api/data/parse-ini` - Prototype pollution
- `POST /api/data/parse-dom` - XML parsing vulnerabilities

### Template Rendering Endpoints
- `POST /api/templates/render-ejs` - SSTI in EJS
- `POST /api/templates/render-handlebars` - RCE via Handlebars
- `POST /api/templates/render-pug` - Code injection in Pug
- `POST /api/templates/render-mustache` - Template injection
- `POST /api/templates/render-dot` - Code injection in doT
- `POST /api/templates/compile-template` - Multi-engine SSTI

### WebSocket Endpoints
- `/ws` - WebSocket connection (ws library)
- `/socket.io` - Socket.IO connection

## Installation & Running

### Local Development
```bash
# Install dependencies (will install vulnerable packages)
npm install

# Start the server
npm start

# Or with nodemon
npm run dev
```

### Docker Deployment
```bash
# Build the image
docker build -t vuln-app-node .

# Run standalone
docker run -p 3000:3000 vuln-app-node

# Run with docker-compose (includes databases)
docker-compose up -d
```

### Kubernetes Deployment
```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Apply service
kubectl apply -f k8s/service.yaml
```

## Testing SCA Reachability Analysis

### Expected Results from SCA Scanners

#### High-Quality SCA Scanner Should Detect:
1. ✅ All direct dependencies with CVEs (30+ vulnerabilities)
2. ✅ Transitive dependencies with CVEs (10+ vulnerabilities)
3. ✅ Correctly identify REACHABLE vs NON-REACHABLE vulnerabilities
4. ✅ Trace vulnerability usage across multiple files
5. ✅ Identify cross-file vulnerability chains
6. ✅ Map CVEs to actual code usage locations
7. ✅ Detect multiple attack vectors per vulnerability
8. ✅ Identify aggregated risk from vulnerability chains

#### Reachability Statistics:
- **Total Dependencies**: 44+
- **Total Vulnerabilities**: 100+ CVEs
- **Reachable Vulnerabilities**: 85%+
- **Non-Reachable Vulnerabilities**: 15%
- **Critical Severity**: 40%
- **High Severity**: 35%
- **Medium Severity**: 20%
- **Low Severity**: 5%

### Test Scenarios

#### Scenario 1: Direct Reachable CVE
Test if scanner identifies `lodash@4.17.19` CVE-2020-8203 as REACHABLE because `_.merge()` is actively used in `routes/user.js:12`.

#### Scenario 2: Transitive CVE Chains
Test if scanner traces vulnerability from `request` → `tough-cookie` → `psl` and marks as reachable.

#### Scenario 3: Non-Reachable False Positives
Test if scanner correctly marks `jquery` and `bootstrap` as NON-REACHABLE since they're never imported in any module.

#### Scenario 4: Cross-File Reachability
Test if scanner traces `jwt.sign()` from `routes/auth.js` → `services/authService.js` → `utils/tokenUtils.js`.

#### Scenario 5: Multiple CVEs per Package
Test if scanner identifies ALL CVEs in `jsonwebtoken@8.5.1` (CVE-2022-23529, CVE-2022-23539, CVE-2022-23540, CVE-2022-23541).

## Architecture

```
vuln-app-node/
├── server.js                 # Main application entry
├── routes/
│   ├── auth.js              # Authentication (JWT, SQL injection)
│   ├── user.js              # User management (Prototype pollution)
│   ├── file.js              # File operations (Path traversal, RCE)
│   ├── api.js               # External APIs (SSRF)
│   ├── data.js              # Data parsing (XXE, Code injection)
│   ├── template.js          # Template rendering (SSTI, RCE)
│   └── websocket.js         # WebSocket/Socket.IO
├── services/
│   ├── authService.js       # Auth logic (Crypto vulnerabilities)
│   ├── userService.js       # User operations (lodash usage)
│   ├── fileService.js       # File handling (shelljs, tar)
│   ├── apiService.js        # API interactions (axios, request)
│   ├── dataService.js       # Data processing (parsers, eval)
│   ├── templateService.js   # Template compilation
│   └── wsService.js         # WebSocket logic
├── utils/
│   ├── tokenUtils.js        # JWT/crypto utilities
│   ├── dataProcessor.js     # Data transformation (lodash)
│   ├── requestUtils.js      # HTTP request builders
│   ├── parserUtils.js       # XML/YAML parsers
│   └── archiveUtils.js      # Archive operations (tar)
├── package.json             # Dependencies manifest
├── Dockerfile               # Container definition
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## Security Considerations

### ⚠️ CRITICAL WARNINGS

1. **DO NOT** deploy this application in any production environment
2. **DO NOT** expose this application to the public internet
3. **DO NOT** use any code patterns from this application in real projects
4. **DO NOT** store real credentials or sensitive data
5. **USE ONLY** in isolated, controlled testing environments

### Intended Use Cases

✅ Testing SCA scanner reachability analysis capabilities
✅ Validating vulnerability detection accuracy
✅ Training security engineers on vulnerability patterns
✅ Benchmarking security tools
✅ Academic research on software security
✅ Developing better SCA scanning algorithms

### Prohibited Use Cases

❌ Production deployments
❌ Handling real user data
❌ Public accessibility
❌ Learning "secure" coding practices
❌ As template for real applications

## Contributing

This is a security testing resource. If you identify additional vulnerability patterns that would be valuable for SCA scanner testing, please contribute them.

## License

MIT License - For educational and testing purposes only.

## Disclaimer

This application is intentionally vulnerable and insecure. The authors and contributors are not responsible for any misuse or damage caused by this application. Use at your own risk in controlled environments only.

## References

- [CVE Database](https://cve.mitre.org/)
- [National Vulnerability Database](https://nvd.nist.gov/)
- [Snyk Vulnerability Database](https://security.snyk.io/)
- [GitHub Advisory Database](https://github.com/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated**: December 2025
**Total CVEs**: 100+
**Reachable CVEs**: 85+
**Cross-File Chains**: 5+
**API Endpoints**: 35+

