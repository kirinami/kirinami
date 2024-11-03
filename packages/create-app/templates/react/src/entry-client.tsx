/* eslint-disable no-underscore-dangle */

import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { createStore } from '@/helpers/createStore';
import { HeadProvider } from '@/utils/react/head';

import { routes } from './main';

const store = createStore(window.__staticStoreHydrationData);

const router = createBrowserRouter(routes);

hydrateRoot(
  document.getElementById('root')!,
  <Provider store={store}>
    <HeadProvider>
      <RouterProvider router={router} />
    </HeadProvider>
  </Provider>,
);
