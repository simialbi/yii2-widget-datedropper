(function($) {
    var p = {},
        o = null,
        a = null,
        n = null,
        s = null,
        d = null,
        e = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",
        r = "webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",
        l = {
            init: function(r) {
                return $(this).each(function() {
                    r && r.roundtrip && !$(this).attr("data-dd-roundtrip") && $(this).attr("data-dd-roundtrip", r.roundtrip)
                }), $(this).each(function() {
                    if (!$(this).hasClass("picker-trigger")) {
                        var e = $(this),
                            i = "datedropper-" + Object.keys(p).length;
                        e.attr("data-datedropper-id", i).addClass("picker-trigger");
                        var t = {
                            identifier: i,
                            selector: e,
                            jump: 10,
                            maxYear: !1,
                            minYear: !1,
                            format: "m/d/Y",
                            lang: "en",
                            lock: !1,
                            theme: "primary",
                            disabledDays: !1,
                            large: !1,
                            largeDefault: !1,
                            fx: !0,
                            fxMobile: !0,
                            defaultDate: null,
                            modal: !1,
                            hideDay: !1,
                            hideMonth: !1,
                            hideYear: !1,
                            enabledDays: !1,
                            largeOnly: !1,
                            roundtrip: !1,
                            eventListener: e.is("input") ? "focus" : "click",
                            trigger: !1,
                            minDate: !1,
                            maxDate: !1,
                            autofill: !0,
                            autoIncrease: !0,
                            showOnlyEnabledDays: !1,
                            changeValueTo: !1,
                            startFromMonday: !0
                        };
                        p[i] = $.extend(!0, {}, t, r, y(e)), R(p[i])
                    }
                })
            },
            show: function() {
                return $(this).each(function() {
                    H($(this))
                })
            },
            hide: function() {
                return $(this).each(function(e) {
                    var i = S($(this));
                    i && B(i)
                })
            },
            destroy: function(i) {
                return $(this).each(function() {
                    var e = S($(this));
                    e && (o && e.identifier == o.identifier && B(o), $(this).removeAttr("data-datedropper-id").removeClass("picker-trigger").off(e.eventListener), delete e, i && i())
                })
            },
            set: function(e) {
                return $(this).each(function() {
                    var t = S($(this));
                    t && ($.each(e, function(e, i) {
                        "true" == i && (i = !0), "false" == i && (i = !1), "roundtrip" != e ? t[e] = i : console.error("[DATEDROPPER] You can't set roundtrip after main initialization")
                    }), t.selector.off(t.eventListener), t.trigger && $(t.trigger).off("click"), R(t), console.log(t), o && o.element == t.element && V(t))
                })
            },
            setDate: function(e) {
                return $(this).each(function() {
                    var t = S($(this));
                    t && ($.each(e, function(e, i) {
                        "y" == e && t.key[e] && i > t.key[e].max && (t.key[e].max = i), t.key[e].current = i
                    }), o && o.element == t.element && V(t))
                })
            },
            getDate: function(i) {
                return $(this).each(function() {
                    var e = S($(this));
                    e && i && i(J(e))
                })
            }
        },
        k = !1,
        m = function() {
            var e = navigator.userAgent.toLowerCase();
            return -1 != e.indexOf("msie") && parseInt(e.split("msie")[1])
        },
        f = function() {
            return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        },
        b = function(e) {
            e.fx && !e.fxMobile && ($(window).width() < 480 ? e.element.removeClass("picker-fxs") : e.element.addClass("picker-fxs"))
        },
        g = function(e) {
            return e % 1 == 0 && e
        },
        h = function(e) {
            return !!/(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/.test(e) && e
        };
    if (f()) var v = {
        i: "touchstart",
        m: "touchmove",
        e: "touchend"
    };
    else v = {
        i: "mousedown",
        m: "mousemove",
        e: "mouseup"
    };
    var y = function(e) {
            var o = {},
                n = /^data-dd\-(.+)$/;
            return $.each(e.get(0).attributes, function(e, i) {
                if (n.test(i.nodeName)) {
                    var t = (a = i.nodeName.match(n)[1], a.replace(/(?:^\w|[A-Z]|\b\w)/g, function(e, i) {
                            return 0 == i ? e.toLowerCase() : e.toUpperCase()
                        }).replace(/\s+/g, "")).replace(new RegExp("-", "g"), ""),
                        r = !1;
                    switch (i.nodeValue) {
                        case "true":
                            r = !0;
                            break;
                        case "false":
                            r = !1;
                            break;
                        default:
                            r = i.nodeValue
                    }
                    o[t] = r
                }
                var a
            }), o
        },
        w = function(r, e) {
            var i, a = N(r),
                o = !1,
                n = !1,
                p = !1,
                s = !0;
            if (a && $.each(a, function(e, i) {
                var t = P(i.value);
                t.m == x(r, "m") && t.y == x(r, "y") && A(r, ".pick-lg-b li.pick-v[data-value=" + t.d + "]").addClass("pick-sl pick-sl-" + e)
            }), o = A(r, ".pick-lg-b li.pick-sl-a"), n = e || A(r, ".pick-lg-b li.pick-sl-b"), i = {
                a: o.length ? A(r, ".pick-lg-b li").index(o) + 1 : 0,
                b: n.length ? A(r, ".pick-lg-b li").index(n) - 1 : A(r, ".pick-lg-b li").last().index()
            }, a.a.value != a.b.value && e && (s = !1), e ? (t = L(x(r, "m") + "/" + e.attr("data-value") + "/" + x(r, "y")), a.a.value == a.b.value && t > a.a.value && (p = !0)) : (t = L(x(r)), (t >= a.a.value && t <= a.b.value || o.length) && (p = !0)), s && A(r, ".pick-lg-b li").removeClass("pick-dir pick-dir-sl pick-dir-first pick-dir-last"), p)
                for (var d = i.a; d <= i.b; d++) A(r, ".pick-lg-b li").eq(d).addClass("pick-dir");
            o.next(".pick-dir").addClass("pick-dir-first"), n.prev(".pick-dir").addClass("pick-dir-last")
        },
        x = function(e, i) {
            return i ? parseInt(e.key[i].current) : x(e, "m") + "/" + x(e, "d") + "/" + x(e, "y")
        },
        D = function(e, i) {
            return i ? parseInt(e.key[i].today) : D(e, "m") + "/" + D(e, "d") + "/" + D(e, "y")
        },
        z = function(e, i, t) {
            var r = e.key[i];
            return t > r.max ? z(e, i, t - r.max + (r.min - 1)) : t < r.min ? z(e, i, t + 1 + (r.max - r.min)) : t
        },
        T = function(e) {
            return !!e && {
                selector: e.selector,
                date: J(e)
            }
        },
        C = function(e, i) {
            return A(e, 'ul.pick[data-k="' + i + '"]')
        },
        M = function(e, i, t) {
            ul = C(e, i);
            var r = [];
            return ul.find("li").each(function() {
                r.push($(this).attr("value"))
            }), "last" == t ? r[r.length - 1] : r[0]
        },
        j = function(e, i) {
            var t = !1;
            for (var r in "Y" != e.format && "m" != e.format || (e.hideDay = !0, "Y" == e.format && (e.hideMonth = !0), "m" == e.format && (e.hideYear = !0), t = !0), (e.hideDay || e.hideMonth || e.hideYear) && (t = !0), e.largeOnly && (e.large = !0, e.largeDefault = !0), (e.hideMonth || e.hideDay || e.hideYear || e.showOnlyEnabledDays) && (e.largeOnly = !1, e.large = !1, e.largeDefault = !1), e.element = $("<div>", {
                class: "datedropper " + (t ? "picker-clean" : "") + " " + (e.modal ? "picker-modal" : "") + " " + e.theme + " " + (e.fx ? "picker-fxs" : "") + " " + (e.large && e.largeDefault ? "picker-lg" : ""),
                id: e.identifier,
                html: $("<div>", {
                    class: "picker"
                })
            }).appendTo("body"), e.key) {
                var a = !0;
                "y" == r && e.hideYear && (a = !1), "d" == r && e.hideDay && (a = !1), "m" == r && e.hideMonth && (a = !1), a && ($("<ul>", {
                    class: "pick pick-" + r,
                    "data-k": r,
                    tabindex: 0
                }).appendTo(A(e, ".picker")), K(e, r))
            }
            e.large && $("<div>", {
                class: "pick-lg"
            }).insertBefore(A(e, ".pick-d")), $("<div>", {
                class: "pick-btns"
            }).appendTo(A(e, ".picker")), $("<div>", {
                tabindex: 0,
                class: "pick-submit",
                html: $($.dateDropperSetup.icons.checkmark)
            }).appendTo(A(e, ".pick-btns")), e.large && !e.largeOnly && $("<div>", {
                class: "pick-btn pick-btn-sz",
                html: $($.dateDropperSetup.icons.expand)
            }).appendTo(A(e, ".pick-btns")), setTimeout(function() {
                e.element.addClass("picker-focused"), f() || setTimeout(function() {
                    A(e, ".pick:first-of-type").focus()
                }, 100), e.element.hasClass("picker-modal") && (e.overlay = $('<div class="picker-overlay"></div>').appendTo("body")), b(e), I(e), W(e), o = e, i && i()
            }, 100)
        },
        S = function(e) {
            var i = e.attr("data-datedropper-id");
            return p[i] || !1
        },
        A = function(e, i) {
            if (e.element) return e.element.find(i)
        },
        Y = function(e) {
            if ("string" == typeof e) {
                if (h(e)) {
                    var t = e.match(/\d+/g);
                    return $.each(t, function(e, i) {
                        t[e] = parseInt(i)
                    }), {
                        m: t[0] && t[0] <= 12 ? t[0] : picker.key.m.today,
                        d: t[1] && t[1] <= 31 ? t[1] : picker.key.d.today,
                        y: t[2] || picker.key.y.today
                    }
                }
                return !1
            }
            return !1
        },
        F = "div.datedropper.picker-focused",
        J = function(e, i) {
            i || (i = {
                d: x(e, "d"),
                m: x(e, "m"),
                y: x(e, "y")
            });
            var t = i.d,
                r = i.m,
                a = i.y,
                o = new Date(r + "/" + t + "/" + a).getDay(),
                n = {
                    F: $.dateDropperSetup.languages[e.lang].months.full[r - 1],
                    M: $.dateDropperSetup.languages[e.lang].months.short[r - 1],
                    D: $.dateDropperSetup.languages[e.lang].weekdays.full[o].substr(0, 3),
                    l: $.dateDropperSetup.languages[e.lang].weekdays.full[o],
                    d: O(t),
                    m: O(r),
                    S: E(t),
                    Y: a,
                    U: L(x(e)),
                    n: r,
                    j: t
                },
                p = e.format.replace(/\b(F)\b/g, n.F).replace(/\b(M)\b/g, n.M).replace(/\b(D)\b/g, n.D).replace(/\b(l)\b/g, n.l).replace(/\b(d)\b/g, n.d).replace(/\b(m)\b/g, n.m).replace(/\b(S)\b/g, n.S).replace(/\b(Y)\b/g, n.Y).replace(/\b(U)\b/g, n.U).replace(/\b(n)\b/g, n.n).replace(/\b(j)\b/g, n.j);
            return n.formatted = p, n
        },
        O = function(e) {
            return e < 10 ? "0" + e : e
        },
        E = function(e) {
            var i = ["th", "st", "nd", "rd"],
                t = e % 100;
            return e + (i[(t - 20) % 10] || i[t] || i[0])
        },
        L = function(e) {
            return Date.parse(e) / 1e3
        },
        P = function(e) {
            var i = new Date(1e3 * e);
            return {
                m: i.getMonth() + 1,
                y: i.getFullYear(),
                d: i.getDate()
            }
        },
        N = function(e) {
            var r = '[data-dd-roundtrip="' + e.roundtrip + '"]',
                a = !1;
            if ($(r).length) {
                a = {};
                $.each(["a", "b"], function(e, i) {
                    var t = $(r + "[data-dd-roundtrip-" + i + "]");
                    a[i] = {
                        value: t.length && t.attr("data-dd-roundtrip-" + i) || !1,
                        selector: !!t.length && t
                    }
                })
            }
            return a
        },
        X = function(e) {
            e.large && (e.element.addClass("picker-transit").toggleClass("picker-lg"), e.element.hasClass("picker-lg") && q(e), setTimeout(function() {
                e.element.removeClass("picker-transit")
            }, 800))
        },
        I = function(e) {
            if (!e.element.hasClass("picker-modal")) {
                var i = e.selector,
                    t = i.offset().left + i.outerWidth() / 2,
                    r = i.offset().top + i.outerHeight();
                e.element.css({
                    left: t,
                    top: r
                })
            }
        },
        R = function(a) {
            if (a.jump = g(a.jump) || 10, a.maxYear = g(a.maxYear), a.minYear = g(a.minYear), a.lang in $.dateDropperSetup.languages || (a.lang = "en"), a.key = {
                m: {
                    min: 1,
                    max: 12,
                    current: (new Date).getMonth() + 1,
                    today: (new Date).getMonth() + 1
                },
                d: {
                    min: 1,
                    max: 31,
                    current: (new Date).getDate(),
                    today: (new Date).getDate()
                },
                y: {
                    min: a.minYear || (new Date).getFullYear() - 50,
                    max: a.maxYear || (new Date).getFullYear() + 50,
                    current: (new Date).getFullYear(),
                    today: (new Date).getFullYear()
                }
            }, a.key.y.current > a.key.y.max && (a.key.y.current = a.key.y.max), a.key.y.current < a.key.y.min && (a.key.y.current = a.key.y.min), a.minDate) {
                var e = !!a.defaultDate && L(a.defaultDate),
                    i = !!a.minDate && L(a.minDate);
                e ? e < i && (a.defaultDate = a.minDate) : a.defaultDate = a.minDate, Q(a, P(L(a.defaultDate)))
            }
            if (a.disabledDays = a.disabledDays ? a.disabledDays.split(",") : null, a.enabledDays = a.enabledDays ? a.enabledDays.split(",") : null, a.disabledDays && $.each(a.disabledDays, function(e, i) {
                i && h(i) && (a.disabledDays[e] = L(i))
            }), a.enabledDays && $.each(a.enabledDays, function(e, i) {
                i && h(i) && (a.enabledDays[e] = L(i))
            }), a.showOnlyEnabledDays && a.enabledDays) {
                var t = (e = !!a.defaultDate && L(a.defaultDate)) && a.enabledDays.includes(e) ? P(e) : P(a.enabledDays[0]);
                $.each(t, function(e, i) {
                    a.key[e].current = i
                })
            } else a.showOnlyEnabledDays = !1;
            if (a.roundtrip) {
                var o = L(x(a)),
                    r = $('[data-dd-roundtrip="' + a.roundtrip + '"]');
                1 < r.length ? r.each(function() {
                    var e = 0 == r.index($(this)) ? "a" : "b",
                        i = $(this).attr("data-dd-roundtrip-default-" + e),
                        t = i ? L(i) : o;
                    t && $(this).attr("data-dd-roundtrip-" + e, t)
                }) : $.each(["a", "b"], function(e, i) {
                    var t = a.selector.attr("data-dd-roundtrip-default-" + i),
                        r = t ? L(t) : o;
                    r && a.selector.attr("data-dd-roundtrip-" + i, r)
                });
                var n = N(a),
                    p = P(n.a.value);
                console.log(a.defaultDate), a.defaultDate = p.m + "/" + p.d + "/" + p.y, a.largeOnly = !0
            }
            if (a.selector.on(a.eventListener, function(e) {
                e.preventDefault(), $(this).blur(), H($(this))
            }), a.trigger && $(a.trigger).on("click", function(e) {
                a.selector.trigger(a.eventListener)
            }), a.onReady && a.onReady(T(a)), a.defaultDate) {
                var s = Y(a.defaultDate);
                s && ($.each(s, function(e, i) {
                    a.key[e] && (a.key[e].current = i)
                }), a.key.y.current > a.key.y.max && (a.key.y.max = a.key.y.current), a.key.y.current < a.key.y.min && (a.key.y.min = a.key.y.current))
            }
        },
        V = function(e, i) {
            e.element && (e.element.remove(), e.overlay && e.overlay.remove(), j(e))
        },
        H = function(e, i) {
            o && B(o);
            var t = S(e);
            t && j(t)
        },
        B = function(e) {
            var i = {
                element: e.element,
                overlay: e.overlay
            };
            i.element && (i.element.removeClass("picker-focused"), setTimeout(function() {
                i.element.remove(), i.overlay && i.overlay.addClass("picker-overlay-hidden")
            }, 400)), o = null
        },
        G = function(e) {
            if (e) {
                var i, t, r = !1;
                return i = L(x(e)), t = L(D(e)), e.lock && ("from" == e.lock && (r = i < t), "to" == e.lock && (r = t < i)), (e.minDate || e.maxDate) && (i = L(x(e)), t = e.minDate ? L(e.minDate) : null, c = e.maxDate ? L(e.maxDate) : null, t && c ? r = i < t || i > c : t ? r = i < t : c && (r = i > c)), e.disabledDays && !e.enabledDays && (r = -1 != e.disabledDays.indexOf(i)), e.enabledDays && !e.disabledDays && (r = -1 == e.enabledDays.indexOf(i)), r ? (Z(e), e.element.addClass("picker-locked"), !0) : (e.element.removeClass("picker-locked"), !1)
            }
        },
        K = function(e, t) {
            var r = C(e, t),
                a = e.key[t];
            for (r.empty(), i = a.min; i <= a.max; i++) {
                var o = i;
                "m" == t && (o = $.dateDropperSetup.languages[e.lang].months.short[i - 1]), o += "d" == t ? "<span></span>" : "", $("<li>", {
                    value: i,
                    html: "<div>" + o + "</div>"
                }).appendTo(r)
            }
            $.each(["l", "r"], function(e, i) {
                $("<div>", {
                    class: "pick-arw pick-arw-s1 pick-arw-" + i,
                    html: $("<div>", {
                        class: "pick-i-" + i,
                        html: $($.dateDropperSetup.icons.arrow[i])
                    })
                }).appendTo(r)
            }), "y" == t && $.each(["l", "r"], function(e, i) {
                $("<div>", {
                    class: "pick-arw pick-arw-s2 pick-arw-" + i,
                    html: $("<div>", {
                        class: "pick-i-" + i,
                        html: $($.dateDropperSetup.icons.arrow[i])
                    })
                }).appendTo(r)
            }), U(e, t, x(e, t))
        },
        q = function(r) {
            A(r, ".pick-lg").empty().append('<ul class="pick-lg-h"></ul><ul class="pick-lg-b"></ul>');
            for (var e = r.startFromMonday ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6], i = 0; i < 7; i++) $("<li>", {
                html: "<div>" + $.dateDropperSetup.languages[r.lang].weekdays.short[e[i]] + "</div>"
            }).appendTo(A(r, ".pick-lg .pick-lg-h"));
            for (i = 0; i < 42; i++) $("<li>", {
                html: $("<div>")
            }).appendTo(A(r, ".pick-lg .pick-lg-b"));
            var t = 0,
                a = A(r, ".pick-lg-b"),
                o = (new Date(x(r)), new Date(x(r))),
                n = new Date(x(r)),
                p = function(e) {
                    var i = e.getMonth(),
                        t = e.getFullYear();
                    return [31, t % 4 == 0 && (t % 100 != 0 || t % 400 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]
                };
            n.setMonth(n.getMonth() - 1), o.setDate(1);
            var s = o.getDay() - 1;
            s < 0 && (s = 6), r.startFromMonday && --s < 0 && (s = 6);
            for (i = p(n) - s; i <= p(n); i++) a.find("li").eq(t).addClass("pick-b pick-n pick-h").attr("data-value", i), t++;
            for (i = 1; i <= p(o); i++) a.find("li").eq(t).addClass("pick-n pick-v").attr("data-value", i), t++;
            if (a.find("li.pick-n").length < 42) {
                var d = 42 - a.find("li.pick-n").length;
                for (i = 1; i <= d; i++) a.find("li").eq(t).addClass("pick-a pick-n pick-h").attr("data-value", i), t++
            }
            if (r.lock && ("from" === r.lock ? x(r, "y") <= D(r, "y") && (x(r, "m") == D(r, "m") ? A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + D(r, "d") + '"]').prevAll("li").addClass("pick-lk") : x(r, "m") < D(r, "m") ? A(r, ".pick-lg .pick-lg-b li").addClass("pick-lk") : x(r, "m") > D(r, "m") && x(r, "y") < D(r, "y") && A(r, ".pick-lg .pick-lg-b li").addClass("pick-lk")) : x(r, "y") >= D(r, "y") && (x(r, "m") == D(r, "m") ? A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + D(r, "d") + '"]').nextAll("li").addClass("pick-lk") : x(r, "m") > D(r, "m") ? A(r, ".pick-lg .pick-lg-b li").addClass("pick-lk") : x(r, "m") < D(r, "m") && x(r, "y") > D(r, "y") && A(r, ".pick-lg .pick-lg-b li").addClass("pick-lk"))), r.maxDate) {
                var l = Y(r.maxDate);
                if (l)
                    if (x(r, "y") == l.y && x(r, "m") == l.m) A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + l.d + '"]').nextAll("li").addClass("pick-lk");
                    else L(r.maxDate) < L(x(r)) && A(r, ".pick-lg .pick-lg-b li.pick-v").addClass("pick-lk")
            }
            if (r.minDate) {
                var c = Y(r.minDate);
                if (c)
                    if (x(r, "y") == c.y && x(r, "m") == c.m) A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + c.d + '"]').prevAll("li").addClass("pick-lk");
                    else {
                        var k = L(r.minDate);
                        L(x(r)) < k && A(r, ".pick-lg .pick-lg-b li.pick-v").addClass("pick-lk")
                    }
            }
            r.disabledDays && !r.enabledDays && $.each(r.disabledDays, function(e, i) {
                if (i) {
                    var t = P(i);
                    t.m == x(r, "m") && t.y == x(r, "y") && A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + t.d + '"]').addClass("pick-lk")
                }
            }), r.enabledDays && !r.disabledDays && (A(r, ".pick-lg .pick-lg-b li").addClass("pick-lk"), $.each(r.enabledDays, function(e, i) {
                if (i) {
                    var t = P(i);
                    t.m == x(r, "m") && t.y == x(r, "y") && A(r, '.pick-lg .pick-lg-b li.pick-v[data-value="' + t.d + '"]').removeClass("pick-lk")
                }
            })), r.roundtrip ? w(r) : A(r, ".pick-lg-b li.pick-v[data-value=" + x(r, "d") + "]").addClass("pick-sl")
        },
        Q = function(t, e) {
            $.each(e, function(e, i) {
                t.key[e].current = i
            })
        },
        W = function(e, i) {
            var t, r, a, o;
            e.element.hasClass("picker-lg") && q(e), r = x(t = e, "m"), a = x(t, "y"), o = a % 4 == 0 && (a % 100 != 0 || a % 400 == 0), t.key.d.max = [31, o ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][r - 1], x(t, "d") > t.key.d.max && (t.key.d.current = t.key.d.max, U(t, "d", x(t, "d"))), A(t, ".pick-d li").removeClass("pick-wke").each(function() {
                var e = new Date(r + "/" + $(this).attr("value") + "/" + a).getDay();
                $(this).find("span").html($.dateDropperSetup.languages[t.lang].weekdays.full[e]), 0 != e && 6 != e || $(this).addClass("pick-wke")
            }), t.element.hasClass("picker-lg") && (A(t, ".pick-lg-b li").removeClass("pick-wke"), A(t, ".pick-lg-b li.pick-v").each(function() {
                var e = new Date(r + "/" + $(this).attr("data-value") + "/" + a).getDay();
                0 != e && 6 != e || $(this).addClass("pick-wke")
            })), G(e) || (! function(e) {
                clearInterval(s);
                var i = e.minYear || e.key.y.current - 50,
                    t = e.maxYear || e.key.y.current + 50;
                e.key.y.max = t, e.key.y.min = i, s = setTimeout(function() {
                    K(e, "y")
                }, 400)
            }(e), ee(e), i && i(e))
        },
        U = function(e, i, t) {
            var r, a = C(e, i);
            (a.find("li").removeClass("pick-sl pick-bfr pick-afr"), t == M(e, i, "last")) && ((r = a.find('li[value="' + M(e, i, "first") + '"]')).clone().insertAfter(a.find("li[value=" + t + "]")), r.remove());
            t == M(e, i, "first") && ((r = a.find('li[value="' + M(e, i, "last") + '"]')).clone().insertBefore(a.find("li[value=" + t + "]")), r.remove());
            a.find("li[value=" + t + "]").addClass("pick-sl"), a.find("li.pick-sl").nextAll("li").addClass("pick-afr"), a.find("li.pick-sl").prevAll("li").addClass("pick-bfr")
        },
        _ = function(e, i, t) {
            var r = e.key[i];
            t > r.max && ("d" == i && e.autoIncrease && $(e, "m", "right"), "m" == i && e.autoIncrease && $(e, "y", "right"), t = r.min), t < r.min && ("d" == i && e.autoIncrease && $(e, "m", "left"), "m" == i && e.autoIncrease && $(e, "y", "left"), t = r.max), e.key[i].current = t, U(e, i, t)
        },
        $ = function(e, i, t) {
            if (e.showOnlyEnabledDays && e.enabledDays) ! function(t, e) {
                for (var i = L(x(t)), r = t.enabledDays, a = (r.length, null), o = 0; o < r.length; o++) r[o] === i && (a = o);
                "right" == e ? a++ : a--;
                var n = !!r[a] && P(r[a]);
                n && $.each(n, function(e, i) {
                    t.key[e].current = i, _(t, e, i)
                })
            }(e, t);
            else {
                var r = x(e, i);
                "right" == t ? r++ : r--, _(e, i, r)
            }
        },
        Z = function(e) {
            e.element.find(".picker").addClass("picker-rumble")
        },
        ee = function(o, e) {
            var i = !0;
            if (o.roundtrip) {
                i = !1;
                var t = N(o);
                if (t) {
                    if (1 < $('.picker-trigger[data-dd-roundtrip="' + o.selector.data("dd-roundtrip") + '"]').length) $.each(t, function(e, i) {
                        var t = i.selector.attr("data-datedropper-id"),
                            r = P(i.value),
                            a = J(o, r);
                        o.identifier != t && p[t] && (p[t].key.m.current = r.m, p[t].key.d.current = r.d, p[t].key.y.current = r.y), i.selector.is("input") && i.selector.val(a.formatted).change()
                    });
                    else {
                        var r = J(o, P(t.a.value)),
                            a = J(o, P(t.b.value));
                        o.selector.val(r.formatted + " - " + a.formatted)
                    }
                    t.a.value != t.b.value && o.onRoundTripChange && o.onRoundTripChange({
                        outward: P(t.a.value),
                        return: P(t.b.value)
                    }), o.onChange && o.onChange(T(o))
                }
            } else i = !!e || o.autofill;
            if (i) {
                var n = J(o);
                o.selector.is("input") && o.selector.val(n.formatted).change(), o.changeValueTo && ie(o, n.formatted), o.onChange && o.onChange(T(o))
            }
        },
        ie = function(e, i) {
            var t = $(e.changeValueTo);
            t.length && t.is("input") && t.val(i).change()
        };
    $(document).on("keydown", function(e) {
        var i = e.which;
        if (o && !f())
            if (32 == i) A(o, ":focus").click(), e.preventDefault();
            else if (9 == i && e.shiftKey) $(e.target).is(".pick-m") && (e.preventDefault(), $(".datedropper .pick-submit").focus());
            else if (9 == i) $(e.target).is(".pick-submit") && (e.preventDefault(), $(".datedropper .pick-m").focus());
            else if (27 == i) B(o);
            else if (13 == i) A(o, ".pick-submit").trigger(v.i);
            else if (37 == i || 39 == i) {
                var t = A(o, ".pick:focus");
                if (t.length && (37 == i || 39 == i)) {
                    if (37 == i) var r = "left";
                    if (39 == i) r = "right";
                    var a = t.attr("data-k");
                    $(o, a, r), W(o)
                }
            }
    }).on("focus", ".pick-d", function() {
        if (o) {
            var e = o.element.find(".pick-lg");
            e.length && !e.hasClass("pick-lg-focused") && e.addClass("pick-lg-focused")
        }
    }).on("blur", ".pick-d", function() {
        if (o) {
            var e = o.element.find(".pick-lg");
            e.length && e.hasClass("pick-lg-focused") && e.removeClass("pick-lg-focused")
        }
    }).on("click", function(e) {
        o && (o.selector.is(e.target) || o.element.is(e.target) || 0 !== o.element.has(e.target).length || (B(o), a = null))
    }).on(r, F + " .picker-rumble", function() {
        $(this).removeClass("picker-rumble")
    }).on(e, ".picker-overlay", function() {
        $(this).remove()
    }).on(v.i, F + " .pick-lg li.pick-v", function() {
        if (o) {
            if (A(o, ".pick-lg-b li").removeClass("pick-sl"), $(this).addClass("pick-sl"), o.key.d.current = $(this).attr("data-value"), U(o, "d", $(this).attr("data-value")), o.roundtrip) {
                var i = N(o),
                    t = L(x(o));
                if (i) {
                    var r = i.a.value == i.b.value ? "b" : "a";
                    "b" == r && t <= i.a.value && (r = "a"), "a" == r ? $.each(i, function(e) {
                        i[e].selector.attr("data-dd-roundtrip-" + e, t).attr("data-dd-roundtrip-selector", r)
                    }) : i[r].selector.attr("data-dd-roundtrip-" + r, t).attr("data-dd-roundtrip-selector", r), r = "b" == r ? "a" : "b"
                }
            }
            W(o)
        }
    }).on("mouseleave", F + " .pick-lg .pick-lg-b li", function() {
        o && o.roundtrip && w(o)
    }).on("mouseenter", F + " .pick-lg .pick-lg-b li", function() {
        o && o.roundtrip && w(o, $(this))
    }).on("click", F + " .pick-btn-sz", function() {
        o && X(o)
    }).on(v.i, F + " .pick-arw.pick-arw-s2", function(e) {
        if (o) {
            var i;
            e.preventDefault(), a = null;
            $(this).closest("ul").data("k");
            var t = o.jump;
            i = $(this).hasClass("pick-arw-r") ? x(o, "y") + t : x(o, "y") - t;
            var r = function(e, i, t) {
                for (var r = [], a = e.key[i], o = a.min; o <= a.max; o++) o % t == 0 && r.push(o);
                return r
            }(o, "y", t);
            i > r[r.length - 1] && (i = r[0]), i < r[0] && (i = r[r.length - 1]), o.key.y.current = i, U(o, "y", x(o, "y"))
        }
    }).on(v.i, F, function(e) {
        o && A(o, "*:focus").blur()
    }).on(v.i, F + " .pick-arw.pick-arw-s1", function(e) {
        if (o) {
            e.preventDefault(), a = null;
            var i = $(this).closest("ul").data("k"),
                t = $(this).hasClass("pick-arw-r") ? "right" : "left";
            $(o, i, t)
        }
    }).on(v.i, F + " ul.pick.pick-y li", function() {
        k = !0
    }).on(v.e, F + " ul.pick.pick-y li", function() {
        var e;
        o && (!k || (e = o).jump >= e.key.y.max - e.key.y.min || (! function(t) {
            var e = A(t, ".picker-jumped-years");
            e.length && e.remove();
            var r = $("<div>", {
                class: "picker-jumped-years"
            }).appendTo(A(t, ".picker"));
            setTimeout(function() {
                r.addClass("picker-jumper-years-visible")
            }, 100);
            for (var i = t.key.y.min; i <= t.key.y.max; i++) i % t.jump == 0 && $("<div>", {
                "data-id": i
            }).click(function(e) {
                var i = $(this).data("id");
                _(t, "y", i), W(t), r.removeClass("picker-jumper-years-visible"), setTimeout(function() {
                    r.remove()
                }, 300)
            }).appendTo(r)
        }(o), k = !1))
    }).on(v.i, F + " ul.pick.pick-d li", function() {
        o && (k = !0)
    }).on(v.e, F + " ul.pick.pick-d li", function() {
        o && k && (X(o), k = !1)
    }).on(v.i, F + " ul.pick", function(e) {
        if (o && (a = $(this))) {
            var i = a.data("k");
            n = f() ? e.originalEvent.touches[0].pageY : e.pageY, d = x(o, i)
        }
    }).on(v.m, function(e) {
        if (o && (k = !1, a)) {
            e.preventDefault();
            var i = a.data("k"),
                t = f() ? e.originalEvent.touches[0].pageY : e.pageY;
            t = n - t, t = Math.round(.026 * t);
            var r = z(o, i, d + t);
            r != o.key[i].current && _(o, i, r), o.onPickerDragging && o.onPickerDragging({
                key: i,
                value: r
            })
        }
    }).on(v.e, function(e) {
        a && (d = n = a = null, o && (W(o), o.onPickerRelease && o.onPickerRelease(J(o))))
    }).on(v.i, F + " .pick-submit", function() {
        o && (G(o) || (ee(o, !0), B(o)))
    }), $(window).resize(function() {
        o && (I(o), b(o))
    }), document.addEventListener("touchmove", function(e) {
        var i = $(e.target).closest(".picker-jumped-years").length;
        o && !i ? ($("html,body").css("touch-action", "none"), e.preventDefault()) : $("html,body").css("touch-action", "unset")
    }, {
        passive: !1
    }), $.fn.dateDropper = function(e) {
        if (m() && m() < 10) console.error("[DATEDROPPER] This browser is not supported");
        else {
            if ("object" == typeof e || !e) return l.init.apply(this, arguments);
            if ("string" == typeof e && l[e]) return l[e].apply(this, Array.prototype.slice.call(arguments, 1));
            console.error("[DATEDROPPER] This method not exist")
        }
    }, $("head").append("<style>" + $.dateDropperSetup.inlineCSS + "</style>"), $(document).ready(function() {
        $.dateDropperSetup.autoInit && $(".datedropper-init,[data-datedropper]").each(function() {
            $(this).dateDropper()
        })
    })
})(jQuery);