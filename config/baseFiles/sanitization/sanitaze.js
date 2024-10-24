const dangerousCommandsPattern = /[;&|><`]+/g;
const controlCharsPattern = /[\x00-\x1F\x7F-\x9F]/g;
const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|TABLE|OR|AND)\b|--)/gi;
const noSqlInjectionPattern = /(\$where|\$gt|\$lt|\$or)/gi;
const xssPattern = /<script.*?>.*?<\/script>|<img.*?onerror=.*?>/gi;
const headerInjectionPattern = /\r\n|\r|\n/g;
const extendedAsciiPattern = /[\x80-\xFF]/g;
const dangerousFunctionsPattern = /\b(eval|exec|system|spawn)\b/gi;
const xxePattern = /<\?xml[\s\S]*?<!DOCTYPE[\s\S]*?>[\s\S]*?<\/.*?>/g;
const MAX_PAYLOAD_SIZE = 10000;

function sanitizeInput(input) {
  switch (typeof input) {
    case 'string':
      if (input.length > MAX_PAYLOAD_SIZE) {
        return 'Request Blocked';
      }

      if (xxePattern.test(input)) {
        return 'Request Blocked';
      }
      
      input = input.replace(dangerousCommandsPattern, '');
      input = input.replace(controlCharsPattern, '');
      input = input.replace(sqlInjectionPattern, '');
      input = input.replace(noSqlInjectionPattern, '');
      input = input.replace(xssPattern, '');
      input = input.replace(headerInjectionPattern, '');
      input = input.replace(extendedAsciiPattern, '');
      input = input.replace(dangerousFunctionsPattern, '');
      input = input.trim();
      return input.replace(/[^a-zA-Z0-9 @.]/g, '');

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
