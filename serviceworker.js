const CACHE = "pwabuilder-offline";

const offlineFallbackPage = "index.html";

// Cross-Origin Isolation headers for SharedArrayBuffer support (required for pthreads)
// This enables the game to run with consistent timing via Web Workers
const COI_HEADERS = {
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin"
};

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
    console.log("Install Event processing");

    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            console.log("Cached offline page during install");

            if (offlineFallbackPage === "ToDo-replace-this-name.html") {
                return cache.add(new Response("Update the value of the offlineFallbackPage constant in the serviceworker."));
            }

            return cache.add(offlineFallbackPage);
        }).then(function () {
            // Immediately activate without waiting for existing pages to close
            return self.skipWaiting();
        })
    );
});

// Activate stage - claim all clients immediately so we can add headers
self.addEventListener("activate", function (event) {
    console.log("Activate Event processing");
    event.waitUntil(self.clients.claim());
});

// Helper to add COOP/COEP headers to enable cross-origin isolation
function addCOIHeaders(response) {
    // Can't modify opaque responses or redirects
    if (response.type === "opaque" || response.type === "opaqueredirect") {
        return response;
    }

    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(COI_HEADERS)) {
        newHeaders.set(key, value);
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                console.log("Add page to offline cache: " + response.url);

                // Add COOP/COEP headers for cross-origin isolation
                const modifiedResponse = addCOIHeaders(response);

                // If request was success, add or update it in the cache
                event.waitUntil(updateCache(event.request, modifiedResponse.clone()));

                return modifiedResponse;
            })
            .catch(function (error) {
                console.log("Network request Failed. Serving content from cache: " + error);
                return fromCache(event.request);
            })
    );
});

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return error page
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return Promise.reject("no-match");
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(function (cache) {
        return cache.put(request, response);
    });
}
