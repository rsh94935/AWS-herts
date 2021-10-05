export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    fname: { type: 'string' },
    lname: { type: 'string' },
    add1: { type: 'string' },
    add2: { type: 'string' },
    city: { type: 'string' },
    postcode: { type: 'string' },
    preferences: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['username', 'fname', 'lname', 'add1', 'add2', 'city', 'postcode', 'preferences']
} as const;
