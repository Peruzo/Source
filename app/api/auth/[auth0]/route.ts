import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      scope: 'openid profile email',
    },
  }),
  callback: handleCallback({
    afterCallback: async (_req, session) => {
      return session;
    },
  }),
});
