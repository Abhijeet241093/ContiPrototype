import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './scss/index.scss'
import 'antd/dist/antd.css';
import 'mapbox-gl/dist/mapbox-gl.css';
const root = createRoot(document.getElementById("root"));

root.render(<App />);
