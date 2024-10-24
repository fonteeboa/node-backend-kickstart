const dangerousCommandsPattern = /[;&|><`]+/g;
const controlCharsPattern = /[\x00-\x1F\x7F-\x9F]/g;
const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|TABLE|OR|AND)\b|--)/gi;
const noSqlInjectionPattern = /(\$where|\$gt|\$lt|\$or)/gi;
const xssPattern = /<script.*?>.*?<\/script>|<img.*?onerror=.*?>/gi;
const headerInjectionPattern = /\r\n|\r|\n/g;
const extendedAsciiPattern = /[\x80-\xFF]/g;
const dangerousFunctionsPattern = /\b(eval|exec|system|spawn|whoami|etcpasswd|cat|touch|shutdown|uname)\b/gi;
const xxePattern = /<\?xml[\s\S]*?<!DOCTYPE[\s\S]*?>[\s\S]*?<\/.*?>/g;
const pathTraversalPattern = /(\.\.|\/\/|\\|\.\/)/g;
const allowedCharsPattern = /[^a-zA-Z0-9\s@._\-,:<>[\]{}|]/g;
const MAX_PAYLOAD_SIZE = 10000;

const accentMapping = {
  'Ё': 'E', 'ё': 'e', 'Є': 'E', 'є': 'e', 'Ї': 'I', 'ї': 'i', 'Љ': 'Lj', 'љ': 'lj', 'Њ': 'Nj', 'њ': 'nj',
  'Ћ': 'C', 'ћ': 'c', 'Ќ': 'K', 'ќ': 'k', 'Ў': 'U', 'ў': 'u', 'Џ': 'Dz', 'џ': 'dz', 'Ә': 'A', 'ә': 'a', 'Ғ': 'G', 'ғ': 'g',
  'Қ': 'K', 'қ': 'k', 'Ң': 'N', 'ң': 'n', 'Ү': 'U', 'ү': 'u', 'Ұ': 'U', 'ұ': 'u', 'Ҳ': 'H', 'ҳ': 'h', 'Җ': 'Zh', 'җ': 'zh',
  'Ҹ': 'Ch', 'ҹ': 'ch', 'Ѡ': 'O', 'ѡ': 'o', 'Ѣ': 'E', 'ѣ': 'e', 'Ѥ': 'E', 'ѥ': 'e', 'Ѧ': 'A', 'ѧ': 'a', 'Ѩ': 'Ya', 'ѩ': 'ya',
  'Ѫ': 'U', 'ѫ': 'u', 'Ѭ': 'Yu', 'ѭ': 'yu', 'Ѯ': 'Ks', 'ѯ': 'ks', 'Ѱ': 'Ps', 'ѱ': 'ps', 'Ѳ': 'F', 'ѳ': 'f', 'Ѵ': 'V', 'ѵ': 'v',
  'Ѷ': 'V', 'ѷ': 'v', 'Ѹ': 'U', 'ѹ': 'u', 'Ѻ': 'O', 'ѻ': 'o', 'Ѽ': 'O', 'ѽ': 'o', 'Ѿ': 'O', 'ѿ': 'o', 'Ҁ': 'S', 'ҁ': 's',
  '҂': 'S', '҃': 's', '҄': 'N', '҅': 'n', '҆': 'T', '҇': 't', '҈': 'Zh', '҉': 'zh', 'Ҋ': 'Ch', 'ҋ': 'ch', 'Ҍ': 'D', 'ҍ': 'd',
  'Ҏ': 'R', 'ҏ': 'r', 'Ӏ': 'I', 'Ӂ': 'Zh', 'ӂ': 'zh', 'Ӄ': 'K', 'ӄ': 'k', 'Ӆ': 'L', 'ӆ': 'l', 'Ӈ': 'N', 'ӈ': 'n', 'Ӊ': 'Ng',
  'ӊ': 'ng', 'Ӌ': 'Ch', 'ӌ': 'ch', 'Ӎ': 'M', 'ӎ': 'm', 'ӏ': 'I', 'Ӑ': 'A', 'ӑ': 'a', 'Ӓ': 'A', 'ӓ': 'a', 'Ӕ': 'Ae', 'ӕ': 'ae',
  'Ә': 'A', 'ә': 'a', 'Ӗ': 'E', 'ӗ': 'e', 'Ғ': 'G', 'ғ': 'g', 'Ҕ': 'G', 'ҕ': 'g', 'Җ': 'Zh', 'җ': 'zh', 'Ҙ': 'Z', 'ҙ': 'z',
  'Қ': 'K', 'қ': 'k', 'Ҝ': 'K', 'ҝ': 'k', 'Ҟ': 'K', 'ҟ': 'k', 'Ҡ': 'K', 'ҡ': 'k', 'Ң': 'N', 'ң': 'n', 'Ҥ': 'N', 'ҥ': 'n',
  'Ү': 'U', 'ү': 'u', 'Ұ': 'U', 'ұ': 'u', 'Ҳ': 'H', 'ҳ': 'h', 'Җ': 'Zh', 'җ': 'zh', 'Ҵ': 'Ts', 'ҵ': 'ts', 'Ҷ': 'Ch', 'ҷ': 'ch',
  'Ҹ': 'Ch', 'ҹ': 'ch', 'Һ': 'H', 'һ': 'h', 'Ҽ': 'Ts', 'ҽ': 'ts', 'Ҿ': 'Ts', 'ҿ': 'ts', 'Ӏ': 'I', 'Ӂ': 'Zh', 'ӂ': 'zh'
};

function replaceAccentedCharacters(input) {
  return input.split('').map(char => {
    if (char === '-') return '_';
    return accentMapping[char] || char;
  }).join('');
}

function sanitizeInput(input) {
  switch (typeof input) {
    case 'string':
      if (input.length > MAX_PAYLOAD_SIZE) {
        return 'Request Blocked';
      }

      if (xxePattern.test(input)) {
        return 'Request Blocked';
      }
      input = replaceAccentedCharacters(input);
      input = input.replace(dangerousCommandsPattern, '');
      input = input.replace(controlCharsPattern, '');
      input = input.replace(sqlInjectionPattern, '');
      input = input.replace(noSqlInjectionPattern, '');
      input = input.replace(xssPattern, '');
      input = input.replace(headerInjectionPattern, '');
      input = input.replace(extendedAsciiPattern, '');
      input = input.replace(allowedCharsPattern, '');
      input = input.replace(pathTraversalPattern, '');
      input = input.replace(dangerousFunctionsPattern, '');
      return input.trim();

    case 'object':
      if (input === null) {
        return input;
      }

      if (Array.isArray(input)) {
        return input.map(sanitizeInput);
      }

      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          input[key] = sanitizeInput(input[key]);
        }
      }
      return input;

    default:
      return input;
  }
};

module.exports = sanitizeInput;
