import * as React from 'react';

export const AuthContext = React.createContext({
  status: 'idle',
  authToken: null as string | null,
  signIn: (email: string, password: string) => {
    console.log("origin here")
  },
  signOut: () => {
    console.log("origin here")
  },
});
