import store from "@/config/redux/reducer/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Linkify</title>
        <meta name="description" content="Best project ever!" />
        <link rel="icon" href="/images/logo.png" /> 
        {/* Put logo.png or favicon.ico inside /public */}
      </Head>

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
