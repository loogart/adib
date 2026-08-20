(function () {
    var pixelId = '2095557687696893';
    var customEventName = 'ClicBilletterie';
    var ticketingDomains = [
        'lepointdevente.com',
        'ticketmaster.ca',
        'am.ticketmaster.com',
        'tuxedobillet.com',
        'epasslive.com',
        'maisondelaculture.ca',
        'theatredelaville.qc.ca',
        'reseau.ovation.ca',
        'ovation.ca',
        'culture3r.com',
        'spec.qc.ca',
        'co-motion.ca',
        'grizzlyfuzz.com',
        'leministere.ca',
        'francosmontreal.com',
        'festivalmosaiquelaval.com',
        'theatregranada.com',
        'legesu.tuxedobillet.com',
        'theatreduvieuxterrebonne.com',
        'vieuxpalais.com',
        'chasse-galerie.ca',
        'concertsdelacite.ca',
        'chansontadoussac.com',
        'hahaha.com',
        'zoofest.com',
        'montgolfieresgatineau.com',
        'billetterie.cinemabeaubien.com'
    ];

    function loadPixel() {
        if (window.adibMetaPixelLoaded) return;
        window.adibMetaPixelLoaded = true;

        !function(f,b,e,v,n,t,s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
    }

    function hasAdvertisingConsent() {
        return window.adibCookieConsent &&
            typeof window.adibCookieConsent.hasAdvertisingConsent === 'function' &&
            window.adibCookieConsent.hasAdvertisingConsent();
    }

    if (hasAdvertisingConsent()) {
        loadPixel();
    }

    window.addEventListener('adib:cookie-consent', function (e) {
        if (e.detail && e.detail.advertising) {
            loadPixel();
        }
    });

    document.addEventListener('click', function (e) {
        var target = e.target;
        var link = target && target.closest ? target.closest('a[href]') : null;
        if (!link || !window.adibMetaPixelLoaded || typeof window.fbq !== 'function') return;

        var href = link.href.toLowerCase();
        var isTicketLink = ticketingDomains.some(function (domain) {
            return href.indexOf(domain) > -1;
        });

        if (isTicketLink) {
            window.fbq('trackCustom', customEventName, {
                destination: link.href,
                page: window.location.pathname
            });
        }
    }, true);
}());
