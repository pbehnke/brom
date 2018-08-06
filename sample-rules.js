const {
  contentSecurityPolicy,
  cookie,
  featurePolicy,
  setCookie,
} = require('./parse-headers');

module.exports = [
  {

    // header that the rule applies to
    header: 'content-security-policy',

    // callback function to determine when to check this rule
    when: (headers, type) => type === 'response' && headers['content-type'] && headers['content-type'].indexOf('text/html') !== -1,

    // callback function to determine if rule passes or fails
    expect: headers => headers['content-security-policy'],

    // message and flags to set if rule fails
    fail: {
      message: 'No Content-Security-Policy in place.',
      flags: ['severe'],
    },

    // message and flags to set if rule passes
    pass: {
      flags: ['csp'],
    },

  },
  {
    header: 'content-security-policy',
    when: (headers, type) => type === 'response' && headers['content-security-policy'],
    expect: (headers) => {
      const policy = contentSecurityPolicy(headers['content-security-policy']);
      return policy['default-src'][0] !== '*';
    },
    fail: {
      message: 'Avoid setting default-src to a wild card. Try opting for a stricter default and looser rules on specific sources.',
      flags: ['severe'],
    },
    pass: {
      flags: [],
    },
  },
  {
    header: 'x-powered-by',
    when: (_, type) => type === 'response',
    expect: headers => !headers['x-powered-by'],
    fail: {
      message: 'The X-Powered-By header advertises unnecessary details about your server, and should not be sent.',
      flags: ['severe'],
    },
    pass: {
      flags: [],
    },
  },
  {
    header: 'x-content-type-options',
    when: (_, type) => type === 'response',
    expect: headers => headers['x-content-type'] === 'nosniff',
    fail: {
      message: 'X-Content-Type-Options should be present on all responses, with a value of nosniff.',
      flags: ['severe'],
    },
    pass: {
      flags: [],
    },
  },
  {
    header: 'feature-policy',
    when: (headers, type) => type === 'response' && headers['content-type'] && headers['content-type'].indexOf('text/html') !== -1,
    expect: headers => headers['feature-policy'],
    fail: {
      message: 'Consider setting a Feature-Policy header on HTML files, to restrict device access to necessary features.',
      flags: ['severe'],
    },
    pass: {
      flags: ['fp'],
    },
  },
  {
    header: 'x-xss-protection',
    when: (headers, type) => type === 'response' && headers['content-type'] && headers['content-type'].indexOf('text/html') !== -1,
    expect: headers => headers['x-xss-protection'] !== 0,
    fail: {
      message: 'While you may not need stricter XSS protection policies, there is rarely a good reason to deactivate the browser\'s default protections.',
      flags: ['severe'],
    },
    pass: {
      flags: ['fp'],
    },
  },
];
