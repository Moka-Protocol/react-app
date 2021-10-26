import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactGA from 'react-ga';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { DAppProvider } from '@usedapp/core'

import App from './containers/App';
import { KEYS, SENTRY_KEYS, GA_KEYS } from './constants/constants';

import { GlobalStyle } from 'styles/Global';

Sentry.init({
  dsn: SENTRY_KEYS[process.env.REACT_APP_ENV],
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.25,
});

ReactGA.initialize(GA_KEYS[process.env.REACT_APP_ENV]);

let SUBGRAPH_URI = KEYS[process.env.REACT_APP_ENV].SUBGRAPH_URI;

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      default: return object.id;
    }
  }
});

const client = new ApolloClient({
  uri: SUBGRAPH_URI,
  cache
});

const config = {
  supportedChains: [KEYS[process.env.REACT_APP_ENV].CHAINID],
  readOnlyChainId: KEYS[process.env.REACT_APP_ENV].CHAINID,
  readOnlyUrls: {
    [KEYS[process.env.REACT_APP_ENV].CHAINID]: KEYS[process.env.REACT_APP_ENV].CHAINRPC
  }
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <DAppProvider config={config}>
      <App SUBGRAPH_URI={SUBGRAPH_URI} />
      <GlobalStyle />
    </DAppProvider>
  </ApolloProvider>,
  document.getElementById('root')
);