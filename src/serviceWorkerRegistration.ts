interface CustomFetchEvent extends Event {
    request: Request;
}

export function register(onUpdate: () => void) {
    if ("serviceWorker" in navigator) {
        // excluding auth api calls from sw handling
        self.addEventListener("fetch", (event: Event) => {
            const fetchEvent = event as CustomFetchEvent;
            if (fetchEvent.request && fetchEvent.request.url) {
                const url = fetchEvent.request.url;
                if (url.includes("/oauth2") || url.includes("/auth")) {
                    fetchEvent.stopImmediatePropagation();
                }
            }
        });

        window.addEventListener("load", async () => {
            try {
                const registration = await navigator.serviceWorker.register("/service-worker.js");

                setInterval(async () => {
                    try {
                        await registration.update();
                    } catch (error) {
                        console.error("Error updating service worker:", error);
                    }
                }, 1000 * 60);

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (
                                installingWorker.state === "installed" &&
                                navigator.serviceWorker.controller
                            ) {
                                onUpdate && onUpdate();
                            }
                        };
                    }
                };
            } catch (error) {
                console.error("Error during service worker registration:", error);
            }
        });
    }
}
