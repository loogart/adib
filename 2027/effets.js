/* effets.js · ronde 3 · v25 (8 oct.) : emblème du graphiste partout (défiler, retour en haut), tison, arche */
(function () {
    'use strict';
    var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sourisFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
                s.style.height = ''; colle.style.height = ''; colle.style.paddingTop = ''; bloc.style.marginTop = '';
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
                s.style.height = Math.round(H + window.innerHeight * (s.classList.contains('moment-court') ? 0.4 : 0.9)) + 'px';
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
            var p = Math.min(1, Math.max(0, -r.top / (course * 0.8)));
            var n = Math.round(p * spans.length);
            spans.forEach(function (x, i) { x.classList.toggle('allume', i < n); });
            var fr = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + course * 0.8)));
            arc.style.strokeDashoffset = long * (1 - fr);
            placerFleche(fr);
            s.classList.toggle('fini', n >= spans.length);
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj);
        maj();
    }

    function moments() {
        var distinction = document.querySelector('.distinction');
        if (distinction) moment({
            avant: distinction,
            classe: 'moment-court moment-nom',
            label: "Le 6e spectacle d'Adib Alkhalidey",
            balise: 'p',
            kicker: 'Comme les Mongols à Baghdad',
            mots: ['Le', '6<sup>e</sup>', 'spectacle', 'd’<span class="nom">Adib</span>', '<span class="nom">Alkhalidey</span>'],
            source: '<a href="#billets">les dates ↓</a>'
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
        var t = document.querySelectorAll('#billets h1, .infolettre h2, #musique h2, #boutique h2, #spectacles h2, #bio h2');
        if (calme || !('IntersectionObserver' in window)) { t.forEach(function (h) { h.classList.add('titre-ecrit', 'go'); }); return; }
        t.forEach(function (h) { h.classList.add('titre-ecrit'); });
        /* une fois écrit, on retire le masque : il rognait les lettres qui débordent (interligne serré du h1) */
        t.forEach(function (h) { h.addEventListener('animationend', function () { h.classList.add('ecrit-fini'); }); });
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('go'); io.unobserve(x.target); } });
        }, { threshold: 0.6 });
        t.forEach(function (h) { io.observe(h); });
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
        }, { threshold: 0.45 });
        io.observe(svg);
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
                var r = e.getBoundingClientRect();
                var centre = r.top + r.height / 2;
                var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
                if (centre < vh * 0.5) p = 1;
                e.style.setProperty('--p', p.toFixed(3));
            });
        }
        window.addEventListener('scroll', function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
        window.addEventListener('resize', maj);
        maj();
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

    /* Le fil : le petit cercle du diagramme parcourt le paragraphe en arcs, aller-retour,
       comme un fil qui se tisse ; chaque mot apparaît quand le cercle passe près de lui. */
    function revelerLignes(p, delaiBase) {
        if (p._revele) return;
        p._revele = true;
        var origine = p.innerHTML;
        var mots = [];
        var marche = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
        var noeuds = [];
        while (marche.nextNode()) noeuds.push(marche.currentNode);
        var espace = false;
        noeuds.forEach(function (n) {
            var it = !!(n.parentNode.closest && n.parentNode.closest('i, em'));
            var cle = !!(n.parentNode.closest && n.parentNode.closest('.mot-cle'));
            var acc = !!(n.parentNode.closest && n.parentNode.closest('.accent'));
            n.nodeValue.split(/(\s+)/).forEach(function (m) {
                if (!m) return;
                if (/^\s+$/.test(m)) { espace = true; return; }
                mots.push({ t: m, it: it, cle: cle, acc: acc, sp: espace && mots.length > 0 });
                espace = false;
            });
        });
        p.innerHTML = mots.map(function (m) {
            return (m.sp ? ' ' : '') + '<span class="lm' + (m.it ? ' lm-it' : '') + (m.cle ? ' lm-cle' : '') + (m.acc ? ' accent' : '') + '">' +
                m.t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
        }).join('');
        p.classList.add('fil-pret');
        var spans = Array.prototype.slice.call(p.querySelectorAll('.lm'));

        /* lignes réelles */
        var lignes = [], courante = null, haut = null;
        spans.forEach(function (sp) {
            var t = sp.offsetTop;
            if (haut === null || Math.abs(t - haut) > 4) { courante = []; lignes.push(courante); haut = t; }
            courante.push(sp);
        });

        /* le chemin : un arc par ligne, en alternant le sens, relié par des virages en demi-lune */
        var cs = getComputedStyle(p);
        var pos = cs.position;
        if (pos === 'static') p.style.position = 'relative';
        var W = p.clientWidth, H = p.clientHeight;
        var pts = lignes.map(function (l, i) {
            var g = l[0], d = l[l.length - 1];
            var y = g.offsetTop + g.offsetHeight * 0.95;
            return { x0: g.offsetLeft - 6, x1: d.offsetLeft + d.offsetWidth + 6, y: y };
        });
        var dPath = '';
        pts.forEach(function (q, i) {
            var aller = i % 2 === 0;
            var xa = aller ? q.x0 : q.x1, xb = aller ? q.x1 : q.x0;
            var amp = (i % 3 === 1 ? -1 : 1) * (5 + (i * 7) % 9);
            if (i === 0) dPath += 'M ' + xa + ' ' + q.y;
            else {
                var prec = pts[i - 1];
                var bord = aller ? Math.min(prec.x0, q.x0) - 26 : Math.max(prec.x1, q.x1) + 26;
                dPath += ' C ' + bord + ' ' + prec.y + ', ' + bord + ' ' + q.y + ', ' + xa + ' ' + q.y;
            }
            var l3 = xa + (xb - xa) / 3, l6 = xa + (xb - xa) * 2 / 3;
            dPath += ' C ' + l3 + ' ' + (q.y - amp) + ', ' + l6 + ' ' + (q.y + amp * 0.6) + ', ' + xb + ' ' + q.y;
        });
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'fil-svg');
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.setAttribute('aria-hidden', 'true');
        var chemin = document.createElementNS(NS, 'path');
        chemin.setAttribute('d', dPath);
        var cercle = document.createElementNS(NS, 'circle');
        cercle.setAttribute('r', '4');
        svg.appendChild(chemin);
        svg.appendChild(cercle);
        p.appendChild(svg);
        var total = chemin.getTotalLength();
        chemin.style.strokeDasharray = total;
        chemin.style.strokeDashoffset = total;

        /* pour chaque mot : la distance le long du fil où le cercle passe à sa hauteur */
        var echant = [];
        for (var L = 0; L <= total; L += 6) { var pt = chemin.getPointAtLength(L); echant.push([L, pt.x, pt.y]); }
        var seuils = spans.map(function (sp) {
            var cx = sp.offsetLeft + sp.offsetWidth / 2, cy = sp.offsetTop + sp.offsetHeight * 0.95;
            var best = 0, bd = 1e9;
            for (var k = 0; k < echant.length; k++) {
                var dx = echant[k][1] - cx, dy = (echant[k][2] - cy) * 3;
                var dd = dx * dx + dy * dy;
                if (dd < bd) { bd = dd; best = echant[k][0]; }
            }
            return best;
        });

        var vitesse = 1300;  /* px par seconde */
        var duree = Math.max(1.2, total / vitesse) * 1000;
        var t0 = null;
        function pas(ts) {
            if (t0 === null) t0 = ts;
            var e = Math.min(1, (ts - t0) / duree);
            var f = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;   /* départ et arrivée en douceur */
            var Lc = f * total;
            chemin.style.strokeDashoffset = total - Lc;
            var q = chemin.getPointAtLength(Lc);
            cercle.setAttribute('cx', q.x); cercle.setAttribute('cy', q.y);
            for (var j = 0; j < spans.length; j++) if (!spans[j]._v && seuils[j] <= Lc + 4) { spans[j]._v = true; spans[j].classList.add('vu'); }
            if (e < 1) requestAnimationFrame(pas);
            else {
                svg.classList.add('fil-fin');
                setTimeout(function () {
                    p.innerHTML = origine;
                    if (pos === 'static') p.style.position = '';
                    p.classList.remove('fil-pret');
                    p.classList.add('cles-go');
                }, 900);
            }
        }
        setTimeout(function () { requestAnimationFrame(pas); }, delaiBase * 1000);
    }

    function bio() {
        var col = document.querySelector('#bio .bio-texte');
        var h2 = document.querySelector('#bio h2');
        if (!col || !h2) return;
        var q = document.createElement('p');
        q.className = 'bio-exergue';
        q.innerHTML = '«\u00a0le disciple de trois formes d’art\u00a0»';
        h2.parentNode.appendChild(q);

        var paras = col.querySelectorAll('p');
        paras.forEach(marquerMotsCles);
        if (calme || !('IntersectionObserver' in window)) {
            q.classList.add('vu');
            paras.forEach(function (p) { p.classList.add('cles-go'); });
            return;
        }
        var ioq = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { q.classList.add('vu'); ioq.disconnect(); } }, { threshold: 1 });
        ioq.observe(q);

        var visibles = [];
        for (var i = 0; i < col.children.length; i++) if (col.children[i].tagName === 'P') visibles.push(col.children[i]);
        visibles.forEach(function (p) { p.classList.add('lignes-attente'); });
        var io = new IntersectionObserver(function (e) {
            e.forEach(function (x) {
                if (!x.isIntersecting) return;
                io.unobserve(x.target);
                x.target.classList.remove('lignes-attente');
                revelerLignes(x.target, 0);
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
                if (r.top < window.innerHeight) revelerLignes(el, 0.15 + k * 0.05);
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
        var enCours = false;
        function maj() {
            enCours = false;
            var r = b.getBoundingClientRect();
            var vh = window.innerHeight;
            var prog = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
            lignes.forEach(function (l, i) {
                var x = Math.min(1, Math.max(0, prog * 4.2 - i * 0.85 - 0.4));
                l.style.setProperty('--r', x.toFixed(3));
            });
            b.classList.toggle('fini', prog >= 0.98);
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
                nom: v ? v.textContent.trim() : '',
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
            if (b.closest('nav') || b.querySelector('.conv')) return;
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
        window.addEventListener('scroll', function () { if (cible && !boucle) boucle = requestAnimationFrame(anime); }, { passive: true });
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
            img.insertAdjacentElement('afterend', feu);
            img.insertAdjacentElement('afterend', ombre);

            var pOmbre = ombre.querySelector('path'), pTrace = feu.querySelector('.tison-trace'), pHalo = feu.querySelector('.tison-halo');
            var braise = feu.querySelector('.tison-braise');
            var L1 = pOmbre.getTotalLength(), L2 = pTrace.getTotalLength(), L3 = pHalo.getTotalLength();
            pTrace.style.strokeDasharray = L2; pTrace.style.strokeDashoffset = L2;
            pHalo.style.strokeDasharray = L3; pHalo.style.strokeDashoffset = L3;
            braise.style.opacity = 0;
            var debut = null, attente = 900, duree = 2600;
            function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
            function pas(ts) {
                if (debut === null) debut = ts;
                var t = Math.min(1, Math.max(0, (ts - debut - attente) / duree)), e = ease(t);
                pOmbre.style.strokeDasharray = '0 ' + (L1 * e).toFixed(1) + ' ' + (L1 + 1).toFixed(0);   /* l'ombre recule devant le tison */
                pTrace.style.strokeDashoffset = L2 * (1 - e);
                pHalo.style.strokeDashoffset = L3 * (1 - e);
                var q = pTrace.getPointAtLength(L2 * e);
                var vacille = 1 + Math.sin(ts / 70) * 0.08 + Math.sin(ts / 23) * 0.05;
                braise.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ') scale(' + vacille.toFixed(3) + ')');
                braise.style.opacity = t <= 0 ? 0 : (t < 0.06 ? t / 0.06 : (t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1));
                if (t < 1) requestAnimationFrame(pas);
                else {
                    ombre.remove(); braise.remove(); feu.classList.add('fini');
                    feu.addEventListener('animationend', function () { feu.remove(); });   /* plus rien par-dessus l'image */
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
            window.scrollTo({ top: m.getBoundingClientRect().top + window.scrollY, behavior: calme ? 'auto' : 'smooth' });
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
        suivre();
    }

    /* 6. Retour en haut : l'emblème, les deux flèches pointent vers le haut */
    function retourHaut() {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'retour-haut';
        b.setAttribute('aria-label', 'Retour en haut');
        b.innerHTML = embleme(24);   /* l'emblème ramène à la maison : le haut de la page */
        document.body.appendChild(b);
        b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: calme ? 'auto' : 'smooth' }); });
        var enCours = false;
        window.addEventListener('scroll', function () {
            if (enCours) return; enCours = true;
            requestAnimationFrame(function () { enCours = false; b.classList.toggle('visible', window.scrollY > window.innerHeight * 1.5); });
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

    /* ---------- Menu des plateformes : même langage que les boutons ---------- */
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
        });
    }

    /* ---------- Boutique : les objets posés sur le disque du diagramme ---------- */
    function boutique() {
        document.querySelectorAll('#boutique .produit:not(.produit-fin)').forEach(function (p) {
            p.classList.add('produit-scene');
            var nom = p.querySelector('.produit-nom');
            if (nom && !nom.querySelector('.pn-chev')) nom.insertAdjacentHTML('beforeend', '<svg class="pn-chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M 1 1 L 6.5 7 L 1 13"/></svg>');
            var img = p.querySelector('.produit-image');
            if (img && !img.querySelector('.socle')) img.insertAdjacentHTML('beforeend',
                '<svg class="socle" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">' +
                '<ellipse class="socle-a" cx="100" cy="20" rx="98" ry="17"/>' +
                '<path class="socle-b" pathLength="1" d="M 10 16 A 92 15 0 0 1 196 21"/></svg>');
        });
        var fin = document.querySelector('#boutique .produit-fin');
        if (fin) {
            fin.classList.add('pf-cachet');
            fin.innerHTML =
                '<svg class="cachet-boutique" viewBox="0 0 200 200" aria-hidden="true">' +
                '<defs><path id="cachet-boutique-cercle" d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0"/></defs>' +
                '<circle cx="100" cy="100" r="95" class="cb-trait"/><circle cx="100" cy="100" r="62" class="cb-trait cb-pointille"/>' +
                '<g class="cb-texte"><text><textPath href="#cachet-boutique-cercle">toute la boutique · vinyles · livres · vêtements · </textPath></text></g>' +
                '<g class="cb-fleche"><path d="M 82 100 L 118 100 M 106 88 L 119 100 L 106 112"/></g></svg>' +
                '<span class="cb-legende"><i>expédiés par La Tribu</i></span>';
            fin.setAttribute('aria-label', 'Toute la boutique : vinyles, livres et vêtements, expédiés par La Tribu');
        }
    }

    /* ---------- Spectacles complets : une phrase courte et un chiffre qui respire ---------- */
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

    function go() { tison(); moments(); titres(); timbres(); panneauVille(); vinyles(); objets(); discographie(); cinema(); prochain(); bio(); infolettre(); dar(); boutonsConvergence(); boutonsChevrons(); curseur(); separateurs(); defiler(); retourHaut(); plexusNav(); menuPlateformes(); boutique(); sousTitreSpectacles(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
