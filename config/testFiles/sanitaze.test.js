const sanitizeInput = require('../utils/sanitaze');

const testCases = [
  {
    name: 'Simple Text',
    input: 'Hello World',
    description: 'Simple text input',
    type: 'Valid Input',
    expected: 'Hello World',
  },
  {
    name: 'Number Input',
    input: 123,
    description: 'Number input',
    type: 'Valid Input',
    expected: 123,
  },
  {
    name: 'Boolean True',
    input: true,
    description: 'Boolean input true',
    type: 'Valid Input',
    expected: true,
  },
  {
    name: 'Boolean False',
    input: false,
    description: 'Boolean input false',
    type: 'Valid Input',
    expected: false,
  },
  {
    name: 'Null Input',
    input: null,
    description: 'Null input',
    type: 'Valid Input',
    expected: null,
  },
  {
    name: 'Undefined Input',
    input: undefined,
    description: 'Undefined input',
    type: 'Valid Input',
    expected: undefined,
  },
  {
    name: 'Basic Text',
    input: 'test',
    description: 'Basic text input',
    type: 'Valid Input',
    expected: 'test',
  },
  {
    name: 'Sanitize Double Hyphen',
    input: 'input--teste',
    description: 'Sanitization of double hyphens',
    type: 'Sanitization',
    expected: 'input__teste',
  },
  {
    name: 'Sanitize Special Characters',
    input: 'input@#%%%@%#!%!tes!$@$!@$!@$te',
    description: 'Sanitization of special characters',
    type: 'Sanitization',
    expected: 'input@@tes@@@te',
  },
  {
    name: 'Sanitize Command Semicolon',
    input: ';ls',
    description: 'Sanitization of command attempt with semicolon',
    type: 'Command Injection',
    expected: '',
  },
  {
    name: 'Sanitize Command AND',
    input: '&&whoami',
    description: 'Sanitization of command attempt with logical AND',
    type: 'Command Injection',
    expected: '',
  },
  {
    name: 'Sanitize Command Pipe',
    input: '|id',
    description: 'Sanitization of command attempt with pipe',
    type: 'Command Injection',
    expected: 'id',
  },
  {
    name: 'Sanitize Command Cat',
    input: ';cat /etc/passwd',
    description: 'Sanitization of command attempt to read file',
    type: 'Command Injection',
    expected: '',
  },
  {
    name: 'Sanitize Command Echo',
    input: '&&echo Injection Test',
    description: 'Sanitization of command attempt with echo',
    type: 'Command Injection',
    expected: 'echo Injection Test',
  },
  {
    name: 'Sanitize Command Touch',
    input: '|touch /tmp/hacked',
    description: 'Sanitization of command attempt to create file',
    type: 'Command Injection',
    expected: 'tmphacked',
  },
  {
    name: 'Sanitize Command Uname',
    input: ';uname -a',
    description: 'Sanitization of command attempt to run uname',
    type: 'Command Injection',
    expected: '_a',
  },
  {
    name: 'Sanitize Null Characters and Script',
    input: '\x00\x01\x02<script>\x03\x04\x05',
    description: 'Sanitization of null characters and script tags',
    type: 'XSS',
    expected: 'script',
  },
  {
    name: 'Sanitize Hexadecimal with Script',
    input: '0xDEADBEEF<script>0xCAFEBABE',
    description: 'Sanitization of hexadecimal values and script tags',
    type: 'XSS',
    expected: '0xDEADBEEFscript0xCAFEBABE',
  },
  {
    name: 'Sanitize Extended ASCII',
    input: '\x7F\x80\x81normal\x82\x83\x84string',
    description: 'Sanitization of extended ASCII characters',
    type: 'Sanitization',
    expected: 'normalstring',
  },
  {
    name: 'Sanitize Base64 Script',
    input: 'PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4=',
    description: 'Sanitization of base64 input with script content',
    type: 'XSS',
    expected: 'PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4',
  },
  {
    name: 'Sanitize Special ASCII and Script',
    input: '\x90\x90\xEB\x0F\x5E<script>\x89\x46\x0C',
    description: 'Sanitization of special characters and script',
    type: 'XSS',
    expected: 'scriptF',
  },
  {
    name: 'Allow Safe Special Characters',
    input: 'validInput-123!@#$',
    description: 'Allow safe special characters',
    type: 'Valid Input',
    expected: 'validInput_123@',
  },
  {
    name: 'Allow Colon and Underscore',
    input: 'abc:def_ghi;jkl',
    description: 'Allow colon, underscore, and semicolon',
    type: 'Valid Input',
    expected: 'abc:def_ghijkl',
  },
  {
    name: 'Sanitize Dangerous Characters',
    input: 'command;;rm -rf /',
    description: 'Remove dangerous character sequences',
    type: 'Sanitization',
    expected: 'commandrm _rf',
  },
  {
    name: 'Sanitize Comparison Operators',
    input: 'input--valid!=invalid',
    description: 'Sanitize comparisons and double hyphens',
    type: 'Sanitization',
    expected: 'input__validinvalid',
  },
  {
    name: 'Sanitize Command with OR',
    input: 'ls || cat /etc/passwd',
    description: 'Sanitize command attempts with logical OR',
    type: 'Command Injection',
    expected: '',
  },
  {
    name: 'Sanitize Echo Command',
    input: ';echo "Hacked"',
    description: 'Sanitization of echo command with semicolon',
    type: 'Command Injection',
    expected: 'echo Hacked',
  },
  {
    name: 'Sanitize Shutdown Command',
    input: '&&shutdown -h now',
    description: 'Sanitization of shutdown attempt',
    type: 'Command Injection',
    expected: '_h now',
  },
  {
    name: 'Sanitize Uname and Whoami',
    input: 'uname -a && whoami',
    description: 'Sanitization of uname command with logical AND',
    type: 'Command Injection',
    expected: '_a',
  },
  {
    name: 'SQL Injection OR 1=1',
    input: "' OR 1=1; --",
    description: 'SQL Injection attempt to bypass login',
    type: 'SQL Injection',
    expected: '11 __',
  },
  {
    name: 'SQL Injection UNION SELECT',
    input: "' UNION SELECT username, password FROM users; --",
    description: 'SQL Injection attempt using UNION SELECT',
    type: 'SQL Injection',
    expected: 'username, password FROM users __',
  },
  {
    name: 'SQL Injection Drop Table',
    input: "'; DROP TABLE users; --",
    description: 'SQL Injection attempt to drop table',
    type: 'SQL Injection',
    expected: 'users __',
  },
  {
    name: 'NoSQL Injection MongoDB Always True',
    input: "{ $or: [ {}, { 'username': { $gt: '' } } ] }",
    description: 'NoSQL Injection attempt to bypass authentication',
    type: 'NoSQL Injection',
    expected: '{ : [ {}, { username: { :  } } ] }',
  },
  {
    name: 'NoSQL Injection MongoDB Comment Out',
    input: "{ $where: '1 == 1' }",
    description: 'NoSQL Injection attempt with $where',
    type: 'NoSQL Injection',
    expected: '{ : 1  1 }',
  },
  {
    name: 'XSS Script Injection',
    input: "<script>alert('XSS')</script>",
    description: 'XSS script injection attempt',
    type: 'XSS',
    expected: 'scriptalertXSSscript',
  },
  {
    name: 'XSS Image Onerror',
    input: '<img src="invalid" onerror="alert(\'XSS\')" />',
    description: 'XSS injection attempt via image attribute',
    type: 'XSS',
    expected: 'img srcinvalid onerroralertXSS',
  },
  {
    name: 'DDoS Test Small Payload',
    input: 'A'.repeat(1000),
    description: 'DDoS attempt with small repeated requests',
    type: 'DDoS',
    expected: 'A'.repeat(1000),
  },
  {
    name: 'DDoS Test Large Payload',
    input: 'A'.repeat(1000000),
    description: 'DDoS attempt with massive payload',
    type: 'DDoS',
    expected: 'Request Blocked',
  },
  {
    name: 'CSRF Forged Request',
    input: "<img src='http://target.com/transfer?amount=1000&to=attacker'>",
    description: 'CSRF forged request attempt',
    type: 'CSRF',
    expected: 'img srchttp:target.comtransferamount1000toattacker',
  },
  {
    name: 'Directory Traversal',
    input: '../../etc/passwd',
    description: 'Directory traversal attempt to access sensitive files',
    type: 'Traversal',
    expected: '',
  },
  {
    name: 'Command Injection Attempt',
    input: '|| ls -la ||',
    description: 'Command injection attempt on system',
    type: 'Command Injection',
    expected: '_la',
  },
  {
    name: 'LDAP Injection',
    input: "*)(userPassword=*)",
    description: 'LDAP Injection attempt to retrieve passwords',
    type: 'LDAP Injection',
    expected: 'userPassword',
  },
  {
    name: 'Validation Bypass with Invalid Email',
    input: 'invalid-email@',
    description: 'Validation bypass attempt with invalid email',
    type: 'Validation Bypass',
    expected: 'invalid_email@',
  },
  {
    name: 'Validation Bypass with Empty Field',
    input: '',
    description: 'Validation bypass attempt with empty field',
    type: 'Validation Bypass',
    expected: '',
  },
  {
    name: 'HTTP Header Injection',
    input: "Content-Length: 0\r\n\r\nHTTP/1.1 200 OK\r\n\r\n",
    description: 'Attempt to inject malicious HTTP headers',
    type: 'Header Injection',
    expected: 'Content_Length: 0HTTP1.1 200 OK',
  },
  {
    name: 'XXE Injection',
    input: `<?xml version="1.0"?>
            <!DOCTYPE foo [  
            <!ELEMENT foo ANY >
            <!ENTITY xxe SYSTEM "file:///etc/passwd" >]>
            <foo>&xxe;</foo>`,
    description: 'XXE (XML External Entity) injection attempt',
    type: 'XXE',
    expected: 'Request Blocked',
  },
  {
    name: 'JWT Token Tampering',
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF0dGFja2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT token tampering attempt',
    type: 'JWT Manipulation',
    expected: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF0dGFja2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  
  {
    name: 'Array with nested objects',
    input:['<script>', 123, true, '$dollar$', 'cleanString'],
    description: 'Simple text input',
    type: 'Valid Input',
    expected: ['script', 123, true, 'dollar', 'cleanString'],
  },
  {
    name: 'Object with nested objects',
    input: { info: { code: '$special$', message: '<alert>' }, status: 'safe' },
    description: 'Simple text input',
    type: 'Valid Input',
    expected: { info: { code: 'special', message: 'alert' }, status: 'safe' },
  },
  {
    name: 'Special Characters Input',
    input: '!@#$%^&*()_+-=[]{}|;:",.<>?/`~©..--.///../®™€£¥§«»¿¡±°µ¶×÷¤©®¢¥£µªº¿¡¶¼½¾¬¤¦°·¨©ÆØÞßÐæøþœŒ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷ÞþÐðßæœŒƏəΩ≈ç√∫˜≤≥÷„“”‘’†‡•…‰′″‹›ЁёЄєЇїЉљЊњЋћЌќЎўЏџӘәҒғҚқҢңҮүҰұҲҳҖҗҸҹѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҇҈҉ҊҋҌҍҎҏӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӘәӖӗӘәҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҮүҰұҲҳҖҗҴҵҶҷҸҹҺһҼҽҾҿӀӁӂαβγδεζηθικλμνξοπρςστυφχψωάέήίΰαβγδεζηθικλμνξοπρςστυφχψωάέήίΰἀἁἂἃἄἅἆἇἈἉἊἋἌἍἎἏᾀᾁᾂᾃᾄᾅᾆᾇᾈᾉᾊᾋᾌᾍᾎᾏὰὲὴὶὸὺὼᾀᾁᾂᾃᾄᾅᾆᾇᾈᾉᾊᾋᾌᾍᾎᾏἀἁἂἃἄἅἆἇἈἉἊἋἌἍἎἏὰὲὴὶὸὺὼḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ',
    description: 'Simple text input',
    type: 'Valid Input',
    expected: '@__[]{}:,.__.EeEeIiLjljNjnjCcKkUuDzdzAaGgKkNnUuUuHhZhzhChchOoEeEeAaYayaUuYuyuKsksPspsFfVvVvUuOoOoOoSsSsNnTtZhzhChchDdRrIZhzhKkLlNnNgngChchMmIAaAaAeaeAaEeAaGgGgZhzhZzKkKkKkKkNnNnUuUuHhZhzhTstsChchChchHhTstsTstsIZhzh',
  },
  {
    name: 'Special Characters Input',
    input: "'",
    description: 'Simple text input',
    type: 'Valid Input',
    expected: "",
  },
  {
    name: 'BigInt Input',
    input: BigInt(12345678901234567890),
    description: 'BigInt input',
    type: 'Valid Input',
    expected: BigInt(12345678901234567890),
  },
  {
    name: 'Binary Injection Null Characters',
    input: '\x00\x00\x00\x00\x00\x00\x00\x00',
    description: 'Binary injection attempt with null characters',
    type: 'Binary Injection',
    expected: ''
  },
  {
    name: 'Binary Injection Shellcode',
    input: '\x90\x90\x90\x90\xEB\xFE\xC3',
    description: 'Binary injection attempt with shellcode',
    type: 'Binary Injection',
    expected: ''
  },
  {
    name: 'Binary Injection Overflow Pattern',
    input: '\x41\x41\x41\x41\x42\x42\x42\x42\x43\x43\x43\x43',
    description: 'Binary injection attempt with overflow pattern',
    type: 'Binary Injection',
    expected: 'AAAABBBBCCCC'
  },
  {
    name: 'Binary Injection Malformed UTF-8',
    input: '\xC3\x28',
    description: 'Binary injection attempt with malformed UTF-8 sequence',
    type: 'Binary Injection',
    expected: ''
  },
  {
    name: 'Binary Injection Executable Header',
    input: '\x4D\x5A\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00',
    description: 'Binary injection attempt with executable file header (PE format)',
    type: 'Binary Injection',
    expected: ''
  },
  {
    name: 'Binary Injection ASCII to Binary Conversion',
    input: Buffer.from('echo vulnerable', 'ascii').toString('binary'),
    description: 'Binary injection attempt with ASCII to binary conversion',
    type: 'Binary Injection',
    expected: 'echo vulnerable'
  },
  {
    name: 'Binary Injection JPEG File Header',
    input: '\xFF\xD8\xFF\xE0\x00\x10\x4A\x46\x49\x46\x00\x01',
    description: 'Binary injection attempt with JPEG file header',
    type: 'Binary Injection',
    expected: 'JFIF'
  },
  {
    name: 'Binary Injection ELF Executable',
    input: '\x7F\x45\x4C\x46\x02\x01\x01\x00',
    description: 'Binary injection attempt with ELF executable header',
    type: 'Binary Injection',
    expected: 'ELF'
  },
  {
    name: 'ls in the middle of the string',
    input: 'testelstest',
    description: 'Sanitization of word with ls in the middle',
    type: 'sanitization',
    expected: 'testelstest'
  }
];

testCases.forEach(testCase => {
  describe('Input Sanitization', () => {
    it(`Should correctly process input: ${testCase.input}`, () => {
      const result = sanitizeInput(testCase.input);
      expect(result).toStrictEqual(testCase.expected);
    });
  });
});
