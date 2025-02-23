import axios from "axios";

import { siteConfig } from "../config/site.js";

export const Axios = axios.create({
  baseURL: siteConfig.api_url,
});

Axios.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + localStorage.getItem("token");

  return config;
});
