import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';

import getApolloClient from './helpers/createApolloClient';
import App from './pages/App';

export default async function render() {
  const apolloClient = getApolloClient();

  const Tree = (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </ApolloProvider>
  );

  const root = document.getElementById('root')!;

  if (root.innerHTML !== '<!--root-outlet-->') {
    hydrateRoot(root, Tree);
  } else {
    createRoot(root).render(Tree);
  }
}

render()
  .catch(console.error);
