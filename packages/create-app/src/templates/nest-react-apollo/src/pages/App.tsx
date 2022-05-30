import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Meta from '@/components/Meta/Meta';
import Loader from '@/components/Common/Loader/Loader';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';

const HomePage = lazy(() => import('./HomePage/HomePage'));
const NotFoundPage = lazy(() => import('./NotFoundPage/NotFoundPage'));

export default function App() {
  return (
    <ThemeProvider>
      <Meta />
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="**" component={NotFoundPage} />
        </Switch>
      </Suspense>
    </ThemeProvider>
  );
}
