import "workbox-sw";

import { skipWaiting, clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

const assetEntries = self.__WB_MANIFEST;

function precacheAssets() {
  function filterByAssetType(entries) {
    const assetExtensions = [".js", ".css", ".html"];
    return entries.filter(({ url }) =>
      assetExtensions.some((ext) => url.endsWith(ext))
    );
  }

  const precachedEntries = filterByAssetType(assetEntries);
  precacheAndRoute(precachedEntries);
}

function cacheImages() {
  registerRoute(
    /.*\.(jpg|svg|webp|gif|jpeg|png)(\?|$)/,
    new StaleWhileRevalidate({
      cacheName: "images",
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
}

function setupOfflineRoutes() {
  const indexHtmlEntry = assetEntries.find(({ url }) =>
    url.endsWith("index.html")
  );
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL(indexHtmlEntry.url), {
      denylist: [/.*\.(jpg|svg|webp|gif|jpeg|png|js|css)(\?|$)/],
    })
  );
}

skipWaiting();
clientsClaim();

precacheAssets();

setupOfflineRoutes();
cacheImages();
