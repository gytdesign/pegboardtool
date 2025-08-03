// pages/_app.js

import '../styles/style.css'; // ✅ your global styles
import React from 'react';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
