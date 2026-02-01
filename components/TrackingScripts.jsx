"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function TrackingScripts({
    gtmId,
    fbPixelId,
    gaId,
    tiktokPixelId,
    snapchatPixelId,
    enableGTM,
    enableFBPixel,
    enableGA,
    enableTikTok,
    enableSnapchat
}) {
    useEffect(() => {
        // Initialize Facebook Pixel
        if (enableFBPixel && fbPixelId && typeof window !== "undefined") {
            !(function (f, b, e, v, n, t, s) {
                if (f.fbq) return
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                }
                if (!f._fbq) f._fbq = n
                n.push = n
                n.loaded = !0
                n.version = "2.0"
                n.queue = []
                t = b.createElement(e)
                t.async = !0
                t.src = v
                s = b.getElementsByTagName(e)[0]
                s.parentNode.insertBefore(t, s)
            })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")

            window.fbq("init", fbPixelId)
            window.fbq("track", "PageView")
        }

        // Initialize TikTok Pixel
        if (enableTikTok && tiktokPixelId && typeof window !== "undefined") {
            !(function (w, d, t) {
                w.TiktokAnalyticsObject = t
                var ttq = (w[t] = w[t] || [])
                    ; (ttq.methods = [
                        "page",
                        "track",
                        "identify",
                        "instances",
                        "debug",
                        "on",
                        "off",
                        "once",
                        "ready",
                        "alias",
                        "group",
                        "enableCookie",
                        "disableCookie",
                    ]),
                        (ttq.setAndDefer = function (t, e) {
                            t[e] = function () {
                                t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                            }
                        })
                for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
                    ; (ttq.instance = function (t) {
                        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                            ttq.setAndDefer(e, ttq.methods[n])
                        return e
                    }),
                        (ttq.load = function (e, n) {
                            var i = "https://analytics.tiktok.com/i18n/pixel/events.js"
                                ; (ttq._i = ttq._i || {}),
                                    (ttq._i[e] = []),
                                    (ttq._i[e]._u = i),
                                    (ttq._t = ttq._t || {}),
                                    (ttq._t[e] = +new Date()),
                                    (ttq._o = ttq._o || {}),
                                    (ttq._o[e] = n || {})
                            var o = document.createElement("script")
                                ; (o.type = "text/javascript"),
                                    (o.async = !0),
                                    (o.src = i + "?sdkid=" + e + "&lib=" + t)
                            var a = document.getElementsByTagName("script")[0]
                            a.parentNode.insertBefore(o, a)
                        })

                ttq.load(tiktokPixelId)
                ttq.page()
            })(window, document, "ttq")
        }

        // Initialize Snapchat Pixel
        if (enableSnapchat && snapchatPixelId && typeof window !== "undefined") {
            !(function (e, t, n) {
                if (e.snaptr) return
                var a = (e.snaptr = function () {
                    a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments)
                })
                    ; (a.queue = []),
                        (r = "script"),
                        ((s = t.createElement(r)).async = !0),
                        (s.src = n)
                var c = t.getElementsByTagName(r)[0]
                c.parentNode.insertBefore(s, c)
            })(window, document, "https://sc-static.net/scevent.min.js")

            snaptr("init", snapchatPixelId, {
                user_email: "__INSERT_USER_EMAIL__",
            })
            snaptr("track", "PAGE_VIEW")
        }
    }, [fbPixelId, enableFBPixel, tiktokPixelId, enableTikTok, snapchatPixelId, enableSnapchat])

    return (
        <>
            {/* Google Tag Manager */}
            {enableGTM && gtmId && (
                <>
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
                        }}
                    />
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                </>
            )}

            {/* Google Analytics 4 */}
            {enableGA && gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="ga-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
                        }}
                    />
                </>
            )}

            {/* Facebook Pixel NoScript */}
            {enableFBPixel && fbPixelId && (
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
                    />
                </noscript>
            )}

            {/* TikTok Pixel NoScript */}
            {enableTikTok && tiktokPixelId && (
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://analytics.tiktok.com/i18n/pixel/static/${tiktokPixelId}.gif`}
                    />
                </noscript>
            )}
        </>
    )
}
