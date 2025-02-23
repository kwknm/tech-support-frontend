import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import "@/styles/globals.css";

import { Axios } from "@/api/api-provider.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider>
      <SWRConfig
        value={{
          // @ts-ignore
          fetcher: (...args) => Axios.get(...args).then((res) => res.data),
        }}
      >
        <App />
      </SWRConfig>
    </Provider>
  </BrowserRouter>,
);
