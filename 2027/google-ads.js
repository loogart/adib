/* Balise Google (Google Ads + Google Analytics 4), chargée seulement avec le consentement.
   Envoie la conversion « Clic billetterie » à chaque clic vers une billetterie,
   sur le même modèle que meta-pixel.js. */
(function () {
    var adsId = 'AW-18330321205';
    var conversionSendTo = 'AW-18330321205/k3wlCN7J7ZMdELWCyqRE';
    var analyticsId = 'G-769T4WFWPX';
    var ticketingDomains = [
        'lepointdevente.com',
        'ticketmaster.ca',
        'ticketmaster.com',
        'tuxedobillet.com',
        'epasslive.com',
        'maisondelaculture.ca',
        'theatredelaville.qc.ca',
        'ovation.ca',
        'culture3r.com',
        'spec.qc.ca',
        'co-motion.ca',
        'grizzlyfuzz.com',
        'leministere.ca',
        'francosmontreal.com',
        'festivalmosaiquelaval.com',
        'theatregranada.com',
        'theatreduvieuxterrebonne.com',
        'vieuxpalais.com',
        'chasse-galerie.ca',
        'concertsdelacite.ca',
        'chansontadoussac.com',
        'hahaha.com',
        'zoofest.com',
        'montgolfieresgatineau.com',
        'placedesarts.com',
        'billetterie.cinemabeaubien.com'
    ];

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    function loadGoogleTag() {
        if (window.adibGoogleTagLoaded) return;
        window.adibGoogleTagLoaded = true;

        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + adsId;
        document.head.appendChild(s);

        window.gtag('js', new Date());
        window.gtag('config', adsId);
        window.gtag('config', analyticsId);
    }

    function hasAdvertisingConsent() {
        return window.adibCookieConsent &&
            typeof window.adibCookieConsent.hasAdvertisingConsent === 'function' &&
            window.adibCookieConsent.hasAdvertisingConsent();
    }

    if (hasAdvertisingConsent()) {
        loadGoogleTag();
    }

    window.addEventListener('adib:cookie-consent', function (e) {
        if (e.detail && e.detail.advertising) {
            loadGoogleTag();
        }
    });

    document.addEventListener('click', function (e) {
        var lecteur = e.target && e.target.closest ? e.target.closest('.lecteur-bouton') : null;
        if (lecteur && window.adibGoogleTagLoaded) {
            window.gtag('event', 'ecoute_site', { send_to: analyticsId });
        }
        var special = e.target && e.target.closest ? e.target.closest('.special-ecran') : null;
        if (special && window.adibGoogleTagLoaded) {
            window.gtag('event', 'video_site', { send_to: analyticsId, spectacle: special.getAttribute('data-titre') || '' });
        }

        var target = e.target;
        var link = target && target.closest ? target.closest('a[href]') : null;
        if (!link || !window.adibGoogleTagLoaded) return;

        var href = link.href.toLowerCase();
        var isTicketLink = ticketingDomains.some(function (domain) {
            return href.indexOf(domain) > -1;
        });

        if (/myshopify\.com/.test(href)) {
            window.gtag('event', 'clic_boutique', {
                send_to: analyticsId,
                destination: link.href,
                transport_type: 'beacon'
            });
            return;
        }
        if (/spotify\.com|music\.apple\.com|bfan\.link|youtube\.com/.test(href)) {
            window.gtag('event', 'clic_musique', {
                send_to: analyticsId,
                destination: link.href,
                transport_type: 'beacon'
            });
            return;
        }

        if (isTicketLink) {
            window.gtag('event', 'conversion', {
                send_to: conversionSendTo,
                transport_type: 'beacon'
            });
            window.gtag('event', 'clic_billetterie', {
                send_to: analyticsId,
                destination: link.href,
                ville: new URLSearchParams(window.location.search).get('ville') || '',
                transport_type: 'beacon'
            });
        }
    }, true);
}());
