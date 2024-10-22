import pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = pkg.default;

import https from "https";

import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

const url = process.env.PRODUCTDB;
const consumerKey = process.env.CON_KEY;
const consumerSecret = process.env.CON_SECRET;

if (!url | !consumerKey | !consumerSecret) {
  console.error("Please set the woocommerce environment variables");
  process.exit(1);
}

const wc = new WooCommerceRestApi({
  url,
  consumerKey,
  consumerSecret,
  version: "wc/v3", // WooCommerce WP REST API version
  axiosConfig: { httpsAgent: new https.Agent({ rejectUnauthorized: false }) },
});

export default wc;
