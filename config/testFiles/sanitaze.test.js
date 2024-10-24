const sanitizeInput = require('../utils/sanitaze');

// Grupo 1: Testes simples
const simpleTests = [
  { name: 'Simple Text', input: 'Hello World', expected: 'Hello World' },
  { name: 'Number Input', input: 123, expected: 123 },
  { name: 'Boolean True', input: true, expected: true },
  { name: 'Boolean False', input: false, expected: false },
  { name: 'Null Input', input: null, expected: null },
  { name: 'Undefined Input', input: undefined, expected: undefined },
  { name: 'Basic Text', input: 'test', expected: 'test' },
  { name: 'Sanitize Boolean Inverted', input: 'false==true', expected: 'falsetrue' },
  { name: 'Sanitize Boolean AND in String', input: 'true&&false', expected: 'truefalse' },
];

// Grupo 2: Sanitização de caracteres especiais
const specialCharacterTests = [
  { name: 'Sanitize Double Hyphen', input: 'input--teste', expected: 'input__teste' },
  { name: 'Sanitize Special Characters', input: 'input@#%%%@%#!%!tes!$@$!@$!@$te', expected: 'input@@tes@@@te' },
  { name: 'Sanitize Extended ASCII', input: '\x7F\x80\x81normal\x82\x83\x84string', expected: 'normalstring' },
  { name: 'Sanitize Base64 Script', input: 'PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4=', expected: 'PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4' },
  { name: 'Allow Safe Special Characters', input: 'validInput-123!@#$', expected: 'validInput_123@' },
  { name: 'Allow Colon and Underscore', input: 'abc:def_ghi;jkl', expected: 'abc:def_ghijkl' },
  { name: 'Sanitize Complex String', input: '$(whoami); DROP TABLE users; --', expected: 'users __' },
];

// Grupo 3: Sanitização de comandos e operadores
const commandTests = [
  { name: 'Sanitize Command Semicolon', input: ';ls', expected: '' },
  { name: 'Sanitize Command AND', input: '&&whoami', expected: '' },
  { name: 'Sanitize Command Pipe', input: '|id', expected: 'id' },
  { name: 'Sanitize Command Echo', input: '&&echo Injection Test', expected: 'echo Injection Test' },
  { name: 'Sanitize Command Touch', input: '|touch /tmp/hacked', expected: 'tmphacked' },
  { name: 'Sanitize Command Uname', input: ';uname -a', expected: '_a' },
  { name: 'Sanitize Dangerous Characters', input: 'command;;rm -rf /', expected: 'commandrm _rf' },
  { name: 'Sanitize Comparison Operators', input: 'input--valid!=invalid', expected: 'input__validinvalid' },
  { name: 'Sanitize Command with OR', input: 'ls || cat /etc/passwd', expected: '' },
  { name: 'Sanitize Echo Command', input: ';echo "Hacked"', expected: 'echo Hacked' },
  { name: 'Sanitize Shutdown Command', input: '&&shutdown -h now', expected: '_h now' },
  { name: 'Sanitize Nested JSON Structure', input: { user: { name: '<script>', role: 'admin' }, permissions: ['read', 'write', '$delete'] }, expected: { user: { name: 'script', role: 'admin' }, permissions: ['read', 'write', 'delete'] } },
];

// Grupo 4: Injeções (SQL, NoSQL, XSS, etc.)
const injectionTests = [
  { name: 'SQL Injection OR 1=1', input: "' OR 1=1; --", expected: '11 __' },
  { name: 'SQL Injection UNION SELECT', input: "' UNION SELECT username, password FROM users; --", expected: 'username, password FROM users __' },
  { name: 'SQL Injection Drop Table', input: "'; drop DrOp dRoP TABLE users; --", expected: 'users __' },
  { name: 'NoSQL Injection MongoDB Always True', input: "{ $or: [ {}, { 'username': { $gt: '' } } ] }", expected: '{ : [ {}, { username: { :  } } ] }' },
  { name: 'NoSQL Injection MongoDB Comment Out', input: "{ $where: '1 == 1' }", expected: '{ : 1  1 }' },
  { name: 'XSS Script Injection', input: "<script>alert('XSS')</script>", expected: 'scriptalertXSSscript' },
  { name: 'XSS Image Onerror', input: '<img src="invalid" onerror="alert(\'XSS\')" />', expected: 'img srcinvalid onerroralertXSS' },
];

// Grupo 5: DDoS
const ddosTests = [
  { name: 'DDoS Test Small Payload', input: 'A'.repeat(1000), expected: 'A'.repeat(1000) },
  { name: 'DDoS Test Large Payload', input: 'A'.repeat(1000000), expected: 'Request Blocked' },
];

// Grupo 6: Casos que cobrem o `case 'object'` (Objetos e Arrays)
const objectTests = [
  { name: 'Object is Null', input: null, expected: null },
  { name: 'Array of Strings', input: ['<script>', 'test'], expected: ['script', 'test'] },
  { name: 'Array of Mixed Types', input: ['<script>', 123, false], expected: ['script', 123, false] },
  { name: 'Simple Object with Strings', input: { name: '<script>', role: 'admin' }, expected: { name: 'script', role: 'admin' } },
  { name: 'Nested Object', input: { user: { name: '<alert>', role: 'user' } }, expected: { user: { name: 'alert', role: 'user' } } },
  { name: 'Object with Array', input: { names: ['<script>', 'admin'] }, expected: { names: ['script', 'admin'] } },
  { name: 'Array of Objects', input: [{ name: '<script>' }, { role: 'admin' }], expected: [{ name: 'script' }, { role: 'admin' }] },
  { name: 'Object with Safe Properties', input: { age: 30, isAdmin: true }, expected: { age: 30, isAdmin: true } },
];

// Grupo 7: Injeção Binária e Buffer
const binaryTests = [
  { name: 'Binary Injection Null Characters', input: '\x00\x00\x00\x00\x00\x00\x00\x00', expected: '' },
  { name: 'Binary Injection Shellcode', input: '\x90\x90\x90\x90\xEB\xFE\xC3', expected: '' },
  { name: 'Binary Injection Overflow Pattern', input: '\x41\x41\x41\x41\x42\x42\x42\x42\x43\x43\x43\x43', expected: 'AAAABBBBCCCC' },
  { name: 'Binary Injection Malformed UTF-8', input: '\xC3\x28', expected: '' },
  { name: 'Binary Injection Executable Header', input: '\x4D\x5A\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00', expected: '' },
  { name: 'Binary Injection ASCII to Binary Conversion', input: Buffer.from('echo vulnerable', 'ascii').toString('binary'), expected: 'echo vulnerable' },
  { name: 'Binary Injection JPEG File Header', input: '\xFF\xD8\xFF\xE0\x00\x10\x4A\x46\x49\x46\x00\x01', expected: 'JFIF' },
  { name: 'Binary Injection ELF Executable', input: '\x7F\x45\x4C\x46\x02\x01\x01\x00', expected: 'ELF' },
];

// Grupo 8: Outros casos
const otherTests = [
  { name: 'Array with nested objects', input: ['<script>', 123, true, '$dollar$', 'cleanString'], expected: ['script', 123, true, 'dollar', 'cleanString'] },
  { name: 'Object with nested objects', input: { info: { code: '$special$', message: '<alert>' }, status: 'safe' }, expected: { info: { code: 'special', message: 'alert' }, status: 'safe' } },
];

// Função para rodar os testes agrupados
function runTests(testGroup, groupName) {
  describe(`Sanitization Tests - ${groupName}`, () => {
    testGroup.forEach(testCase => {
      it(`Should correctly process: ${testCase.name}`, () => {
        const result = sanitizeInput(testCase.input);
        expect(result).toStrictEqual(testCase.expected);
      });
    });
  });
}

// Rodando os testes
runTests(simpleTests, 'Simple Inputs');
runTests(specialCharacterTests, 'Special Characters');
runTests(commandTests, 'Command Sanitization');
runTests(injectionTests, 'Injection Prevention');
runTests(ddosTests, 'DDoS Prevention');
runTests(objectTests, 'Object and Array Handling');
runTests(binaryTests, 'Binary and Buffer Injections');
runTests(otherTests, 'Miscellaneous');
