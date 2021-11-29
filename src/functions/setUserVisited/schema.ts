export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    visited: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attractionType: { type: 'string' },
          name: { type: 'string' },
          visitAgain: { type: 'string' }
        },
        required: ['attractionType', 'name', 'visitAgain']
      }
    }
  },
  required: ['username', 'visited']
} as const;
