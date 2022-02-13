export default {
  NAMESPACE: {
    LOGIN: 'login',
    AUTH: 'auth',
    QUESTION: 'question',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
  },
  RECEIVE: { LOGIN: { AUTH: 1000 } },
  QUESTION: { ANSWER: 2001 },
  RETURN: {
    AUTH: {
      LOGIN: 1000,
      USER_GO_ONLINE: 1001,
      DISCONNECT: 1002,
    },
  },
};
