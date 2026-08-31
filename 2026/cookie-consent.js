(function () {
    var cookieName = 'adib_cookie_consent';
    var maxAge = 60 * 60 * 24 * 180;

    function getCookie(name) {
        var prefix = name + '=';
        var cookies = document.cookie ? document.cookie.split(';') : [];

        for (var i = 0; i < cookies.length; i += 1) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(prefix) === 0) {
                return decodeURIComponent(cookie.slice(prefix.length));
            }
        }

        return '';
    }

    function setCookie(name, value) {
        document.cookie = name + '=' + encodeURIComponent(value) + '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax';
    }

    function hasAdvertisingConsent() {
        return getCookie(cookieName) === 'accepted';
    }

    function dispatchConsent(value) {
        window.dispatchEvent(new CustomEvent('adib:cookie-consent', {
            detail: {
                advertising: value === 'accepted'
            }
        }));
    }

    function injectStyles() {
        if (document.getElementById('adib-cookie-consent-styles')) return;

        var style = document.createElement('style');
        style.id = 'adib-cookie-consent-styles';
        style.textContent = [
            '.adib-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;display:flex;gap:16px;align-items:center;justify-content:space-between;max-width:980px;margin:0 auto;padding:16px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 12px 32px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45}',
            '.adib-cookie-banner p{margin:0;max-width:700px}',
            '.adib-cookie-banner a{color:#fff;text-decoration:underline}',
            '.adib-cookie-actions{display:flex;gap:8px;flex-shrink:0}',
            '.adib-cookie-button{appearance:none;border:1px solid #fff;padding:10px 14px;background:#fff;color:#111;cursor:pointer;font:inherit;line-height:1}',
            '.adib-cookie-button.secondary{background:transparent;color:#fff}',
            '.adib-cookie-button:focus{outline:2px solid #fff;outline-offset:2px}',
            '@media (max-width:640px){.adib-cookie-banner{display:block;padding:14px}.adib-cookie-actions{margin-top:12px}.adib-cookie-button{flex:1}}'
        ].join('');

        document.head.appendChild(style);
    }

    function createBanner() {
        if (document.getElementById('adib-cookie-consent')) return;

        injectStyles();

        var banner = document.createElement('div');
        banner.id = 'adib-cookie-consent';
        banner.className = 'adib-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Consentement aux cookies');
        banner.innerHTML = [
            '<p>Ce site utilise des cookies de mesure publicitaire Meta pour comprendre les visites et les clics vers la billetterie. <a href="./politique-confidentialite.html">Politique de confidentialité</a></p>',
            '<div class="adib-cookie-actions">',
            '<button type="button" class="adib-cookie-button secondary" data-adib-cookie-choice="declined">Refuser</button>',
            '<button type="button" class="adib-cookie-button" data-adib-cookie-choice="accepted">Accepter</button>',
            '</div>'
        ].join('');

        banner.addEventListener('click', function (e) {
            var button = e.target.closest ? e.target.closest('[data-adib-cookie-choice]') : null;
            if (!button) return;

            var choice = button.getAttribute('data-adib-cookie-choice');
            setCookie(cookieName, choice);
            dispatchConsent(choice);
            banner.parentNode.removeChild(banner);
        });

        document.body.appendChild(banner);
    }

    window.adibCookieConsent = window.adibCookieConsent || {};
    window.adibCookieConsent.hasAdvertisingConsent = hasAdvertisingConsent;

    if (!getCookie(cookieName)) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createBanner);
        } else {
            createBanner();
        }
    }
}());
