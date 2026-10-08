/* Arrivée par ville : adibalkhalidey.com/?ville=sherbrooke
   Fait défiler jusqu'à la prochaine date de cette ville dans « spectacles d'humour »
   et la met en évidence. Sans paramètre ?ville=, ne fait rien. */
(function () {
    function norm(s) {
        return (s || '')
            .toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    var ville = norm(new URLSearchParams(window.location.search).get('ville'));
    if (!ville) return;

    /* Cas où la ville seule ne suffit pas : à Montréal, on vise les supplémentaires. */
    var precision = { 'montreal': 'maisonneuve' }[ville] || '';

    var style = document.createElement('style');
    style.textContent = [
        '.ville-cible{position:relative;background:rgba(239,111,34,.12);box-shadow:inset 4px 0 0 var(--site-highlight,#EF6F22);border-radius:4px}',
        '.ville-cible .ville-etiquette{display:inline-block;margin-bottom:.4rem;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--site-highlight,#EF6F22)}',
        '.ville-cible .btn-outline-light{background:var(--site-text,#FFB287)!important;border-color:var(--site-text,#FFB287)!important}',
        '.ville-cible .btn-outline-light,.ville-cible .btn-outline-light *{color:#170A0E!important}'
    ].join('');
    document.head.appendChild(style);

    function trouverSectionHumour() {
        var titres = document.querySelectorAll('h2');
        for (var i = 0; i < titres.length; i += 1) {
            if (norm(titres[i].textContent).indexOf('spectacles d humour') > -1) {
                return titres[i].closest('.py-3') || document;
            }
        }
        return document;
    }

    function cibler() {
        var section = trouverSectionHumour();
        var lignes = section.querySelectorAll('[data-date]');
        var trouvees = [];

        for (var i = 0; i < lignes.length; i += 1) {
            var ligne = lignes[i];
            if (ligne.style.display === 'none' || ligne.offsetParent === null) continue;
            var lieu = ligne.querySelector('.small');
            var nomVille = norm(ligne.getAttribute('data-ville') || (lieu ? lieu.textContent.split(/[•–-]\s/)[0] : ''));
            if (precision && norm(lieu ? lieu.textContent : '').indexOf(precision) === -1) continue;
            if (nomVille === ville || nomVille.indexOf(ville) === 0) trouvees.push(ligne);
        }

        if (!trouvees.length) return;

        trouvees.forEach(function (ligne, index) {
            ligne.classList.add('ville-cible');
            if (index === 0) {
                var col = ligne.querySelector('.col-8');
                if (ligne.closest('.ticket-vedette') && index === 0) col = null;
                if (col) {
                    var etiquette = document.createElement('span');
                    etiquette.className = 'ville-etiquette';
                    etiquette.textContent = trouvees.length > 1 ? 'Près de chez vous' : 'Votre date';
                    col.insertBefore(etiquette, col.firstChild);
                }
            }
        });

        trouvees[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    window.addEventListener('load', function () {
        setTimeout(cibler, 150);
    });
}());
