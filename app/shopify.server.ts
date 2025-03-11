import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  DeliveryMethod
} from "@shopify/shopify-app-remix/server";
import { RedisClientOptions, createClient } from 'redis';
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";
const client = createClient({ url: process.env.REDIS_URL } as RedisClientOptions);
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  webhooks: {
    PRODUCTS_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      const result = await shopify.registerWebhooks({ session });
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);
      console.log('registerWebhooks', result);

    }
  },
  sessionStorage: new RedisSessionStorage(client),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});


export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
