/* effets.js · v110 (12 oct.) : la flèche du haut devient un sommaire au survol ; v109 : téléphone : extraits joués sur le site, avis un après l'autre au doigt ; v108 : mois couleur braise, couronne qui se replie, nuit après la musique (éclair à l'infolettre), trois formes d'art sous Dar ; v107 : les mois deviennent des seuils (mois en grand + trait de lumière), rôles des avis, retour en haut qui scintille ; v106 : éclosion d'avis, trait de lumière sous les titres, carte billets vers le bas, exergue bio retirée ; v105 : retours des testeurs (menu, flèche du haut, un autre avis, extraits au grand écran, presse, bio) ; v104 : la braise s'en va sans traînée ; v103 : implosion subtile (halo qui se resserre, pouf doux) partagée par les dates et l'infolettre ; l'infolettre passe à la braise ; v102 : braise : seule la 1re date d'elle-même (ordi et téléphone), puis au curseur ou au toucher du nom, jamais pendant le défilement ; v101 : une seule braise partout, nouvelles dates et derniers articles pour ceux qui reviennent, la nuit qui descend et la braise qui reste ; v100 : la braise embrase le bouton de l'intérieur (contour qui s'allume, lueur translucide, mot qui chauffe) ; v99 : l'impact de la braise remplit le bouton de lumière ; v98 : braise : première date seule puis au survol des villes, traînée de poussière, cible suivie, attend que la date soit prête ; infolettre sans retard au défilement ; v97 : la braise se charge (implosion), pop, puis file en ligne droite en gagnant de la traction ; v96 : la carte du bouton billets éclot et se referme avec grâce ; une braise voyage du nom de la ville au bouton ; v95 : le bouton billets dessine sa carte (et le fait seul à l'arrivée), braise sur les boutons des dates, Plexus lunaire vivant ; v94 : « prochain spectacle » sous le bouton billets ; v93 : extraits vidéo en boucle dans les miniatures du spectacle gratuit ; v92 : bouton billets du hero qui s'ouvre (3 prochaines dates), presse avec cachets et manchettes décodées ; v91 : « on en parle » (recherche déjà faite) et les deux petites affiches du spectacle gratuit ; v90 : le retour du grand écran se fait dans la page (il défile avec l'affiche, une seule animation) ; v88 : téléphone : la distinction et « voir les dates » dans le hero, plus de plein écran « 6e spectacle » ; ordi : bouton « voir les dates » sous l'emblème ; partout : essai gratuit, suivi des portes ; ronde 3 · v52 (10 oct.) : ouverture glissée, déclenchée par la braise ; v48 : anagramme au fil du curseur, menu écouter refait ; v38 : tison et reflet calculés une fois, volets sur la carte graphique ; v36 : le reflet du tison sur le titre ; v35 : profondeur, flèche du diagramme dans la boutique ; v34 : anagramme partout, symboles compris ; v29 : emblème du graphiste partout (défiler, retour en haut), tison, arche */
(function () {
    'use strict';
    var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sourisFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var LENT = +((location.search.match(/[?&]lent=(\d+)/) || [])[1] || 1);   /* outil : apercu?lent=10 joue les animations au ralenti */

    /* L'emblème du graphiste (relevé sur l'affiche), découpé en morceaux animables.
       Même dessin que le logo ; seule l'épaisseur du trait (sw) change selon la taille d'affichage. */
    var EMBLEME = '<g class="em-haut"><ellipse cx="0" cy="-134.4" rx="185.5" ry="111.0"/><path d="M -185.5 -175.4 A 185.5 111.0 0 0 1 185.5 -175.4"/></g><g class="em-bas"><ellipse cx="0" cy="133.6" rx="185.5" ry="111.0"/><path d="M -185.5 174.6 A 185.5 111.0 0 0 0 185.5 174.6"/></g><g class="em-chev"><path d="M -133.5 -94.4 L -172.5 0.6 L -133.5 95.6"/><path d="M 133.5 -94.4 L 172.5 0.6 L 133.5 95.6"/></g><g class="em-fl-haut"><path d="M 0.0 -231.4 L 0.0 -106.4 M -12.0 -133.4 L 0.0 -105.4 L 12.0 -133.4"/></g><g class="em-fl-bas"><path d="M 0.0 230.6 L 0.0 105.6 M -12.0 132.6 L 0.0 104.6 L 12.0 132.6"/></g><g class="em-soi"><circle cx="-0.2" cy="0" r="65.2"/><circle cx="-61.0" cy="0.6" r="39.5" clip-path="url(#ID)"/><circle cx="-0.4" cy="-57.6" r="32.2" stroke-dasharray="DASH"/></g>';
    var nEmb = 0;
    function embleme(sw) {
        var id = 'emb-clip-' + (++nEmb), k = Math.sqrt(Math.max(1, sw / 4));
        return '<svg class="emb" viewBox="-230 -330 460 660" aria-hidden="true" focusable="false" style="--sw:' + sw + '">' +
            '<defs><clipPath id="' + id + '"><circle cx="-0.2" cy="0" r="' + (65.2 - sw / 2).toFixed(1) + '"/></clipPath></defs>' +
            EMBLEME.replace('ID', id).replace('DASH', (10.5 * k).toFixed(1) + ' ' + (6.8 * k).toFixed(1)) + '</svg>';
    }


    /* ---------- v33 : l'anagramme, le geste du site ----------
       Les lettres d'un mot sautent de place (mélange), par coups secs, puis se verrouillent de gauche à droite.
       Fonctionne sur n'importe quel élément, même s'il contient de l'italique ou un exposant : seules les lettres bougent. */
    var LETTRE = /[A-Za-z0-9À-ÖØ-öø-ÿŒœ]/;
    function brasser(el, avant, pas) {
        if (calme || !el || el._brasse) return;
        if (el._fr && el._fr.orig) { clearTimeout(el._fr.minut); el._fr.noeuds.forEach(function (nd, x) { nd.nodeValue = el._fr.orig[x]; }); }
        var marche = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), noeuds = [];
        var monSvg = el.closest ? el.closest('svg') : null;
        while (marche.nextNode()) if (marche.currentNode.parentNode.closest('svg') === monSvg) noeuds.push(marche.currentNode);
        var orig = noeuds.map(function (n) { return n.nodeValue; });
        var pos = [];
        orig.forEach(function (s, a) { for (var i = 0; i < s.length; i++) if (LETTRE.test(s[i])) pos.push([a, i]); });
        if (pos.length < 2) return;
        el._brasse = true;
        var lettres = pos.map(function (q) { return orig[q[0]][q[1]]; });
        var coupsAvant = avant || 2, n = 0, verrou = 0, saut = pos.length > 6 ? 2 : 1;
        function ecrire(choix) {
            var t = orig.map(function (s) { return s.split(''); });
            pos.forEach(function (q, k) { t[q[0]][q[1]] = choix[k]; });
            noeuds.forEach(function (nd, a) { nd.nodeValue = t[a].join(''); });
        }
        function coup() {
            if (n >= coupsAvant) verrou = Math.min(pos.length, verrou + saut);
            if (verrou >= pos.length) { noeuds.forEach(function (nd, a) { nd.nodeValue = orig[a]; }); el._brasse = false; return; }
            var libres = melanger(lettres.slice(verrou));
            if (libres.join('') === lettres.slice(verrou).join('') && libres.length > 1) libres.push(libres.shift());
            ecrire(lettres.slice(0, verrou).concat(libres));
            n++;
            setTimeout(coup, (pas || 55) * LENT);
        }
        coup();
    }

    /* l'anagramme des symboles : les disques échangent leur place, les chevrons changent de côté,
       les flèches se retournent, le petit cercle du soi saute ; puis tout se verrouille, morceau par morceau */
    function partiesEmbleme(root) {
        var P = [];
        function aj(els, type) { els = Array.prototype.slice.call(els); if (els.length) P.push({ els: els, type: type }); }
        aj(root.querySelectorAll('.em-haut'), 'v'); aj(root.querySelectorAll('.em-bas'), 'v');
        root.querySelectorAll('.em-chev path').forEach(function (x) { aj([x], 'h'); });
        aj(root.querySelectorAll('.em-fl-haut'), 'v'); aj(root.querySelectorAll('.em-fl-bas'), 'v');
        root.querySelectorAll('.em-soi circle').forEach(function (x) { aj([x], 's'); });
        return P;
    }
    function brasserFormes(P, E, avant) {
        if (calme || !P || !P.length || P._brasse) return;
        P._brasse = true;
        var coupsAvant = avant || 2, n = 0, verrou = 0;
        var ordre = melanger(P.slice());
        function r() { return Math.random() * 2 - 1; }
        function coup() {
            if (n >= coupsAvant) verrou++;
            ordre.forEach(function (q, i) {
                var t = '';
                if (i >= verrou) {
                    if (q.type === 'v' && Math.random() < .6) t = 'scale(1,-1) ';
                    if (q.type === 'h' && Math.random() < .6) t = 'scale(-1,1) ';
                    if (q.type === 's') t = 'translate(' + (r() * E * .2).toFixed(1) + ',' + (r() * E * .3).toFixed(1) + ') ';
                    t += 'translate(' + (r() * E * .035).toFixed(1) + ',' + (r() * E * .035).toFixed(1) + ') rotate(' + (r() * 9 * Math.min(1, 370 / E)).toFixed(1) + ')';
                }
                q.els.forEach(function (el) { if (t) el.setAttribute('transform', t); else el.removeAttribute('transform'); });
            });
            n++;
            if (verrou < ordre.length) setTimeout(coup, 60 * LENT);
            else P._brasse = false;
        }
        coup();
    }
    /* l'emblème du graphiste en vectoriel, à placer dans un repère (cx, cy, échelle k) */
    function embleme_g(cx, cy, k, sw) {
        var id = 'emb-clip-' + (++nEmb), q = Math.sqrt(Math.max(1, sw / 4));
        return '<defs><clipPath id="' + id + '"><circle cx="-0.2" cy="0" r="' + (65.2 - sw / 2).toFixed(1) + '"/></clipPath></defs>' +
            '<g class="emb-g" transform="translate(' + cx + ' ' + cy + ') scale(' + k + ') translate(0 0.4)" style="--sw:' + sw + '">' +
            EMBLEME.replace('ID', id).replace('DASH', (10.5 * q).toFixed(1) + ' ' + (6.8 * q).toFixed(1)) + '</g>';
    }

    /* découpe le texte d'un élément en mots (span.ana) ; garde l'italique, les exposants, les liens */
    function mots(el) {
        if (el._mots) return el._mots;
        var marche = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), noeuds = [];
        while (marche.nextNode()) if (!marche.currentNode.parentNode.closest('svg, .ana')) noeuds.push(marche.currentNode);
        noeuds.forEach(function (nd) {
            if (!/\S/.test(nd.nodeValue)) return;
            var frag = document.createDocumentFragment();
            nd.nodeValue.split(/(\s+)/).forEach(function (m) {
                if (!m) return;
                if (/^\s+$/.test(m)) { frag.appendChild(document.createTextNode(m)); return; }
                var s = document.createElement('span'); s.className = 'ana'; s.textContent = m; frag.appendChild(s);
            });
            nd.parentNode.replaceChild(frag, nd);
        });
        return (el._mots = Array.prototype.slice.call(el.querySelectorAll('.ana')));
    }

    /* ---------- v48 : l'anagramme suit le curseur ----------
       Le mélange n'est plus déclenché une fois à l'entrée : il se produit SOUS le curseur, à chaque mouvement.
       On glisse vers la droite : les lettres sous le curseur et juste devant se mélangent ; on revient à gauche : même chose dans l'autre sens.
       Dès que le curseur s'arrête ou quitte le mot, les lettres se remettent en ordre. */
    function prepTexte(el) {
        if (el._fr) return el._fr;
        var monSvg = el.closest ? el.closest('svg') : null;
        var marche = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), noeuds = [];
        while (marche.nextNode()) if (marche.currentNode.parentNode.closest('svg') === monSvg) noeuds.push(marche.currentNode);
        var pos = [];
        noeuds.forEach(function (n, a) { var s = n.nodeValue; for (var i = 0; i < s.length; i++) if (LETTRE.test(s[i])) pos.push([a, i]); });
        return (el._fr = { noeuds: noeuds, pos: pos, minut: null });
    }
    function frotterTexte(el, frac, dir) {
        if (calme || !el || el._brasse) return;
        var F = prepTexte(el), n = F.pos.length;
        if (n < 2) return;
        if (!F.orig) F.orig = F.noeuds.map(function (x) { return x.nodeValue; });
        var k = Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
        /* fenêtre : la lettre sous le curseur et deux lettres dans le sens du mouvement */
        var a = dir >= 0 ? k - 1 : k - 2, b = dir >= 0 ? k + 2 : k + 1;
        a = Math.max(0, a); b = Math.min(n - 1, b);
        var idx = []; for (var i = a; i <= b; i++) idx.push(i);
        if (idx.length < 2) return;
        var t = F.orig.map(function (s) { return s.split(''); });
        var lettres = idx.map(function (i) { var q = F.pos[i]; return F.orig[q[0]][q[1]]; });
        var m = melanger(lettres.slice()), essais = 0;
        while (m.join('') === lettres.join('') && essais++ < 4) m = melanger(lettres.slice());
        idx.forEach(function (i, j) { var q = F.pos[i]; t[q[0]][q[1]] = m[j]; });
        F.noeuds.forEach(function (nd, x) { nd.nodeValue = t[x].join(''); });
        clearTimeout(F.minut);
        F.minut = setTimeout(function () { F.noeuds.forEach(function (nd, x) { nd.nodeValue = F.orig[x]; }); }, 130 * LENT);
    }
    /* mots en lettres SVG (titre de l'affiche, titre du bas, adresse) : les lettres changent de place et penchent dans le sens du mouvement */
    function frotterSvg(m, sx, dir) {
        if (calme || m.enCours) return;
        var L = m.lettres, n = L.length;
        if (n < 2) return;
        var k = 0, best = 1e9;
        L.forEach(function (l, i) { var c = l.d[1] + (l.av || l.d[3] * 0.4) / 2, d = Math.abs(c - sx); if (d < best) { best = d; k = i; } });
        var a = Math.max(0, dir >= 0 ? k - 1 : k - 2), b = Math.min(n - 1, dir >= 0 ? k + 2 : k + 1);
        var fen = L.slice(a, b + 1);
        if (fen.length < 2) return;
        fen.forEach(function (l) { if (l.av == null) { try { l.av = l.el.getComputedTextLength() - l.d[3] * 0.12; } catch (e) { l.av = l.d[3] * 0.4; } } });
        var ordre = melanger(fen.slice()), essais = 0;
        while (ordre.every(function (l, i) { return l === fen[i]; }) && essais++ < 4) ordre = melanger(fen.slice());
        var x = fen[0].d[1];
        L.forEach(function (l) { if (fen.indexOf(l) < 0) { l.el.setAttribute('x', l.d[1]); l.el.setAttribute('y', l.d[2]); l.el.style.transform = ''; miroir(l.el); } });
        ordre.forEach(function (l) {
            l.el.setAttribute('x', x.toFixed(1)); x += l.av;
            l.el.setAttribute('y', l.d[2] + (Math.random() - 0.5) * l.d[3] * 0.1);
            l.el.style.transform = 'rotate(' + (dir * (5 + Math.random() * 12)).toFixed(1) + 'deg)';
            miroir(l.el);
        });
        clearTimeout(m._minut);
        m._minut = setTimeout(function () {
            L.forEach(function (l) { l.el.setAttribute('x', l.d[1]); l.el.setAttribute('y', l.d[2]); l.el.style.transform = ''; miroir(l.el); });
        }, 140 * LENT);
    }
    /* suivi du curseur, avec un pas minimal (pas de frénésie quand on bouge à peine) */
    function suivreCurseur(cible, quoi) {
        var dernierX = null, dernierT = 0;
        cible.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            var maintenant = performance.now();
            if (dernierX !== null && Math.abs(e.clientX - dernierX) < 4) return;
            if (maintenant - dernierT < 45) return;
            var dir = dernierX === null ? 1 : (e.clientX >= dernierX ? 1 : -1);
            dernierX = e.clientX; dernierT = maintenant;
            quoi(e, dir);
        });
        cible.addEventListener('pointerleave', function () { dernierX = null; });
    }
    function fracDans(el, x) { var r = el.getBoundingClientRect(); return r.width ? Math.max(0, Math.min(1, (x - r.left) / r.width)) : 0.5; }

    /* au survol (souris seulement), le mot sous le curseur se remélange */
    function survolAnagramme(zone, selecteur) {
        if (calme || !sourisFine || !zone) return;
        suivreCurseur(zone, function (e, dir) {
            var m = e.target.closest ? e.target.closest(selecteur) : null;
            if (m && zone.contains(m)) frotterTexte(m, fracDans(m, e.clientX), dir);
        });
    }
    /* entrée : les mots apparaissent mélangés et se décodent en cascade */
    function decoderEntree(el, delai, pasMot) {
        var ms = mots(el);
        ms.forEach(function (m, i) { setTimeout(function () { brasser(m, 3); }, ((delai || 0) + i * (pasMot || 0.06)) * 1000 * LENT); });
    }

    /* ---------- 1. Moments (mots qui s'allument au défilement) ---------- */
    function moment(o) {
        var s = document.createElement('section');
        s.className = 'moment' + (o.classe ? ' ' + o.classe : '');
        s.setAttribute('aria-label', o.label);
        var html = o.mots.map(function (m) { return '<span class="moment-mot">' + m + '</span>'; }).join(' ');
        if (o.guillemets) html = '« ' + html + ' »';
        s.innerHTML =
            '<div class="moment-colle">' +
            '<svg class="moment-arc" viewBox="0 0 1000 520" aria-hidden="true"><path d="M 30 500 A 470 470 0 0 1 970 500"/><g class="moment-fleche"><path d="M -13 -7.5 L 0 0 L -13 7.5"/></g></svg>' +
            '<div class="moment-bloc">' +
            (o.kicker ? '<p class="moment-kicker">' + o.kicker + '</p>' : '') +
            '<' + o.balise + ' class="moment-citation">' + html + '</' + o.balise + '>' +
            (o.source ? '<p class="moment-source">' + o.source + '</p>' : '') +
            '</div></div>';
        o.avant.parentNode.insertBefore(s, o.avant);

        var spans = s.querySelectorAll('.moment-mot');
        if (o.finaux) for (var f = spans.length - o.finaux; f < spans.length; f++) spans[f].classList.add('final');
        var arc = s.querySelector('.moment-arc path');
        var svg = s.querySelector('.moment-arc');
        var colle = s.querySelector('.moment-colle');
        var bloc = s.querySelector('.moment-bloc');
        var dOrig = arc.getAttribute('d'), vbOrig = svg.getAttribute('viewBox');
        var long = arc.getTotalLength();
        arc.style.strokeDasharray = long;
        arc.style.strokeDashoffset = calme ? 0 : long;

        /* Téléphone : l'arc devient l'arche de l'affiche verticale. Le dôme passe AU-DESSUS du texte,
           les deux montants descendent de chaque côté, et le tout est calculé sur le texte réel
           (aucune ligne ne touche le trait). Le bloc colle ne fait que la hauteur de l'arche : plus de vide. */
        var telephone = window.matchMedia('(max-width: 768px)');
        var largeurVue = 0;
        function geom(force) {
            if (!force && window.innerWidth === largeurVue) return;   /* iOS : la barre d'adresse change la hauteur, on ignore */
            largeurVue = window.innerWidth;
            if (!telephone.matches) {
                s.classList.remove('arche');
                s.style.height = ''; colle.style.height = ''; colle.style.paddingTop = ''; colle.style.top = ''; bloc.style.marginTop = '';
                svg.setAttribute('viewBox', vbOrig); arc.setAttribute('d', dOrig);
            } else {
                s.classList.add('arche');
                bloc.style.marginTop = '0px';
                var W = colle.clientWidth, cx = W / 2, r = W / 2 - 14, haut = Math.round(window.innerHeight * 0.05);
                colle.style.paddingTop = haut + 'px';
                var b0 = bloc.getBoundingClientRect(), D = 30;
                bloc.querySelectorAll('.moment-kicker, .moment-citation, .moment-source').forEach(function (el) {
                    var rg = document.createRange(); rg.selectNodeContents(el);
                    Array.prototype.forEach.call(rg.getClientRects(), function (q) {
                        if (q.width < 2) return;
                        var t = q.top - b0.top, demi = Math.max(cx - (q.left - b0.left), (q.right - b0.left) - cx) + 12;
                        D = Math.max(D, demi >= r ? r - t : (r - Math.sqrt(r * r - demi * demi)) - t);
                    });
                });
                D = Math.ceil(D);
                bloc.style.marginTop = D + 'px';
                var cy = haut + r, bas = Math.max(cy, haut + D + bloc.offsetHeight + 30);
                var H = Math.ceil(bas + 24);
                colle.style.height = H + 'px';
                /* v88 : la citation se fige au milieu de l'écran (avant : en haut, avec un grand vide dessous) et la pause est plus courte */
                var court = s.classList.contains('moment-court');
                colle.style.top = court ? '' : Math.max(0, Math.round((window.innerHeight - H) / 2)) + 'px';
                s.style.height = Math.round(H + window.innerHeight * (court ? 0.4 : 0.6)) + 'px';
                svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
                arc.setAttribute('d', 'M ' + (cx - r) + ' ' + bas + ' L ' + (cx - r) + ' ' + cy +
                    ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + ' L ' + (cx + r) + ' ' + bas);
            }
            long = arc.getTotalLength();
            arc.style.strokeDasharray = long;
            if (calme) { arc.style.strokeDashoffset = 0; placerFleche(1); } else if (typeof maj === 'function') maj();
        }
        var fleche = s.querySelector('.moment-fleche');
        function placerFleche(frac) {   /* la flèche du diagramme mène le trait */
            var l = Math.max(0.5, long * frac);
            var a = arc.getPointAtLength(l), b = arc.getPointAtLength(Math.max(0, l - 4));
            var ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
            fleche.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');
            fleche.style.opacity = frac > 0.01 ? 1 : 0;
            /* on remonte : la flèche se retourne et ramène le trait vers son départ */
            if (frac < dernier - 0.0005) fleche.classList.add('recule');
            else if (frac > dernier + 0.0005) fleche.classList.remove('recule');
            dernier = frac;
        }
        var dernier = 0;
        geom(true);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { geom(true); });
        window.addEventListener('resize', function () { geom(false); });
        if (calme) placerFleche(1);
        if (calme) { spans.forEach(function (x) { x.classList.add('allume'); }); s.classList.add('fini'); return; }

        var enCours = false;
        function maj() {
            enCours = false;
            var r = s.getBoundingClientRect();
            var course = Math.max(1, s.offsetHeight - colle.offsetHeight);
            var p = Math.min(1, Math.max(0, ((parseFloat(colle.style.top) || 0) - r.top) / (course * 0.8)));
            var n = Math.round(p * spans.length);
            spans.forEach(function (x, i) {
                var on = i < n;
                if (on && !x.classList.contains('allume')) brasser(x, 2);   /* le mot se décode en s'allumant */
                x.classList.toggle('allume', on);
            });
            var fr = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + course * 0.8)));
            arc.style.strokeDashoffset = long * (1 - fr);
            placerFleche(fr);
            s.classList.toggle('fini', n >= spans.length);
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj);
        maj();
        survolAnagramme(s.querySelector('.moment-citation'), '.moment-mot');
    }

    function moments() {
        var distinction = document.querySelector('.distinction');
        if (distinction && !window.matchMedia('(min-width: 768px)').matches) distinction = null;   /* v88 */
        if (distinction) moment({
            avant: distinction,
            classe: 'moment-court moment-nom',
            label: "Le 6e spectacle d'Adib Alkhalidey",
            balise: 'p',
            kicker: 'Comme les Mongols à Baghdad',
            mots: ['Le', '6<sup>e</sup>', 'spectacle', 'd’<span class="nom">Adib</span>', '<span class="nom">Alkhalidey</span>'],
            source: ''   /* v92 : le bouton du hero fait ce travail (redite) */
        });
        var musique = document.getElementById('musique');
        if (musique) {
            moment({
                avant: musique,
                label: 'Critique de Plexus lunaire',
                balise: 'blockquote',
                guillemets: true,
                kicker: 'Plexus lunaire · 2025',
                mots: 'Quelle formidable surprise\u00a0! Aérien, lumineux, lucide, intelligent, délicieusement groovy.'.split(' '),
                finaux: 1,
                source: 'Mario Girard, La Presse<br><a href="#musique">écouter Plexus lunaire ↓</a>'
            });
            musique.classList.add('avec-moment');
        }
    }

    /* ---------- Ronde A : titres de section qui s'écrivent + petit arc ---------- */
    function titres() {
        var t = document.querySelectorAll('#billets h1, .infolettre h2, #musique h2, #boutique h2, #spectacles h2, #presse h2, #bio h2');
        if (calme || !('IntersectionObserver' in window)) { t.forEach(function (h) { h.classList.add('titre-ecrit', 'go'); }); return; }
        t.forEach(function (h) { h.classList.add('titre-ecrit'); });
        /* v106 : à l'arrivée d'une section, un trait de lumière se trace sous le titre, une braise à sa pointe,
           puis la braise s'éteint et le trait reste, doux : on sait qu'on vient d'entrer ailleurs */
        t.forEach(function (h) { if (h.tagName === 'H2') { h.classList.add('avec-trait'); h.insertAdjacentHTML('beforeend', '<span class="titre-trait" aria-hidden="true"><span class="tt-braise"></span></span>'); } });
        /* une fois écrit, on retire le masque : il rognait les lettres qui débordent (interligne serré du h1) */
        t.forEach(function (h) { h.addEventListener('animationend', function () { h.classList.add('ecrit-fini'); }); });
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('go'); io.unobserve(x.target); } });
        }, { threshold: 0.6 });
        t.forEach(function (h) { io.observe(h); });
        /* v33 : le titre se décode en anagramme au lieu de s'écrire derrière un masque */
        t.forEach(function (h) {
            h.classList.add('titre-ana');
            mots(h);
            new MutationObserver(function (l, o) { if (h.classList.contains('go')) { o.disconnect(); decoderEntree(h, 0, 0.09); } })
                .observe(h, { attributes: true, attributeFilter: ['class'] });
            survolAnagramme(h, '.ana');
        });
    }

    /* ---------- Ronde A : Dar Alkhalidey se dessine ---------- */
    function dar() {
        var svg = document.querySelector('.dar-maison');
        if (!svg || calme || !('IntersectionObserver' in window)) return;
        var traits = svg.querySelectorAll('.dar-traits path, .dar-traits ellipse, .dar-traits circle:not([stroke-dasharray])');
        traits.forEach(function (el, i) {
            el.setAttribute('pathLength', '1');
            el.style.strokeDasharray = '1';
            el.style.strokeDashoffset = '1';
            el.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.45, .1, .25, 1) ' + (i * 0.12) + 's';
        });
        svg.classList.add('dar-attente');
        var io = new IntersectionObserver(function (e) {
            if (!e[0].isIntersecting) return;
            io.disconnect();
            svg.classList.add('dar-go');
            traits.forEach(function (el) { el.style.strokeDashoffset = '0'; });
            setTimeout(function () { darSurvol(svg); }, 3200 * LENT);   /* une fois la maison dessinée */
        }, { threshold: 0.45 });
        io.observe(svg);
    }
    /* v34 : au survol, Dar Alkhalidey fait son anagramme, lettres et symboles ensemble */
    function darSurvol(svg) {
        if (svg._survol || calme) return;
        svg._survol = true;
        var texte = svg.querySelector('.dar-texte');
    
    function go() {
        if (calme) document.querySelectorAll('.hero-anime .scene').forEach(function (s) { s.classList.add('scene-prete'); }); brasser(texte, 2, 60); }   /* v35 : les lettres seulement, le diagramme reste calme */
        suivreCurseur(svg, function (e, dir) { frotterTexte(texte, fracDans(texte, e.clientX), dir); });   /* v48 : au fil du curseur */

        svg.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') go(); });
    }

    /* ---------- Ronde B : spectacles complets en mode cinéma ---------- */
    function cinema() {
        var ecrans = document.querySelectorAll('#spectacles .special-ecran');
        if (!ecrans.length) return;
        /* lauriers : la tige se trace, les feuilles poussent une à une */
        var felix = document.querySelectorAll('#spectacles .special-felix');
        if (!calme && 'IntersectionObserver' in window) {
            felix.forEach(function (f) {
                f.classList.add('felix-attente');
                f.querySelectorAll('.laurier').forEach(function (l) {
                    var tige = l.querySelector('path');
                    if (tige) tige.setAttribute('pathLength', '1');
                    l.querySelectorAll('ellipse').forEach(function (e, i) { e.style.transitionDelay = (0.35 + (14 - i) * 0.06) + 's'; });
                });
            });
            var io = new IntersectionObserver(function (e) {
                e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('felix-go'); io.unobserve(x.target); } });
            }, { threshold: 1 });
            felix.forEach(function (f) { io.observe(f); });
        }
        if (calme) return;
        /* l'écran s'allume et grandit à mesure qu'on arrive devant */
        ecrans.forEach(function (e) { e.classList.add('ecran-cinema'); });
        var enCours = false;
        function maj() {
            enCours = false;
            var vh = window.innerHeight;
            ecrans.forEach(function (e) {
                if (e._fige) return;   /* v90 : pendant le retour du grand écran, l'affiche ne change pas de taille (la cible reste fixe) */
                var r = e.getBoundingClientRect();
                var centre = r.top + r.height / 2;
                var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
                if (centre < vh * 0.5) p = 1;
                e.style.setProperty('--p', p.toFixed(3));
            });
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj);
        cinemaMaj = maj;
        maj();
    }
    var cinemaMaj = function () {}, theatreOuvrir = null;
    /* v90 : une fois l'écran posé, l'affiche reprend sa taille de défilement en glissant, sans sauter */
    function liberer(e) {
        if (!e || !e._fige) return;
        e._fige = false;
        e.style.transition = 'transform .7s cubic-bezier(.16, 1, .3, 1)';
        cinemaMaj();
        setTimeout(function () { if (!e._fige) e.style.transition = ''; }, 750);
    }

    /* ---------- Bio : les lignes montent de derrière un trait invisible, les mots clés se soulignent ---------- */
    var MOTS_CLES = ['« le disciple de trois formes d\'art »', 'La forme change; la voix demeure.', 'Ouarzazate', 'Montréal', 'apatride', 'l\'enracinement choisi'];

    function marquerMotsCles(p) {
        MOTS_CLES.forEach(function (m) {
            var marche = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
            var n;
            while ((n = marche.nextNode())) {
                var i = n.nodeValue.indexOf(m);
                if (i < 0) continue;
                var apres = n.splitText(i);
                apres.splitText(m.length);
                var sp = document.createElement('span');
                sp.className = 'mot-cle';
                apres.parentNode.replaceChild(sp, apres);
                sp.appendChild(apres);
                break;
            }
        });
    }

    /* Bio : chaque mot monte de derrière sa propre ligne invisible, ligne après ligne (à la Locomotive).
       Sur ordinateur, les mots s'écartent doucement du curseur, un petit désordre, puis reprennent leur place. */
    function revelerLignes(p, delaiBase) {
        if (p._revele) return;
        p._revele = true;
        var marche = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null), noeuds = [];
        while (marche.nextNode()) noeuds.push(marche.currentNode);
        noeuds.forEach(function (n) {
            var frag = document.createDocumentFragment();
            n.nodeValue.split(/(\s+)/).forEach(function (m) {
                if (!m) return;
                if (/^\s+$/.test(m)) { frag.appendChild(document.createTextNode(m)); return; }
                var a = document.createElement('span'); a.className = 'lm';
                var b = document.createElement('span'); b.className = 'lmi'; b.textContent = m;
                a.appendChild(b); frag.appendChild(a);
            });
            n.parentNode.replaceChild(frag, n);
        });
        if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
        var mots = Array.prototype.slice.call(p.querySelectorAll('.lm'));
        var ligne = -1, haut = null, rang = 0;
        mots.forEach(function (m) {
            var t = m.offsetTop;
            if (haut === null || Math.abs(t - haut) > 6) { ligne++; haut = t; rang = 0; }
            m.firstChild.style.setProperty('--d', (delaiBase + ligne * 0.085 + rang * 0.012).toFixed(3) + 's');
            rang++;
        });
        requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('mots-go'); }); });
        setTimeout(function () { p.classList.add('cles-go', 'mots-fin'); }, (delaiBase + ligne * 0.085 + 1.2) * 1000);
        survolAnagramme(p, '.lmi');   /* v33 : au survol, le mot se remélange (remplace le petit désordre) */
    }

    /* ---------- v58 : dans la bio, notre flèche (avec sa braise) circule sous les lignes au fil du défilement ----------
       Le fil serpente sous chaque ligne, d'un côté puis de l'autre, avec une ondulation à peine sensible. */
    function filBio(p) {
        if (calme || p._fil || !p.querySelectorAll) return;
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg'), chemin, pointe, total = 0, lignesY = [];
        svg.setAttribute('class', 'fil-bio'); svg.setAttribute('aria-hidden', 'true');
        var gid = 'fb-' + Math.random().toString(36).slice(2, 8);
        svg.innerHTML = '<defs><radialGradient id="' + gid + '"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".9"/><stop offset=".35" stop-color="#ff8a3a" stop-opacity=".5"/><stop offset="1" stop-color="#ff5a14" stop-opacity="0"/></radialGradient></defs>' +
            '<path class="fil-bio-trait"/><g class="fil-bio-pointe"><circle class="fb-lueur" r="8" fill="url(#' + gid + ')"/><circle class="fb-coeur" r="1.3"/><path d="M -8 -4.5 L 0.8 0 L -8 4.5"/></g>';
        if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
        p.appendChild(svg);
        p._fil = true;
        chemin = svg.querySelector('.fil-bio-trait'); pointe = svg.querySelector('.fil-bio-pointe');
        var lueur = svg.querySelector('.fb-lueur');
        var mob = false, morceaux = [];
        function construire() {
            var mots = Array.prototype.slice.call(p.querySelectorAll('.lm'));
            if (!mots.length) return;
            var lignes = [], haut = null;
            mots.forEach(function (m) {
                var t = m.offsetTop;
                if (haut === null || Math.abs(t - haut) > 6) { lignes.push([]); haut = t; }
                lignes[lignes.length - 1].push(m);
            });
            var pts = lignes.map(function (l) {
                var g = l[0], d = l[l.length - 1];
                return { x0: g.offsetLeft - 4, x1: d.offsetLeft + d.offsetWidth + 4, y: g.offsetTop + g.offsetHeight * .98 };
            });
            mob = window.innerWidth < 768;
            svg.classList.toggle('fil-bio-mob', mob);
            if (mob) {
                /* v63, téléphone : lignes courtes, donc pas d'aller-retour en boucles. La flèche lit comme l'œil :
                   sous chaque ligne de gauche à droite, s'éteint au bout, se rallume au début de la suivante,
                   et ne traîne derrière elle qu'une courte queue (une comète, pas un soulignement de tout le texte) */
                morceaux.forEach(function (m) { m.el.remove(); }); morceaux = [];
                var cumul = 0;
                pts.forEach(function (q, i) {
                    var amp = (i % 2 ? -1 : 1) * 1.2, l3 = q.x0 + (q.x1 - q.x0) / 3, l6 = q.x0 + (q.x1 - q.x0) * 2 / 3;
                    var el = document.createElementNS(NS, 'path');
                    el.setAttribute('class', 'fil-bio-trait');
                    el.setAttribute('d', 'M ' + q.x0.toFixed(1) + ' ' + q.y.toFixed(1) + ' C ' + l3.toFixed(1) + ' ' + (q.y - amp).toFixed(1) + ', ' + l6.toFixed(1) + ' ' + (q.y + amp * .6).toFixed(1) + ', ' + q.x1.toFixed(1) + ' ' + q.y.toFixed(1));
                    svg.insertBefore(el, pointe);
                    var lg = el.getTotalLength();
                    morceaux.push({ el: el, debut: cumul, lg: lg });
                    cumul += lg;
                });
                chemin.style.display = 'none';
                svg.setAttribute('width', p.clientWidth); svg.setAttribute('height', p.clientHeight + 20);
                total = cumul;
                maj();
                return;
            }
            chemin.style.display = '';
            morceaux.forEach(function (m) { m.el.remove(); }); morceaux = [];
            var dPath = '';
            pts.forEach(function (q, i) {
                var aller = i % 2 === 0, xa = aller ? q.x0 : q.x1, xb = aller ? q.x1 : q.x0;
                var amp = (i % 3 === 1 ? -1 : 1) * (1.6 + (i * 7) % 3);   /* à peine vivant */
                if (i === 0) dPath += 'M ' + xa.toFixed(1) + ' ' + q.y.toFixed(1);
                else {
                    var prec = pts[i - 1], bord = aller ? Math.min(prec.x0, q.x0) - 10 : Math.max(prec.x1, q.x1) + 10;
                    dPath += ' C ' + bord.toFixed(1) + ' ' + prec.y.toFixed(1) + ', ' + bord.toFixed(1) + ' ' + q.y.toFixed(1) + ', ' + xa.toFixed(1) + ' ' + q.y.toFixed(1);
                }
                var l3 = xa + (xb - xa) / 3, l6 = xa + (xb - xa) * 2 / 3;
                dPath += ' C ' + l3.toFixed(1) + ' ' + (q.y - amp).toFixed(1) + ', ' + l6.toFixed(1) + ' ' + (q.y + amp * .6).toFixed(1) + ', ' + xb.toFixed(1) + ' ' + q.y.toFixed(1);
            });
            svg.setAttribute('width', p.clientWidth); svg.setAttribute('height', p.clientHeight + 20);
            chemin.setAttribute('d', dPath);
            total = chemin.getTotalLength();
            chemin.style.strokeDasharray = total + ' ' + total;
            lignesY = pts.map(function (q) { return q.y; });
            maj();
        }
        /* v59 : la flèche ne colle plus au scroll image par image (ça sautait) : le scroll donne une cible,
           la pointe glisse vers elle, comme une braise qu'on pousse. Une seule boucle, qui dort hors écran. */
        var largeur = window.innerWidth, fVise = 0, fVu = -1, dort = true, angle = null, queue = 0;
        function viser() {
            var r = p.getBoundingClientRect(), vh = window.innerHeight;
            fVise = Math.max(0, Math.min(1, (vh * .92 - r.top) / Math.max(1, r.height + vh * .5)));
            return r.bottom > -80 && r.top < vh + 80;
        }
        function dessinerMob(f) {
            var L = total * f, QUEUE = queue * .85, cur = morceaux[0];
            morceaux.forEach(function (m) {
                var a = Math.max(m.debut, L - QUEUE), b = Math.min(m.debut + m.lg, L);
                if (b <= a) { m.el.style.strokeDasharray = '0 ' + (m.lg + 1); return; }
                m.el.style.strokeDasharray = '0 ' + (a - m.debut).toFixed(1) + ' ' + (b - a).toFixed(1) + ' ' + (m.lg + 1).toFixed(0);
                if (L >= m.debut) cur = m;
            });
            morceaux.forEach(function (m) { if (L >= m.debut && L <= m.debut + m.lg) cur = m; });
            var l = Math.max(.5, Math.min(cur.lg, L - cur.debut));
            var pa = cur.el.getPointAtLength(l), pb = cur.el.getPointAtLength(Math.max(0, l - 5));
            var ang = Math.atan2(pa.y - pb.y, pa.x - pb.x) * 180 / Math.PI;
            pointe.setAttribute('transform', 'translate(' + pa.x.toFixed(1) + ' ' + pa.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(.8)');
            /* elle s'éteint en arrivant au bout de la ligne et se rallume au début de la suivante */
            var bord = Math.min(l, cur.lg - l);
            pointe.style.opacity = (Math.min(1, bord / 16, f / .02, (1 - f) / .03)).toFixed(2);
        }
        function dessiner(f) {
            if (mob) return dessinerMob(f);
            var L = total * f, a0 = Math.max(0, L - queue);
            /* v105 : seule une courte queue suit la pointe, et elle rentre dans la braise quand on arrête de lire */
            chemin.style.strokeDashoffset = '0';
            chemin.style.strokeDasharray = '0 ' + a0.toFixed(1) + ' ' + Math.max(0, L - a0).toFixed(1) + ' ' + (total + 1).toFixed(0);
            var a = chemin.getPointAtLength(Math.max(.5, L)), b = chemin.getPointAtLength(Math.max(0, L - 7));
            var ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
            if (angle === null) angle = ang;
            var d = ((ang - angle + 540) % 360) - 180; angle += d * .35;   /* la pointe tourne, elle ne claque pas */
            pointe.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
            pointe.style.opacity = (Math.min(1, f / .02, (1 - f) / .03)).toFixed(2);
            svg.classList.toggle('fil-bio-fin', f >= .995);
        }
        function boucle() {
            if (!total || !svg.isConnected) { dort = true; return; }
            var voit = viser();
            if (fVu < 0) fVu = fVise;
            var bouge = Math.abs(fVise - fVu) > .0006;
            fVu += (fVise - fVu) * .11;
            if (Math.abs(fVise - fVu) < .0004) fVu = fVise;
            queue += ((bouge ? 150 : 0) - queue) * (bouge ? .08 : .035);
            if (queue < .5) queue = 0;
            dessiner(fVu);
            var tt = performance.now(); lueur.setAttribute('r', (8 * (1 + Math.sin(tt / 70) * .1 + Math.sin(tt / 23) * .06)).toFixed(2));
            if (!voit && fVu === fVise && !queue) { dort = true; return; }
            requestAnimationFrame(boucle);
        }
        function reveiller() { if (dort && total) { dort = false; requestAnimationFrame(boucle); } }
        function maj() { reveiller(); }
        window.addEventListener('scroll', reveiller, { passive: true });
        window.addEventListener('resize', function () { if (window.innerWidth !== largeur) { largeur = window.innerWidth; construire(); } });
        /* on attend que les mots soient posés (montée des lignes) avant de mesurer */
        setTimeout(construire, 60);
        setTimeout(construire, 1600);
    }

    function bio() {
        var col = document.querySelector('#bio .bio-texte');
        var h2 = document.querySelector('#bio h2');
        if (!col || !h2) return;
        var q = document.createElement('p');   /* v106 : l'exergue est retirée (le focus va au mot « biographie ») ; on garde l'objet, hors page */

        var paras = col.querySelectorAll('p');
        paras.forEach(marquerMotsCles);
        if (calme || !('IntersectionObserver' in window)) {
            q.classList.add('vu');
            paras.forEach(function (p) { p.classList.add('cles-go'); });
            return;
        }

        var visibles = [];
        for (var i = 0; i < col.children.length; i++) if (col.children[i].tagName === 'P') visibles.push(col.children[i]);
        visibles.forEach(function (p) { p.classList.add('lignes-attente'); });
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) {
                if (!x.isIntersecting) return;
                io.unobserve(x.target);
                x.target.classList.remove('lignes-attente');
                revelerLignes(x.target, 0);
                filBio(x.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
        visibles.forEach(function (p) { io.observe(p); });

        /* biographie complète : même entrée quand on l'ouvre */
        var suite = col.querySelector('.bio-suite');
        if (suite) suite.addEventListener('toggle', function () {
            if (!suite.open) return;
            suite.querySelectorAll('.bio-suite-contenu p, .bio-suite-contenu h3').forEach(function (el, k) {
                if (el.tagName === 'H3') { el.classList.add('titre-ecrit', 'go'); return; }
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight) { revelerLignes(el, 0.15 + k * 0.05); filBio(el); }
                else {
                    el.classList.add('lignes-attente');
                    io.observe(el);
                }
            });
        });
    }

    /* ---------- « Le prochain » : le titre de l'affiche s'écrit au défilement ---------- */
    function prochain() {
        var p = document.querySelector('#spectacles .specials-suite');
        if (!p) return;
        var b = document.createElement('div');
        b.className = 'prochain';
        b.innerHTML =
            '<p class="prochain-kicker">le prochain spectacle</p>' +
            '<a class="prochain-titre" href="#billets" aria-label="Comme les Mongols à Baghdad, voir les dates">' +
            '<span class="pl t1"></span><span class="pl t2"></span><span class="pl t3"></span><span class="pl em"></span></a>' +
            '<a class="btn btn-light prochain-btn" href="#billets"><i>en tournée · les dates</i></a>';
        p.parentNode.replaceChild(b, p);
        var lignes = b.querySelectorAll('.pl');
        if (calme) { lignes.forEach(function (l) { l.style.setProperty('--r', 1); }); b.classList.add('fini'); return; }
        /* v34 : le titre est du vrai texte (mêmes lettres, mêmes positions que l'affiche) ; chaque ligne se décode en anagramme */
        var NS = 'http://www.w3.org/2000/svg', G = GLYPHES.desk, DY = 190, H = 660;
        var a = b.querySelector('.prochain-titre');
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + G.W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('class', 'titre-svg emb prochain-svg'); svg.setAttribute('aria-hidden', 'true');
        var e = EM_AFFICHE.desk;
        svg.innerHTML = embleme_g(e.cx, e.cy - DY, e.k, e.sw);
        var parMot = {}, ordre = [];
        G.g.forEach(function (d) {
            if (!/^t/.test(d[5])) return;
            var t = document.createElementNS(NS, 'text');
            t.setAttribute('x', d[1]); t.setAttribute('y', d[2] - DY); t.setAttribute('font-size', d[3]); t.setAttribute('font-weight', d[4]);
            t.setAttribute('class', 'lettre'); t.textContent = d[0];
            svg.appendChild(t);
            var dd = d.slice(); dd[2] = d[2] - DY;
            var cle = d[5] + ':' + d[6];
            if (!parMot[cle]) { parMot[cle] = { ligne: d[5], lettres: [], svg: svg }; ordre.push(cle); }
            parMot[cle].lettres.push({ el: t, d: dd });
        });
        a.appendChild(svg); a.classList.add('prochain-vectoriel');
        var motsP = ordre.map(function (k) { return parMot[k]; });
        var embG = svg.querySelector('.emb-g'), partiesP = partiesEmbleme(svg), survolPret = false;
        function ligneArrive(i) {
            motsP.filter(function (m) { return m.ligne === 't' + (i + 1); })
                .forEach(function (m, j) { setTimeout(function () { decoder(m); }, j * 160 * LENT); });
        }
        var vues = [false, false, false];
        var enCours = false;
        function maj() {
            enCours = false;
            var r = b.getBoundingClientRect();
            var vh = window.innerHeight;
            var prog = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
            lignes.forEach(function (l, i) {
                var x = Math.min(1, Math.max(0, prog * 4.2 - i * 0.85 - 0.4));
                l.style.setProperty('--r', x.toFixed(3));
                if (i < 3 && x > 0.05 && !vues[i]) { vues[i] = true; ligneArrive(i); }
                if (i === 3) { embG.style.opacity = x; }
            });
            b.classList.toggle('fini', prog >= 0.98);
            if (prog >= 0.98 && !survolPret) {
                survolPret = true;
                setTimeout(function () {
                    motsP.forEach(zoneSurvol);
                    var z = document.createElementNS(NS, 'rect');
                    z.setAttribute('x', e.cx - 200 * e.k); z.setAttribute('y', e.cy - DY - 300 * e.k); z.setAttribute('width', 400 * e.k); z.setAttribute('height', 600 * e.k);
                    z.setAttribute('class', 'zone-mot'); svg.appendChild(z);
                    z.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') brasserFormes(partiesP, 370, 2); });
                    z.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') brasserFormes(partiesP, 370, 2); });
                }, 1500 * LENT);
            }
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj);
        maj();
    }

    /* ---------- Infolettre : une lettre, un cachet, un champ qui s'écrit ---------- */
    function infolettre() {
        var sec = document.querySelector('.infolettre');
        if (!sec) return;
        sec.classList.add('infolettre-v2');
        var inner = sec.querySelector('.infolettre-inner');
        var texte = sec.querySelector('.infolettre-texte');
        var form = sec.querySelector('.infolettre-form');
        var input = form && form.querySelector('input[type="email"]');
        var bouton = form && form.querySelector('button[type="submit"]');

        /* « d'abord » : le mot qui compte */
        if (texte) texte.innerHTML = texte.innerHTML.replace("d'abord", '<span class="accent">d’abord</span>');

        /* le diagramme se construit autour du champ : un disque au-dessus, un disque en dessous,
           les chevrons de chaque côté, et les flèches qui convergent vers l'endroit où on écrit */
        /* la maison autour du champ : on écrit son courriel à la place du nom (mêmes règles que le logo) */
        if (form) {
            var cadre = document.createElement('div');
            cadre.className = 'form-maison';
            form.parentNode.insertBefore(cadre, form);
            cadre.innerHTML =
                '<svg class="fm-svg" viewBox="-528 -245 1056 490" aria-hidden="true" focusable="false">' +
                '<defs><clipPath id="fm-clip"><circle cx="0" cy="-53" r="16"/></clipPath></defs>' +
                '<g class="fm-traits">' +
                '<path d="M -458.2 -154.5 A 458.2 55.5 0 0 1 458.2 -154.5"/><ellipse cx="0" cy="-134" rx="458.2" ry="55.5"/>' +
                '<ellipse cx="0" cy="134" rx="458.2" ry="55.5"/><path d="M -458.2 154.5 A 458.2 55.5 0 0 0 458.2 154.5"/>' +
                '<g class="fm-chev-g"><path d="M -387.1 -95 L -426.1 0 L -387.1 95"/></g>' +
                '<g class="fm-chev-d"><path d="M 387.1 -95 L 426.1 0 L 387.1 95"/></g>' +
                '<g class="fm-fl-haut"><path d="M 0 -175.5 L 0 -82.5"/><path d="M -12 -110.5 L 0 -82.5 L 12 -110.5"/></g>' +
                '<g class="fm-fl-bas"><path d="M 0 175.5 L 0 70"/><path d="M -12 98 L 0 70 L 12 98"/></g>' +
                '<circle cx="0" cy="-53" r="17"/><circle cx="-15.8" cy="-52.9" r="10.3" clip-path="url(#fm-clip)"/>' +
                '<circle class="fm-pointille" cx="-0.1" cy="-68" r="8.4"/>' +
                '</g></svg>';
            cadre.appendChild(form);
            var traitsFm = cadre.querySelectorAll('.fm-traits path, .fm-traits ellipse, .fm-traits circle:not(.fm-pointille)');
            if (!calme) traitsFm.forEach(function (el, n) {
                el.setAttribute('pathLength', '1');
                el.style.strokeDasharray = '1'; el.style.strokeDashoffset = '1';
                el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.45, .1, .25, 1) ' + (n * 0.08) + 's';
            });
        }

        if (form) {
            form.addEventListener('submit', function () {
                setTimeout(function () { if (bouton) bouton.innerHTML = '<i>c’est noté ✓</i>'; form.classList.add('envoye'); }, 250);
            });
        }
        if (calme || !('IntersectionObserver' in window)) { sec.classList.add('vu'); return; }
        if (texte) texte.classList.add('lignes-attente');
        var io = new IntersectionObserver(function (e) {
            if (!e[0].isIntersecting) return;
            io.disconnect();
            document.querySelectorAll('.form-maison .fm-traits [pathLength]').forEach(function (el) { el.style.strokeDashoffset = '0'; });
            sec.classList.add('vu');
            if (texte) { texte.classList.remove('lignes-attente'); texte.classList.add('fondu-go'); }
            /* le champ s'écrit tout seul, comme à la machine */
            if (input && !input.value) {
                var mot = input.getAttribute('placeholder') || 'ton courriel';
                input.setAttribute('placeholder', '');
                var k = 0;
                var tape = setInterval(function () {
                    k++;
                    input.setAttribute('placeholder', mot.slice(0, k) + (k < mot.length ? '|' : ''));
                    if (k >= mot.length) clearInterval(tape);
                }, 85);
            }
        }, { threshold: 0.5 });
        io.observe(sec);
    }


    /* ---------- v49 : l'avion en papier de l'infolettre ----------
       Au survol du mot « infolettre », la lettre sous le curseur se plie en avion en papier,
       vole jusqu'au champ (une fine traînée de braise derrière elle), y atterrit et se défait
       en « infolettre » qui se décode ; le champ s'allume au même moment. Sur téléphone : une fois, à l'arrivée sur le champ. */
    /* v55 : contours des lettres de « infolettre » (Ibarra Real Nova italique 700), tirés de la police, en unités de la police */
    /* v56 : le tracé (squelette) de ces lettres, pour l'ordre dans lequel elles se dévident */
    var SQUEL_INFO = {"upm":1000,"g":{"E":[{"p":[[623,180],[611,176],[601,164],[591,154],[583,142],[571,130],[563,118],[553,106],[543,94],[533,82],[523,70],[513,58],[503,46],[493,34],[481,30],[469,28],[457,26],[445,24],[433,22],[421,20],[409,20],[397,18],[385,18],[373,18],[361,18],[349,18],[337,18],[325,18],[313,18],[301,18],[289,18],[277,18],[265,18],[253,18],[241,18],[229,18],[217,18],[205,20],[193,24],[181,34],[169,46],[157,58],[157,70],[159,82],[161,94],[163,106],[165,118],[169,130],[173,142],[177,154],[181,166],[187,178],[191,190],[197,202],[201,214],[205,226],[211,238],[215,250],[221,262],[225,274],[231,286],[235,298],[241,310],[245,322],[251,334],[255,346],[259,358],[265,370],[269,382],[279,394],[291,386],[303,374],[315,362],[327,356],[339,356],[351,356],[363,356],[375,356],[387,356],[399,356],[411,356],[423,356],[435,356],[447,356],[459,356],[471,356],[483,356],[495,356],[507,356],[519,354],[531,352],[543,350],[555,360],[565,372],[573,384],[581,396],[589,408],[595,420],[601,432],[607,444],[613,456],[619,468],[625,480],[635,490],[641,494]],"w":48}],"F":[{"p":[[709,506],[713,518],[713,530],[715,542],[713,554],[713,566],[713,578],[713,590],[713,602],[711,614],[711,626],[707,638],[695,642],[683,646],[671,648],[659,652],[647,654],[635,656],[623,658],[611,658],[599,658],[587,658],[575,658],[563,658],[551,658],[539,658],[527,658],[515,658],[503,658],[491,658],[479,658],[467,658],[455,658],[443,658],[431,658],[419,652],[407,646],[395,640],[383,634],[371,626],[359,620],[349,612],[347,600],[345,588],[343,576],[341,564],[337,552],[333,540],[329,528],[323,516],[319,504],[313,492],[309,480],[305,468],[299,456],[295,444],[289,432],[285,420],[279,408],[277,396],[275,384],[271,374],[263,364],[257,352],[253,340],[249,328],[243,316],[239,304],[233,292],[229,280],[223,268],[219,256],[215,244],[209,232],[205,220],[199,208],[195,196],[189,184],[185,172],[181,160],[175,148],[171,136],[165,124],[163,112],[161,100],[159,88],[155,76],[153,64],[145,56],[133,48],[121,42],[109,36],[97,30],[85,26],[73,24],[61,22],[49,20],[37,18],[25,18],[13,16],[1,14],[-11,14],[-23,12],[-35,12],[-47,8],[-53,4]],"w":89}],"I":[{"p":[[561,674],[549,668],[537,664],[525,662],[513,662],[501,660],[489,658],[477,658],[465,656],[453,656],[441,654],[429,652],[417,648],[405,644],[393,638],[381,632],[369,626],[357,618],[349,610],[347,598],[343,586],[341,574],[339,562],[337,550],[333,538],[329,526],[323,514],[319,502],[313,490],[309,478],[303,466],[299,454],[295,442],[289,430],[285,418],[279,406],[275,394],[269,382],[265,370],[261,358],[255,346],[251,334],[245,322],[241,310],[237,298],[231,286],[227,274],[221,262],[217,250],[211,238],[207,226],[203,214],[197,202],[193,190],[187,178],[183,166],[177,154],[173,142],[167,130],[163,118],[161,106],[159,94],[157,82],[155,70],[151,58],[139,52],[127,46],[115,38],[103,34],[91,28],[79,24],[67,22],[55,20],[43,18],[31,18],[19,16],[7,16],[-5,14],[-17,14],[-29,12],[-41,10],[-53,4],[-53,4]],"w":123}],"L":[{"p":[[687,198],[675,194],[665,182],[655,170],[645,158],[637,146],[627,134],[617,122],[609,110],[599,98],[589,86],[581,74],[569,62],[561,50],[551,38],[539,30],[527,28],[515,26],[503,24],[491,22],[479,20],[467,20],[455,18],[443,18],[431,18],[419,18],[407,18],[395,18],[383,18],[371,18],[359,18],[347,18],[335,18],[323,18],[311,18],[299,18],[287,18],[275,18],[263,18],[251,18],[239,18],[227,18],[215,20],[203,22],[191,28],[179,38],[167,50],[155,62],[157,74],[161,86],[163,98],[165,110],[167,122],[169,134],[175,146],[179,158],[185,170],[189,182],[195,194],[199,206],[203,218],[209,230],[213,242],[219,254],[223,266],[227,278],[233,290],[237,302],[243,314],[247,326],[253,338],[257,350],[261,362],[267,374],[271,386],[277,398],[281,410],[287,422],[291,434],[295,446],[301,458],[305,470],[311,482],[315,494],[321,506],[325,518],[329,530],[335,542],[337,554],[341,566],[343,578],[345,590],[347,602],[349,614],[361,622],[373,628],[385,634],[397,640],[409,646],[421,650],[433,652],[445,654],[457,656],[469,658],[481,658],[493,660],[505,660],[517,662],[529,662],[541,664],[553,670],[561,674]],"w":68}],"N":[{"p":[[223,22],[211,16],[199,12],[187,14],[175,16],[163,16],[151,18],[139,18],[127,20],[115,22],[103,26],[97,34],[99,46],[101,58],[105,70],[107,82],[109,94],[115,106],[119,118],[123,130],[129,142],[133,154],[139,166],[143,178],[147,190],[153,202],[157,214],[163,226],[167,238],[171,250],[177,262],[181,274],[187,286],[191,298],[195,310],[201,322],[205,334],[211,346],[215,358],[219,370],[225,382],[229,394],[235,406],[239,418],[243,430],[249,442],[253,454],[259,466],[263,478],[267,490],[273,502],[277,514],[283,526],[287,538],[293,550],[297,562],[303,574],[313,584],[325,594],[337,606],[349,618],[361,616],[371,606],[377,594],[383,582],[389,570],[395,558],[401,546],[407,534],[411,522],[417,510],[423,498],[429,486],[435,474],[441,462],[447,450],[453,438],[459,426],[465,414],[469,402],[475,390],[481,378],[487,366],[493,354],[499,342],[505,330],[511,318],[517,306],[523,294],[527,282],[533,270],[539,258],[545,246],[551,234],[557,222],[563,210],[569,198],[575,186],[581,174],[587,162],[591,150],[599,138],[599,126],[599,114],[599,102],[601,90],[601,78],[601,66],[601,54],[601,42],[601,30],[603,18],[603,6],[603,-6],[601,-10]],"w":48}],"O":[{"p":[[257,512],[267,524],[277,536],[289,548],[299,560],[311,572],[323,582],[335,592],[347,602],[359,610],[371,616],[383,624],[395,632],[407,638],[419,642],[431,648],[443,652],[455,656],[467,658],[479,662],[491,664],[503,664],[515,666],[527,666],[539,666],[551,666],[563,666],[575,666],[587,664],[599,660],[611,660],[623,656],[635,652],[647,646],[659,640],[671,634],[683,624],[695,616],[707,604],[717,592],[725,580],[733,568],[741,556],[745,544],[751,532],[755,520],[757,508],[761,496],[763,484],[765,472],[767,460],[769,448],[771,436],[773,424],[775,412],[773,400],[773,388],[771,376],[769,364],[767,352],[765,340],[761,328],[757,316],[753,304],[751,292],[745,280],[741,268],[737,256],[731,244],[725,232],[719,220],[711,208],[703,196],[695,184],[687,172],[679,160],[669,148],[657,136],[647,124],[635,112],[623,100],[611,90],[599,82],[587,72],[575,64],[563,56],[551,50],[539,44],[527,38],[515,32],[503,28],[491,24],[479,20],[467,16],[455,14],[443,14],[431,12],[419,12],[407,10],[395,10],[383,10],[371,12],[359,12],[347,14],[335,18],[323,20],[311,22],[299,26],[287,34],[275,40],[263,48],[251,58],[239,66],[227,78],[217,90],[211,102],[203,114],[197,126],[193,138],[187,150],[183,162],[179,174],[177,186],[175,198],[173,210],[171,222],[167,234],[167,246],[165,258],[165,270],[165,282],[167,294],[169,306],[171,318],[171,330],[175,342],[179,354],[183,366],[187,378],[189,390],[195,402],[199,414],[205,426],[211,438],[217,450],[225,462],[231,474],[239,486],[247,498],[257,510],[257,510]],"w":95}],"R":[{"p":[[-51,4],[-39,10],[-27,12],[-15,14],[-3,14],[9,16],[21,16],[33,18],[45,18],[57,20],[69,22],[81,26],[93,28],[105,34],[117,40],[129,46],[141,52],[153,60],[157,72],[159,84],[161,96],[163,108],[165,120],[169,132],[173,144],[179,156],[183,168],[189,180],[193,192],[199,204],[203,216],[207,228],[213,240],[217,252],[223,264],[227,276],[233,288],[237,300],[243,312],[247,324],[251,336],[259,346],[265,358],[267,370],[269,382],[273,394],[279,406],[283,418],[289,430],[293,442],[297,454],[303,466],[307,478],[313,490],[317,502],[321,514],[327,526],[331,538],[337,550],[339,562],[341,574],[343,586],[345,598],[347,610],[357,620],[369,626],[381,632],[393,640],[405,646],[417,652],[429,658],[441,658],[453,658],[465,658],[477,658],[489,658],[501,658],[513,656],[525,654],[537,654],[549,652],[561,650],[573,646],[585,642],[597,638],[609,632],[621,624],[633,616],[643,604],[651,592],[655,580],[661,568],[665,556],[669,544],[669,532],[667,520],[663,508],[661,496],[657,484],[653,472],[647,460],[641,448],[633,436],[623,424],[611,412],[599,400],[587,390],[575,380],[563,372],[551,364],[539,360],[527,354],[515,348],[503,342],[491,338],[479,336],[467,332],[455,330],[445,318],[435,306],[425,302],[413,304],[401,308],[389,308],[377,310],[365,310],[353,310],[341,310],[329,310],[317,310],[305,310],[293,318],[281,330],[269,342],[263,348]],"w":92}],"T":[{"p":[[116,478],[128,482],[136,494],[144,506],[150,518],[160,530],[168,542],[176,554],[184,566],[192,578],[200,590],[210,602],[218,614],[228,626],[236,638],[246,644],[258,646],[270,648],[282,650],[294,652],[306,654],[318,656],[330,656],[342,658],[354,658],[366,658],[378,658],[390,658],[402,658],[414,658],[426,658],[438,658],[450,658],[462,658],[474,652],[486,640],[498,628],[506,616],[504,604],[502,592],[498,580],[492,568],[488,556],[482,544],[478,532],[474,520],[468,508],[464,496],[458,484],[454,472],[448,460],[444,448],[440,436],[434,424],[430,412],[424,400],[420,388],[414,376],[410,364],[406,352],[400,340],[396,328],[390,316],[386,304],[380,292],[376,280],[372,268],[366,256],[362,244],[356,232],[352,220],[346,208],[342,196],[338,184],[332,172],[328,160],[322,148],[318,136],[312,124],[310,112],[308,100],[306,88],[304,76],[300,64],[292,56],[280,48],[268,42],[256,36],[244,30],[232,26],[220,24],[208,22],[196,20],[184,18],[172,18],[160,16],[148,14],[136,14],[124,12],[112,12],[100,8],[94,4]],"w":88}],"e":[{"p":[[326,174],[314,172],[304,162],[298,150],[288,138],[278,126],[270,114],[258,102],[246,92],[236,84],[224,76],[212,70],[200,64],[188,60],[176,56],[164,54],[152,50],[140,48],[128,46],[116,44],[104,46],[92,52],[80,64],[74,76],[70,88],[66,100],[68,112],[68,124],[70,136],[72,148],[74,160],[76,172],[86,184],[98,196],[110,206],[120,218],[132,230],[144,238],[156,238],[168,242],[180,244],[192,248],[204,252],[216,258],[228,262],[240,268],[252,276],[264,284],[276,292],[288,302],[298,314],[308,326],[314,338],[318,350],[320,362],[324,374],[326,386],[322,398],[316,410],[304,418],[292,418],[280,418],[268,416],[256,414],[244,410],[232,408],[220,402],[208,396],[196,386],[184,376],[172,364],[160,352],[152,340],[142,328],[134,316],[126,304],[118,292],[112,280],[104,270],[92,262],[80,256],[74,246],[70,234],[68,222],[64,210],[62,198],[64,186],[76,176],[76,176]],"w":46}],"f":[{"p":[[-140,-169],[-130,-181],[-122,-193],[-114,-205],[-106,-217],[-94,-225],[-82,-229],[-70,-229],[-58,-229],[-46,-227],[-34,-221],[-22,-211],[-12,-199],[-4,-187],[4,-175],[12,-163],[16,-151],[22,-139],[28,-127],[34,-115],[44,-103],[50,-91],[54,-79],[58,-67],[62,-55],[64,-43],[68,-31],[72,-19],[76,-7],[80,5],[84,17],[86,29],[90,41],[94,53],[98,65],[102,77],[104,89],[108,101],[112,113],[116,125],[120,137],[124,149],[126,161],[130,173],[134,185],[138,197],[142,209],[144,221],[148,233],[152,245],[156,257],[160,269],[164,281],[166,293],[170,305],[174,317],[178,329],[182,341],[184,353],[188,365],[200,375],[212,383],[224,389],[236,397],[248,405],[260,413],[272,419],[284,425],[296,425],[308,425],[320,425],[332,425],[344,429],[356,435],[368,441],[372,443]],"w":92}],"i":[{"p":[[298,168],[286,166],[276,156],[268,144],[258,132],[250,120],[238,108],[228,96],[218,84],[208,72],[196,62],[184,52],[172,48],[160,46],[148,42],[136,40],[124,44],[112,56],[112,68],[114,80],[116,92],[118,104],[120,116],[124,128],[128,140],[132,152],[136,164],[142,176],[146,188],[150,200],[156,212],[160,224],[164,236],[170,248],[174,260],[180,272],[184,284],[188,296],[194,308],[198,320],[200,332],[202,344],[204,356],[206,368],[208,380],[216,392],[208,388],[196,400],[184,404],[172,402],[160,398],[148,394],[136,388],[124,376],[112,364],[102,352],[92,340],[82,328],[74,316],[64,304],[54,292],[46,280],[34,276],[46,280],[48,270],[50,268]],"w":78}],"l":[{"p":[[375,706],[363,702],[351,694],[339,684],[327,674],[315,664],[303,656],[291,646],[279,638],[275,626],[273,614],[271,602],[269,590],[267,578],[261,566],[257,554],[251,542],[247,530],[243,518],[237,506],[233,494],[229,482],[223,470],[219,458],[213,446],[209,434],[205,422],[199,410],[195,398],[191,386],[185,374],[181,362],[175,350],[171,338],[167,326],[161,314],[157,302],[151,290],[147,278],[143,266],[137,254],[133,242],[129,230],[123,218],[119,206],[113,194],[109,182],[105,170],[99,158],[95,146],[91,134],[87,122],[85,110],[83,98],[81,86],[79,74],[77,62],[81,50],[93,42],[105,40],[117,42],[129,46],[141,50],[153,54],[165,62],[177,74],[187,86],[197,98],[207,110],[215,122],[225,134],[235,146],[243,158],[255,166],[265,168]],"w":91}],"n":[{"p":[[557,168],[545,166],[535,156],[527,144],[517,132],[507,120],[497,108],[487,96],[477,84],[467,72],[455,62],[443,52],[431,50],[419,46],[407,42],[395,40],[383,42],[371,52],[369,64],[371,76],[375,88],[377,100],[379,112],[381,124],[387,136],[391,148],[397,160],[401,172],[407,184],[413,196],[417,208],[423,220],[427,232],[433,244],[437,256],[443,268],[449,280],[453,292],[459,304],[463,316],[465,328],[469,340],[471,352],[473,364],[475,376],[477,388],[465,398],[453,400],[441,398],[429,394],[417,392],[405,388],[393,386],[381,380],[369,372],[357,362],[345,352],[333,342],[321,330],[311,318],[299,306],[289,294],[279,282],[269,270],[259,258],[251,246],[241,234],[233,222],[225,210],[215,198],[207,188],[201,194],[189,198],[177,198],[165,198],[157,204],[159,216],[161,228],[165,240],[171,252],[175,264],[179,276],[185,288],[189,300],[195,312],[199,324],[201,336],[203,348],[205,360],[207,372],[209,384],[199,396],[187,402],[175,402],[163,398],[151,394],[139,390],[127,378],[115,366],[103,354],[93,342],[83,330],[73,318],[65,306],[55,294],[47,282],[49,270],[49,270],[41,278],[33,276]],"w":58}],"o":[{"p":[[132,295],[138,307],[146,319],[152,331],[160,343],[170,355],[180,367],[192,379],[204,391],[216,401],[228,411],[240,419],[252,423],[264,429],[276,433],[288,435],[300,435],[312,433],[324,433],[336,429],[348,423],[360,411],[368,399],[374,387],[378,375],[382,363],[384,351],[386,339],[388,327],[390,315],[392,303],[392,291],[390,279],[388,267],[384,255],[380,243],[378,231],[372,219],[368,207],[366,195],[360,183],[354,171],[348,159],[342,147],[336,135],[328,123],[320,111],[312,99],[304,87],[294,75],[284,65],[274,55],[262,43],[250,33],[238,25],[226,19],[214,15],[202,11],[190,9],[178,7],[166,9],[154,9],[142,13],[130,19],[118,27],[108,39],[102,51],[96,63],[92,75],[90,87],[86,99],[84,111],[82,123],[80,135],[80,147],[82,159],[86,171],[88,183],[92,195],[94,207],[98,219],[102,231],[106,243],[112,255],[118,267],[122,279],[130,291],[130,293]],"w":82}],"r":[{"p":[[449,372],[451,384],[443,396],[433,406],[421,408],[409,406],[397,404],[385,400],[373,396],[361,394],[349,388],[337,378],[325,368],[315,356],[305,346],[297,334],[287,322],[277,310],[267,298],[261,286],[253,274],[245,262],[237,250],[231,238],[225,226],[217,214],[209,202],[201,210],[199,200],[187,198],[175,194],[163,200],[161,212],[163,224],[165,236],[167,248],[173,260],[177,272],[183,284],[187,296],[193,308],[197,320],[201,332],[203,344],[205,356],[207,368],[209,380],[203,392],[191,402],[179,402],[167,398],[155,396],[143,392],[131,382],[119,370],[107,358],[97,346],[87,334],[77,322],[67,310],[59,298],[49,286],[47,274],[49,266],[45,278],[33,276],[33,276]],"w":37}],"t":[{"p":[[98,408],[110,416],[122,422],[134,424],[146,424],[158,424],[170,424],[182,422],[194,410],[202,398],[200,386],[198,374],[196,362],[190,350],[186,338],[182,326],[176,314],[172,302],[168,290],[162,278],[158,266],[154,254],[148,242],[144,230],[138,218],[134,206],[130,194],[124,182],[120,170],[116,158],[110,146],[106,134],[102,122],[100,110],[98,98],[96,86],[94,74],[92,62],[82,52],[94,56],[106,44],[118,42],[130,44],[142,46],[154,50],[166,54],[178,64],[188,74],[198,86],[208,98],[218,110],[228,122],[236,134],[242,146],[252,158],[262,166],[272,168]],"w":91}]}};
    var GLY_INFO = {"upm":1000,"g":{"E":{"adv":671,"c":[[[-59,0],[-50,22],[5,33],[20,36],[33,40],[44,44],[53,48],[60,53],[66,60],[72,68],[78,79],[83,92],[281,581],[288,600],[290,614],[288,623],[282,629],[269,635],[251,640],[204,651],[213,673],[786,673],[780,664],[775,655],[770,646],[766,636],[762,627],[759,618],[753,603],[748,587],[743,572],[739,558],[735,543],[732,527],[728,512],[724,496],[702,496],[702,512],[700,527],[698,541],[694,555],[690,568],[682,584],[673,598],[663,610],[650,620],[638,628],[626,633],[611,637],[595,639],[578,640],[445,640],[336,372],[464,372],[480,373],[496,374],[509,377],[522,381],[537,388],[551,397],[564,407],[575,419],[585,433],[594,448],[621,494],[643,494],[531,217],[509,217],[519,265],[522,287],[520,305],[514,320],[505,328],[492,334],[475,338],[453,339],[323,339],[234,119],[227,101],[221,85],[217,70],[215,59],[217,49],[223,42],[233,37],[248,34],[268,33],[342,33],[360,34],[377,36],[394,39],[410,44],[427,49],[442,56],[458,64],[474,74],[486,82],[498,90],[510,100],[523,110],[535,120],[602,180],[624,180],[616,167],[608,155],[600,142],[593,129],[585,117],[578,104],[570,91],[563,78],[556,65],[550,52],[543,39],[537,26],[532,13],[526,0]]]},"F":{"adv":647,"c":[[[-59,0],[-50,22],[5,33],[20,36],[33,40],[44,44],[53,48],[60,53],[66,60],[72,68],[78,79],[83,92],[281,581],[288,600],[290,614],[288,623],[282,629],[269,635],[251,640],[204,651],[213,673],[785,673],[779,664],[774,655],[770,646],[765,636],[762,627],[758,618],[752,603],[746,587],[742,572],[738,558],[734,543],[731,527],[727,512],[723,496],[701,496],[701,511],[699,525],[697,539],[694,552],[688,569],[681,584],[672,598],[661,610],[648,620],[634,628],[621,634],[608,637],[593,639],[577,640],[445,640],[328,352],[456,352],[472,353],[488,354],[501,357],[514,361],[529,368],[543,377],[556,387],[567,399],[577,413],[586,428],[613,474],[635,474],[523,197],[501,197],[511,245],[514,260],[515,274],[513,286],[509,296],[502,304],[493,310],[481,315],[465,318],[445,319],[315,319],[223,92],[216,74],[214,60],[216,50],[223,44],[235,38],[253,33],[307,22],[298,0]]]},"I":{"adv":410,"c":[[[-59,0],[-50,22],[5,33],[20,36],[33,40],[44,44],[53,48],[60,53],[66,60],[72,68],[78,79],[83,92],[281,581],[288,600],[290,614],[288,623],[282,629],[269,635],[251,640],[204,651],[213,673],[563,673],[554,651],[499,640],[484,637],[471,633],[460,630],[451,625],[444,620],[438,613],[433,605],[427,594],[421,581],[223,92],[216,74],[214,60],[216,51],[223,45],[235,39],[253,33],[300,22],[291,0]]]},"L":{"adv":702,"c":[[[-59,0],[-50,22],[5,33],[20,36],[33,40],[44,44],[53,48],[60,53],[66,60],[72,68],[78,79],[83,92],[281,581],[288,600],[290,614],[288,623],[282,629],[269,635],[251,640],[204,651],[213,673],[563,673],[554,651],[499,640],[484,637],[471,633],[460,630],[451,625],[444,620],[438,613],[433,605],[427,594],[421,581],[223,92],[218,75],[217,61],[220,49],[229,40],[245,35],[268,33],[394,33],[409,33],[424,35],[438,36],[452,39],[465,42],[481,48],[497,54],[513,62],[528,72],[540,80],[552,89],[564,98],[575,109],[587,120],[665,197],[687,197],[680,186],[673,174],[666,163],[658,151],[651,138],[643,126],[636,113],[628,100],[619,84],[611,70],[604,55],[596,41],[590,27],[584,13],[578,0]]]},"N":{"adv":832,"c":[[[598,-16],[319,567],[127,92],[122,77],[122,64],[125,54],[132,47],[143,41],[158,37],[225,22],[216,0],[-59,0],[-50,22],[14,35],[27,38],[38,41],[48,46],[58,50],[66,56],[74,63],[80,71],[86,81],[91,92],[288,581],[293,594],[296,605],[298,613],[297,620],[294,625],[288,630],[281,633],[271,637],[258,640],[212,651],[220,673],[410,673],[654,177],[814,581],[819,596],[819,609],[816,618],[809,626],[797,632],[782,636],[716,651],[724,673],[999,673],[991,651],[927,638],[915,635],[903,632],[893,628],[884,623],[875,617],[868,610],[862,602],[856,592],[850,581],[610,-16]]]},"O":{"adv":825,"c":[[[388,-8],[371,-8],[354,-7],[338,-5],[323,-3],[307,-1],[293,2],[278,6],[264,11],[251,15],[238,21],[226,27],[212,34],[200,42],[188,50],[177,59],[166,69],[156,79],[147,89],[138,100],[130,111],[122,124],[116,136],[110,149],[104,162],[100,175],[96,189],[93,203],[90,217],[88,232],[87,247],[87,262],[87,278],[88,293],[90,309],[92,324],[95,339],[98,354],[102,368],[107,383],[112,397],[118,412],[125,426],[132,438],[138,450],[146,463],[153,474],[161,486],[170,497],[179,508],[188,519],[197,530],[207,540],[218,550],[228,560],[240,569],[251,578],[262,587],[274,595],[286,603],[298,611],[311,618],[324,625],[337,632],[350,638],[363,644],[377,650],[391,655],[405,660],[419,664],[433,668],[447,672],[462,675],[476,677],[490,679],[505,681],[520,682],[534,683],[549,683],[566,683],[583,682],[599,680],[614,678],[630,676],[644,673],[659,669],[673,664],[686,660],[699,654],[712,648],[725,641],[737,633],[749,625],[760,616],[771,606],[781,597],[790,586],[799,575],[807,564],[814,552],[821,540],[827,527],[833,514],[837,500],[841,487],[844,473],[847,458],[849,444],[850,428],[850,413],[850,397],[849,382],[847,366],[845,351],[842,336],[839,321],[835,307],[830,292],[825,278],[819,263],[812,250],[805,237],[799,225],[791,212],[784,201],[776,189],[767,178],[758,167],[749,156],[740,145],[730,135],[719,125],[708,116],[697,106],[686,97],[675,88],[663,80],[651,72],[639,64],[626,57],[613,50],[600,43],[587,37],[574,31],[560,25],[546,20],[532,15],[518,11],[504,7],[490,3],[476,0],[461,-2],[447,-4],[432,-6],[418,-7],[403,-8],[388,-8]],[[409,27],[424,28],[439,29],[453,32],[467,35],[481,40],[495,46],[508,53],[521,61],[534,69],[546,79],[557,89],[569,99],[580,111],[590,123],[599,134],[608,146],[616,157],[624,170],[632,182],[639,195],[646,208],[653,221],[659,235],[665,248],[671,262],[676,276],[681,290],[685,304],[689,318],[692,332],[696,349],[699,365],[702,381],[704,396],[705,412],[706,427],[706,442],[706,460],[704,477],[703,494],[700,509],[696,524],[692,538],[687,552],[680,567],[672,580],[663,593],[653,604],[642,614],[630,624],[618,630],[606,636],[593,641],[579,644],[565,647],[550,648],[534,649],[519,648],[504,647],[490,644],[476,641],[462,636],[448,630],[435,623],[422,615],[409,607],[397,597],[386,587],[374,577],[363,565],[352,553],[344,542],[335,530],[327,519],[319,506],[311,494],[304,481],[297,468],[290,455],[284,441],[278,428],[272,414],[267,400],[262,386],[258,372],[254,358],[250,344],[247,327],[244,311],[241,295],[239,280],[238,264],[237,249],[237,234],[237,216],[239,199],[241,183],[243,167],[247,152],[251,138],[256,124],[264,110],[272,96],[281,83],[291,72],[302,62],[314,52],[325,46],[337,40],[350,35],[364,32],[378,29],[393,28],[409,27]]]},"R":{"adv":839,"c":[[[665,-16],[649,-15],[633,-13],[619,-9],[605,-4],[592,2],[580,11],[568,20],[557,31],[546,44],[536,58],[528,68],[521,80],[513,92],[506,104],[498,118],[490,131],[482,146],[474,161],[467,176],[459,190],[451,204],[444,218],[435,230],[427,242],[418,253],[409,263],[399,272],[386,282],[371,289],[354,293],[336,294],[305,294],[224,92],[217,74],[215,60],[217,51],[224,45],[236,39],[254,33],[300,22],[292,0],[-57,0],[-49,22],[7,33],[22,36],[35,40],[46,44],[54,48],[61,53],[68,60],[73,68],[79,79],[84,92],[281,581],[288,600],[290,614],[288,623],[282,629],[269,635],[251,640],[205,651],[213,673],[480,673],[499,673],[517,672],[534,671],[551,670],[567,669],[583,667],[598,665],[612,662],[625,659],[638,656],[650,653],[661,649],[672,645],[682,640],[698,631],[712,622],[723,611],[733,600],[740,587],[746,574],[749,560],[750,545],[749,530],[747,515],[744,501],[739,487],[732,473],[724,460],[716,447],[706,434],[695,422],[683,411],[670,400],[656,390],[644,381],[632,373],[619,365],[605,358],[591,352],[577,346],[563,340],[548,335],[534,330],[519,326],[505,323],[490,320],[476,318],[461,316],[460,314],[476,313],[491,310],[505,306],[518,299],[530,291],[541,281],[552,271],[562,259],[572,246],[581,232],[588,221],[595,209],[602,196],[609,184],[616,172],[622,159],[629,145],[636,131],[643,118],[650,105],[658,92],[667,76],[676,62],[687,50],[698,39],[709,30],[722,24],[737,20],[752,19],[743,-5],[729,-9],[715,-12],[703,-14],[691,-15],[678,-16],[665,-16]],[[319,327],[354,327],[371,327],[387,329],[403,331],[419,334],[434,338],[450,342],[464,348],[479,354],[492,361],[506,369],[518,377],[530,386],[542,396],[553,407],[562,418],[571,429],[580,442],[587,454],[593,468],[599,482],[603,496],[606,511],[607,527],[608,543],[607,561],[602,577],[595,591],[585,603],[572,614],[560,621],[548,627],[534,632],[520,635],[503,638],[486,639],[467,640],[445,640]]]},"T":{"adv":704,"c":[[[88,0],[97,22],[152,33],[167,36],[180,40],[191,44],[200,48],[207,53],[214,60],[219,68],[225,79],[230,92],[452,640],[379,640],[365,639],[350,638],[336,634],[321,630],[306,624],[292,618],[279,611],[267,603],[254,595],[242,587],[231,578],[219,568],[208,558],[197,547],[187,536],[176,524],[167,513],[157,501],[148,488],[140,476],[113,476],[120,487],[127,499],[134,511],[141,524],[148,538],[156,551],[163,565],[170,579],[176,593],[182,608],[190,625],[196,642],[201,658],[205,673],[865,673],[858,660],[851,646],[845,632],[839,618],[833,603],[828,588],[822,572],[818,557],[813,542],[809,528],[806,514],[802,501],[799,488],[797,476],[770,476],[772,493],[773,510],[773,526],[771,542],[768,558],[763,575],[756,591],[746,605],[734,618],[724,626],[711,632],[697,636],[682,639],[665,640],[592,640],[370,92],[363,74],[361,60],[363,51],[370,45],[382,39],[400,33],[447,22],[438,0]]]},"e":{"adv":360,"c":[[[100,-8],[83,-7],[68,-3],[55,3],[44,11],[35,22],[27,34],[22,47],[17,62],[15,77],[14,94],[14,110],[16,125],[17,140],[20,155],[24,170],[28,184],[33,199],[38,212],[45,226],[52,240],[59,253],[66,266],[74,278],[83,290],[92,302],[101,314],[112,326],[123,339],[134,350],[145,362],[156,373],[168,383],[179,393],[192,404],[206,413],[219,422],[233,429],[246,436],[263,443],[279,447],[295,450],[309,451],[327,450],[342,447],[355,441],[366,434],[376,422],[382,408],[384,392],[383,378],[379,363],[374,349],[366,334],[356,320],[348,311],[339,302],[329,294],[318,286],[306,278],[292,270],[278,263],[262,256],[252,251],[241,247],[229,243],[218,239],[205,236],[192,232],[178,229],[164,226],[149,223],[134,220],[118,217],[102,214],[85,212],[87,241],[103,243],[119,245],[133,247],[148,250],[161,254],[174,258],[186,262],[197,268],[214,276],[229,286],[242,295],[253,306],[262,316],[274,334],[282,351],[284,366],[281,381],[272,390],[258,393],[245,392],[231,388],[218,381],[206,372],[196,362],[186,352],[177,341],[168,328],[160,315],[152,301],[144,286],[138,271],[132,255],[126,239],[122,223],[118,206],[116,190],[114,174],[114,158],[115,140],[118,124],[123,110],[130,100],[141,89],[157,82],[175,80],[189,81],[203,85],[218,91],[229,97],[240,105],[252,115],[263,126],[272,135],[281,146],[290,158],[299,171],[307,185],[326,173],[319,161],[311,149],[303,137],[295,126],[287,115],[278,104],[269,93],[259,83],[248,72],[236,61],[225,51],[213,41],[202,33],[190,24],[178,17],[161,8],[145,1],[130,-4],[115,-7],[100,-8]]]},"f":{"adv":335,"c":[[[-76,-247],[-90,-246],[-105,-244],[-119,-241],[-132,-237],[-150,-230],[-164,-221],[-177,-210],[-186,-198],[-192,-186],[-194,-173],[-192,-155],[-187,-141],[-178,-130],[-166,-122],[-154,-118],[-140,-116],[-126,-118],[-113,-122],[-102,-130],[-94,-139],[-89,-151],[-86,-167],[-85,-187],[-84,-196],[-82,-203],[-79,-209],[-75,-213],[-69,-215],[-63,-216],[-54,-214],[-45,-207],[-36,-196],[-27,-181],[-19,-161],[-11,-137],[183,501],[188,518],[194,535],[200,551],[206,566],[213,580],[219,593],[226,606],[233,618],[240,629],[247,639],[255,648],[263,656],[270,664],[281,673],[293,681],[305,688],[317,694],[330,699],[344,703],[358,707],[373,709],[389,711],[405,711],[422,711],[438,709],[453,707],[467,704],[480,700],[491,694],[502,688],[517,677],[528,664],[535,649],[537,634],[536,622],[532,610],[525,598],[515,589],[502,583],[485,581],[466,583],[451,587],[438,595],[430,606],[425,619],[423,634],[423,637],[423,641],[424,644],[424,647],[424,649],[424,651],[423,659],[420,665],[414,670],[407,674],[399,676],[390,677],[372,675],[356,668],[343,656],[331,640],[326,631],[321,620],[316,609],[311,597],[306,583],[301,568],[295,552],[290,535],[284,517],[86,-138],[78,-139],[70,-143],[64,-150],[57,-158],[50,-167],[43,-178],[34,-190],[24,-202],[11,-214],[-2,-225],[-15,-233],[-28,-239],[-43,-243],[-59,-246],[-76,-247]],[[85,407],[99,442],[374,442],[359,407]]]},"i":{"adv":326,"c":[[[107,-8],[91,-6],[76,-2],[65,6],[55,16],[48,29],[46,43],[47,59],[52,76],[159,346],[163,358],[165,368],[164,374],[162,377],[159,379],[156,380],[149,378],[140,372],[128,361],[118,351],[108,340],[98,328],[88,315],[77,302],[67,288],[58,276],[50,263],[30,276],[40,291],[50,304],[60,318],[70,330],[79,342],[88,354],[97,364],[105,374],[113,384],[121,392],[129,401],[136,408],[150,421],[165,432],[179,440],[194,446],[208,450],[223,451],[245,448],[261,439],[270,425],[274,411],[274,396],[272,380],[266,362],[164,105],[160,92],[158,81],[160,73],[163,67],[167,64],[172,63],[179,65],[189,71],[200,82],[210,92],[220,103],[231,115],[242,128],[252,142],[262,155],[271,168],[279,180],[299,167],[289,152],[279,139],[269,125],[259,113],[250,101],[241,90],[232,79],[223,69],[215,59],[207,51],[199,42],[192,35],[177,22],[162,11],[148,3],[134,-3],[120,-7],[107,-8]],[[286,544],[267,546],[250,554],[235,566],[223,582],[215,598],[213,617],[214,632],[219,646],[225,658],[235,670],[251,682],[267,690],[286,692],[301,691],[315,686],[327,680],[339,670],[349,658],[356,646],[360,632],[361,617],[359,598],[351,581],[339,566],[327,556],[315,550],[301,545],[286,544]]]},"l":{"adv":296,"c":[[[74,-8],[58,-6],[44,-2],[32,6],[22,16],[15,29],[13,43],[14,59],[19,76],[230,608],[234,620],[234,630],[232,636],[227,642],[220,645],[213,648],[188,655],[193,673],[210,676],[227,679],[242,681],[257,684],[270,686],[283,688],[298,692],[313,695],[329,700],[345,706],[361,712],[375,705],[367,690],[358,674],[350,658],[343,641],[336,625],[330,609],[128,99],[125,88],[124,79],[126,72],[129,67],[134,64],[139,63],[150,66],[163,76],[178,92],[186,101],[194,111],[203,122],[212,135],[223,149],[234,164],[246,180],[266,167],[256,152],[246,139],[236,125],[226,113],[217,101],[208,90],[199,79],[190,69],[182,59],[174,51],[166,42],[158,35],[144,22],[129,11],[115,3],[101,-3],[87,-7],[74,-8]]]},"n":{"adv":585,"c":[[[17,-12],[161,350],[164,359],[166,366],[166,372],[164,376],[161,378],[156,379],[149,377],[140,371],[128,360],[118,350],[108,339],[98,327],[88,314],[77,301],[67,288],[58,275],[50,262],[30,275],[40,290],[50,303],[60,317],[70,329],[79,341],[88,352],[97,363],[106,373],[114,383],[122,391],[130,400],[138,407],[152,420],[167,431],[181,439],[195,445],[209,449],[222,450],[243,447],[259,439],[270,426],[275,412],[276,397],[273,380],[266,361],[191,184],[193,184],[201,197],[210,210],[219,223],[229,237],[238,251],[247,263],[256,275],[265,287],[274,299],[284,310],[294,322],[303,334],[314,345],[324,356],[334,366],[345,377],[356,386],[369,398],[383,408],[396,418],[410,426],[424,434],[437,440],[451,445],[465,448],[478,450],[492,451],[514,448],[530,440],[540,426],[544,412],[545,397],[542,380],[535,362],[421,100],[417,88],[416,79],[417,72],[420,67],[425,64],[431,63],[438,65],[448,71],[460,82],[469,92],[480,103],[490,115],[500,128],[511,142],[521,155],[530,168],[538,180],[558,167],[548,152],[538,139],[528,125],[518,113],[509,101],[500,90],[491,79],[482,69],[474,59],[466,51],[458,42],[450,35],[436,22],[421,11],[407,3],[393,-3],[379,-7],[366,-8],[348,-6],[333,-1],[321,7],[312,19],[308,33],[307,49],[309,67],[316,86],[424,336],[428,345],[429,353],[428,360],[424,364],[419,367],[412,368],[402,366],[390,361],[375,351],[358,338],[349,331],[340,322],[330,313],[320,304],[310,293],[300,282],[289,270],[278,258],[269,247],[261,236],[252,225],[243,214],[235,202],[226,190],[218,178],[209,166],[201,153],[192,140],[185,127],[178,115],[171,103],[164,90],[158,78],[151,65],[145,52],[139,39],[134,26],[128,13],[123,0]]]},"o":{"adv":473,"c":[[[188,-9],[171,-8],[156,-7],[141,-4],[126,0],[113,5],[100,11],[88,18],[77,26],[67,36],[58,46],[51,58],[45,70],[40,84],[37,99],[35,114],[34,131],[34,147],[35,163],[37,179],[39,195],[42,210],[46,225],[50,240],[56,254],[61,269],[67,282],[74,296],[81,309],[88,321],[96,333],[105,345],[114,356],[124,369],[135,380],[147,391],[158,401],[171,410],[183,418],[196,426],[210,433],[223,438],[237,443],[250,446],[264,449],[278,450],[292,451],[309,450],[325,448],[340,445],[354,441],[367,435],[380,428],[391,420],[401,411],[411,399],[420,386],[427,373],[433,358],[437,343],[439,327],[440,310],[440,294],[439,278],[437,263],[435,248],[432,233],[429,218],[425,203],[420,188],[415,174],[409,161],[403,147],[396,134],[389,122],[382,110],[374,98],[365,86],[355,74],[344,63],[333,52],[322,42],[310,33],[297,24],[284,16],[271,10],[258,4],[244,-1],[231,-4],[217,-7],[202,-8],[188,-9]],[[168,23],[184,26],[201,34],[218,47],[228,57],[238,69],[247,81],[257,95],[266,110],[274,123],[281,136],[288,150],[295,164],[301,178],[308,193],[313,208],[319,223],[324,237],[329,252],[333,266],[337,280],[341,297],[344,313],[346,327],[348,341],[348,354],[346,377],[341,395],[333,408],[321,415],[306,418],[290,415],[274,407],[257,394],[247,384],[237,373],[228,360],[218,347],[208,332],[201,319],[193,306],[186,292],[180,278],[173,264],[167,249],[161,234],[156,219],[151,205],[146,190],[142,176],[138,162],[134,145],[131,129],[129,115],[127,101],[127,88],[128,69],[132,53],[138,40],[146,31],[156,25],[168,23]]]},"r":{"adv":460,"c":[[[17,-12],[161,350],[164,359],[166,366],[166,372],[164,376],[161,378],[156,379],[149,377],[140,371],[128,360],[118,350],[108,339],[98,327],[88,314],[77,301],[67,288],[58,275],[50,262],[30,275],[40,290],[50,303],[60,317],[70,329],[79,341],[88,352],[97,363],[106,373],[114,383],[122,391],[130,400],[138,407],[152,420],[167,431],[181,439],[195,445],[209,449],[222,450],[243,447],[259,439],[270,426],[275,412],[276,397],[273,380],[266,361],[189,184],[191,184],[198,197],[206,210],[213,224],[221,238],[230,253],[238,268],[246,281],[254,294],[262,307],[270,319],[278,331],[287,344],[296,356],[306,369],[316,382],[327,393],[338,404],[349,415],[361,424],[375,434],[389,441],[404,447],[419,450],[434,451],[450,450],[465,446],[477,441],[488,432],[498,419],[504,404],[506,388],[504,369],[498,352],[488,339],[475,329],[461,323],[446,321],[438,322],[431,324],[425,327],[420,331],[416,335],[413,340],[408,349],[404,357],[400,364],[394,370],[388,374],[379,375],[367,373],[355,367],[341,358],[326,344],[316,335],[307,325],[298,314],[288,302],[278,289],[269,276],[258,261],[251,249],[243,237],[235,224],[227,211],[219,198],[211,184],[204,170],[196,155],[188,140],[182,128],[175,116],[169,103],[163,91],[157,78],[151,65],[145,52],[140,39],[134,26],[128,13],[123,0]]]},"t":{"adv":325,"c":[[[86,-8],[68,-6],[53,-1],[41,7],[34,18],[29,33],[28,48],[31,66],[37,85],[162,406],[95,406],[109,441],[178,441],[210,521],[315,531],[279,442],[361,442],[347,407],[265,407],[144,100],[141,88],[139,79],[140,72],[144,67],[148,64],[154,63],[160,65],[169,71],[180,82],[189,92],[198,103],[208,115],[218,128],[228,142],[237,155],[245,168],[253,180],[273,167],[263,152],[253,138],[244,125],[234,112],[225,100],[216,89],[208,78],[199,68],[191,59],[183,50],[175,42],[168,34],[154,22],[139,11],[126,3],[112,-3],[99,-7],[86,-8]]]}}};
    function avionInfolettre() {
        var sec = document.querySelector('.infolettre');
        var h2 = sec && sec.querySelector('h2');
        var form = sec && sec.querySelector('.infolettre-form');
        var input = form && form.querySelector('input[type="email"]');
        if (!h2 || !form || !input || calme) return;
        /* chaque lettre du mot devient un petit élément qu'on peut cacher pendant son vol */
        var cible = h2.querySelector('.ana') || h2;
        var marche = document.createTreeWalker(cible, NodeFilter.SHOW_TEXT, null), nds = [];
        while (marche.nextNode()) nds.push(marche.currentNode);
        nds.forEach(function (nd) {
            if (nd.parentNode.classList && nd.parentNode.classList.contains('inf-l')) return;
            var frag = document.createDocumentFragment();
            nd.nodeValue.split('').forEach(function (ch) {
                if (!/\S/.test(ch)) { frag.appendChild(document.createTextNode(ch)); return; }
                var s = document.createElement('span'); s.className = 'inf-l'; s.textContent = ch; s.setAttribute('data-c', ch); frag.appendChild(s);
            });
            nd.parentNode.replaceChild(frag, nd);
        });
        if (cible._fr) cible._fr = null;
        var lettres = Array.prototype.slice.call(h2.querySelectorAll('.inf-l'));
        if (!lettres.length) return;
        var NS = 'http://www.w3.org/2000/svg', enVol = false, dernier = 0;
        function bez(p0, p1, p2, p3, t) {
            var u = 1 - t;
            return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
        }
        function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
        /* v56 : la lettre reste la vraie lettre (pleine, exacte). Une gomme invisible suit son tracé (squelette tiré de la police) :
           la lettre s'efface trait par trait vers le point d'où sort le fil, comme une pelote qui se dévide ; le fil, lui, devient la flèche. */
        /* v103 : la lettre où le curseur s'arrête implose en braise (le même geste que les dates) ; la braise file
           en ligne droite jusqu'au champ, l'embrase, et « infolettre » devient « ton courriel ». */
        function lancer(lettre) {
            if (enVol || document.activeElement === input || input.value) return;
            if (performance.now() - dernier < 400) return;
            enVol = true;
            var fr = cible._fr;
            if (fr && fr.orig) { clearTimeout(fr.minut); fr.noeuds.forEach(function (nd, x) { nd.nodeValue = fr.orig[x]; }); }
            lettres.forEach(function (s) { var c = s.getAttribute('data-c'); if (c && s.firstChild && s.firstChild.nodeValue !== c) s.firstChild.nodeValue = c; });
            var rl = lettre.getBoundingClientRect();
            var A = { x: rl.left + rl.width * .55 + window.scrollX, y: rl.top + rl.height * .55 + window.scrollY };
            lettre.classList.remove('inf-revient', 'inf-partie'); void lettre.offsetWidth;
            lettre.classList.add('inf-implose');
            braiseVol(A, function () {
                var ri = input.getBoundingClientRect();
                return { x: ri.left + Math.min(46, ri.width * .2) + window.scrollX, y: ri.top + ri.height / 2 + window.scrollY };
            }, {
                depart: function () { lettre.classList.add('inf-partie'); lettre.classList.remove('inf-implose'); },
                impact: function () {
                    toucher();
                    form.classList.remove('champ-embrase'); void form.offsetWidth; form.classList.add('champ-embrase');
                    setTimeout(function () { form.classList.remove('champ-embrase'); }, 1600);
                    setTimeout(arriver, 280 * LENT);
                },
                fin: function () {
                    setTimeout(function () { lettre.classList.remove('inf-partie'); lettre.classList.add('inf-revient'); }, 500 * LENT);
                    setTimeout(function () { lettre.classList.remove('inf-revient'); enVol = false; dernier = performance.now(); }, 1300 * LENT);
                }
            });
        }
        /* v57 : la pointe touche le champ : il s'allume et se vide. La flèche finit d'atterrir : bang, « infolettre » se décode,
           puis, comme si on passait dessus, le mot se remélange et devient « ton courriel », qui redevient le texte du champ. */
        var mot = null;
        function preparerMot() {
            if (!mot) { mot = document.createElement('span'); mot.className = 'champ-mot'; mot.setAttribute('aria-hidden', 'true'); form.appendChild(mot); }
            var ri = input.getBoundingClientRect(), rf = form.getBoundingClientRect();
            mot.style.left = (ri.left - rf.left + (parseFloat(getComputedStyle(input).paddingLeft) || 0)) + 'px';
        }
        function toucher() {
            preparerMot();
            mot.textContent = ''; form.classList.remove('champ-mot-place');
            form.classList.add('champ-allume', 'champ-vide');
        }
        function transformer(el, vers, pasMs, fin) {
            var n = 0, pool = (el.textContent + vers).replace(/\s/g, '');
            (function coup() {
                var verrou = Math.max(0, n - 2);
                el.textContent = vers.split('').map(function (c, i) { return i < verrou || c === ' ' ? c : pool[Math.floor(Math.random() * pool.length)]; }).join('');
                n++;
                if (verrou < vers.length) setTimeout(coup, pasMs * LENT); else { el.textContent = vers; if (fin) fin(); }
            })();
        }
        function arriver() {
            preparerMot();
            form.classList.add('champ-allume', 'champ-vide', 'champ-mot-on');
            mot.textContent = 'infolettre'; mot._fr = null; mot._brasse = false;
            brasser(mot, 3, 60);
            setTimeout(function () {
                transformer(mot, input.getAttribute('placeholder') && input.getAttribute('placeholder').indexOf('|') < 0 ? input.getAttribute('placeholder') : 'ton courriel', 65, function () {
                    form.classList.add('champ-mot-place');   /* il prend l'allure exacte du texte du champ */
                    setTimeout(function () {
                        form.classList.remove('champ-mot-on', 'champ-vide', 'champ-mot-place', 'champ-allume');
                    }, 450 * LENT);
                });
            }, 1100 * LENT);
        }
        /* aussi utilisé par le lien « infolettre » du haut : le champ s'allume quand on arrive */
        form._allumer = function () {
            form.classList.add('champ-allume');
            setTimeout(function () { form.classList.remove('champ-allume'); }, 1800);
        };
        if (sourisFine) {
            /* v51 : c'est la lettre où le curseur S'ARRÊTE qui devient la flèche (pause d'un quart de seconde) */
            var sous = null, attente = null;
            h2.addEventListener('pointermove', function (e) {
                if (e.pointerType !== 'mouse') return;
                var l = e.target.closest && e.target.closest('.inf-l');
                if (l !== sous) { sous = l; }
                clearTimeout(attente);
                if (sous) attente = setTimeout(function () { if (sous) lancer(sous); }, 260);
            });
            h2.addEventListener('pointerleave', function () { sous = null; clearTimeout(attente); });
        }
        /* v68 : sur ordinateur aussi, la première arrivée dans la section joue le geste une fois, comme un indice ; ensuite, c'est le curseur */
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (en) {
                if (!en[0].isIntersecting) return;
                io.disconnect();
                setTimeout(function () { lancer(lettres[Math.floor(lettres.length / 2)]); }, 900);
            }, { threshold: .9 });
            io.observe(form);
        }
    }

    /* ---------- Discographie : des disques, pas des tuiles ---------- */
    function discographie() {
        var albums = document.querySelectorAll('#musique .album');
        if (!albums.length) return;
        var rangee = albums[0].closest('.row');
        if (rangee) {
            rangee.classList.add('discos');
            rangee.insertAdjacentHTML('beforebegin', '<p class="discos-kicker">discographie</p>');
        }
        albums.forEach(function (al, i) {
            var img = al.querySelector('.album-img');
            if (!img) return;
            var poch = document.createElement('div');
            poch.className = 'album-pochette';
            img.parentNode.insertBefore(poch, img);
            var d = document.createElement('span');
            d.className = 'disque';
            d.setAttribute('aria-hidden', 'true');
            var et = document.createElement('span');
            et.className = 'disque-etiquette';
            et.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
            img.addEventListener('load', function () { et.style.backgroundImage = 'url("' + img.currentSrc + '")'; });
            d.appendChild(et);
            poch.appendChild(d);
            poch.appendChild(img);
            al.style.setProperty('--retard', (i * 0.18) + 's');
        });
        if (calme || !('IntersectionObserver' in window)) { albums.forEach(function (a) { a.classList.add('vu'); }); return; }
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('vu'); io.unobserve(x.target); } });
        }, { threshold: 0.5 });
        albums.forEach(function (a) { io.observe(a); });
    }

    /* ---------- 2a. Timbres « complet » ---------- */
    function timbres() {
        var t = document.querySelectorAll('.ticket-complet');
        t.forEach(function (x) { x.classList.add('timbre'); });
        if (calme || !('IntersectionObserver' in window)) return;
        t.forEach(function (x) { x.classList.add('timbre-attente'); });
        var file = [];
        var minuterie = null;
        function vider() {
            var x = file.shift();
            if (!x) { minuterie = null; return; }
            x.classList.remove('timbre-attente');
            x.classList.add('timbre-pose');
            minuterie = setTimeout(vider, 140);
        }
        var io = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (e) {
                if (!e.isIntersecting) return;
                io.unobserve(e.target);
                file.push(e.target);
                if (!minuterie) minuterie = setTimeout(vider, 250);
            });
        }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
        t.forEach(function (x) { io.observe(x); });
        /* filet : tout timbre déjà passé à l'écran est posé, même si l'observateur l'a raté */
        var verif = false;
        function rattraper() {
            verif = false;
            t.forEach(function (x) {
                if (!x.classList.contains('timbre-attente')) return;
                var r = x.getBoundingClientRect();
                if (r.top < window.innerHeight * 0.9 && r.height) { io.unobserve(x); x.classList.remove('timbre-attente'); x.classList.add('timbre-pose'); }
            });
        }
        window.addEventListener('scroll', function () { if (!verif) { verif = true; setTimeout(rattraper, 600); } }, { passive: true });
        window.addEventListener('load', function () { setTimeout(rattraper, 1200); });
    }

    /* ---------- 2b. Panneau fixe dans la colonne de gauche (ordi) ---------- */
    function panneauVille() {
        var billets = document.getElementById('billets');
        if (!billets) return;
        var h2 = billets.querySelector('h2');
        var col = h2 && h2.parentNode;
        if (!col) return;
        var p = document.createElement('div');
        p.className = 'panneau-ville';
        p.setAttribute('aria-hidden', 'true');
        p.innerHTML = '<div class="panneau-photo"><div class="panneau-texte"><span class="panneau-kicker"></span><span class="panneau-nom"></span><span class="panneau-date"></span></div></div>';
        col.appendChild(p);
        var bloc = p.querySelector('.panneau-texte');
        var k = p.querySelector('.panneau-kicker');
        var nom = p.querySelector('.panneau-nom');
        var date = p.querySelector('.panneau-date');
        var courant = null, minuterie = null;

        function infos(row) {
            var v = row.querySelector('.ticket-ville');
            var j = row.querySelector('.ticket-jour i');
            var salle = row.querySelector('.ticket-salle');
            var tag = row.querySelector('.ticket-tag');
            return {
                nom: v ? (v.getAttribute('data-nom') || v.textContent).trim() : '',
                date: j ? j.textContent.trim() : '',
                kicker: row.classList.contains('ticket-est-complet') ? 'complet' : (tag ? tag.textContent.trim() : (salle ? salle.textContent.trim() : ''))
            };
        }
        function afficher(row, doux) {
            if (!row || row === courant) return;
            courant = row;
            var d = infos(row);
            function poser() { k.textContent = d.kicker; nom.textContent = d.nom; nom.style.fontSize = d.nom.length > 14 ? '1.55rem' : ''; date.textContent = d.date; bloc.classList.remove('change'); }
            clearTimeout(minuterie);
            if (!doux || calme) { poser(); return; }
            bloc.classList.add('change');
            minuterie = setTimeout(poser, 200);
        }
        function prochaine() {
            var rows = billets.querySelectorAll('.ticket');
            for (var i = 0; i < rows.length; i++) {
                var r = rows[i];
                if (r.classList.contains('ticket-est-complet')) continue;
                if (r.offsetParent === null) continue;          /* date passée ou masquée */
                if (r.closest('.ticket-vedette')) continue;     /* les supplémentaires ont leur encadré */
                return r;
            }
            return null;
        }
        /* attendre que le script des dates ait masqué les dates passées */
        setTimeout(function () { afficher(prochaine(), false); }, 0);
        window.addEventListener('load', function () { if (!courant) afficher(prochaine(), false); });

        /* le panneau suit le défilement : il montre la date qui passe au milieu de l'écran */
        var survol = false, retour = null, enCours = false;
        function suivre() {
            enCours = false;
            if (survol || window.innerWidth < 768) return;
            var bz = billets.getBoundingClientRect();
            if (bz.bottom < 0 || bz.top > window.innerHeight) return;
            var rows = billets.querySelectorAll('.ticket');
            var milieu = window.innerHeight * 0.45, best = null, bd = 1e9;
            for (var i = 0; i < rows.length; i++) {
                var r = rows[i];
                if (r.offsetParent === null || r.closest('.ticket-vedette')) continue;
                var b = r.getBoundingClientRect();
                var d = Math.abs(b.top + b.height / 2 - milieu);
                if (d < bd) { bd = d; best = r; }
            }
            if (best) afficher(best, true);
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(suivre); } }, { passive: true });

        if (!sourisFine) return;
        billets.querySelectorAll('.ticket').forEach(function (row) {
            row.addEventListener('mouseenter', function () { clearTimeout(retour); survol = true; afficher(row, true); });
            row.addEventListener('mouseleave', function () {
                clearTimeout(retour);
                retour = setTimeout(function () { survol = false; suivre(); }, 500);
            });
        });
    }

    /* ---------- 3. Vinyles ---------- */
    function vinyles() {
        document.querySelectorAll('.produit').forEach(function (p) {
            var cat = p.querySelector('.produit-cat');
            var img = p.querySelector('.produit-image img');
            if (!cat || !img || cat.textContent.trim().toLowerCase() !== 'vinyle') return;
            p.classList.add('produit-vinyle');
            var d = document.createElement('span');
            d.className = 'disque';
            d.setAttribute('aria-hidden', 'true');
            var et = document.createElement('span');
            et.className = 'disque-etiquette';
            et.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
            img.addEventListener('load', function () { et.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")'; });
            d.appendChild(et);
            img.parentNode.insertBefore(d, img);
        });
        if (sourisFine || calme || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (e) { e.target.classList.toggle('vu', e.isIntersecting); });
        }, { threshold: 0.7 });
        document.querySelectorAll('.produit-vinyle').forEach(function (p) { io.observe(p); });
    }

    /* ---------- Ronde C : pochette Plexus, livres, vêtements, cascade ---------- */
    function objets() {
        var poch = document.querySelector('.vedette-pochette');
        var img = poch && poch.querySelector('img');
        if (poch && img) {
            var d = document.createElement('span');
            d.className = 'disque';
            d.setAttribute('aria-hidden', 'true');
            var et = document.createElement('span');
            et.className = 'disque-etiquette';
            et.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
            d.appendChild(et);
            poch.insertBefore(d, img);
            if (calme || !('IntersectionObserver' in window)) poch.classList.add('vu');
            else {
                var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { poch.classList.add('vu'); io.disconnect(); } }, { threshold: 0.55 });
                io.observe(poch);
            }
        }
        document.querySelectorAll('.produit').forEach(function (p, i) {
            var cat = p.querySelector('.produit-cat');
            var t = cat ? cat.textContent.trim().toLowerCase() : '';
            if (t === 'livre') p.classList.add('produit-livre');
            if (t === 't-shirt' || t === 'tuque') p.classList.add('produit-vetement');
            /* cascade : AOS lit le délai au moment d'animer */
            if (p.hasAttribute('data-aos')) p.setAttribute('data-aos-delay', String((i % 4) * 90));
        });
        document.querySelectorAll('#musique [data-aos], #spectacles .special[data-aos]').forEach(function (el, i) {
            el.setAttribute('data-aos-delay', String((i % 3) * 110));
        });
    }

    /* ==========================================================
       Le diagramme de l'âme : boutons, curseur, séparateurs, défiler, retour en haut
       ========================================================== */
    var FLECHE_BAS = '<path d="M 6 1 L 6 15 M 2.5 10.5 L 6 15.5 L 9.5 10.5"/>';
    var FLECHE_HAUT = '<path d="M 6 17 L 6 3 M 2.5 7.5 L 6 2.5 L 9.5 7.5"/>';

    /* 1. Boutons principaux : les flèches convergent vers le mot, un arc fait le tour */
    function boutonsConvergence() {
        var cibles = document.querySelectorAll('main .btn-light, main .ticket-btn, main .btn-lg.btn-outline-light, .infolettre .btn');
        cibles.forEach(function (b) {
            if (b.closest('nav') || b.closest('.hp-billets') || b.querySelector('.conv')) return;   /* v96 : le bouton du hero a son propre geste */
            b.classList.add('btn-conv');
            b.insertAdjacentHTML('beforeend',
                '<span class="conv" aria-hidden="true">' +
                '<svg class="conv-arc" viewBox="0 0 100 40" preserveAspectRatio="none"><ellipse cx="50" cy="20" rx="49" ry="19" pathLength="1"/></svg>' +
                '<svg class="conv-fl conv-haut" viewBox="0 0 12 18">' + FLECHE_BAS + '</svg>' +
                '<svg class="conv-fl conv-bas" viewBox="0 0 12 18">' + FLECHE_HAUT + '</svg>' +
                '</span>');
        });
    }

    /* 2. Boutons secondaires : le mot entre chevrons, les disques se tracent autour */
    function boutonsChevrons() {
        document.querySelectorAll('.musique-btn, .bio-suite summary, .bio-suite-fin').forEach(function (b) {
            if (b.querySelector('.chev')) return;
            b.classList.add('btn-chev');
            b.insertAdjacentHTML('afterbegin', '<svg class="chev chev-g" viewBox="0 0 8 14" aria-hidden="true"><path d="M 7 1 L 1.5 7 L 7 13"/></svg>');
            b.insertAdjacentHTML('beforeend',
                '<svg class="chev chev-d" viewBox="0 0 8 14" aria-hidden="true"><path d="M 1 1 L 6.5 7 L 1 13"/></svg>' +
                '<svg class="chev-arcs" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">' +
                '<path pathLength="1" d="M 10 7 Q 50 -9 90 7"/>' +
                '<path pathLength="1" d="M 10 33 Q 50 49 90 33"/></svg>');
        });
    }

    /* 3. Curseur contextuel : invisible au repos ; sur un lien, le cercle pointillé du diagramme vient l'entourer.
          Les boutons qui ont déjà leur propre dessin (convergence, chevrons) n'en ont pas besoin. */
    function curseur() {
        if (!sourisFine || calme) return;
        var c = document.createElement('div');
        c.className = 'curseur';
        c.setAttribute('aria-hidden', 'true');
        document.body.appendChild(c);
        var cible = null, mx = 0, my = 0;
        var x = 0, y = 0, w = 0, h = 0, tx = 0, ty = 0, tw = 0, th = 0, boucle = null;
        function viser() {
            var r = cible.getBoundingClientRect();
            var rond = cible.matches('.sociaux a, .retour-haut');
            tw = r.width + (rond ? 10 : 12);
            th = rond ? tw : r.height + 6;
            /* léger effet d'aimant : le cercle suit un peu la souris */
            tx = r.left + r.width / 2 + (mx - (r.left + r.width / 2)) * 0.12;
            ty = r.top + r.height / 2 + (my - (r.top + r.height / 2)) * 0.12;
        }
        function anime() {
            if (cible) viser();
            x += (tx - x) * 0.2; y += (ty - y) * 0.2; w += (tw - w) * 0.2; h += (th - h) * 0.2;
            c.style.transform = 'translate3d(' + (x - w / 2) + 'px,' + (y - h / 2) + 'px,0)';
            c.style.width = w + 'px';
            c.style.height = h + 'px';
            if (cible || Math.abs(tx - x) + Math.abs(tw - w) > 0.3) boucle = requestAnimationFrame(anime); else boucle = null;
        }
        var SEL = 'a, button, summary';
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            var t = e.target.closest && e.target.closest(SEL);
            if (t && (t.matches('.btn, .bouton-note, .btn-conv, .btn-chev, .produit, .special-poster, .prochain-titre, .ecouter-menu a, .pf-cachet') || t.getBoundingClientRect().width > 320 || t.getBoundingClientRect().height > 90)) t = null;
            if (t !== cible) {
                if (t && !cible) {   /* première apparition : partir du centre de l'élément */
                    var r = t.getBoundingClientRect();
                    x = r.left + r.width / 2; y = r.top + r.height / 2; w = r.width * 0.6; h = r.height * 0.6;
                }
                cible = t;
                c.classList.toggle('actif', !!t);
            }
            if (cible && !boucle) boucle = requestAnimationFrame(anime);
        }, { passive: true });
        /* v60 : au défilement, la souris ne bouge pas mais la page oui : si l'élément n'est plus sous elle (ou s'est effacé), le pointillé part */
        window.addEventListener('scroll', function () {
            if (!cible) return;
            var r = cible.getBoundingClientRect(), dedans = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
            if (!dedans || cible.classList.contains('parti') || parseFloat(cible.style.getPropertyValue('--p')) > .25 || parseFloat(getComputedStyle(cible).opacity) < .3) { cible = null; c.classList.remove('actif'); }
            if (!boucle) boucle = requestAnimationFrame(anime);
        }, { passive: true });
        document.addEventListener('mouseleave', function () { cible = null; c.classList.remove('actif'); });
    }

    /* 4. Séparateurs : l'arc double du diagramme remplace le trait droit */
    function separateurs() {
        var els = document.querySelectorAll('.infolettre-inner, #musique > .container > .border-top, #boutique > .container > .border-top, #spectacles > .container > .border-top, #bio > .container > .border-top');
        els.forEach(function (el) {
            el.classList.add('sep-arc');
            el.insertAdjacentHTML('afterbegin',
                '<svg class="sep-svg" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">' +
                '<path pathLength="1" d="M 0 14 C 260 2, 740 2, 1000 14"/>' +
                '<path class="sep-double" pathLength="1" d="M 90 18 C 330 7, 790 7, 1000 11"/></svg>');
        });
        if (calme || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('sep-go'); }); return; }
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('sep-go'); io.unobserve(x.target); } });
        }, { threshold: 0.05, rootMargin: '0px 0px -12% 0px' });
        els.forEach(function (e) { io.observe(e); });
    }



    /* ---------- Ouverture (v31) : le titre est du vrai texte, lettre par lettre, et chaque mot se « décode » ----------
       Ibarra Real Nova italique, la police de l'affiche, chaque lettre à sa position exacte relevée sur l'affiche.
       À l'entrée, les lettres d'un mot apparaissent mélangées (anagramme), sautent de place par coups secs,
       légèrement penchées, puis se verrouillent une à une de gauche à droite. Aucune glissade, aucun flou. */
    var GLYPHES = {"desk":{"W":570,"H":965,"g":[["L",159.0,69.0,64.7,425,"l1","le"],["e",197.2,69.0,64.7,425,"l1","le"],["6",220.0,69.0,64.7,425,"l1","6e"],["e",244.8,47.6,38.4,425,"l1","6e"],["s",261.0,69.0,64.7,425,"l1","spectacle"],["p",276.7,69.0,64.7,425,"l1","spectacle"],["e",300.0,69.0,64.7,425,"l1","spectacle"],["c",315.7,69.0,64.7,425,"l1","spectacle"],["t",331.9,69.0,64.7,425,"l1","spectacle"],["a",344.2,69.0,64.7,425,"l1","spectacle"],["c",368.4,69.0,64.7,425,"l1","spectacle"],["l",383.7,69.0,64.7,425,"l1","spectacle"],["e",394.9,69.0,64.7,425,"l1","spectacle"],["d",105.5,132.0,64.7,425,"l2","dadib"],["’",130.7,132.0,64.7,425,"l2","dadib"],["A",140.0,133.0,64.7,425,"l2","dadib"],["d",180.7,132.0,64.7,425,"l2","dadib"],["i",205.9,132.0,64.7,425,"l2","dadib"],["b",217.7,132.0,64.7,425,"l2","dadib"],["A",246.5,133.0,64.7,425,"l2","alkhalidey"],["l",288.2,132.0,64.7,425,"l2","alkhalidey"],["k",299.5,132.0,64.7,425,"l2","alkhalidey"],["h",323.7,132.0,64.7,425,"l2","alkhalidey"],["a",350.9,132.0,64.7,425,"l2","alkhalidey"],["l",375.2,132.0,64.7,425,"l2","alkhalidey"],["i",386.4,132.0,64.7,425,"l2","alkhalidey"],["d",398.7,132.0,64.7,425,"l2","alkhalidey"],["e",422.9,133.0,64.7,425,"l2","alkhalidey"],["y",433.6,133.0,64.7,425,"l2","alkhalidey"],["C",20.0,301.0,147.2,600,"t1","comme"],["o",117.3,301.0,147.2,600,"t1","comme"],["m",166.7,301.0,147.2,600,"t1","comme"],["m",268.0,301.0,147.2,600,"t1","comme"],["e",371.4,301.0,147.2,600,"t1","comme"],["l",422.5,304.0,147.2,600,"t1","les"],["e",451.8,303.0,147.2,600,"t1","les"],["s",489.7,303.0,147.2,600,"t1","les"],["M",38.5,413.0,147.2,600,"t2","mongols"],["o",160.3,414.0,147.2,600,"t2","mongols"],["n",209.7,414.0,147.2,600,"t2","mongols"],["g",277.5,413.0,147.2,600,"t2","mongols"],["o",328.4,414.0,147.2,600,"t2","mongols"],["l",376.7,414.0,147.2,600,"t2","mongols"],["s",404.0,414.0,147.2,600,"t2","mongols"],["à",475.5,414.0,147.2,600,"t2","a"],["B",59.0,534.0,147.2,600,"t3","baghdad"],["a",148.3,534.0,147.2,600,"t3","baghdad"],["g",205.7,533.0,147.2,600,"t3","baghdad"],["h",257.0,534.0,147.2,600,"t3","baghdad"],["d",322.4,534.0,147.2,600,"t3","baghdad"],["a",380.7,534.0,147.2,600,"t3","baghdad"],["d",439.5,534.0,147.2,600,"t3","baghdad"]]},"mob":{"W":492,"H":1200,"g":[["L",132.0,58.0,57.2,400,"l1","le"],["e",165.6,58.0,57.2,400,"l1","le"],["6",186.0,58.0,57.2,400,"l1","6e"],["e",207.8,38.8,34.0,400,"l1","6e"],["s",222.0,58.0,57.2,400,"l1","spectacle"],["p",236.1,58.0,57.2,400,"l1","spectacle"],["e",256.3,58.0,57.2,400,"l1","spectacle"],["c",270.9,58.0,57.2,400,"l1","spectacle"],["t",284.5,58.0,57.2,400,"l1","spectacle"],["a",294.7,58.0,57.2,400,"l1","spectacle"],["c",316.8,58.0,57.2,400,"l1","spectacle"],["l",329.9,58.0,57.2,400,"l1","spectacle"],["e",340.0,58.0,57.2,400,"l1","spectacle"],["d",86.0,113.0,57.2,400,"l2","dadib"],["’",107.1,113.0,57.2,400,"l2","dadib"],["A",116.3,113.0,57.2,400,"l2","dadib"],["d",152.4,113.0,57.2,400,"l2","dadib"],["i",172.5,114.0,57.2,400,"l2","dadib"],["b",184.7,113.0,57.2,400,"l2","dadib"],["A",210.0,113.0,57.2,400,"l2","alkhalidey"],["l",245.6,114.0,57.2,400,"l2","alkhalidey"],["k",256.3,113.0,57.2,400,"l2","alkhalidey"],["h",278.4,113.0,57.2,400,"l2","alkhalidey"],["a",300.5,113.0,57.2,400,"l2","alkhalidey"],["l",321.7,114.0,57.2,400,"l2","alkhalidey"],["i",331.8,114.0,57.2,400,"l2","alkhalidey"],["d",343.9,113.0,57.2,400,"l2","alkhalidey"],["e",365.0,113.0,57.2,400,"l2","alkhalidey"],["y",374.2,113.0,57.2,400,"l2","alkhalidey"],["C",10.0,319.0,130.2,600,"t1","comme"],["o",95.4,319.0,130.2,600,"t1","comme"],["m",138.8,319.0,130.2,600,"t1","comme"],["m",228.1,319.0,130.2,600,"t1","comme"],["e",318.5,319.0,130.2,600,"t1","comme"],["l",364.5,321.0,130.2,600,"t1","les"],["e",389.4,321.0,130.2,600,"t1","les"],["s",423.8,321.0,130.2,600,"t1","les"],["M",26.5,417.0,130.2,600,"t2","mongols"],["o",133.4,418.0,130.2,600,"t2","mongols"],["n",176.8,418.0,130.2,600,"t2","mongols"],["g",237.1,418.0,130.2,600,"t2","mongols"],["o",280.5,418.0,130.2,600,"t2","mongols"],["l",323.9,418.0,130.2,600,"t2","mongols"],["s",348.3,418.0,130.2,600,"t2","mongols"],["à",411.0,418.0,130.2,600,"t2","a"],["B",44.5,523.0,130.2,600,"t3","baghdad"],["a",123.4,523.0,130.2,600,"t3","baghdad"],["g",173.8,523.0,130.2,600,"t3","baghdad"],["h",219.1,523.0,130.2,600,"t3","baghdad"],["d",275.5,523.0,130.2,600,"t3","baghdad"],["a",327.9,523.0,130.2,600,"t3","baghdad"],["d",378.8,524.0,130.2,600,"t3","baghdad"]]}};
    var DEPART_LIGNE = { desk: { l1: .15, l2: .45, t1: .85, t2: 1.35, t3: 1.85 }, mob: { l1: .15, l2: .45, t1: 1.05, t2: 1.55, t3: 2.05 } };
    var POLICE_TITRE = 'Ibarra Titre';
    var PAS_BRASSAGE = 0.065;   /* durée d'un « coup » (s) */

    /* v34 : l'emblème et l'adresse du haut, redessinés en vectoriel à leur place exacte sur l'affiche (relevé au pixel) */
    var EM_AFFICHE = { desk: { cx: 287.75, cy: 732.5, k: 0.3362, sw: 4.2 }, mob: { cx: 245.5, cy: 183.5, k: 0.127, sw: 8.8 } };
    var URL_AFFICHE = {"desk":{"size":44.0,"wght":400,"g":[["a",136.0,935.0],["d",153.8,935.0],["i",175.6,935.0],["b",183.4,935.0],["a",204.2,935.0],["l",222.0,935.0],["k",231.9,935.0],["h",252.7,935.0],["a",273.5,935.0],["l",291.3,935.0],["i",301.1,935.0],["d",308.9,935.0],["e",330.7,935.0],["y",347.5,935.0],[".",364.3,935.0],["c",373.2,935.0],["o",390.0,935.0],["m",408.8,935.0]]},"mob":{"size":38.0,"wght":400,"g":[["a",109,1175.0],["d",123.6,1175.0],["i",143.2,1175.0],["b",150.9,1175.0],["a",170.5,1175.0],["l",185.1,1175.0],["k",193.8,1175.0],["h",211.4,1175.0],["a",229.0,1175.0],["l",243.6,1175.0],["i",252.2,1175.0],["d",259.9,1175.0],["e",279.5,1175.0],["y",295.1,1175.0],[".",310.8,1175.0],["c",319.4,1175.0],["o",334.0,1175.0],["m",351.6,1175.0]]}};
    var URL_OPACITE = { desk: .42, mob: 1 };
    function heroEmUrl(v, sc, G) {
        var NS = 'http://www.w3.org/2000/svg', retour = {};
        var em = sc.querySelector('.ligne.em'), url = sc.querySelector('.ligne.url');
        if (em) {
            var e = EM_AFFICHE[v];
            var s = document.createElementNS(NS, 'svg');
            s.setAttribute('viewBox', '0 0 ' + G.W + ' ' + G.H); s.setAttribute('preserveAspectRatio', 'none');
            s.setAttribute('class', 'emb titre-em-svg'); s.setAttribute('aria-hidden', 'true');
            s.innerHTML = embleme_g(e.cx, e.cy, e.k, e.sw);
            var z = document.createElementNS(NS, 'rect');
            z.setAttribute('x', e.cx - 200 * e.k); z.setAttribute('y', e.cy - 300 * e.k); z.setAttribute('width', 400 * e.k); z.setAttribute('height', 600 * e.k);
            z.setAttribute('class', 'zone-mot');
            s.appendChild(z);
            em.appendChild(s); em.classList.add('vectoriel');
            retour.em = { zone: z, parties: partiesEmbleme(s) };
        }
        if (url && URL_AFFICHE[v]) {
            var u = URL_AFFICHE[v];
            var s2 = document.createElementNS(NS, 'svg');
            s2.setAttribute('viewBox', '0 0 ' + G.W + ' ' + G.H); s2.setAttribute('preserveAspectRatio', 'none');
            s2.setAttribute('class', 'titre-svg titre-url-svg'); s2.setAttribute('aria-hidden', 'true');
            s2.style.setProperty('--url-op', URL_OPACITE[v]);
            var m = { lettres: [], svg: s2 };
            u.g.forEach(function (d) {
                var t = document.createElementNS(NS, 'text');
                t.setAttribute('x', d[1]); t.setAttribute('y', d[2]); t.setAttribute('font-size', u.size); t.setAttribute('font-weight', u.wght);
                t.setAttribute('class', 'lettre lettre-url'); t.textContent = d[0];
                s2.appendChild(t);
                m.lettres.push({ el: t, d: [d[0], d[1], d[2], u.size, u.wght, 'url', 'url'] });
            });
            url.appendChild(s2); url.classList.add('vectoriel');
            retour.url = m;
        }
        return retour;
    }


    /* v36 : le reflet du tison. Pendant l'ouverture seulement, la lumière du tison glisse sur les lettres,
       l'emblème et l'adresse, au même rythme que lui. Après, il ne reste que l'anagramme au survol. */
    var LUMIERE = {};
    /* v86 : on relit les boîtes à chaque image (le cache de la v84 gardait une taille périmée quand l'image du hero
       arrivait tard sur un vrai téléphone : le reflet se décalait et les lettres semblaient doublées). On garde
       l'essentiel du gain : toutes les lectures avant toutes les écritures. */
    function boiteDoc(el) { return el.getBoundingClientRect(); }
    function refletTison(v, sc, G) {
        if (calme) return;
        /* v38 : une copie incandescente du titre, de l'emblème et de l'adresse (blanc chaud, lueur orange),
           calculée une seule fois ; elle n'apparaît que dans une bande douce qui suit la braise.
           La bande se déplace par transformation seulement : la carte graphique fait le travail, rien n'est recalculé. */
        var vertical = v === 'desk';
        var NS = 'http://www.w3.org/2000/svg';
        var couches = [];
        function couche(parent, source, liaison) {
            if (!parent || !source) return;
            var fen = document.createElement('div'); fen.className = 'rb-fenetre ' + (vertical ? 'rb-v' : 'rb-h');
            var cont = document.createElement('div'); cont.className = 'rb-contenu';
            var copie = source.cloneNode(true);
            copie.removeAttribute('id'); copie.classList.add('rb-copie');
            copie.querySelectorAll('.zone-mot').forEach(function (z) { z.remove(); });
            /* identifiants uniques pour les dégradés et masques recopiés */
            copie.querySelectorAll('[id]').forEach(function (n) {
                var ancien = n.id, nouveau = ancien + '-rb' + v;
                n.id = nouveau;
                copie.querySelectorAll('[clip-path="url(#' + ancien + ')"]').forEach(function (u) { u.setAttribute('clip-path', 'url(#' + nouveau + ')'); });
            });
            if (liaison) {
                var a = source.querySelectorAll('.lettre'), b = copie.querySelectorAll('.lettre');
                for (var i = 0; i < a.length; i++) a[i]._jumeau = b[i];
            }
            cont.appendChild(copie); fen.appendChild(cont); parent.appendChild(fen);
            couches.push({ fen: fen, cont: cont, parent: parent });
        }
        couche(sc.querySelector('.scene-titre'), sc.querySelector('.scene-titre > .titre-svg'), true);
        couche(sc.querySelector('.ligne.em'), sc.querySelector('.titre-em-svg'), false);
        couche(sc.querySelector('.ligne.url'), sc.querySelector('.titre-url-svg'), true);
        if (!couches.length) return;
        var debut = performance.now(), BANDE = vertical ? 0.3 : 0.5, FORCE = 0.86;   /* v39 : bande plus large et plus douce, 14 % moins forte */   /* hauteur (ou largeur) de la bande, en fraction de la boîte */
        function finir() { couches.forEach(function (c) { c.fen.remove(); }); }
        function pas(ts) {
            var l = LUMIERE[v];
            if (ts - debut > 9000 * LENT) { finir(); return; }
            if (!l) { requestAnimationFrame(pas); return; }
            if (l.fini) { finir(); return; }
            couches.forEach(function (c) { c.r = boiteDoc(c.parent); });   /* lectures d'abord, écritures ensuite */
            couches.forEach(function (c) {
                var r = c.r;
                var b = Math.max(40, (vertical ? l.h : l.w) * BANDE);
                if (c.w !== r.width || c.h !== r.height) { c.w = r.width; c.h = r.height; c.cont.style.width = r.width + 'px'; c.cont.style.height = r.height + 'px'; }
                var pos = (vertical ? l.y - r.top : l.x - r.left) - b / 2;
                var bAvant = c.b; c.b = b;
                if (vertical) {
                    if (bAvant !== b) c.fen.style.height = b + 'px';
                    c.fen.style.transform = 'translate3d(0,' + pos.toFixed(1) + 'px,0)';
                    c.cont.style.transform = 'translate3d(0,' + (-pos).toFixed(1) + 'px,0)';
                } else {
                    if (bAvant !== b) c.fen.style.width = b + 'px';
                    c.fen.style.transform = 'translate3d(' + pos.toFixed(1) + 'px,0,0)';
                    c.cont.style.transform = 'translate3d(' + (-pos).toFixed(1) + 'px,0,0)';
                }
                c.fen.style.opacity = (FORCE * Math.max(0, Math.min(1, l.f))).toFixed(3);
            });
            requestAnimationFrame(pas);
        }
        requestAnimationFrame(pas);
    }

    function heroLettres() {
        var calque = /[?&]calque\b/.test(location.search);   /* outil de vérification : texte en rouge par-dessus l'affiche */
        if (calme && !calque) return;
        var NS = 'http://www.w3.org/2000/svg';
        var mots = [], extras = [];
        ['desk', 'mob'].forEach(function (v) {
            var sc = document.querySelector('.hero-anime .scene-' + v);
            if (!sc || !sc.offsetParent) return;
            var boite = sc.querySelector('.scene-titre');
            if (!boite) return;
            var G = GLYPHES[v];
            var svg = document.createElementNS(NS, 'svg');
            svg.setAttribute('viewBox', '0 0 ' + G.W + ' ' + G.H);
            svg.setAttribute('preserveAspectRatio', 'none');
            svg.setAttribute('class', 'titre-svg');
            svg.setAttribute('aria-hidden', 'true');
            var parMot = {}, ordre = [];
            G.g.forEach(function (d) {
                var t = document.createElementNS(NS, 'text');
                t.setAttribute('x', d[1]); t.setAttribute('y', d[2]);
                t.setAttribute('font-size', d[3]); t.setAttribute('font-weight', d[4]);
                t.setAttribute('class', 'lettre');
                t.textContent = d[0];
                svg.appendChild(t);
                var cle = d[5] + ':' + d[6];
                if (!parMot[cle]) { parMot[cle] = { ligne: d[5], lettres: [], svg: svg }; ordre.push(cle); }
                parMot[cle].lettres.push({ el: t, d: d });
            });
            boite.appendChild(svg);
            sc.classList.add('titre-lettres');
            var eu = calque ? null : heroEmUrl(v, sc, G);
            if (eu) extras.push(eu);
            if (!calque) refletTison(v, sc, G);
            if (calque) { sc.classList.add('titre-calque'); return; }
            var rangDansLigne = {};
            ordre.forEach(function (cle) {
                var m = parMot[cle];
                var r = rangDansLigne[m.ligne] = (rangDansLigne[m.ligne] || 0) + 1;
                m.t0 = DEPART_LIGNE[v][m.ligne] + (r - 1) * 0.16;
                m.v = v; m.rang = r - 1;
                mots.push(m);
            });
        });
        if (!mots.length) return;
        var parti = false;
        function partir() {
            if (parti) return; parti = true;
            /* v52 : chaque ligne se remet en ordre au moment où la lumière de la braise l'atteint */
            var SEUIL_MOB = { l1: 0, l2: .08, t1: .18, t2: .32, t3: .46 };
            var debutAttente = performance.now();
            mots.forEach(function (m) {
                var r = m.lettres[0].el.getBoundingClientRect();
                m.haut = r.top; m.parti = false;
            });
            function lancerMot(m) {
                if (m.parti) return; m.parti = true;
                setTimeout(function () { decoder(m, 2, true); }, m.rang * 160 * LENT);
            }
            function guetter() {
                var reste = false, ecoule = performance.now() - debutAttente;
                mots.forEach(function (m) {
                    if (m.parti) return;
                    var l = LUMIERE[m.v];
                    if (l && !l.fini) {
                        if (m.v === 'desk' ? l.y >= m.haut - l.h * 0.05 : (l.t || 0) >= SEUIL_MOB[m.ligne]) lancerMot(m);
                    } else if ((l && l.fini) || ecoule > 2500 * LENT) {
                        /* pas de tison (ou déjà passé) : on retombe sur l'horaire d'origine */
                        if (ecoule >= m.t0 * 1000 * LENT) lancerMot(m);
                    }
                    if (!m.parti) reste = true;
                });
                if (reste) requestAnimationFrame(guetter);
            }
            requestAnimationFrame(guetter);
            /* au passage de la souris (ou au toucher sur cellulaire), le mot se remélange et se remet en ordre */
            setTimeout(function () {
                mots.forEach(zoneSurvol);
                extras.forEach(function (x) {
                    if (x.url) zoneSurvol(x.url);
                    if (x.em) {
                        var go = function () { brasserFormes(x.em.parties, 370, 2); };
                        x.em.zone.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') go(); });
                        x.em.zone.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') go(); });
                    }
                });
            }, 3800 * LENT);
        }
        if (document.fonts && document.fonts.load) {
            document.fonts.load('italic 600 100px "' + POLICE_TITRE + '"').then(partir, partir);
            setTimeout(partir, 2000);
        } else partir();
    }
    function zoneSurvol(m) {
        var NS = 'http://www.w3.org/2000/svg', x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        m.lettres.forEach(function (l) {
            try { var b = l.el.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); } catch (e) {}
        });
        if (x1 <= x0) return;
        var r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x0); r.setAttribute('y', y0 + (y1 - y0) * 0.1);
        r.setAttribute('width', x1 - x0); r.setAttribute('height', (y1 - y0) * 0.8);
        r.setAttribute('class', 'zone-mot');
        m.svg.insertBefore(r, m.svg.firstChild);
        function rejouer() { if (!m.enCours) decoder(m, 2); }
        suivreCurseur(r, function (e, dir) {
            var ctm = m.svg.getScreenCTM(); if (!ctm) return;
            var pt = m.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
            frotterSvg(m, pt.matrixTransform(ctm.inverse()).x, dir);
        });
        r.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') rejouer(); });
    }
    function melanger(a) {
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
        return a;
    }
    /* la copie incandescente du titre (reflet du tison) suit les lettres pendant qu'elles se mélangent */
    function miroir(el) {
        var j = el._jumeau;
        if (!j || !j.isConnected) return;
        j.setAttribute('x', el.getAttribute('x')); j.setAttribute('y', el.getAttribute('y'));
        j.style.transform = el.style.transform; j.style.opacity = el.style.opacity;
    }
    /* v50 : à l'ouverture, une cendre minuscule s'échappe de chaque lettre qui se pose (la bibliothèque qui brûle, en filigrane) */
    function cendres(l) {
        if (calme || !l.el.ownerSVGElement) return;
        var svg = l.el.ownerSVGElement, NS = 'http://www.w3.org/2000/svg', fs = l.d[3];
        var cx = l.d[1] + (l.av || fs * 0.4) * 0.5, cy = l.d[2] - fs * 0.55;
        if (Math.random() < 0.35) return;   /* pas à chaque lettre : la cendre reste rare */
        var n = 1 + (Math.random() < 0.4 ? 1 : 0);
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS(NS, 'circle');
            var braise = Math.random() < 0.55;
            c.setAttribute('cx', (cx + (Math.random() - 0.5) * fs * 0.35).toFixed(1));
            c.setAttribute('cy', (cy + (Math.random() - 0.3) * fs * 0.3).toFixed(1));
            c.setAttribute('r', (fs * (0.006 + Math.random() * 0.006)).toFixed(2));
            c.setAttribute('class', braise ? 'cendre cendre-braise' : 'cendre');
            svg.appendChild(c);
            var dx = (Math.random() - 0.3) * fs * 0.22, dy = -fs * (0.25 + Math.random() * 0.3), d = (1800 + Math.random() * 1000) * LENT;
            var a = c.animate([
                { transform: 'translate(0,0)', opacity: 0 },
                { opacity: braise ? 0.75 : 0.55, offset: 0.2 },
                { transform: 'translate(' + (dx * 0.5).toFixed(1) + 'px,' + (dy * 0.55).toFixed(1) + 'px)', opacity: braise ? 0.5 : 0.4, offset: 0.55 },
                { transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)', opacity: 0 }
            ], { duration: d, easing: 'cubic-bezier(.2,.6,.3,1)', delay: Math.random() * 180 * LENT });
            a.onfinish = (function (cc) { return function () { cc.remove(); }; })(c);
        }
    }

    /* v52 : à l'ouverture, les lettres GLISSENT d'une place à l'autre (plus de téléportation) */
    var glissantes = [], glisseBoucle = false, glisseT = 0;
    function glisser(l, x, y, instant) {
        if (l.cx == null || instant) { l.cx = x; l.cy = y; l.el.setAttribute('x', x.toFixed(1)); l.el.setAttribute('y', y.toFixed(1)); miroir(l.el); }
        l.tx = x; l.ty = y;
        if (glissantes.indexOf(l) < 0) glissantes.push(l);
        if (!glisseBoucle) { glisseBoucle = true; glisseT = performance.now(); requestAnimationFrame(glisseTour); }
    }
    function glisseTour(ts) {
        var dt = Math.min(50, ts - glisseT); glisseT = ts;
        var k = 1 - Math.exp(-dt / (38 * LENT));   /* arrive en ~120 ms, freinage doux */
        glissantes = glissantes.filter(function (l) {
            l.cx += (l.tx - l.cx) * k; l.cy += (l.ty - l.cy) * k;
            var fini = Math.abs(l.tx - l.cx) < 0.3 && Math.abs(l.ty - l.cy) < 0.3;
            if (fini) { l.cx = l.tx; l.cy = l.ty; }
            l.el.setAttribute('x', l.cx.toFixed(1)); l.el.setAttribute('y', l.cy.toFixed(1));
            miroir(l.el);
            return !fini;
        });
        if (glissantes.length) requestAnimationFrame(glisseTour); else glisseBoucle = false;
    }
    function decoder(m, avant, ouverture) {
        m.enCours = true;
        /* v50 : à l'ouverture, la même anagramme mais ralentie et grave : une lettre à la fois, peu de rotation,
           les lettres en désordre rougeoient et chaque lettre posée refroidit en lâchant un peu de cendre */
        var PAS = ouverture ? 0.14 : PAS_BRASSAGE, ROT = ouverture ? 5 : 24, SAUT = ouverture ? 1 : 0;
        var L = m.lettres;
        /* le « e » en exposant de 6e ne se mélange pas : il arrive avec le dernier coup */
        var mobiles = L.filter(function (l, i) { return !(l.d[6] === '6e' && i > 0); });
        var fixes = L.filter(function (l) { return mobiles.indexOf(l) < 0; });
        var places = mobiles.map(function (l) { return l.d[1]; });
        var verrou = 0;
        var coupsAvant = avant || 3;           /* quelques coups de mélange complet avant que les lettres se verrouillent */
        var total = coupsAvant + mobiles.length;
        var n = 0;
        function poser(l) {
            var nouveau = ouverture && !l.pose;
            if (ouverture) glisser(l, l.d[1], l.d[2]); else { l.el.setAttribute('x', l.d[1]); l.el.setAttribute('y', l.d[2]); }
            l.el.style.transform = ''; l.el.style.opacity = 1; miroir(l.el);
            if (ouverture) { l.el.classList.remove('lettre-rougeoie'); if (nouveau) { l.pose = true; l.el.classList.add('lettre-refroidit'); cendres(l); } }
        }
        function coup() {
            if (n >= coupsAvant) verrou = Math.min(mobiles.length, verrou + (SAUT || (mobiles.length > 6 ? 2 : 1)));
            var libres = melanger(mobiles.slice(verrou));
            if (libres.length > 1 && libres.every(function (l, i) { return l === mobiles[verrou + i]; })) libres.push(libres.shift());
            mobiles.slice(0, verrou).forEach(poser);
            /* les lettres libres se tassent dans l'ordre mélangé, comme un vrai mot (anagramme lisible) */
            var x = places[verrou];
            libres.forEach(function (l) {
                var fs = l.d[3];
                if (l.av == null) { try { l.av = l.el.getComputedTextLength() - fs * 0.12; } catch (e) { l.av = fs * 0.4; } }
                var ny = l.d[2] + (Math.random() - 0.5) * fs * (ouverture ? 0.05 : 0.12);
                if (ouverture) glisser(l, x, ny, n === 0); else { l.el.setAttribute('x', x.toFixed(1)); l.el.setAttribute('y', ny); }
                x += l.av;
                l.el.style.transform = 'rotate(' + ((Math.random() - 0.5) * ROT * 2).toFixed(1) + 'deg)';
                l.el.style.opacity = 1;
                if (ouverture) l.el.classList.add('lettre-rougeoie');
                miroir(l.el);
            });
            n++;
            if (verrou < mobiles.length) setTimeout(coup, PAS * 1000 * LENT);
            else { mobiles.forEach(poser); fixes.forEach(poser); m.enCours = false; }
        }
        coup();
    }

    /* ---------- Ouverture : un tison parcourt l'arc de l'affiche et l'allume ----------
       Géométrie relevée dans les images (cercle ajusté sur le bord net de l'arc, écart moyen < 3 px). */
    function tison() {
        if (calme) return;
        var NS = 'http://www.w3.org/2000/svg';
        var variantes = [
            { sel: '.scene-desk', W: 2208, H: 1198, cx: 2080.3, cy: 611.9, r: 1033.2, sens: 'v', trace: 4, halo: 26, flou: 12, ombre: 230, ombreDecal: 95, lueur: 46, coeur: 5 },
            { sel: '.scene-mob',  W: 932,  H: 1398, cx: 467.5,  cy: 1231.4, r: 529.3, sens: 'h', trace: 6, halo: 34, flou: 14, ombre: 200, ombreDecal: 80, lueur: 60, coeur: 7 }
        ];
        function chemin(v, R) {
            if (v.sens === 'v') {   /* ordinateur : l'arc est le flanc gauche du cercle, du haut vers le bas */
                var x0 = v.cx - Math.sqrt(R * R - v.cy * v.cy), x1 = v.cx - Math.sqrt(R * R - (v.H - v.cy) * (v.H - v.cy));
                return 'M ' + x0.toFixed(1) + ' 0 A ' + R + ' ' + R + ' 0 0 0 ' + x1.toFixed(1) + ' ' + v.H;
            }
            var dy = Math.sqrt(R * R - v.cx * v.cx), dy2 = Math.sqrt(R * R - (v.W - v.cx) * (v.W - v.cx));   /* téléphone : le dôme, de gauche à droite */
            return 'M 0 ' + (v.cy - dy).toFixed(1) + ' A ' + R + ' ' + R + ' 0 0 1 ' + v.W + ' ' + (v.cy - dy2).toFixed(1);
        }
        variantes.forEach(function (v) {
            var scene = document.querySelector('.hero-anime ' + v.sel);
            if (!scene || !scene.offsetParent) return;
            var img = scene.querySelector('.scene-fond');
            /* la traînée s'estompe aux deux bouts, là où l'image se fond déjà dans le noir */
            function degrade(id, c) {
                var ax = v.sens === 'v' ? 'x1="0" y1="0" x2="0" y2="' + v.H + '"' : 'x1="0" y1="0" x2="' + v.W + '" y2="0"';
                return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" ' + ax + '>' +
                    '<stop offset="0" stop-color="' + c + '" stop-opacity="0"/><stop offset=".14" stop-color="' + c + '"/>' +
                    '<stop offset=".78" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></linearGradient>';
            }
            var vb = '0 0 ' + v.W + ' ' + v.H;
            var ombre = document.createElementNS(NS, 'svg');
            ombre.setAttribute('class', 'tison tison-ombre'); ombre.setAttribute('viewBox', vb); ombre.setAttribute('preserveAspectRatio', 'none'); ombre.setAttribute('aria-hidden', 'true');
            ombre.innerHTML = '<defs><filter id="tf-o' + v.sens + '" filterUnits="userSpaceOnUse" x="' + (-v.W * .3) + '" y="' + (-v.H * .3) + '" width="' + (v.W * 1.6) + '" height="' + (v.H * 1.6) + '"><feGaussianBlur stdDeviation="' + (v.ombre / 5) + '"/></filter></defs>' +
                '<path d="' + chemin(v, v.r + v.ombreDecal) + '" stroke-width="' + v.ombre + '" filter="url(#tf-o' + v.sens + ')"/>';
            var feu = document.createElementNS(NS, 'svg');
            feu.setAttribute('class', 'tison tison-feu'); feu.setAttribute('viewBox', vb); feu.setAttribute('preserveAspectRatio', 'none'); feu.setAttribute('aria-hidden', 'true');
            feu.innerHTML = '<defs><filter id="tf-h' + v.sens + '" filterUnits="userSpaceOnUse" x="' + (-v.W * .3) + '" y="' + (-v.H * .3) + '" width="' + (v.W * 1.6) + '" height="' + (v.H * 1.6) + '"><feGaussianBlur stdDeviation="' + v.flou + '"/></filter>' +
                degrade('tf-dt' + v.sens, '#ff9a4d') + degrade('tf-dh' + v.sens, '#ff6a1f') +
                '<radialGradient id="tf-g' + v.sens + '"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".95"/><stop offset=".35" stop-color="#ff8a3a" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a14" stop-opacity="0"/></radialGradient></defs>' +
                '<path class="tison-halo" stroke="url(#tf-dh' + v.sens + ')" d="' + chemin(v, v.r + 10) + '" stroke-width="' + v.halo + '" filter="url(#tf-h' + v.sens + ')" opacity=".75"/>' +
                '<path class="tison-trace" stroke="url(#tf-dt' + v.sens + ')" d="' + chemin(v, v.r + 2) + '" stroke-width="' + v.trace + '" opacity=".8"/>' +
                '<g class="tison-braise"><circle r="' + v.lueur + '" fill="url(#tf-g' + v.sens + ')"/><circle r="' + v.coeur + '" fill="#fff3da"/></g>';
            /* v38 : les flous sont dessinés une seule fois. Deux volets glissent pour les dévoiler :
               le feu derrière la braise, l'ombre devant elle. La braise est un petit calque à part. */
            function volet(svg, cls) {
                var cadre = document.createElement('div'); cadre.className = 'tison-cadre ' + cls;
                var contre = document.createElement('div'); contre.className = 'tison-contre';
                contre.appendChild(svg); cadre.appendChild(contre);
                return { cadre: cadre, contre: contre };
            }
            var braiseG = feu.querySelector('.tison-braise'); braiseG.remove();
            var vo = volet(ombre, 'tison-cadre-ombre ' + (v.sens === 'v' ? 'tc-v' : 'tc-h'));
            var vf = volet(feu, 'tison-cadre-feu ' + (v.sens === 'v' ? 'tc-v' : 'tc-h'));
            var braise = document.createElement('div'); braise.className = 'tison-braise-div';
            braise.style.setProperty('--lueur', v.lueur); braise.style.setProperty('--coeur', v.coeur);
            var apresImg = img.closest('picture') || img;   /* v82 : l'image est dans un <picture> (une seule image téléchargée selon l'écran) */
            apresImg.insertAdjacentElement('afterend', braise);
            apresImg.insertAdjacentElement('afterend', vf.cadre);
            apresImg.insertAdjacentElement('afterend', vo.cadre);
            scene.classList.add('scene-prete');   /* v58 : la salle ne s'affiche qu'une fois l'ombre du tison en place (point A dès la 1re image) */
            var pTrace = feu.querySelector('.tison-trace');
            var L2 = pTrace.getTotalLength();
            braise.style.opacity = 0;
            vf.cadre.style.transform = v.sens === 'v' ? 'translate3d(0,-100%,0)' : 'translate3d(-100%,0,0)';
            vf.contre.style.transform = v.sens === 'v' ? 'translate3d(0,100%,0)' : 'translate3d(100%,0,0)';
            var debut = null, attente = 700 * LENT, duree = 2800 * LENT, NUIT = 0.3;   /* v45 : pénombre de départ plus légère */
            scene.classList.add('salle-pilotee');   /* le tison prend le contrôle de la lumière : la sécurité CSS se retire */
            scene.style.setProperty('--nuit', NUIT);
            function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
            /* v84 : la pénombre (--nuit) n'est plus réécrite à chaque image (ça forçait le navigateur à recalculer le style
               de tout le hero, titre compris). Même courbe (sinus), même durée, même départ, jouée par la carte graphique. */
            var nuitAnim = null;
            var pseudoOk = typeof KeyframeEffect !== 'undefined' && 'pseudoElement' in KeyframeEffect.prototype;
            function pas(ts) {
                if (debut === null) {
                    debut = ts;
                    if (pseudoOk) {
                        try {
                            nuitAnim = scene.animate([{ opacity: NUIT }, { opacity: 0 }],
                                { pseudoElement: '::after', delay: attente, duration: duree, easing: 'cubic-bezier(0.37, 0, 0.63, 1)', fill: 'both' });
                        } catch (er) { nuitAnim = null; }
                    }
                }
                var t = Math.min(1, Math.max(0, (ts - debut - attente) / duree)), e = ease(t);
                var q = pTrace.getPointAtLength(L2 * e);
                var rb = boiteDoc(scene);
                var px = q.x / v.W * rb.width, py = q.y / v.H * rb.height;
                if (v.sens === 'v') {
                    vf.cadre.style.transform = 'translate3d(0,' + (py - rb.height).toFixed(1) + 'px,0)';
                    vf.contre.style.transform = 'translate3d(0,' + (rb.height - py).toFixed(1) + 'px,0)';
                    vo.cadre.style.transform = 'translate3d(0,' + py.toFixed(1) + 'px,0)';
                    vo.contre.style.transform = 'translate3d(0,' + (-py).toFixed(1) + 'px,0)';
                } else {
                    vf.cadre.style.transform = 'translate3d(' + (px - rb.width).toFixed(1) + 'px,0,0)';
                    vf.contre.style.transform = 'translate3d(' + (rb.width - px).toFixed(1) + 'px,0,0)';
                    vo.cadre.style.transform = 'translate3d(' + px.toFixed(1) + 'px,0,0)';
                    vo.contre.style.transform = 'translate3d(' + (-px).toFixed(1) + 'px,0,0)';
                }
                var vacille = 1 + Math.sin(ts / 70) * 0.08 + Math.sin(ts / 23) * 0.05;
                var k = rb.width / v.W;
                braise.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) scale(' + (vacille * k).toFixed(4) + ')';
                var op = t <= 0 ? 0 : (t < 0.06 ? t / 0.06 : (t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1));
                /* v42 : c'est le tison qui allume la salle ; avant lui, rien ne bouge (point A) */
                if (!nuitAnim) scene.style.setProperty('--nuit', (NUIT * (1 - e)).toFixed(3));
                braise.style.opacity = op;
                /* v36 : la position du tison est partagée, pour que les lettres captent sa lumière */
                LUMIERE[v.sens === 'v' ? 'desk' : 'mob'] = { x: rb.left + px, y: rb.top + py, f: op, h: rb.height, w: rb.width, t: e, fini: t >= 1 };
                if (t < 1) requestAnimationFrame(pas);
                else {
                    scene.style.setProperty('--nuit', 0); scene.classList.add('salle-allumee');
                    if (nuitAnim) { nuitAnim.cancel(); nuitAnim = null; }
                    vo.cadre.remove(); braise.remove(); vf.cadre.classList.add('fini');
                    vf.cadre.addEventListener('animationend', function () { vf.cadre.remove(); });   /* plus rien par-dessus l'image */
                }
            }
            requestAnimationFrame(pas);
        });
    }

    /* 5. Défiler : une flèche du diagramme entre deux disques, sous l'ouverture */
    function defiler() {
        var hero = document.querySelector('.hero-anime');
        if (!hero) return;
        var a = document.createElement('a');
        a.className = 'defiler';
        a.href = '#billets';
        a.setAttribute('aria-label', 'Défiler vers la suite');
        a.innerHTML = embleme(24) + '<span>défiler</span>';   /* l'emblème : la flèche du haut descend, au défilement les disques se referment sur le cercle */
        hero.appendChild(a);
        a.addEventListener('click', function (e) {
            var m = document.querySelector('.moment-nom') || document.getElementById('billets');
            if (!m) return;
            e.preventDefault();
            /* on atterrit à la FIN du moment : texte allumé, arche tracée jusqu'au bout, « les dates » visible */
            var colleM = m.querySelector('.moment-colle');
            var fin = colleM ? Math.max(0, m.offsetHeight - colleM.offsetHeight) : 0;
            window.scrollTo({ top: m.getBoundingClientRect().top + window.scrollY + fin + 2, behavior: calme ? 'auto' : 'smooth' });
        });
        /* en défilant : la flèche rentre dans le disque du bas, les disques se rapprochent, le tout s'efface en douceur */
        var enCours = false;
        function suivre() {
            enCours = false;
            var p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.32)));
            a.style.setProperty('--p', p.toFixed(3));
            a.classList.toggle('parti', p > 0.85);
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(suivre); } }, { passive: true });
        /* v43 : le bouton se pose au bas de ce qu'on voit en arrivant (pas au bas de l'image, souvent plus haute que l'écran) */
        var largeur = 0;
        function placer(force) {
            if (!force && window.innerWidth === largeur) return;   /* iOS : la barre d'adresse change la hauteur, on ignore */
            largeur = window.innerWidth;
            var haut = hero.getBoundingClientRect().top + window.scrollY;
            var visible = Math.min(hero.offsetHeight, window.innerHeight - haut);
            a.style.top = Math.max(0, visible - a.offsetHeight - 22) + 'px';
            a.style.bottom = 'auto';
        }
        placer(true);
        window.addEventListener('resize', function () { placer(false); });
        window.addEventListener('load', function () { placer(true); });
        suivre();
    }

    /* 6. Retour en haut : l'emblème, les deux flèches pointent vers le haut */
    function retourHaut() {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'retour-haut';
        b.setAttribute('aria-label', 'Retour en haut');
        /* v105 : une vraie flèche vers le haut (notre flèche, braise à la pointe) ; le cercle autour se remplit avec la lecture */
        b.innerHTML = '<svg class="rh-anneau" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24.5" pathLength="1"/></svg>' +
            '<svg class="rh-fleche" viewBox="0 0 16 30" aria-hidden="true"><path d="M 8 28 L 8 3 M 2.4 10 L 8 2 L 13.6 10"/><circle class="rh-braise" cx="8" cy="2" r="1.6"/></svg>';
        document.body.appendChild(b);
        var anneau = b.querySelector('.rh-anneau circle');
        b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: calme ? 'auto' : 'smooth' }); fermerNav(true); });
        /* v110 : sur ordinateur, au survol de la flèche, les sections du site éclosent au-dessus d'elle, en petit.
           Un clic sur une section y mène ; un clic sur la flèche, en haut, comme avant. La section où l'on est porte la braise. */
        var nav = null, tNav = null;
        function fermerNav(vite) { clearTimeout(tNav); if (!nav) return; tNav = setTimeout(function () { nav.classList.remove('ouvert'); }, vite ? 0 : 320); }
        if (sourisFine) {
            var SECTIONS = [['#billets', 'billets'], ['#infolettre', 'infolettre'], ['#musique', 'musique'], ['#boutique', 'boutique'], ['#spectacles', 'spectacles complets'], ['#presse', 'on en parle'], ['#bio', 'biographie']];
            nav = document.createElement('nav');
            nav.className = 'rh-nav'; nav.setAttribute('aria-label', 'Sections du site');
            document.body.appendChild(nav);
            function construire() {
                var L = SECTIONS.map(function (x) { var el = document.querySelector(x[0]) || (x[0] === '#infolettre' && document.querySelector('.infolettre')); return el && el.offsetParent !== null ? { el: el, id: x[0], nom: x[1] } : null; })
                    .filter(Boolean).sort(function (p, q) { return p.el.getBoundingClientRect().top - q.el.getBoundingClientRect().top; });
                nav.innerHTML = L.map(function (x, i) { return '<a href="' + x.id + '" style="--k:' + (L.length - 1 - i) + '"><span class="rhn-point" aria-hidden="true"></span>' + x.nom + '</a>'; }).join('');
                nav._L = L;
            }
            function ouvrirNav() {
                if (!b.classList.contains('visible')) return;
                clearTimeout(tNav);
                if (!nav._L) construire();
                var milieu = window.innerHeight * .4, ici = null;
                nav._L.forEach(function (x) { if (x.el.getBoundingClientRect().top <= milieu) ici = x.id; });
                nav.querySelectorAll('a').forEach(function (a) { a.classList.toggle('ici', a.getAttribute('href') === ici); });
                nav.classList.add('ouvert');
            }
            [b, nav].forEach(function (el) {
                el.addEventListener('pointerenter', ouvrirNav);
                el.addEventListener('pointerleave', function () { fermerNav(); });
            });
            nav.addEventListener('click', function (e) {
                var a = e.target.closest('a'); if (!a) return;
                var el = document.querySelector(a.getAttribute('href')) || document.querySelector('.infolettre');
                if (!el) return;
                e.preventDefault();
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: calme ? 'auto' : 'smooth' });
                fermerNav(true);
            });
            window.addEventListener('resize', function () { nav._L = null; });
        }
        var enCours = false;
        window.addEventListener('scroll', function () {
            if (enCours) return; enCours = true;
            requestAnimationFrame(function () {
                enCours = false;
                b.classList.toggle('visible', window.scrollY > window.innerHeight * 1.5);
                if (nav && !b.classList.contains('visible')) fermerNav(true);
                var max = document.documentElement.scrollHeight - window.innerHeight;
                anneau.style.strokeDashoffset = (1 - Math.max(0, Math.min(1, max > 0 ? window.scrollY / max : 0))).toFixed(4);
            });
        }, { passive: true });
    }

    /* ---------- Bouton « Plexus lunaire » du haut : un petit disque qui sort de sa pochette ---------- */
    function plexusNav() {
        var disque = '<span class="mini-disque" aria-hidden="true"><span class="md-pointille"></span><span class="md-orbite"><span class="md-lune"></span></span><span class="md-etiquette">' +
            '<svg class="md-lecture" viewBox="0 0 10 10"><path d="M 3 2 L 8 5 L 3 8 Z"/></svg>' +
            '<svg class="md-pause" viewBox="0 0 10 10"><path d="M 3 2 L 3 8 M 7 2 L 7 8"/></svg></span></span>';
        var grand = document.querySelector('.bouton-plexus');
        if (grand) {
            var ic = grand.querySelector('.bouton-plexus-icone');
            if (ic) ic.remove();
            grand.insertAdjacentHTML('afterbegin', disque);
            grand.classList.add('plexus-disque');
        }
        var note = document.querySelector('.bouton-note');
        if (note) {
            note.innerHTML = disque;
            note.classList.add('plexus-disque');
        }
    }


    /* ---------- v33 : l'anagramme ailleurs sur le site ---------- */
    function anagrammes() {
        if (calme) return;
        /* dates : au survol d'une rangée, le nom de la ville se remélange */
        if (sourisFine) document.querySelectorAll('.ticket').forEach(function (row) {
            var v = row.querySelector('.ticket-ville');
            if (!v) return;
            v.setAttribute('data-nom', v.textContent.trim());
            suivreCurseur(row, function (e, dir) { frotterTexte(v, fracDans(v, e.clientX), dir); });
        });
        /* menu du haut */
        if (sourisFine) document.querySelectorAll('nav ul a').forEach(function (a) {
            suivreCurseur(a, function (e, dir) { frotterTexte(a, fracDans(a, e.clientX), dir); });
        });
        /* titres des spectacles complets : se décodent en arrivant, puis au survol */
        document.querySelectorAll('#spectacles .special-titre').forEach(function (h) {
            mots(h); h.classList.add('ana-attente');
            var io = new IntersectionObserver(function (e) {
                if (!e[0].isIntersecting) return;
                io.disconnect(); h.classList.remove('ana-attente'); decoderEntree(h, 0.1, 0.12);
            }, { threshold: 0.8 });
            io.observe(h);
            survolAnagramme(h, '.ana');
        });
        /* infolettre : c'est la section des lettres, toutes ses lettres réagissent */
        var info = document.querySelector('.infolettre');
        if (info) {
            info.querySelectorAll('.infolettre-texte, button i, label:not(.visually-hidden)').forEach(mots);
            survolAnagramme(info, '.ana');
        }
        /* citation du Canal Auditif : se décode quand elle arrive à l'écran, puis au survol */
        document.querySelectorAll('.vedette-citation').forEach(function (q) {
            if (q.offsetParent === null) return;
            mots(q);
            q.classList.add('ana-attente');
            var io = new IntersectionObserver(function (e) {
                if (!e[0].isIntersecting) return;
                io.disconnect(); q.classList.remove('ana-attente'); decoderEntree(q, 0, 0.05);
            }, { threshold: 0.6 });
            io.observe(q);
            survolAnagramme(q, '.ana');
        });
    }

    /* ---------- v33 : « Plexus lunaire » sort du bouton ----------
       Au repos, seul le disque. Au survol, le nom sort du disque en anagramme et se remet en ordre.
       À l'arrivée sur la page, il sort une fois tout seul, reste quelques secondes, puis rentre. */
    function plexusSort() {
        var b = document.querySelector('.bouton-plexus.plexus-disque');
        var t = b && b.querySelector('.bouton-plexus-texte');
        if (!b || !t) return;
        b.setAttribute('aria-label', 'Écouter Plexus lunaire');
        if (calme) return;
        b.classList.add('plexus-replie');
        var minuterie = null;
        function sortir() { clearTimeout(minuterie); if (!b.classList.contains('plexus-sorti')) { b.classList.add('plexus-sorti'); brasser(t, 3); } }
        function rentrer(d) { clearTimeout(minuterie); minuterie = setTimeout(function () { b.classList.remove('plexus-sorti'); }, d); }
        b.addEventListener('mouseenter', sortir);
        suivreCurseur(b, function (e, dir) { if (b.classList.contains('plexus-sorti')) frotterTexte(t, fracDans(t, e.clientX), dir); });
        b.addEventListener('focus', sortir);
        b.addEventListener('mouseleave', function () { rentrer(350); });
        b.addEventListener('blur', function () { rentrer(0); });
    }

    /* ---------- Menu des plateformes : même langage que les boutons ---------- */
    /* v44 : un menu « écouter » ouvert ne sort jamais de l'écran (téléphone : les albums de la discographie sont à droite) */
    function menusDansEcran() {
        document.querySelectorAll('details.ecouter').forEach(function (d) {
            d.addEventListener('toggle', function () {
                var m = d.querySelector('.ecouter-menu');
                if (!m || !d.open) return;
                m.style.left = ''; m.style.right = '';
                var r = m.getBoundingClientRect(), W = document.documentElement.clientWidth, marge = 12;
                if (r.right > W - marge) m.style.left = (m.offsetLeft - (r.right - (W - marge))) + 'px';
            });
        });
    }

    /* ---------- v57 : l'infolettre accessible dès le haut (menu, et sous « défiler » sur téléphone) ---------- */
    function lienInfolettre() {
        var sec = document.querySelector('.infolettre');
        if (!sec) return;
        if (!sec.id) sec.id = 'infolettre';
        function aller(e) {
            e.preventDefault();
            var cadre = sec.querySelector('.form-maison') || sec;
            cadre.scrollIntoView({ behavior: calme ? 'auto' : 'smooth', block: 'center' });
            var f = sec.querySelector('.infolettre-form');
            if (f && f._allumer) setTimeout(f._allumer, calme ? 0 : 850);
        }
        document.querySelectorAll('a[href="#infolettre"]').forEach(function (a) { a.addEventListener('click', aller); });
        var hero = document.querySelector('.hero-anime'), def = hero && hero.querySelector('.defiler');
        if (def) {
            var l = document.createElement('a');
            l.className = 'lien-infolettre-mob d-md-none'; l.href = '#infolettre';
            l.innerHTML = '<i>infolettre</i>';
            var porteMob = hero.querySelector('.hero-porte-mob');   /* v88 : sur téléphone, sous le bouton « voir les dates » */
            (porteMob || hero).appendChild(l);
            l.addEventListener('click', aller);
            function placer() { if (porteMob) return; l.style.top = (def.offsetTop + def.offsetHeight + 8) + 'px'; }
            placer(); window.addEventListener('resize', placer); window.addEventListener('load', placer);
            l.addEventListener('animationend', function () { l.style.animation = 'none'; l.style.opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * .3)).toFixed(2); });
            window.addEventListener('scroll', function () { if (l.style.animation !== 'none') return; l.style.opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * .3)).toFixed(2); }, { passive: true });
        }
    }

    function menuPlateformes() {
        document.querySelectorAll('.ecouter-menu a').forEach(function (a) {
            if (a.querySelector('.pf-chev')) return;
            var ic = a.querySelector('i');
            if (ic) {
                var rond = document.createElement('span');
                rond.className = 'pf-icone';
                ic.classList.remove('me-2');
                a.insertBefore(rond, ic);
                rond.appendChild(ic);
            }
            var texte = document.createElement('span');
            texte.className = 'pf-nom';
            while (rond && rond.nextSibling) texte.appendChild(rond.nextSibling);
            a.appendChild(texte);
            a.insertAdjacentHTML('beforeend', '<svg class="pf-chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M 1 1 L 6.5 7 L 1 13"/></svg>');
            /* v48 : l'icône prend le langage du disque Plexus : cercle fin, pointillé qui tourne, petite lune en orbite */
            if (rond && !rond.querySelector('.pf-pointille')) rond.insertAdjacentHTML('afterbegin', '<span class="pf-pointille" aria-hidden="true"></span><span class="pf-orbite" aria-hidden="true"><span class="pf-lune"></span></span>');
            /* et la flèche du diagramme (pointe ouverte, tige) remplace le chevron */
            var ch = a.querySelector('.pf-chev');
            if (ch) ch.outerHTML = '<svg class="pf-fleche" viewBox="0 0 30 12" aria-hidden="true"><path d="M 1 6 L 27 6 M 20 1.6 L 28 6 L 20 10.4"/></svg>';
        });
        /* v48 : à l'ouverture, chaque nom de plateforme se décode ; au fil du curseur, il se remélange */
        document.querySelectorAll('details.ecouter').forEach(function (d) {
            var menu = d.querySelector('.ecouter-menu');
            if (!menu) return;
            menu.querySelectorAll('.pf-nom').forEach(mots);
            survolAnagramme(menu, '.ana');
            d.addEventListener('toggle', function () {
                if (!d.open || calme) return;
                menu.querySelectorAll('.pf-nom').forEach(function (nm, i) { decoderEntree(nm, 0.06 + i * 0.07, 0.05); });
            });
        });
    }

    /* ---------- Boutique : les objets posés sur le disque du diagramme ---------- */

    /* v35 : notre flèche (la pointe ouverte du diagramme) qui trace un trait ; la pointe mène le trait */
    function tracer(chemin, tete, duree, delai) {
        var L = chemin.getTotalLength();
        chemin.style.strokeDasharray = L + ' ' + L;
        function poser(f) {
            var l = Math.max(0.5, L * f);
            var a = chemin.getPointAtLength(l), b = chemin.getPointAtLength(Math.max(0, l - 1.5));
            var ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
            tete.setAttribute('transform', 'translate(' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + ') rotate(' + ang.toFixed(1) + ')');
            tete.style.opacity = f > 0.005 ? 1 : 0;
            chemin.style.strokeDashoffset = (L * (1 - f)).toFixed(2);
        }
        if (calme) { poser(1); return poser; }
        if (!duree) return poser;   /* préparer seulement, sans animer */
        poser(0);
        var t0 = null, d = duree * 1000 * LENT;
        function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
        function pas(ts) { if (t0 === null) t0 = ts; var f = Math.min(1, (ts - t0) / d); poser(ease(f)); if (f < 1) requestAnimationFrame(pas); }
        setTimeout(function () { requestAnimationFrame(pas); }, (delai || 0) * 1000 * LENT);
        return poser;
    }

    function boutique() {
        document.querySelectorAll('#boutique .produit:not(.produit-fin)').forEach(function (p) {
            p.classList.add('produit-scene');
            var nom = p.querySelector('.produit-nom');
            if (nom && !nom.querySelector('.pn-chev')) nom.insertAdjacentHTML('beforeend', '<svg class="pn-chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M 1 1 L 6.5 7 L 1 13"/></svg>');
            var img = p.querySelector('.produit-image');
            if (img && !img.querySelector('.socle')) img.insertAdjacentHTML('beforeend',
                '<svg class="socle" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">' +
                '<path class="socle-a" d="M 54.0 35.0 A 98 17 0 1 1 111.9 36.9"/>' +
                '<g class="socle-tete"><path d="M -6.5 -3.2 L 0.6 0 L -6.5 3.2"/></g></svg>');
        });
        /* v35 : sous chaque produit, notre flèche trace l'ellipse, tranquillement, quand le produit arrive */
        var socles = Array.prototype.slice.call(document.querySelectorAll('#boutique .socle'));
        if ('IntersectionObserver' in window && socles.length) {
            var ios = new IntersectionObserver(function (e) {
                e.forEach(function (x) {
                    if (!x.isIntersecting) return;
                    ios.unobserve(x.target);
                    tracer(x.target.querySelector('.socle-a'), x.target.querySelector('.socle-tete'), 2.4, (socles.indexOf(x.target) % 4) * 0.18);
                });
            }, { threshold: 0.6 });
            socles.forEach(function (s) {
                tracer(s.querySelector('.socle-a'), s.querySelector('.socle-tete'), 0, 0)(0);
                ios.observe(s);
            });
        }
        var fin = document.querySelector('#boutique .produit-fin');
        if (fin) {
            fin.classList.add('pf-cachet');
            fin.innerHTML =
                '<svg class="cachet-boutique" viewBox="0 0 200 200" aria-hidden="true">' +
                '<defs><path id="cachet-boutique-cercle" d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0"/></defs>' +
                '<path class="cb-trait cb-anneau" d="M 59.9 13.9 A 95 95 0 1 1 24.1 42.8"/><g class="cb-tete"><path d="M -10 -6 L 1 0 L -10 6"/></g>' +
                '<circle cx="100" cy="100" r="62" class="cb-trait cb-pointille"/>' +
                '<g class="cb-texte"><text><textPath href="#cachet-boutique-cercle" textLength="482" lengthAdjust="spacing">toute la boutique · vinyles · livres · vêtements ·</textPath></text></g>' +
                '<g class="cb-fleche"><path d="M 78 100 L 121 100 M 110 93.6 L 121.4 100 L 110 106.4"/></g></svg>' +
                '<span class="cb-legende"><i>expédiés par La Tribu</i></span>';
            fin.setAttribute('aria-label', 'Toute la boutique : vinyles, livres et vêtements, expédiés par La Tribu');
            /* v35 : l'anneau est notre flèche ; il se trace en arrivant, et refait son tour au survol */
            var an = fin.querySelector('.cb-anneau'), te = fin.querySelector('.cb-tete');
            var poser = tracer(an, te, 0, 0); poser(calme ? 1 : 0);
            if (!calme && 'IntersectionObserver' in window) {
                var ioc = new IntersectionObserver(function (e) {
                    if (!e[0].isIntersecting) return;
                    ioc.disconnect(); tracer(an, te, 1.8, 0.1);
                    setTimeout(function () {
                        var occupe = false;
                        fin.addEventListener('mouseenter', function () {
                            if (occupe) return; occupe = true; tracer(an, te, 1.1, 0);
                            setTimeout(function () { occupe = false; }, 1200 * LENT);
                        });
                    }, 2000 * LENT);
                }, { threshold: 0.6 });
                ioc.observe(fin);
            } else poser(1);
        }
    }

    /* ---------- Spectacles complets : une phrase courte et un chiffre qui respire ---------- */
    /* v107 : chaque mois de la billetterie devient un seuil. Le mois en grand, l'année en petit,
       et un trait de lumière qui traverse la page à son arrivée, braise en tête : on change de chapitre. */
    function moisBilletterie() {
        var M = document.querySelectorAll('#billets .ticket-mois');
        M.forEach(function (m) {
            var t = m.textContent.trim().split(/\s+/), an = /^\d{4}$/.test(t[t.length - 1]) ? t.pop() : '';
            m.classList.add('tm-v2');
            m.innerHTML = '<span class="tm-mois">' + t.join(' ') + '</span>' + (an ? '<span class="tm-an">' + an + '</span>' : '') + '<span class="tm-trait" aria-hidden="true"><span class="tt-braise"></span></span>';
        });
        if (calme || !('IntersectionObserver' in window)) { M.forEach(function (m) { m.classList.add('tm-go'); }); return; }
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('tm-go'); io.unobserve(x.target); } });
        }, { threshold: 1, rootMargin: '0px 0px -12% 0px' });
        M.forEach(function (m) { io.observe(m); });
    }

    /* v108 : sous Dar Alkhalidey, les trois formes d'art se lisent : trois mots en italique, séparés par de petites lueurs,
       qui s'allument l'un après l'autre à l'arrivée */
    function disciplinesDar() {
        var p = document.querySelector('.dar-disciplines');
        if (!p) return;
        var mots = p.textContent.split('·').map(function (m) { return m.trim(); }).filter(Boolean);
        p.classList.add('dd-v2');
        p.innerHTML = mots.map(function (m, i) { return '<span class="dd-mot" style="--k:' + i + '">' + m + '</span>'; }).join('<span class="dd-point" aria-hidden="true"></span>');
        if (calme || !('IntersectionObserver' in window)) { p.classList.add('dd-go'); return; }
        var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { p.classList.add('dd-go'); io.disconnect(); } }, { threshold: 1 });
        io.observe(p);
    }

    function sousTitreSpectacles() {
        var st = document.querySelector('#spectacles .section-sous-titre');
        if (!st) return;
        st.classList.add('st-v2');
        st.innerHTML = '<span class="st-kicker">en entier sur YouTube</span>' +
            '<span class="st-grand">Plus de <span class="accent">deux millions</span> de visionnements.</span>';
        var grand = st.querySelector('.st-grand');
        if (calme || !('IntersectionObserver' in window)) return;
        grand.classList.add('lignes-attente');
        var io = new IntersectionObserver(function (e) {
            if (!e[0].isIntersecting) return;
            io.disconnect();
            grand.classList.remove('lignes-attente');
            grand.classList.add('fondu-go');
        }, { threshold: 0.8 });
        io.observe(grand);
    }

    function etiquettes() {
        document.querySelectorAll('.ticket .ticket-tag').forEach(function (tag) {
            var bloc = tag.closest('.col-8') || tag.parentNode.parentNode;
            var apres = bloc.querySelector('.ticket-salle') || bloc.querySelector('.ticket-ville');
            if (!apres) return;
            var ligne = document.createElement('p');
            ligne.className = 'ticket-tag-ligne mb-0';
            ligne.appendChild(tag);
            apres.insertAdjacentElement('afterend', ligne);
        });
    }
    /* ---------- v60 : la petite braise de la flèche de l'infolettre, au bout de toutes nos flèches ---------- */
    function lueurs() {
        var NS = 'http://www.w3.org/2000/svg';
        if (!document.getElementById('braise-g')) {
            var d = document.createElementNS(NS, 'svg');
            d.setAttribute('width', 0); d.setAttribute('height', 0); d.setAttribute('aria-hidden', 'true');
            d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
            d.innerHTML = '<defs><radialGradient id="braise-g"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".95"/><stop offset=".35" stop-color="#ff8a3a" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a14" stop-opacity="0"/></radialGradient></defs>';
            document.body.appendChild(d);
        }
        /* [sélecteur, x, y, rayon de la lueur, rayon du cœur] dans les unités de chaque dessin */
        /* v61 : sur les grandes flèches, plus de point lumineux posé dessus : c'est la tête elle-même qui chauffe,
           blanche au bout, orange vers les branches, avec une chaleur floue autour (aucun cercle) */
        if (!document.getElementById('tison-lin')) {
            document.getElementById('braise-g').parentNode.insertAdjacentHTML('beforeend',
                '<linearGradient id="tison-lin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff6a1e" stop-opacity="0"/><stop offset=".5" stop-color="#ff8a3a" stop-opacity=".55"/><stop offset=".85" stop-color="#ffd2a0" stop-opacity=".95"/><stop offset="1" stop-color="#fff4e2"/></linearGradient>' +
                '<filter id="tison-flou" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
                '<filter id="tison-net" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".35"/></filter>');
        }
        [['.moment-fleche', 'M -13 -7.5 L 0 0 L -13 7.5', 1], ['.cb-tete', 'M -10 -6 L 1 0 L -10 6', .55]].forEach(function (c) {
            document.querySelectorAll(c[0]).forEach(function (el, i) {
                if (el._tison) return; el._tison = true;
                var g = document.createElementNS(NS, 'g');
                g.setAttribute('class', 'tison-t');
                g.style.setProperty('--fort', c[2]);
                g.style.animationDelay = '-' + ((i * .53) % 2.6).toFixed(2) + 's';
                g.innerHTML = '<path class="tt-halo" d="' + c[1] + '"/><path class="tt-chaud" d="' + c[1] + '"/>';
                el.appendChild(g);
            });
        });
        [['.socle-tete', .6, 0, 6, .9], ['.conv-haut', 6, 15.5, 4.6, .8], ['.conv-bas', 6, 2.5, 4.6, .8]].forEach(function (c) {
            document.querySelectorAll(c[0]).forEach(function (el, i) {
                if (el._braise) return; el._braise = true;
                if (el.tagName.toLowerCase() === 'svg') el.style.overflow = 'visible';
                var g = document.createElementNS(NS, 'g');
                g.setAttribute('class', 'braise');
                g.setAttribute('transform', 'translate(' + c[1] + ' ' + c[2] + ')');
                g.innerHTML = '<circle class="braise-l" r="' + c[3] + '" fill="url(#braise-g)" style="animation-delay:-' + ((i * .37) % 1.3).toFixed(2) + 's"/><circle class="braise-c" r="' + c[4] + '"/>';
                el.insertBefore(g, el.firstChild);
            });
        });
    }



    /* ---------- v64 : les manuscrits sauvés. Entre deux mois de la billetterie, un mot du public, tiré des stories,
       arrive brouillé comme un fragment noirci et se déchiffre quand une ligne de braise passe dessous.
       Mot à mot, fautes et emojis compris : le vrai bat le léché. Trois fragments au plus, pigés au hasard à chaque visite. ---------- */
    var MANUSCRITS = [
        ['rire et pleurer et se faire brasser et rire encore et partir avec la tête bouillonnante et l’âme nourrie. Adib strikes again ✨', 'Julie Le Breton', 'comédienne'],
        ['Je sais pas comment il fait pour 🎯 à chaque colice de fois. CHAQUE. COLICE. DE. FOIS.', 'Pénélope McQuade', 'animatrice'],
        ['Quelle joie de voir cette œuvre si nécessaire continuer de se déployer.', 'Alain Farah', 'écrivain'],
        ['Poète, philosophe, fou du roi fucking drôle. Son art nous élève toute la gang!', 'Philippe Boutin', 'auteur et metteur en scène'],
        ['Drôle, brillant, nous fait réfléchir et livraison de 🔥', 'Stéphane Leclair', 'journaliste'],
        ['De martyriser l’IA, à la fatigue de la vie parentale en passant par 2-3 drains français, ce show est EXCEPTIONNEL.', 'Marc-Olivier GL', 'spectateur'],
        /* v106 : la deuxième couronne (éclot après deux avis lus). Mot à mot, banque citations-public-2026-10.md */
        ['Ce gars sait tisser des textes d’une finesse inégalable, à la croisée de la critique, l’empathie, l’humour et l’intelligence.', 'Caroline Arbour', 'spectatrice'],
        ['Flash news: le show est 🔥 as always.', 'Fabrice Vil', 'entrepreneur et chroniqueur'],
        ['Un excellent spectacle. Un parfait équilibre entre faire rire et réfléchir. Bravo!', 'Josée P', 'spectatrice'],
        ['Tellement bon! Adib au sommet de son art. Fatigué comme un jeune papa mais drôle et pertinent en maudit', 'Stéphanie Merizzi', 'spectatrice'],
        ['Ce spectacle est, comment dire... NÉCESSAIRE', 'Dr Yara Asbar', 'spectatrice'],
        ['ALERTE AU CHEF D’ŒUVRE', 'Mélanie Gay', 'spectatrice']
    ];
    function manuscrits() {
        var groupes = Array.prototype.filter.call(document.querySelectorAll('#billets .ticket-groupe'), function (g) { return g.offsetParent !== null && getComputedStyle(g).display !== 'none'; });
        if (groupes.length < 2) return;
        /* Pénélope ouvre toujours ; les deux autres changent à chaque visite */
        var pool = MANUSCRITS.slice(1), choix = [MANUSCRITS[0]];
        while (choix.length < 3 && pool.length) choix.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        /* après le 1er groupe, puis tous les deux groupes : jamais deux fragments de suite */
        var places = [];
        for (var i = 0; i < groupes.length - 1 && places.length < choix.length; i += 2) places.push(groupes[i]);
        places.forEach(function (g, k) {
            var q = choix[k], f = document.createElement('figure');
            f.className = 'manuscrit' + (k % 2 ? ' ms-gauche' : '');
            f.innerHTML = '<svg class="ms-bord" viewBox="0 0 400 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M 0 6 L 18 4.6 L 31 6.8 L 52 5 L 70 6.2 L 88 3.8 L 109 6.4 L 131 5.1 L 150 6.9 L 171 4.4 L 196 6 L 214 5.2 L 238 7 L 259 4.7 L 280 6.3 L 302 4.9 L 325 6.6 L 344 5 L 366 6.1 L 384 4.8 L 400 5.8"/></svg>' +
                '<blockquote class="ms-texte">' + q[0] + '</blockquote><figcaption class="ms-qui">' + q[1] + (q[2] ? '<span class="ms-role"> · ' + q[2] + '</span>' : '') + '</figcaption>';
            g.insertAdjacentElement('afterend', f);
        });
        var figs = document.querySelectorAll('.manuscrit');
        if (calme || !('IntersectionObserver' in window)) { figs.forEach(function (f) { f.classList.add('ms-lu'); }); return; }
        var io = new IntersectionObserver(function (en) {
            en.forEach(function (x) {
                if (!x.isIntersecting) return;
                io.unobserve(x.target);
                var f = x.target;
                f.classList.add('ms-brule');
                brasser(f.querySelector('.ms-texte'), 4, 55);
                setTimeout(function () { f.classList.add('ms-lu'); }, 1500);
            });
        }, { threshold: .6, rootMargin: '0px 0px -12% 0px' });
        figs.forEach(function (f) { io.observe(f); });
    }


    /* ---------- v66 : six voix. Sous la photo qui suit les villes, un petit diagramme : six flèches qui convergent vers le soi.
       Chaque flèche est une personne. On passe dessus (ou on touche, sur téléphone) : sa phrase sort en grand,
       dans la typo des critiques, avec sa provenance. ---------- */
    function voix() {
        var billets = document.getElementById('billets');
        if (!billets || !MANUSCRITS.length) return;
        /* v106 : une éclosion. Une première couronne de flèches ; après deux avis lus, une deuxième couronne
           éclot entre les rayons, un peu plus loin du centre : d'autres avis, comme un petit jeu qu'on n'a pas demandé. */
        var V = MANUSCRITS, N = V.length, N1 = Math.min(6, N), N2 = Math.min(6, N - N1);
        var d = document.createElement('div');
        d.className = 'voix';
        var fl = '', angles = [];
        for (var i = 0; i < N1 + N2; i++) {
            var deux = i >= N1, k = deux ? i - N1 : i;
            var a = deux ? -90 + (k + .5) * 360 / N1 : -90 + k * 360 / N1;
            angles.push(a);
            fl += '<g class="voix-fl' + (deux ? ' voix-fl2' : '') + '" data-i="' + i + '" transform="rotate(' + a.toFixed(1) + ')" style="--e:' + k + '">' +
                (deux ? '<path d="M 61 0 L 35 0 M 42 -6 L 34 0 L 42 6"/>' : '<path d="M 52 0 L 24 0 M 31 -6 L 23 0 L 31 6"/>') + '</g>';
        }
        d.innerHTML = '<svg class="voix-diag" viewBox="-66 -66 132 132" role="img" aria-label="Ce qu’on en dit, médias et public">' +
            '<circle class="voix-zone-fond" r="66"/><circle class="voix-soi" r="14"/><circle class="voix-coeur" r="4"/>' + fl + '</svg>' +
            '<p class="voix-legende"><i>ce qu’on en dit</i><b><span class="voix-n">' + N1 + '</span> avis · médias et public</b><span class="voix-indice">' + (sourisFine ? 'passe ton curseur sur les flèches' : 'touche les flèches, puis l’avis pour le suivant') + '</span></p>';
        var o = document.createElement('div');
        o.className = 'voix-scene'; o.setAttribute('aria-live', 'polite');
        o.innerHTML = '<p class="voix-kicker"></p><blockquote class="voix-citation"></blockquote><p class="voix-source"></p>';
        document.body.appendChild(o);
        var panneau = billets.querySelector('.panneau-ville');
        if (panneau && getComputedStyle(panneau).display !== 'none') panneau.appendChild(d);
        else { var h = billets.querySelector('h2'); (h && h.parentNode || billets).appendChild(d); d.classList.add('voix-mob'); }
        var courant = -1, sortie = null, lus = [], eclos = !N2;
        function eclore() {
            if (eclos) return; eclos = true;
            d.classList.add('eclos');
            d.querySelector('.voix-n').textContent = N1 + N2;
        }
        function montrer(i) {
            clearTimeout(sortie);
            if (i === courant && o.classList.contains('on')) return;
            courant = i;
            if (lus.indexOf(i) < 0) lus.push(i);
            if (lus.length >= 2) { clearTimeout(d._ecl); d._ecl = setTimeout(function () { if (courant >= 0) eclore(); }, 450); }
            var q = V[i], mots = ('« ' + q[0] + ' »').split(' ');
            o.querySelector('.voix-kicker').textContent = q[3] || 'Instagram · story';
            o.querySelector('.voix-citation').innerHTML = mots.map(function (m, k) { return '<span class="voix-mot" style="animation-delay:' + (k * 0.045).toFixed(3) + 's">' + m + '</span>'; }).join(' ');
            o.querySelector('.voix-source').innerHTML = q[1] + (q[2] ? '<span> · ' + q[2] + '</span>' : '');
            var pr = panneau ? panneau.getBoundingClientRect() : d.getBoundingClientRect();
            o.style.setProperty('--gauche', (d.classList.contains('voix-mob') ? 0 : Math.round(pr.right + 32)) + 'px');
            o.classList.remove('on'); void o.offsetWidth; o.classList.add('on');
            d.querySelectorAll('.voix-fl').forEach(function (g) { g.classList.toggle('vive', +g.getAttribute('data-i') === i); g.classList.toggle('lue', lus.indexOf(+g.getAttribute('data-i')) >= 0); });
            d.classList.add('active');
        }
        /* v108 : on sort des citations, la deuxième couronne se replie : on retrouve les six flèches du début */
        function replier() {
            if (!eclos || !N2 || !sourisFine) return;
            eclos = false; lus = [];
            d.classList.remove('eclos'); d.classList.add('replie');
            d.querySelectorAll('.voix-fl').forEach(function (g) { g.classList.remove('lue'); });
            d.querySelector('.voix-n').textContent = N1;
            clearTimeout(d._rep); d._rep = setTimeout(function () { d.classList.remove('replie'); }, 900);
        }
        function cacher(vite) {
            clearTimeout(sortie);
            sortie = setTimeout(function () { o.classList.remove('on'); d.classList.remove('active'); d.querySelectorAll('.vive').forEach(function (g) { g.classList.remove('vive'); }); courant = -1; replier(); }, vite ? 0 : 260);
        }
        var diag = d.querySelector('.voix-diag');
        /* la flèche visée : la plus proche de l'angle du curseur, parmi celles qui sont sorties */
        function viser(e) {
            var r = diag.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
            if (Math.hypot(x, y) < r.width * .09) return -1;
            var a = Math.atan2(y, x) * 180 / Math.PI, best = -1, bd = 999, n = eclos ? N1 + N2 : N1;
            for (var j = 0; j < n; j++) { var dd = Math.abs(((a - angles[j] + 540) % 360) - 180); if (dd < bd) { bd = dd; best = j; } }
            return best;
        }
        if (sourisFine) {
            diag.addEventListener('pointermove', function (e) { var j = viser(e); if (j >= 0) montrer(j); });
            diag.addEventListener('pointerleave', function () { cacher(); });
        } else {
            /* v109 : au doigt, douze flèches sont trop serrées. On touche le diagramme : un avis ; on touche l'avis : le suivant.
               Les flèches s'allument dans l'ordre et la deuxième couronne éclot quand on dépasse la première. On défile : ça se ferme. */
            var suite = -1;
            function prochain() {
                suite = (suite + 1) % (N1 + N2);
                if (suite >= N1) eclore();
                montrer(suite);
                o.querySelector('.voix-kicker').textContent = (suite + 1) + ' / ' + (N1 + N2) + ' · ' + (V[suite][3] || 'Instagram · story');
            }
            diag.addEventListener('click', function (e) { e.stopPropagation(); prochain(); });
            o.addEventListener('click', function () { prochain(); });
            var oFermer = document.createElement('button'); oFermer.type = 'button'; oFermer.className = 'voix-fermer'; oFermer.innerHTML = '×'; oFermer.setAttribute('aria-label', 'Fermer');
            o.appendChild(oFermer);
            oFermer.addEventListener('click', function (e) { e.stopPropagation(); cacher(true); });
            window.addEventListener('scroll', function () { if (o.classList.contains('on')) cacher(true); }, { passive: true });
        }
        /* les flèches s'allument à tour de rôle tant que personne n'y a touché : on invite, on ne crie pas */
        if (!calme) d.classList.add('voix-invite');
        diag.addEventListener('pointerenter', function () { d.classList.remove('voix-invite'); }, { once: true });
    }


    /* ---------- v71 : spectacles complets, le grand écran.
       Au survol, l'affiche vole au centre (transformations seulement, sur la carte graphique : rien ne repeint pendant le vol).
       Pendant que YouTube démarre, l'affiche se pixellise et rougeoit comme une braise : on comprend que quelque chose arrive.
       Quand la vidéo joue vraiment, elle se lève à travers les pixels. On sort : l'écran se repose à sa place.
       Clic : le spectacle complet, avec le son, dans ce grand écran (Échap, × ou clic à côté pour fermer). ---------- */
    /* v109 : l'écran des extraits sur téléphone. Le spectacle joue au bon moment, avec le son (le toucher le permet) ;
       on ferme (×, toucher à côté, ou retour) et on est exactement où on était, devant les billets. */
    function ecranMobile(cadre) {
        var id = cadre.getAttribute('data-youtube'), debut = parseInt(cadre.getAttribute('data-apercu'), 10) || 0;
        var m = document.createElement('div');
        m.className = 'ecran-mob'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', cadre.getAttribute('data-titre') || 'Extrait');
        m.innerHTML = '<div class="em-cadre"><iframe title="' + (cadre.getAttribute('data-titre') || 'Extrait') + '" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1&start=' + debut + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
            '<p class="em-titre">' + (cadre.getAttribute('data-titre') || '') + '</p><button type="button" class="em-fermer"><i>fermer</i> ×</button>';
        document.body.appendChild(m);
        var y = window.scrollY;
        requestAnimationFrame(function () { m.classList.add('on'); });
        function fermer() {
            m.classList.remove('on');
            window.removeEventListener('popstate', fermer);
            setTimeout(function () { m.remove(); }, 400);
            if (Math.abs(window.scrollY - y) > 4) window.scrollTo(0, y);
        }
        m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.em-fermer')) { if (history.state && history.state.ecranMob) history.back(); else fermer(); } });
        try { history.pushState({ ecranMob: 1 }, ''); window.addEventListener('popstate', fermer); } catch (x) {}
    }

    function apercusFilms() {
        if (!sourisFine || calme) return;
        var ecrans = Array.prototype.filter.call(document.querySelectorAll('.special-ecran, .e2-cadre'), function (e) { return e.getAttribute('data-youtube'); });
        if (!ecrans.length) return;
        var speciaux = ecrans.filter(function (e) { return e.classList.contains('special-ecran'); });
        document.documentElement.classList.add('avec-theatre');   /* v76 : l'affiche ne bouge plus d'elle-même au survol, c'est le grand écran qui prend le relais */
        /* on ouvre la route vers YouTube dès qu'on approche de la section : le démarrage gagne une bonne seconde */
        var chaud = false;
        function rechauffer() {
            if (chaud) return; chaud = true;
            setTimeout(precharger, 30);
            ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com', 'https://www.google.com', 'https://googlevideo.com'].forEach(function (h) {
                var l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; l.crossOrigin = ''; document.head.appendChild(l);
            });
        }
        /* v73 : la première fois coûtait cher (affiches à décoder, halo et fond à peindre). On fait une répétition invisible
           à l'approche de la section : au premier survol, tout est déjà prêt sur la carte graphique. */
        function repeter() {
            ecrans.forEach(function (e) { var i = e.querySelector('img'); if (i) { i.loading = 'eager'; if (i.decode) i.decode().catch(function () {}); } });
            if (actif) return;
            var c = cible(), i0 = ecrans[0].querySelector('img');
            boite.style.left = c.l + 'px'; boite.style.top = c.t + 'px'; boite.style.width = c.w + 'px'; boite.style.height = c.h + 'px';
            boite.style.transform = 'translate3d(0,0,0) scale(1,1)';
            if (i0) affiche.style.backgroundImage = 'url("' + (i0.currentSrc || i0.src) + '")';
            th.classList.add('actif', 'repetition', 'ouvert');
            requestAnimationFrame(function () { requestAnimationFrame(function () { requestAnimationFrame(function () { if (!actif) th.classList.remove('actif', 'repetition', 'ouvert'); }); }); });
        }
        var section = (speciaux[0] || ecrans[0]).closest('section') || ecrans[0].parentNode;
        if ('IntersectionObserver' in window) {
            var ioc = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { rechauffer(); setTimeout(repeter, 60); ioc.disconnect(); } }, { rootMargin: '400px 0px' });
            ioc.observe(section);
            /* v105 : les extraits de la billetterie. On ne réveille YouTube que quand le bloc est bien à l'écran,
               une fois la page chargée : rien ne ralentit l'arrivée sur le site. */
            var e2 = document.querySelector('.essai2');
            if (e2) {
                var ioe = new IntersectionObserver(function (en) { if (en[0].isIntersecting && document.readyState === 'complete') { rechauffer(); ioe.disconnect(); } }, { threshold: .4 });
                ioe.observe(e2);
                e2.addEventListener('pointerenter', rechauffer, { once: true });
            }
        }
        var th = document.createElement('div');
        th.className = 'theatre'; th.setAttribute('aria-hidden', 'true');
        th.innerHTML = '<div class="theatre-fond"></div><div class="theatre-boite"><div class="theatre-halo"></div><div class="theatre-cadre">' +
            '<div class="theatre-affiche"></div><div class="theatre-nette"></div><canvas class="theatre-pixels"></canvas><button type="button" class="theatre-fermer" aria-label="Fermer">×</button>' +
            '<button type="button" class="theatre-son"><span class="ts-a">activer le son</span><span class="ts-b">voir depuis le début</span></button></div></div>';
        document.body.appendChild(th);
        var fond = th.querySelector('.theatre-fond'), boite = th.querySelector('.theatre-boite'), cadre = th.querySelector('.theatre-cadre');
        var affiche = th.querySelector('.theatre-affiche'), nette = th.querySelector('.theatre-nette'), cv = th.querySelector('.theatre-pixels'), cx = cv.getContext('2d');
        var enPause = false, actif = null, fr = null, attente = null, fermeture = null, plein = false, son = false, montre = false, secours = null, boucle = null, img = null, t0 = 0, garde = null;
        var petit = document.createElement('canvas'), pcx = petit.getContext('2d');
        function cible() {
            var W = Math.min(window.innerWidth * .8, window.innerHeight * .8 * 16 / 9), H = W * 9 / 16;
            return { l: (window.innerWidth - W) / 2, t: (window.innerHeight - H) / 2, w: W, h: H };
        }
        function depuis(r, c) { return 'translate3d(' + (r.left - c.l).toFixed(1) + 'px,' + (r.top - c.t).toFixed(1) + 'px,0) scale(' + (r.width / c.w).toFixed(4) + ',' + (r.height / c.h).toFixed(4) + ')'; }
        /* v72 : l'attente, à notre manière. L'affiche s'assombrit et se trouble un peu, comme derrière la chaleur ;
           une bande de braise la traverse lentement, et quelques cendres montent. Rien de numérique, rien de brusque. */
        var cendres = [], serp = {};
        function pixels(ts) {
            var t = ts - t0, W = cv.width, H = cv.height, k = W / 1000;
            cx.clearRect(0, 0, W, H);
            var monte = Math.min(1, t / 700);
            /* v74 : notre flèche, en serpentin. Elle se promène dans l'écran sans plan, vire, s'enroule, s'allonge ;
               la queue s'efface derrière elle, la pointe est une braise. */
            var dt = Math.min(.05, (t - (serp.t || t)) / 1000); serp.t = t;
            if (!serp.pts) { serp.x = W * (.3 + Math.random() * .4); serp.y = H * (.35 + Math.random() * .3); serp.a = Math.random() * 6.28; serp.pts = []; }
            var vire = Math.sin(t / 530) * 1.5 + Math.sin(t / 290 + 1.7) * 1.1 + Math.sin(t / 870 + 3.1) * .8 + Math.sin(t / 1900) * .6;
            var dx = W / 2 - serp.x, dy = H / 2 - serp.y, loin = Math.hypot(dx / W, dy / H);
            if (loin > .28) {   /* près du bord : elle revient doucement vers le centre, sans heurter */
                var vers = Math.atan2(dy, dx), d0 = ((vers - serp.a + 9.4248) % 6.2832) - 3.1416;
                vire += d0 * (loin - .28) * 14;
            }
            serp.a += vire * dt * 2.1;
            var vit = W * (.26 + .08 * Math.sin(t / 700));
            serp.x += Math.cos(serp.a) * vit * dt; serp.y += Math.sin(serp.a) * vit * dt;
            serp.pts.push([serp.x, serp.y]);
            var maxi = Math.min(170, 12 + t / 18);
            while (serp.pts.length > maxi) serp.pts.shift();
            var P = serp.pts, nP = P.length;
            cx.globalCompositeOperation = 'source-over'; cx.lineCap = 'round'; cx.lineJoin = 'round';
            for (var i = 1; i < nP; i++) {
                var f = i / nP;
                cx.strokeStyle = 'rgba(255,' + Math.round(140 + 85 * f) + ',' + Math.round(80 + 90 * f) + ',' + (Math.pow(f, 1.6) * .95 * monte).toFixed(3) + ')';
                cx.lineWidth = (1 + 2.6 * f) * k;
                cx.beginPath(); cx.moveTo(P[i - 1][0], P[i - 1][1]); cx.lineTo(P[i][0], P[i][1]); cx.stroke();
            }
            var hx = serp.x, hy = serp.y, ang = serp.a;
            var lu = cx.createRadialGradient(hx, hy, 0, hx, hy, 30 * k);
            lu.addColorStop(0, 'rgba(255,226,176,' + (.9 * monte) + ')'); lu.addColorStop(.35, 'rgba(255,138,58,' + (.45 * monte) + ')'); lu.addColorStop(1, 'rgba(255,90,20,0)');
            cx.globalCompositeOperation = 'screen'; cx.fillStyle = lu; cx.beginPath(); cx.arc(hx, hy, 30 * k, 0, 6.2832); cx.fill();
            cx.globalCompositeOperation = 'source-over';
            cx.save(); cx.translate(hx, hy); cx.rotate(ang);
            cx.strokeStyle = 'rgba(255,238,218,' + monte + ')'; cx.lineWidth = 2.6 * k;
            cx.beginPath(); cx.moveTo(-13 * k, -7.5 * k); cx.lineTo(1.5 * k, 0); cx.lineTo(-13 * k, 7.5 * k); cx.stroke();
            cx.restore();
            cx.globalCompositeOperation = 'screen';
            /* une lueur basse, comme le tison sous l'horizon */
            var gb = cx.createRadialGradient(W / 2, H * 1.15, 0, W / 2, H * 1.15, H * .95);
            gb.addColorStop(0, 'rgba(255,110,30,' + (.34 * monte * (.85 + .15 * Math.sin(t / 240))) + ')'); gb.addColorStop(1, 'rgba(255,110,30,0)');
            cx.fillStyle = gb; cx.fillRect(0, 0, W, H);
            /* les cendres */
            if (cendres.length < 14 && Math.random() < .2) cendres.push({ x: Math.random() * W, y: H + 4, v: (.4 + Math.random() * .9) * k, r: (1 + Math.random() * 1.8) * k, d: Math.random() * 6.28, a: .5 + Math.random() * .5 });
            cendres = cendres.filter(function (c) {
                c.y -= c.v * 1.6; c.x += Math.sin(c.d + c.y / (60 * k)) * .4 * k;
                var vie = c.y / H; if (vie < .05) return false;
                cx.fillStyle = 'rgba(255,' + (150 + Math.round(70 * vie)) + ',90,' + (c.a * vie * monte).toFixed(3) + ')';
                cx.beginPath(); cx.arc(c.x, c.y, c.r, 0, 6.283); cx.fill();
                return true;
            });
            cx.globalCompositeOperation = 'source-over';
            boucle = requestAnimationFrame(pixels);
        }
        function arreterPixels() { cancelAnimationFrame(boucle); boucle = null; }
        function ecoute(e) {
            if (!fr || e.source !== fr.contentWindow || plein) return;
            var d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (x) { return; }
            if (d && ((d.event === 'onStateChange' && d.info === 1) || (d.event === 'infoDelivery' && d.info && d.info.playerState === 1))) reveler();
        }
        window.addEventListener('message', ecoute);
        function cmd(f, a) { try { fr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: f, args: a || [] }), '*'); } catch (x) {} }
        /* le son, sans recommencer : la vidéo continue là où elle est, on reste dans le grand écran */
        function avecSon() {
            if (!actif || !fr) return;
            if (plein) return;
            if (son) { allerPlein(); return; }
            son = true; th.classList.add('son');
            cmd('unMute'); cmd('setVolume', [100]); cmd('playVideo');
        }
        function reveler() {
            if (montre || !fr) return; montre = true; clearTimeout(secours);
            var f = fr; setTimeout(function () { if (f === fr) { f.classList.add('on'); cv.classList.add('parti'); setTimeout(function () { if (f === fr) arreterPixels(); }, 700); } }, 150);
        }
        /* v74 : un lecteur prêt par spectacle, chargé en douce à l'approche de la section (la première fois, YouTube
           doit télécharger tout son lecteur : c'était ça, la longue attente). Au survol, on ne fait que dire « joue ». */
        var prets = {};
        function precharger() {
            ecrans.forEach(function (e) {
                var id = e.getAttribute('data-youtube'), debut = parseInt(e.getAttribute('data-apercu'), 10) || 600;
                if (prets[id]) return;
                var p = document.createElement('iframe');
                p._pret = true; p._debut = debut;
                p.setAttribute('allow', 'autoplay; encrypted-media'); p.setAttribute('title', 'Aperçu sans son'); p.setAttribute('tabindex', '-1');
                p.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=0&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&start=' + debut + '&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
                p.addEventListener('load', function () {
                    p._charge = true;
                    try { p.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); } catch (x) {}
                    if (p._attend) { p._attend(); p._attend = null; }
                });
                cadre.insertBefore(p, cadre.querySelector('.theatre-fermer'));
                prets[id] = p;
            });
        }
        function cmdA(f, fn, a) { try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: fn, args: a || [] }), '*'); } catch (x) {} }
        function lacher() {
            if (!fr) return;
            var f = fr; fr = null; f.classList.remove('on');
            if (f._pret) cmdA(f, 'pauseVideo'); else setTimeout(function () { f.remove(); }, 250);
        }
        function video(id, debut, son) {
            if (!son && prets[id]) {
                lacher();
                montre = false; fr = prets[id];
                var f = fr, go = function () { cmdA(f, 'mute'); cmdA(f, 'seekTo', [f._debut, true]); cmdA(f, 'playVideo'); };
                if (f._charge) go(); else f._attend = go;
                secours = setTimeout(reveler, 5000);
                return;
            }
            lacher();
            montre = false;
            fr = document.createElement('iframe');
            fr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
            fr.setAttribute('title', son ? 'Spectacle complet' : 'Aperçu sans son');
            fr.src = 'https://www.youtube-nocookie.com/embed/' + id + (son
                ? '?autoplay=1&rel=0&modestbranding=1&playsinline=1'
                : '?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=' + id + '&start=' + debut + '&enablejsapi=1&origin=' + encodeURIComponent(location.origin));
            if (son) fr.allowFullscreen = true;
            cadre.insertBefore(fr, cadre.querySelector('.theatre-fermer'));
            if (son) { fr.classList.add('on'); cv.classList.add('parti'); arreterPixels(); return; }
            fr.addEventListener('load', function () { try { fr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); } catch (x) {} });
            secours = setTimeout(reveler, 5000);
        }
        function ouvrir(ecran) {
            clearTimeout(fermeture); fermeture = null;
            if (actif === ecran) return;
            if (actif) fermer(false, true);
            garde = null;
            rechauffer();
            actif = ecran; plein = false; son = false; enPause = false;
            var r = ecran.getBoundingClientRect(), c = cible();
            img = ecran.querySelector('img');
            affiche.style.backgroundImage = img ? 'url("' + (img.currentSrc || img.src) + '")' : ''; nette.style.backgroundImage = affiche.style.backgroundImage;
            boite.style.left = c.l + 'px'; boite.style.top = c.t + 'px'; boite.style.width = c.w + 'px'; boite.style.height = c.h + 'px';
            var dpr = Math.min(2, window.devicePixelRatio || 1);
            cv.width = Math.round(c.w * dpr); cv.height = Math.round(c.h * dpr);
            cv.classList.remove('parti');
            th.classList.remove('ouvert', 'plein', 'retour', 'son', 'fondu');
            if (boite.getAnimations) boite.getAnimations().forEach(function (a) { a.cancel(); });
            decrocher(); ecrans.forEach(liberer);
            boite.style.opacity = '';
            boite.style.transition = 'none'; boite.style.transform = depuis(r, c);
            th.classList.add('actif'); ecran.classList.add('au-theatre');
            void boite.offsetWidth;
            boite.style.transition = '';
            requestAnimationFrame(function () {
                if (actif !== ecran) return;
                boite.style.transform = 'translate3d(0,0,0) scale(1,1)';
                th.classList.add('ouvert');
            });
            arreterPixels(); cendres = []; serp = {}; cx.clearRect(0, 0, cv.width, cv.height); t0 = performance.now(); boucle = requestAnimationFrame(pixels);
            /* on laisse le vol se faire avant de réveiller YouTube : le chargement du lecteur ne doit pas voler d'images à l'animation */
            var e2 = ecran;
            setTimeout(function () { if (actif === e2 && !plein) video(e2.getAttribute('data-youtube'), parseInt(e2.getAttribute('data-apercu'), 10) || 600, false); }, 120);
        }
        /* v79 : le « pouf ». Au moment où l'écran se pose, l'affiche s'allume brièvement comme une braise qu'on souffle,
           et une poignée d'étincelles et de cendres s'échappe de son centre. L'œil suit le feu, pas la fin du mouvement. */
        function pouf(r) {
            var M = 90, W = Math.round(r.width + M * 2), H = Math.round(r.height + M * 2), dpr = Math.min(2, window.devicePixelRatio || 1);
            var halo = document.createElement('div');
            halo.className = 'pouf-halo';
            var ox = window.scrollX, oy = window.scrollY;   /* v90 : ancré dans la page, il défile avec l'affiche */
            halo.style.cssText = 'position:absolute;left:' + (r.left + ox) + 'px;top:' + (r.top + oy) + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
            var c = document.createElement('canvas');
            c.className = 'pouf-feu'; c.width = W * dpr; c.height = H * dpr;
            c.style.cssText = 'position:absolute;left:' + (r.left - M + ox) + 'px;top:' + (r.top - M + oy) + 'px;width:' + W + 'px;height:' + H + 'px';
            document.body.appendChild(halo); document.body.appendChild(c);
            var x = c.getContext('2d'); x.scale(dpr, dpr);
            var cx0 = W / 2, cy0 = H / 2, P = [], t0 = performance.now(), DUREE = 950;
            for (var i = 0; i < 42; i++) {
                var a = Math.random() * 6.2832, v = 90 + Math.random() * 230, cendre = i % 3 === 0;
                P.push({ x: cx0 + Math.cos(a) * r.width * .08, y: cy0 + Math.sin(a) * r.height * .08, vx: Math.cos(a) * v * (r.width / r.height) * .55, vy: Math.sin(a) * v * .6 - 40,
                    r: cendre ? 1.8 + Math.random() * 2.2 : 1.3 + Math.random() * 1.8, cendre: cendre, vie: .55 + Math.random() * .45 });
            }
            (function dessiner(ts) {
                var t = (ts - t0) / 1000, k = Math.min(1, (ts - t0) / DUREE);
                x.clearRect(0, 0, W, H);
                var g = x.createRadialGradient(cx0, cy0, 0, cx0, cy0, r.width * (.25 + .35 * k));
                var lum = Math.max(0, 1 - k * 1.6);
                g.addColorStop(0, 'rgba(255,214,160,' + (.39 * lum) + ')'); g.addColorStop(.4, 'rgba(255,120,40,' + (.2 * lum) + ')'); g.addColorStop(1, 'rgba(255,90,20,0)');
                x.globalCompositeOperation = 'screen'; x.fillStyle = g; x.fillRect(0, 0, W, H);
                P.forEach(function (p) {
                    var f = 1 - k / p.vie; if (f <= 0) return;
                    var px = p.x + p.vx * t, py = p.y + p.vy * t - (p.cendre ? 30 * t * t : -18 * t * t);
                    x.fillStyle = p.cendre ? 'rgba(255,190,140,' + (.51 * f) + ')' : 'rgba(255,' + Math.round(150 + 90 * f) + ',' + Math.round(70 + 120 * f) + ',' + (.93 * f) + ')';
                    x.beginPath(); x.arc(px, py, p.r * (p.cendre ? 1 : .6 + f * .6), 0, 6.2832); x.fill();
                });
                if (k < 1) requestAnimationFrame(dessiner); else { c.remove(); }
            })(t0);
            setTimeout(function () { halo.remove(); }, 900);
        }
        function fermer(vite, enchaine) {
            if (!actif) return;
            var ecran = actif; actif = null; plein = false; son = false; bloque = performance.now() + (vite ? 150 : 560); survol = null; clearTimeout(survolT); garde = ecran;   /* on ne rouvre pas l'affiche qu'on vient de quitter tant que le curseur ne l'a pas quittée */
            clearTimeout(secours); clearTimeout(fermeture); fermeture = null;
            lacher();
            var c = cible();
            /* v90 : le retour se fait DANS la page. Au moment du départ, le théâtre quitte l'écran fixe et s'accroche au
               document, exactement là où il est : si on défile, il défile avec l'affiche, porté par le navigateur lui-même
               (aucun calcul à chaque image, donc aucun retard d'une image, donc aucun tremblement). La destination ne bouge
               plus : le vol entier est une seule animation sur la carte graphique, de la position actuelle à l'affiche. */
            arreterPixels();
            if (!enchaine) th.classList.remove('ouvert');
            th.classList.remove('plein', 'son'); th.classList.add('retour');
            ecran.classList.remove('au-theatre');
            if (boite.getAnimations) boite.getAnimations().forEach(function (a) { a.cancel(); });
            var depart = getComputedStyle(boite).transform; if (!depart || depart === 'none') depart = 'translate3d(0,0,0) scale(1,1)';
            ecran._fige = !vite;
            var r = ecran.getBoundingClientRect(), arrivee = depuis(r, c);
            boite.style.transition = 'none';
            if (vite || !boite.animate) { boite.style.transform = arrivee; fin(); return; }
            accrocher();
            boite.style.transform = arrivee;
            var D = 600;
            var anim = boite.animate([{ transform: depart }, { transform: arrivee }], { duration: D, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'forwards' });
            /* le fondu commence vers la fin du chemin : on ne voit jamais deux affiches en même temps en vol */
            var fondu = boite.animate([{ opacity: 1 }, { opacity: 1, offset: .55 }, { opacity: 0 }], { duration: D * .92, easing: 'ease-in', fill: 'forwards' });
            setTimeout(function () { if (!actif) pouf(ecran.getBoundingClientRect()); }, D * .62);
            anim.onfinish = function () { liberer(ecran); if (!actif) { boite.style.opacity = '0'; anim.cancel(); fondu.cancel(); fin(); } };
        }
        /* le théâtre s'accroche au document pendant le retour (et se décroche à la fin) */
        function accrocher() {
            th.style.cssText = 'position:absolute;inset:auto;left:' + window.scrollX + 'px;top:' + window.scrollY + 'px;width:' + window.innerWidth + 'px;height:' + window.innerHeight + 'px';
            boite.style.position = 'absolute';
            fond.style.position = 'fixed';   /* le voile, lui, reste sur l'écran pendant qu'il s'efface */
        }
        function decrocher() { th.style.cssText = ''; boite.style.position = ''; fond.style.position = ''; }
        function fin() { if (!actif) { th.classList.remove('actif', 'retour'); boite.style.transition = ''; boite.style.opacity = ''; decrocher(); } }
        function dedans(el, x, y, marge) { var r = el.getBoundingClientRect(); return x >= r.left - marge && x <= r.right + marge && y >= r.top - marge && y <= r.bottom + marge; }
        ecrans.forEach(function (ecran) {
            ecran.addEventListener('pointerleave', function () { clearTimeout(attente); if (garde === ecran) garde = null; });
            ecran.addEventListener('click', function (e) {
                if (actif !== ecran) return;
                e.preventDefault(); e.stopImmediatePropagation(); avecSon();
            }, true);
        });
        theatreOuvrir = function (e) { if (actif === e) avecSon(); else ouvrir(e); };
        function allerPlein() { if (!actif || plein) return; plein = true; th.classList.add('plein'); video(actif.getAttribute('data-youtube'), 0, true); }
        /* on garde l'écran tant que le curseur est dessus ; on en sort : il se repose. Si le curseur arrive alors sur l'autre affiche, c'est elle qui prend le centre */
        /* v73 : bien délimité. Ouvert : on reste tant que le curseur est sur le grand écran ; on en sort, il se repose, point.
           Pendant le retour, rien ne s'ouvre. Ensuite seulement, une affiche sous le curseur (pas celle qu'on vient de quitter) peut s'allumer. */
        var bloque = 0, survol = null, survolT = null;
        document.addEventListener('pointermove', function (e) {
            if (garde && !dedans(garde, e.clientX, e.clientY, 0)) garde = null;
            if (actif) {
                if (plein || son) return;
                if (dedans(boite, e.clientX, e.clientY, 6)) { clearTimeout(fermeture); fermeture = null; return; }
                if (!fermeture) fermeture = setTimeout(function () { fermeture = null; fermer(); }, 70);
                return;
            }
            if (performance.now() < bloque) return;
            var sous = null;
            ecrans.forEach(function (x) { if (x !== garde && dedans(x, e.clientX, e.clientY, 0)) sous = x; });
            if (sous !== survol) { survol = sous; clearTimeout(survolT); if (sous) survolT = setTimeout(function () { if (survol === sous && !actif) ouvrir(sous); }, 90); }
        }, { passive: true });
        cadre.addEventListener('click', function (e) { if (e.target.closest('.theatre-fermer')) return; if (e.target.closest('.theatre-son')) { e.stopPropagation(); if (son) allerPlein(); else avecSon(); return; } if (!son) avecSon(); else { cmd(enPause ? 'playVideo' : 'pauseVideo'); enPause = !enPause; } });
        th.querySelector('.theatre-fermer').addEventListener('click', function (e) { e.stopPropagation(); fermer(); });
        fond.addEventListener('click', function () { fermer(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && actif) fermer(); });
        window.addEventListener('scroll', function () { if (actif && !plein && !son) fermer(); }, { passive: true });   /* v89 : en douceur, l'écran suit l'affiche */
        window.addEventListener('resize', function () { if (actif) fermer(true); });
    }


    /* ---------- v81 : provenance des ventes. Chaque lien de billetterie porte une étiquette discrète (UTM) :
       les billetteries peuvent ainsi rattacher une vente au site, ville par ville. Invisible pour le public. ---------- */
    function provenance() {
        var src = 'adibalkhalidey.com', camp = 'comme-les-mongols-a-baghdad';
        try { var q = new URLSearchParams(location.search); if (q.get('utm_source')) { src = q.get('utm_source'); camp = q.get('utm_campaign') || camp; } } catch (x) {}
        document.querySelectorAll('#billets a.ticket-btn[href^="http"], #billets .ticket a[href^="http"]').forEach(function (a) {
            try {
                var u = new URL(a.href), row = a.closest('.ticket');
                if (u.searchParams.has('utm_source')) return;
                u.searchParams.set('utm_source', 'site-adib');
                u.searchParams.set('utm_medium', src === 'adibalkhalidey.com' ? 'site' : 'site-via-' + src.replace(/[^a-z0-9-]/gi, '').slice(0, 30));
                u.searchParams.set('utm_campaign', camp);
                if (row) u.searchParams.set('utm_content', (row.getAttribute('data-ville') || '') + '-' + (row.getAttribute('data-date') || ''));
                a.href = u.toString();
            } catch (x) {}
        });
    }


    /* v84 : les animations en boucle qui sont hors de l'écran se mettent en pause, et reprennent dès qu'elles
       reviennent en vue (avec 200 px d'avance). Personne ne peut voir la différence ; le téléphone, lui, arrête de
       redessiner des braises et des chevrons que personne ne regarde. */
    function pauseHorsEcran() {
        if (!('IntersectionObserver' in window) || !document.getAnimations) return;
        var vus = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
        if (!vus) return;
        var io = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (en) {
                if (en.isIntersecting) en.target.removeAttribute('data-he');
                else en.target.setAttribute('data-he', '');
            });
        }, { rootMargin: '200px 0px' });
        function suivre(a) {
            if (typeof CSSAnimation === 'undefined' || !(a instanceof CSSAnimation)) return;
            var ef = a.effect, t = ef && ef.target;
            if (!t || vus.has(t)) return;
            var it = ef.getComputedTiming ? ef.getComputedTiming().iterations : ef.getTiming().iterations;
            if (it !== Infinity) return;
            vus.add(t); io.observe(t);
        }
        function balayer() { try { document.getAnimations().forEach(suivre); } catch (e) {} }
        document.addEventListener('animationstart', function (e) {
            try { if (e.target && e.target.getAnimations) e.target.getAnimations().forEach(suivre); } catch (er) {}
        }, true);
        balayer(); setTimeout(balayer, 1500); setTimeout(balayer, 5000);
    }

    /* v84 : même ordre qu'avant ; sur un téléphone lent, on laisse respirer le navigateur entre deux modules
       quand un morceau a déjà pris 50 ms (sur un appareil rapide, tout passe d'un coup, comme avant). */
    /* v88 : on mesure les nouvelles portes (bouton du hero, spectacles gratuits), comme les autres clics du site */
    function portes() {
        document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('[data-porte]') : null;
            if (a && window.adibGoogleTagLoaded && window.gtag) window.gtag('event', 'porte_site', { porte: a.getAttribute('data-porte') });
        }, true);
    }

    /* ---------- v91 : « on en parle ». La recherche Google est déjà faite : le nom s'écrit dans le champ,
       puis les résultats arrivent un à un. Pour ajouter un article : une ligne en haut de la liste (le plus récent en premier).
       [média, émission ou rubrique, date affichée, titre exact, lien, lire / écouter / regarder, durée, date AAAA-MM-JJ] ---------- */
    var PRESSE = [
        ['Radio-Canada', 'Ça promet', '3 oct. 2026', 'Adib Alkhalidey présente un nouveau spectacle d’humour', 'https://ici.radio-canada.ca/ohdio/premiere/emissions/ca-promet/segments/rattrapage/2493226/culture-avec-myriam-eddahia', 'écouter', '6 min', '2026-10-03'],
        ['Radio-Canada', 'Prix Gémeaux', 'sept. 2026', 'Gala d’ouverture des 41es prix Gémeaux : La nuit devant nous domine', 'https://ici.radio-canada.ca/nouvelle/2283416/gala-ouverture-41es-prix-gemeaux', 'lire', '', '2026-09-14'],
        ['La Presse', 'Prix Juste pour rire', '10 août 2026', 'Adib Alkhalidey sacré humoriste de l’année', 'https://www.lapresse.ca/arts/humour/2026-08-10/prix-juste-pour-rire/adib-alkhalidey-sacre-humoriste-de-l-annee.php', 'lire', '', '2026-08-10'],
        ['Radio-Canada', 'Pénélope', '', 'Adib Alkhalidey : faire rire, mais surtout grandir avec son public', 'https://ici.radio-canada.ca/ohdio/premiere/emissions/penelope/segments/rattrapage/2453274/entrevue-avec-humoriste-et-auteur-compositeur-interprete-adib-alkhalidey', 'écouter', '', ''],
        ['La Presse', 'Télévision', '3 janv. 2026', 'La nuit devant nous : incursion chez les noctambules', 'https://www.lapresse.ca/arts/television/2026-01-03/la-nuit-devant-nous/incursion-chez-les-noctambules.php', 'lire', '', '2026-01-03']
    ];
    function presse() {
        var sec = document.getElementById('presse'), ol = sec && sec.querySelector('.presse-liste');
        if (!ol || !PRESSE.length) { if (sec) sec.remove(); return; }
        var VISIBLES = 3;
        ol.innerHTML = PRESSE.map(function (p, i) {
            var source = p[0] + (p[1] ? ' · ' + p[1] : '') + (p[2] ? ' · ' + p[2] : '');
            var sigle = p[0].split(/[\s-]+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2);
            return '<li class="pr-item' + (i >= VISIBLES ? ' pr-plus' : '') + '" style="--i:' + i + '"><a href="' + p[4] + '" target="_blank" rel="noopener">' +
                '<span class="pr-cachet" aria-hidden="true"><span>' + sigle + '</span></span>' +
                '<span class="pr-source">' + source + '</span>' +
                '<span class="pr-titre">' + p[3] + '</span>' +
                '<span class="pr-porte"><span class="pr-geste">' + p[5] + (p[6] ? ' · ' + p[6] : '') + '</span><span class="pr-rond"><svg viewBox="0 0 30 12" aria-hidden="true"><path d="M 1 6 L 27 6 M 20 1.6 L 28 6 L 20 10.4"/></svg></span></span></a></li>';
        }).join('');
        if (PRESSE.length > VISIBLES) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'pr-encore';
            b.innerHTML = '<i>plus de résultats</i>';
            ol.insertAdjacentElement('afterend', b);
            b.addEventListener('click', function () {
                sec.classList.add('pr-tout'); b.remove();
                sec.querySelectorAll('.pr-plus .pr-titre').forEach(function (t, k) { if (!calme) decoderEntree(t, k * .12, .05); });
            });
        }
        var req = sec.querySelector('.presse-requete');
        if (calme || !('IntersectionObserver' in window)) { sec.classList.add('pr-vu', 'pr-ecrit'); return; }
        var texte = req.textContent; req.textContent = '';
        var io = new IntersectionObserver(function (e) {
            if (!e[0].isIntersecting) return;
            io.disconnect();
            sec.classList.add('pr-vu');
            var k = 0;
            (function taper() {
                req.textContent = texte.slice(0, ++k);
                if (k < texte.length) setTimeout(taper, 55 + Math.random() * 70);
                else setTimeout(function () {
                    sec.classList.add('pr-ecrit');
                    /* les manchettes arrivent mélangées et se décodent, une après l'autre : la signature du site */
                    sec.querySelectorAll('.pr-item:not(.pr-plus) .pr-titre').forEach(function (t, k) { decoderEntree(t, .1 + k * .16, .045); });
                }, 260);
            })();
        }, { threshold: .45 });
        io.observe(sec);
    }

    /* v92 : le bouton « billets » du hero. Dessous, la prochaine date ; au survol (ordi), il s'ouvre vers le haut
       et présente les trois prochaines dates, chacune avec son lien direct vers la billetterie. */
    function heroBillets() {
        var blocs = document.querySelectorAll('.hp-billets');
        if (!blocs.length) return;
        var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
        var JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
        function prochaines() {
            var auj = new Date(); auj.setHours(0, 0, 0, 0);
            return Array.prototype.filter.call(document.querySelectorAll('#billets .ticket[data-date]'), function (r) {
                return r.style.display !== 'none' && !r.classList.contains('scheduled-ticket') && !r.classList.contains('ticket-est-complet') && r.querySelector('a.ticket-btn') && new Date(r.getAttribute('data-date') + 'T23:59') >= auj;
            }).sort(function (a, b) { return a.getAttribute('data-date') < b.getAttribute('data-date') ? -1 : 1; });
        }
        function remplir() {
            var L = prochaines();
            if (!L.length) return;
            function quand(r) { var d = new Date(r.getAttribute('data-date') + 'T12:00'); return JOURS[d.getDay()] + ' ' + d.getDate() + (d.getDate() === 1 ? 'er' : '') + ' ' + MOIS[d.getMonth()]; }
            function txt(r, sel) { var e = r.querySelector(sel); return e ? e.textContent.trim() : ''; }
            var fl = '<svg viewBox="0 0 30 12" aria-hidden="true"><path d="M 1 6 L 27 6 M 20 1.6 L 28 6 L 20 10.4"/></svg>';
            blocs.forEach(function (b) {
                var p = b.querySelector('.hp-prochaine');
                p.innerHTML = '<span>prochain spectacle</span> ' + txt(L[0], '.ticket-ville') + ' · ' + quand(L[0]);
                var m = b.querySelector('.hp-menu');
                m.innerHTML = '<p class="hpm-tete">les prochaines dates</p>' + L.slice(0, 3).map(function (r, i) {
                    var chaud = r.querySelector('.ticket-tag-chaud');
                    return '<a class="hpm-date" style="--k:' + i + '" href="' + r.querySelector('a.ticket-btn').href + '" target="_blank" rel="noopener" data-porte="hero-date">' +
                        '<span class="hpm-quand">' + quand(r) + (chaud ? ' · <b>dernières places</b>' : '') + '</span>' +
                        '<span class="hpm-ville">' + txt(r, '.ticket-ville') + '</span><span class="hpm-salle">' + txt(r, '.ticket-salle') + '</span>' +
                        '<span class="hpm-go"><i>billets</i>' + fl + '</span></a>';
                }).join('') + '<a class="hpm-toutes" href="#billets" style="--k:3"><i>toutes les dates</i> ↓</a>';
                b.classList.add('hp-pret');
            });
        }
        /* les dates passées sont retirées par le script de la page au chargement : on lit la liste après lui */
        if (document.readyState === 'complete') remplir(); else window.addEventListener('load', remplir);
        document.addEventListener('DOMContentLoaded', function () { setTimeout(remplir, 0); });
        if (!sourisFine) return;
        /* v96 : la carte éclot du bouton, comme une lumière qui s'étend (cercle qui grandit depuis le bouton, lentement),
           et s'y referme de la même façon : au départ du curseur, au défilement, ou après la présentation d'arrivée.
           Rien de brusque : une intention de survol avant d'ouvrir, un délai de grâce avant de fermer. */
        function ouvrir(b) {
            if (!b.classList.contains('hp-pret') || b.classList.contains('ouvert')) return;
            b.classList.remove('ferme');
            b._y0 = window.scrollY;
            /* v106 : la carte s'ouvre vers le haut ; si elle n'y entre pas à l'écran, elle éclot vers le bas (flèche comprise) */
            var m = b.querySelector('.hp-menu'), rb = b.querySelector('.hp-bouton').getBoundingClientRect(), hm = m ? m.offsetHeight : 0;
            var enHaut = rb.bottom - hm, enBas = window.innerHeight - (rb.top + hm);
            b.classList.toggle('hp-bas', enHaut < 12 && enBas > enHaut);
            var sec = b.closest('section'); if (sec) { clearTimeout(sec._deb); sec.classList.toggle('hp-deborde', b.classList.contains('hp-bas')); }
            b.classList.add('ouvert', 'hp-trace');
        }
        function fermer(b) {
            if (!b.classList.contains('ouvert')) return;
            b.classList.remove('ouvert', 'hp-trace');
            b.classList.add('ferme');
            clearTimeout(b._fin); b._fin = setTimeout(function () { b.classList.remove('ferme'); }, 900);
            var sec = b.closest('section'); if (sec) { clearTimeout(sec._deb); sec._deb = setTimeout(function () { sec.classList.remove('hp-deborde'); }, 1200); }
        }
        blocs.forEach(function (b) {
            var tOuv = null, tFer = null;
            b.addEventListener('pointerenter', function () { b._touche = true; clearTimeout(tFer); clearTimeout(tOuv); tOuv = setTimeout(function () { ouvrir(b); }, 140); });
            b.addEventListener('pointerleave', function () { clearTimeout(tOuv); clearTimeout(tFer); tFer = setTimeout(function () { fermer(b); }, 380); });
        });
        /* on défile : la carte se replie avec grâce */
        window.addEventListener('scroll', function () {
            blocs.forEach(function (b) { if (b.classList.contains('ouvert') && Math.abs(window.scrollY - b._y0) > 24) fermer(b); });
        }, { passive: true });
        /* à l'arrivée (une fois par visite) : quand le titre est posé, la carte éclot seule, montre les dates, puis se referme */
        var dejaVu = false; try { dejaVu = sessionStorage.getItem('hp-intro') === '1'; sessionStorage.setItem('hp-intro', '1'); } catch (x) {}
        if (calme || dejaVu) return;
        setTimeout(function () {
            var b = Array.prototype.filter.call(blocs, function (x) { return x.offsetParent !== null; })[0];
            if (!b || b._touche || window.scrollY > 40) return;
            ouvrir(b);
            setTimeout(function () { if (!b.matches(':hover')) fermer(b); }, 4200);
        }, 5000);
    }

    /* v103 : LA braise du site, en un seul geste partagé (dates et infolettre).
       1) Implosion, subtile : un halo de lumière se resserre sur le point, la braise naît, inspire, puis se comprime.
       2) Pouf : un souffle de lumière très doux, et elle part. 3) Vol en ligne droite : départ lent, puis elle gagne de la
       traction, s'étire avec la vitesse, laisse une poussière de lumière derrière elle. 4) Impact : on rappelle « impact ».
       A : point de départ (coordonnées de la page) ; cible() : point d'arrivée (relu à chaque image). */
    function braiseVol(A, cible, o) {
        o = o || {};
        function point(cls, x, y) { var e = document.createElement('span'); e.className = cls; e.setAttribute('aria-hidden', 'true'); e.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; document.body.appendChild(e); return e; }
        var boule = point('braise-voyage', A.x, A.y); boule.style.opacity = 0;
        var halo = point('braise-halo', A.x, A.y);
        /* v104 : plus aucune traînée (demande d'Adib) : seulement la braise qui s'en va */
        var CHARGE = o.charge || 760, B0 = cible(), dist0 = Math.hypot(B0.x - A.x, B0.y - A.y);
        var D = Math.max(850, Math.min(1500, dist0 * 1.2)), t0 = performance.now(), pouf = false, arrive = false;
        function lisse(x) { return x * x * (3 - 2 * x); }
        (function pas(ts) {
            var e = ts - t0;
            if (e < CHARGE) {
                var c = e / CHARGE;
                /* le halo se resserre (la lumière est aspirée), la braise inspire puis se comprime */
                var hs = 2.6 - 2.1 * lisse(Math.min(1, c / .82)), ho = Math.sin(Math.min(1, c / .82) * Math.PI) * .55;
                halo.style.transform = 'translate3d(' + A.x.toFixed(1) + 'px,' + A.y.toFixed(1) + 'px,0) scale(' + hs.toFixed(3) + ')';
                halo.style.opacity = ho.toFixed(3);
                var sc = c < .8 ? .25 + .9 * lisse(c / .8) : 1.15 - .45 * lisse((c - .8) / .2);
                boule.style.opacity = Math.min(1, c * 1.8).toFixed(3);
                boule.style.transform = 'translate3d(' + A.x.toFixed(1) + 'px,' + A.y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
                requestAnimationFrame(pas); return;
            }
            if (!pouf) {
                pouf = true; halo.remove();
                var pf = point('braise-pouf', A.x, A.y); pf.style.setProperty('--t', pf.style.transform);
                setTimeout(function () { pf.remove(); }, 700);
                if (o.depart) o.depart();
            }
            var T = Math.min(1, (e - CHARGE) / D), B = cible();
            var dx = B.x - A.x, dy = B.y - A.y, dist = Math.hypot(dx, dy) || 1, ux = dx / dist, uy = dy / dist, ang = Math.atan2(dy, dx) * 180 / Math.PI;
            var p = Math.pow(T, 2), vit = 2 * Math.pow(Math.max(T, .02), 1);
            var ond = Math.sin(T * Math.PI * 2.6) * 3 * Math.pow(1 - T, 2.4);
            var x = A.x + dx * p - uy * ond, y = A.y + dy * p + ux * ond;
            var etire = 1 + Math.min(.32, vit * .16);   /* à peine étirée par la vitesse, pour ne pas faire une traînée */
            boule.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + ang.toFixed(1) + 'deg) scale(' + etire.toFixed(3) + ',' + (1 / Math.sqrt(etire)).toFixed(3) + ')';
            if (T >= .985 && !arrive) {
                arrive = true;
                if (o.impact) o.impact(x - window.scrollX, y - window.scrollY);
            }
            if (T < 1) requestAnimationFrame(pas);
            else { boule.classList.add('s-eteint'); setTimeout(function () { boule.remove(); if (o.fin) o.fin(); }, 260); }
        })(t0);
    }

    /* v98 : les boutons « billets » des dates et la boule de lumière du site.
       La première date (en haut) le fait seule quand elle est prête ; ensuite, sur ordi, c'est le curseur qui l'appelle :
       on passe sur le nom d'une ville, la braise s'y charge (implosion), puis file en ligne droite jusqu'au bouton en laissant
       une traînée de poussière de lumière, et l'allume. Sur téléphone (pas de curseur), chaque date le fait en arrivant. */
    function braiseBillets() {
        var btns = Array.prototype.slice.call(document.querySelectorAll('#billets .ticket-groupe:not(.ticket-vedette) .ticket:not(.ticket-est-complet) .ticket-btn'));
        btns.forEach(function (b, i) { b.classList.add('btn-braise'); b.style.setProperty('--d', (-(i * 0.73) % 4.6).toFixed(2) + 's'); });
        if (calme || !('IntersectionObserver' in window)) { btns.forEach(function (b) { b.classList.add('allume'); }); return; }
        function depart(ville) {
            var marche = document.createTreeWalker(ville, NodeFilter.SHOW_TEXT, null), n, cands = [];
            while ((n = marche.nextNode())) for (var i = 0; i < n.nodeValue.length; i++) {
                var ch = n.nodeValue[i], rang = /[ij]/.test(ch) ? 0 : /[éèêàâôîû]/i.test(ch) ? 1 : /[bdfhklt]/.test(ch) ? 2 : 9;
                if (rang < 9) cands.push({ n: n, i: i, rang: rang });
            }
            if (!cands.length) { var r0 = ville.getBoundingClientRect(); return { x: r0.left + 8, y: r0.top + r0.height * .3 }; }
            var meilleur = Math.min.apply(null, cands.map(function (c) { return c.rang; }));
            var choix = cands.filter(function (c) { return c.rang === meilleur; });
            var c = choix[Math.floor(Math.random() * choix.length)];
            var rg = document.createRange(); rg.setStart(c.n, c.i); rg.setEnd(c.n, c.i + 1);
            var q = rg.getBoundingClientRect();
            return { x: q.left + q.width * (c.rang === 0 ? .7 : .62), y: q.top + q.height * (c.rang === 2 ? .2 : .24) };
        }
        function point(cls, x, y) { var e = document.createElement('span'); e.className = cls; e.setAttribute('aria-hidden', 'true'); e.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; document.body.appendChild(e); return e; }
        /* on attend que la date soit vraiment là : police chargée, rangée arrivée (fondu terminé, plus de mouvement) */
        function quandPrete(row, fn) {
            var t0 = performance.now(), dernierY = null, stable = 0;
            (function verifie() {
                var cs = getComputedStyle(row), y = row.getBoundingClientRect().top + window.scrollY;
                var immobile = dernierY !== null && Math.abs(y - dernierY) < .5; dernierY = y;
                stable = (parseFloat(cs.opacity) > .98 && immobile) ? stable + 1 : 0;
                if (stable >= 6 || performance.now() - t0 > 3000) fn(); else requestAnimationFrame(verifie);
            })();
        }
        var polices = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        function voyage(row, btn) {
            var v = row.querySelector('.ticket-ville');
            if (!v || row._vol) return;
            row._vol = true;
            var a = depart(v);
            braiseVol({ x: a.x + window.scrollX, y: a.y + window.scrollY },
                function () { var r = btn.getBoundingClientRect(); return { x: r.left + 10 + window.scrollX, y: r.top + r.height * .5 + window.scrollY }; },
                {
                    impact: function (x) {
                        /* la braise embrase le bouton de l'intérieur, à partir du point d'impact */
                        var rb = btn.getBoundingClientRect();
                        btn.style.setProperty('--ix', Math.max(0, Math.min(rb.width, x - rb.left)).toFixed(1) + 'px');
                        var bw = btn.offsetWidth, bh = btn.offsetHeight, rr = bh / 2, NS2 = 'http://www.w3.org/2000/svg';
                        var cont = btn.querySelector('.btn-contour');
                        if (!cont || cont._w !== bw) {
                            if (cont) cont.remove();
                            cont = document.createElementNS(NS2, 'svg'); cont.setAttribute('class', 'btn-contour'); cont.setAttribute('aria-hidden', 'true');
                            cont.setAttribute('viewBox', '0 0 ' + bw + ' ' + bh); cont._w = bw;
                            var e1 = .75, m = bh / 2;
                            cont.innerHTML = '<path pathLength="1" d="M ' + e1 + ' ' + m + ' A ' + (rr - e1) + ' ' + (rr - e1) + ' 0 0 1 ' + rr + ' ' + e1 + ' L ' + (bw - rr) + ' ' + e1 + ' A ' + (rr - e1) + ' ' + (rr - e1) + ' 0 0 1 ' + (bw - e1) + ' ' + m + '"/>' +
                                '<path pathLength="1" d="M ' + e1 + ' ' + m + ' A ' + (rr - e1) + ' ' + (rr - e1) + ' 0 0 0 ' + rr + ' ' + (bh - e1) + ' L ' + (bw - rr) + ' ' + (bh - e1) + ' A ' + (rr - e1) + ' ' + (rr - e1) + ' 0 0 0 ' + (bw - e1) + ' ' + m + '"/>';
                            btn.appendChild(cont);
                        }
                        btn.classList.add('allume'); btn.classList.remove('eclat', 'inonde', 'redescend'); void btn.offsetWidth; btn.classList.add('eclat', 'inonde');
                        clearTimeout(btn._inonde); btn._inonde = setTimeout(function () { btn.classList.remove('inonde'); btn.classList.add('redescend'); setTimeout(function () { btn.classList.remove('redescend'); }, 1300); }, 1100);
                    },
                    fin: function () { row._vol = false; }
                });
        }
        var visibles = btns.filter(function (b) { return b.offsetParent !== null; });
        /* v102 : partout (ordi et téléphone), seule la première date le fait d'elle-même ; ensuite, c'est un petit jeu :
           sur ordi, on passe le curseur sur le nom d'une ville ; sur téléphone, on touche le nom. */
        var premier = null;
        /* les dates passées sont retirées par le script de la page au chargement : on choisit la première après lui */
        function choisirPremier() {
            premier = btns.filter(function (b) { var r = b.closest('.ticket'); return r && r.style.display !== 'none' && b.offsetParent !== null; })[0];
            if (!premier) return;
            var io1 = new IntersectionObserver(function (en) {
                if (!en[0].isIntersecting) return;
                io1.disconnect();
                var row = premier.closest('.ticket');
                polices.then(function () { quandPrete(row, function () { setTimeout(function () { voyage(row, premier); }, 250); }); });
            }, { threshold: 1, rootMargin: '0px 0px -12% 0px' });
            io1.observe(premier);
        }
        if (document.readyState === 'complete') setTimeout(choisirPremier, 0); else window.addEventListener('load', function () { setTimeout(choisirPremier, 0); });
        /* pendant le défilement, les noms passent sous un curseur immobile : ce n'est pas un geste, on l'ignore */
        var defile = 0;
        window.addEventListener('scroll', function () { defile = performance.now(); }, { passive: true });
        btns.forEach(function (b) {
            var row = b.closest('.ticket'), v = row && row.querySelector('.ticket-ville'), dernier = 0;
            if (!v) return;
            function appel() {
                if (performance.now() - dernier < 1600 || performance.now() - defile < 450) return;
                dernier = performance.now();
                voyage(row, b);
            }
            if (sourisFine) v.addEventListener('pointermove', function (e) { if (Math.abs(e.movementX) + Math.abs(e.movementY) > 0) appel(); });
            else v.addEventListener('click', appel);
        });
    }

    /* v95 : Plexus lunaire prend vie. La lumière de la pochette respire, ses rayons tournent lentement,
       son halo bleu déborde sur la page ; sur ordi, la pochette s'incline vers le curseur et la lumière le suit. */
    function plexusVivant() {
        var poch = document.querySelector('.vedette-pochette');
        if (!poch) return;
        var halo = document.createElement('span'); halo.className = 'plx-halo'; halo.setAttribute('aria-hidden', 'true');
        var c = document.createElement('span'); c.className = 'plx-couche'; c.setAttribute('aria-hidden', 'true');
        c.innerHTML = '<span class="plx-rayons"></span><span class="plx-lueur"></span>';
        poch.insertBefore(halo, poch.firstChild); poch.appendChild(c);
        if (calme || !sourisFine) return;
        poch.classList.add('plx-incline');
        var raf = null, cible = { x: 0, y: 0 }, cour = { x: 0, y: 0 };
        function anim() {
            cour.x += (cible.x - cour.x) * .12; cour.y += (cible.y - cour.y) * .12;
            poch.style.setProperty('--rx', (-cour.y * 7).toFixed(2) + 'deg'); poch.style.setProperty('--ry', (cour.x * 9).toFixed(2) + 'deg');
            poch.style.setProperty('--lx', (52 + cour.x * 6).toFixed(1) + '%'); poch.style.setProperty('--ly', (44 + cour.y * 6).toFixed(1) + '%');
            if (Math.abs(cible.x - cour.x) > .002 || Math.abs(cible.y - cour.y) > .002) raf = requestAnimationFrame(anim); else raf = null;
        }
        poch.addEventListener('pointermove', function (e) {
            var r = poch.getBoundingClientRect();
            cible.x = (e.clientX - r.left) / r.width * 2 - 1; cible.y = (e.clientY - r.top) / r.height * 2 - 1;
            if (!raf) raf = requestAnimationFrame(anim);
        });
        poch.addEventListener('pointerleave', function () { cible.x = 0; cible.y = 0; if (!raf) raf = requestAnimationFrame(anim); });
    }

    /* v101 : ceux qui reviennent. Le téléphone (ou l'ordi) du visiteur se souvient, chez lui seulement, des dates déjà vues.
       S'il revient au moins 6 h plus tard : les nouvelles dates portent une braise « nouveau », et une ligne l'annonce en haut.
       S'il n'y a pas de nouvelle date : une petite carte lui présente les derniers articles parus (« on en parle »). */
    function retour() {
        var CLE = 'adib-visite', avant = null;
        try { avant = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch (x) { return; }
        function lignes() {
            return Array.prototype.filter.call(document.querySelectorAll('#billets .ticket[data-date]'), function (r) {
                return r.style.display !== 'none' && !r.classList.contains('scheduled-ticket');
            });
        }
        function cle(r) { return r.getAttribute('data-date') + '|' + (r.getAttribute('data-ville') || ''); }
        function memoriser() {
            try { localStorage.setItem(CLE, JSON.stringify({ t: Date.now(), d: lignes().map(cle) })); } catch (x) {}
        }
        function lancer() {
            var maintenant = Date.now();
            /* v106 : adibalkhalidey.com/apercu.html?retour fait comme si la dernière visite datait d'hier (pour tester) */
            if (/[?&]retour\b/.test(location.search)) avant = { t: maintenant - 86400000, d: (avant && avant.d) || lignes().map(cle) };
            if (!avant || !avant.t || maintenant - avant.t < 6 * 3600 * 1000) { if (!avant || maintenant - avant.t >= 6 * 3600 * 1000) memoriser(); return; }
            var vues = {}; (avant.d || []).forEach(function (k) { vues[k] = 1; });
            var nouvelles = lignes().filter(function (r) { return !vues[cle(r)]; });
            memoriser();
            if (nouvelles.length) {
                nouvelles.forEach(function (r) {
                    var j = r.querySelector('.ticket-jour');
                    if (j && !j.querySelector('.ticket-nouveau')) j.insertAdjacentHTML('beforeend', '<span class="ticket-tag ticket-nouveau"><span class="tn-braise" aria-hidden="true"></span>nouveau</span>');
                });
                var h = document.querySelector('#billets h1');
                if (h && !document.querySelector('.depuis-visite')) h.insertAdjacentHTML('afterend', '<p class="depuis-visite"><span class="tn-braise" aria-hidden="true"></span>' + nouvelles.length + (nouvelles.length > 1 ? ' nouvelles dates' : ' nouvelle date') + ' depuis ta dernière visite</p>');
                return;
            }
            /* pas de nouvelle date : les derniers articles, d'abord ceux parus depuis sa dernière visite */
            var depuis = new Date(avant.t).toISOString().slice(0, 10);
            var arts = PRESSE.filter(function (p) { return p[7]; }).sort(function (a, b) { return a[7] < b[7] ? 1 : -1; });
            var neufs = arts.filter(function (p) { return p[7] >= depuis; });
            var montres = (neufs.length ? neufs : arts).slice(0, 2);
            if (!montres.length) return;
            var c = document.createElement('aside');
            c.className = 'carte-retour'; c.setAttribute('aria-label', 'Depuis ta dernière visite');
            c.innerHTML = '<button type="button" class="cr-fermer" aria-label="Fermer">×</button>' +
                '<p class="cr-tete"><span class="tn-braise" aria-hidden="true"></span>' + (neufs.length ? 'depuis ta dernière visite' : 'on en parle') + '</p>' +
                montres.map(function (p) {
                    return '<a class="cr-art" href="' + p[4] + '" target="_blank" rel="noopener" data-porte="retour-article"><span class="cr-source">' + p[0] + (p[1] ? ' · ' + p[1] : '') + '</span>' +
                        '<span class="cr-titre">' + p[3] + '</span><span class="cr-geste">' + p[5] + (p[6] ? ' · ' + p[6] : '') + ' →</span></a>';
                }).join('') + '<a class="cr-tout" href="#presse">tout ce qu’on en dit ↓</a>';
            document.body.appendChild(c);
            function fermer() { c.classList.remove('ouverte'); setTimeout(function () { c.remove(); }, 900); }
            c.querySelector('.cr-fermer').addEventListener('click', fermer);
            c.querySelector('.cr-tout').addEventListener('click', function () { fermer(); });
            /* elle attend que la bannière des témoins soit réglée et que le titre soit posé */
            var essais = 0;
            (function attendre() {
                var ban = document.querySelector('.adib-cookie-banner');
                if ((ban && ban.offsetParent !== null) && essais++ < 40) { setTimeout(attendre, 1500); return; }
                setTimeout(function () { c.classList.add('ouverte'); }, 1200);
            })();
            var y0 = null;
            window.addEventListener('scroll', function () {
                if (!c.classList.contains('ouverte')) return;
                if (y0 === null) y0 = window.scrollY;
                if (Math.abs(window.scrollY - y0) > window.innerHeight * 1.2) fermer();
            }, { passive: true });
        }
        /* les dates passées sont retirées au chargement : on compare après */
        if (document.readyState === 'complete') setTimeout(lancer, 5600); else window.addEventListener('load', function () { setTimeout(lancer, 5600); });
    }

    /* v101 : l'incendie devient la lumière qui reste. En haut, le feu (le hero, le tison) ; à mesure qu'on descend
       après la musique, le fond refroidit imperceptiblement vers la nuit ; tout en bas, une seule braise ne s'éteint jamais. */
    function nuit() {
        var voile = document.createElement('div'); voile.className = 'nuit-voile'; voile.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(voile, document.body.firstChild);
        var credit = document.querySelector('.credit');
        if (credit && !credit.querySelector('.braise-eternelle')) credit.insertAdjacentHTML('afterbegin', '<span class="braise-eternelle" aria-hidden="true" title="ce qui ne brûle pas"></span>');
        var enCours = false;
        function maj() {
            enCours = false;
            var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight), p = window.scrollY / max;
            var x = Math.min(1, Math.max(0, (p - .6) / .38)), o = x * x * (3 - 2 * x);
            voile.style.opacity = Math.max(.004, o * .9).toFixed(3);
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj); maj();
    }

    /* v91 : les deux petites affiches du « jamais vu Adib sur scène » mènent au spectacle, qui s'allume à l'arrivée */
    function essai() {
        /* v93 : un vrai moment de chaque spectacle joue en boucle, sans son, dans la miniature, quand elle est à l'écran */
        var vids = document.querySelectorAll('.e2-extrait');
        if (vids.length && !calme && 'IntersectionObserver' in window) {
            var iov = new IntersectionObserver(function (en) {
                en.forEach(function (x) {
                    var v = x.target;
                    if (x.isIntersecting) {
                        if (!v.src) { v.src = v.getAttribute('data-src'); v.addEventListener('playing', function () { v.classList.add('joue'); }); }
                        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
                    } else if (!v.paused) v.pause();
                });
            }, { rootMargin: '120px 0px' });
            vids.forEach(function (v) { iov.observe(v); });
        }
        document.querySelectorAll('.e2-affiche').forEach(function (a) {
            var cadre = a.querySelector('.e2-cadre[data-youtube]');
            if (cadre && !theatreOuvrir) {   /* v109 : sur téléphone, on ne quitte plus le site : l'extrait joue ici, par-dessus la billetterie */
                a.addEventListener('click', function (e) { e.preventDefault(); ecranMobile(cadre); });
                return;
            }
            a.addEventListener('click', function (e) {
                if (cadre && theatreOuvrir) { e.preventDefault(); theatreOuvrir(cadre); return; }   /* v105 : jamais plus de saut vers la fin du site */
                var art = document.querySelector(a.getAttribute('href'));
                if (!art) return;
                e.preventDefault();
                art.scrollIntoView({ behavior: calme ? 'auto' : 'smooth', block: 'center' });
                var ecran = art.querySelector('.special-ecran');
                if (!ecran) return;
                setTimeout(function () { ecran.classList.remove('appel'); void ecran.offsetWidth; ecran.classList.add('appel'); }, calme ? 0 : 700);
            });
        });
    }

    function go() {
        var mods = [provenance, portes, presse, heroBillets, braiseBillets, plexusVivant, retour, nuit, pauseHorsEcran, etiquettes, heroLettres, tison, moments, titres, timbres, panneauVille, vinyles, objets, discographie, cinema, prochain, bio, infolettre, dar, boutonsConvergence, boutonsChevrons, curseur, separateurs, defiler, retourHaut, plexusNav, plexusSort, anagrammes, menuPlateformes, menusDansEcran, avionInfolettre, lienInfolettre, boutique, sousTitreSpectacles, moisBilletterie, disciplinesDar, voix, apercusFilms, essai, lueurs], i = 0;
        (function tranche() {
            var t0 = performance.now();
            while (i < mods.length) {
                mods[i++]();
                if (i < mods.length && performance.now() - t0 > 50) { setTimeout(tranche, 0); return; }
            }
        })();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
