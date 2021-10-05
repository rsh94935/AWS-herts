export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    visited: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    visitAgain: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['username', 'visited', 'visitAgain']
} as const;
