! function (e) {
    var t = function () {
        var e = 0,
            t = 1e-6,
            r = 2,
            n = 1 / 65535;

        function o(e) {
            for (var t = [], r = 0, n = e.length; r < n; ++r) t[r] = [e[r][1], e[r][0]];
            return t
        }

        function a(e) {
            for (var t = [], r = 0, n = e.length; r < n; ++r) t[r] = o(e[r]);
            return t
        }

        function i(e, t) {
            for (var r = 0, n = 0; n < t; ++n) r |= e.charCodeAt(n) << 8 * n;
            return r
        }

        function s(e) {
            var o, a, s, u = (o = (o = e).replace(/_/g, "/").replace(/-/g, "+"), "undefined" != typeof atob ? atob(o) : new Buffer(o, "base64").toString("binary")),
                f = u.length,
                l = [
                    [i(u.substr(0, 4), 4) * t, i(u.substr(4, 4), 4) * t],
                    [i(u.substr(8, 4), 4) * t, i(u.substr(12, 4), 4) * t]
                ],
                p = [l[1][0] - l[0][0], l[1][1] - l[0][1]],
                c = [],
                h = 16,
                g = p[0] * n,
                d = p[1] * n;

            function v() {
                var e = i(u.substr(h, r), r);
                return h += r, e
            }
            for (; h < f;) {
                var y = [(s = v() * g + l[0][0], Math.min(85, Math.max(-85, s))), (a = v() * d + l[0][1], Math.min(180, Math.max(-180, a)))];
                c.push([y[1], y[0]])
            }
            return c
        }

        function u(e, t, r) {
            return r.wayCache[t] ? r.wayCache[t] : r.wayCache[t] = s(e)
        }

        function f(e, t) {
            var r = [],
                n = [],
                o = [],
                a = e.length ? e : t.paths[e],
                i = t.ways;
            if (t.wayCache = t.wayCache || {}, !a) return !1;
            for (var s = 0, f = a.length; s < f; ++s) {
                var l = a[s],
                    p = [],
                    c = [],
                    h = [0];
                "number" == typeof l && (l = [l]);
                for (var g = 0, d = l.length; g < d; ++g) {
                    var v = Math.abs(l[g]),
                        y = u(i[v], v, t);
                    l[g] < 0 && (y = y.slice(0)).reverse(), p.length && (p.length = p.length - 1), p.push.apply(p, y), h.push(p.length - 1), c.push(v)
                }
                p.push(p[0]), r.push(p), n.push(h), o.push(c)
            }
            return {
                type: "Polygon",
                fillRule: "nonZero",
                coordinates: r,
                path: a,
                fixedPoints: n
            }
        }

        function p(e, t) {
            var r = t.regions[e],
                n = r.property || {};
            return {
                osmId: e,
                geoNamesId: n.geoNamesId,
                iso: n.iso3166,
                level: r.level,
                properties: n,
                getBorderWith: function (r) {
                    var n, o, a, i, s = {},
                        u = t.paths[r],
                        f = t.paths[e];
                    for (n = 0, o = u.length; n < o; ++n)
                        for (a = 0, i = u[n].length; a < i; ++a) s[Math.abs(u[n][a])] = 1;
                    var l = [];
                    for (n = 0, o = f.length; n < o; ++n)
                        for (a = 0, i = f[n].length; a < i; ++a) s[Math.abs(f[n][a])] && l.push(f[n]);
                    return l
                },
                hasBorderWith: function (r) {
                    var n, o, a, i, s = {},
                        u = t.paths[e],
                        f = t.paths[r];
                    if (!u || !f) return !1;
                    for (n = 0, o = u.length; n < o; ++n)
                        for (a = 0, i = u[n].length; a < i; ++a) s[Math.abs(u[n][a])] = 1;
                    for (n = 0, o = f.length; n < o; ++n)
                        for (a = 0, i = f[n].length; a < i; ++a)
                            if (s[Math.abs(f[n][a])]) return !0;
                    return !1
                },
                hasParent: function (e) {
                    for (var t = r.parents, n = 0, o = t.length; n < o; ++n)
                        if (t[n].id == e) return !0;
                    return !1
                }
            }
        }

        function c(e, t) {
            var r = e.regions,
                n = e.paths,
                o = {},
                a = [];

            function i(e) {
                for (var t = [], r = 0, n = e.length; r < n; ++r) t.push([e[r]]);
                return t
            }
            for (var s in r)
                if (r.hasOwnProperty(s)) {
                    var u = n[s],
                        l = t.filter(p(s, e));
                    l && (!0 !== l && l.path && (u = l.path), u && u.length && (u = i(u)).length && (o[s] = s, a.push.apply(a, u)))
                }
            function c(e, t) {
                for (var r = {}, n = {}, o = {}, a = [e, t], i = 0; i < 2; ++i)
                    for (var s = 0, u = (c = a[i]).length; s < u; ++s) {
                        "number" == typeof (h = c[s]) && (h = [h]);
                        for (var f = 0, l = h.length; f < l; ++f) {
                            r[g = Math.abs(h[f])] = (r[g] || 0) + 1
                        }
                    }
                var p = 0;
                for (i = 0; i < 2; ++i) {
                    var c;
                    for (s = 0, u = (c = a[i]).length; s < u; ++s) {
                        var h;
                        "number" == typeof (h = c[s]) && (h = [h]);
                        for (f = 0, l = h.length; f < l; ++f) {
                            var g;
                            if (1 === r[g = Math.abs(h[f])]) {
                                0;
                                var d = +h[(f - 1 + l) % l],
                                    v = +h[(f + 1 + l) % l];
                                o[d] = o[d] || [], o[d].push(h[f]), n[h[f]] = [+d, +h[f], +v, i, s]
                            } else p++
                        }
                    }
                }
                if (!p) return !1;

                function y() {
                    for (var e in n)
                        if (m(e)) return +e;
                    return !1
                }

                function m(e) {
                    return e && n.hasOwnProperty(e) && n[e][1]
                }
                var b = [],
                    w = [],
                    C = 1;

                function M(e, t) {
                    if (!n[t]) return !1;
                    var r = -1 == C ? n[t][0] : 0,
                        a = 1 == C ? n[t][2] : 0;
                    if (m(a)) t = a, e.push(+t * C);
                    else if (m(r)) t = r, e.push(+t);
                    else {
                        var i = o[-n[t][2]];
                        for (var s in t = 0, i)
                            if (m(a = i[s])) {
                                t = a, e.push(+t);
                                break
                            } if (!t) return !1
                    }
                    return t
                }
                for (; !1 !== (way = y());) {
                    for (C = 1, (w = []).push(+way); way;) {
                        n[way][1] = 0;
                        var O = M(w, way);
                        if (!O) break;
                        way = O
                    }
                    b.push(w)
                }
                return b
            }
            a.sort(function (e, t) {
                return Math.abs(e[0][0]) < Math.abs(t[0][0])
            });
            for (var h = a[0], g = {
                    0: 1
                }, d = 1, v = [], y = a.length, m = 0, b = 0, w = 0; d < y;) {
                b = 0;
                var C = 1;
                for (y = a.length; C < y; ++C) {
                    var M = C % y;
                    if (!(M in g)) {
                        var O = c(h, a[M]);
                        O && 1 == O.length ? (h = O, g[M] = 1, d++, b++) : m = M
                    }
                }
                if (!b) {
                    if (!m) break;
                    v.push(h[0]), h = a[m], g[m] = 1, d++
                }
                if (w++ > 1e3) break
            }
            return h && v.push(h[0]), f(v, e)
        }

        function h(e, t) {
            setTimeout(function () {
                e.apply(this, t)
            }, 0)
        }
        var g = '/api/0.6/relation/',
            d = {};
        return {
            setHost: function (e) {
                g = e
            },
            coordinateDecode: s,
            geometryCombine: f,
            flipCoordinate: a,
            recombine: c,
            geoJSON: function (region, options, callback, errorCallback) {
                            var addr = g + region + "/full";
                            if (!d[addr]) {
                                var _this = this;
                                this.loadData(addr, function (data) {
                                    d[addr] = data;
                                    h(callback, [_this.parseData(data, options), data]);
                                })
                            } else
                                h(callback, [this.parseData(d[addr], options), d[addr]]);
                        },
            loadData: function (e, t, r) {
                var n = new XMLHttpRequest;
                n.open("GET", e, !0), n.onreadystatechange = function () {
                    if (4 === n.readyState)
                        if (200 === n.status || 304 === n.status) try {
                            var e = JSON.parse(n.responseText);
                            t(e)
                        } catch (e) {
                            r(e)
                        } else window.console && console.error("Response recieved with status " + n.status), r(n)
                }, n.setRequestHeader("Content-Type", "application/json"), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.send()
            },
            parseData: function (e, t) {
                return {
                    type: "FeatureCollection",
                    features: e.features
                }
            },
            dropCache: function () {
                d = {}
            },
            _setCoordOrder: function (t) {
                e = "latlong" == t
            },
            toYandex: function (t, r) {
                for (var n, o = new(r = r || ymaps).GeoObjectCollection, i = t.features, s = v(t), u = 0, f = i.length; u < f; ++u) {
                    var l = i[u];
                    l.geometry ? o.add(new r.GeoObject(e ? l : {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            fillRule: (n = l).geometry.coordinates.length > 1 ? "evenOdd" : "nonZero",
                            coordinates: a(n.geometry.coordinates)
                        },
                        properties: n.properties
                    }, {
                        simplificationFixedPoints: l.geometry.fixedPoints
                    })) : window.console && console.log("osme line fail", l)
                }
                return {
                    collection: o,
                    add: function (e) {
                        e.geoObjects.add(o)
                    },
                    remove: function () {
                        o.setParent(null)
                    },
                    setStyles: function (e) {
                        o.each(function (t) {
                            t.options.set(e(s[t.properties.get("osmId")], t))
                        })
                    },
                    addEvent: function (e, t) {
                        o.events.add(e, function (r) {
                            var n = r.get("target");
                            t(s[n.properties.get("osmId")], [e, "yandex"], n, r)
                        })
                    },
                    removeEvent: function (e) {
                        o.events.remove(e)
                    }
                }
            },
            toGoogle: function (e, t) {
                var r = v(e),
                    n = new(t || google.maps).Data;
                return n.addGeoJson(e), {
                    collection: n,
                    add: function (e) {
                        n.setMap(e)
                    },
                    remove: function () {
                        n.setMap(null)
                    },
                    setStyles: function (e) {
                        n.setStyle(function (t) {
                            return function (e) {
                                var t = {};
                                "strokeWidth" in e && (t.strokeWeight = e.strokeWidth);
                                "fillColor" in e && (t.fillColor = e.fillColor);
                                "strokeColor" in e && (t.strokeColor = e.strokeColor);
                                "strokeOpacity" in e && (t.strokeOpacity = Math.max(.001, e.strokeOpacity));
                                "fillOpacity" in e && (t.fillOpacity = Math.max(.001, e.fillOpacity));
                                return t
                            }(e(r[t.getProperty("osmId")], t))
                        })
                    },
                    addEvent: function (e, t) {
                        n.addListener(e, function (n) {
                            var o = n.feature;
                            t(r[o.getProperty("osmId")], [e, "google"], o, n)
                        })
                    },
                    removeEvent: function (e) {
                        n.removeListener(e)
                    }
                }
            }
        };

        function v(e) {
            for (var t = {}, r = e.features, n = 0, o = r.length; n < o; ++n) {
                var a = r[n];
                a && a.properties && (t[a.properties.osmId] = a)
            }
            return t
        }
    }();
    "object" == typeof exports ? module.exports = t : e.osmeRegions = t, "object" == typeof ymaps && ymaps.modules && ymaps.modules.define && (ymaps.modules.define("osmeRegions", ["vow", "system.project"], function (e, r, n) {
        e(ymaps.osmeRegions = {
            load: function (e, o) {
                var a = r.defer();
                return o = o || {}, t.geoJSON(e, {
                    lang: o.lang || n.data.lang.substr(0, 2),
                    quality: "quality" in o ? o.quality : 0
                }, function (e) {
                    a.resolve({
                        geoObjects: t.toYandex(e).collection
                    })
                }, function () {
                    a.reject()
                }), a.promise()
            }
        })
    }), ymaps.modules.require("osmeRegions", function () {}))
}(this);
