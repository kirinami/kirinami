import { Helmet } from 'react-helmet-async';

export default function Meta() {
  return (
    <Helmet prioritizeSeoTags>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="React.js Starter powered by KIRINAMI" />
      <meta name="keywords" content="" />
      <meta property="og:title" content="React.js Starter powered by KIRINAMI"/>
      <title>React.js Starter powered by KIRINAMI</title>
    </Helmet>
  );
}
