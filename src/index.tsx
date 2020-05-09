import * as React from "react";
import * as ReactDOM from "react-dom";
const App = React.lazy(() => import(/* webpackChunkName: 'App' */ "./App"));

ReactDOM.render(
  <React.Suspense fallback={<div></div>}>
    <App />
  </React.Suspense>,
  document.getElementById("root")
);

if (process.env.ACTIVATE_SW && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("Service Worker has been registered: ", registration);
      })
      .catch((registrationError) => {
        console.error(
          "Service Worker has been failed to register: ",
          registrationError
        );
      });
  });
}
