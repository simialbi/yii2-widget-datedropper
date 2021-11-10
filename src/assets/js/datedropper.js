(function (jQuery) {
    var pickers = {}, picker = null, pickerCtrl = null, pickDragged = null, pickDragOffset = null, pickDragTemp = null,
        transitionEvents = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
        animationEvents = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend';
    var DateDropper = {
        init: function (options) {
            jQuery(this).each(function () {
                options && options.roundtrip && !jQuery(this).attr('data-dd-roundtrip') && jQuery(this).attr('data-dd-roundtrip', options.roundtrip);
            });
            return jQuery(this).each(function () {
                if (!jQuery(this).hasClass('picker-trigger')) {
                    var $this = jQuery(this),
                        id = $this.prop('id') ? $this.prop('id') : 'datedropper-' + Object.keys(pickers).length;
                    $this.attr('data-datedropper-id', id).addClass('picker-trigger');
                    var defaults = {
                        identifier: id,
                        selector: $this,
                        jump: 10,
                        maxYear: false,
                        minYear: false,
                        format: 'm/d/Y',
                        lang: 'en',
                        lock: false,
                        theme: 'primary',
                        disabledDays: false,
                        large: false,
                        largeDefault: false,
                        fx: true,
                        fxMobile: true,
                        defaultDate: null,
                        modal: false,
                        hideDay: false,
                        hideMonth: false,
                        hideYear: false,
                        enabledDays: false,
                        largeOnly: false,
                        roundtrip: false,
                        eventListener: $this.is('input') ? 'focus' : 'click',
                        trigger: false,
                        minDate: false,
                        maxDate: false,
                        autofill: true,
                        autoIncrease: true,
                        showOnlyEnabledDays: false,
                        changeValueTo: false,
                        startFromMonday: true
                    };
                    pickers[id] = jQuery.extend({}, defaults, options, getDataOptions($this));
                    initPicker(pickers[id]);
                }
            });
        },
        show: function () {
            return jQuery(this).each(function () {
                showPicker(jQuery(this));
            });
        },
        hide: function () {
            return jQuery(this).each(function (e) {
                var i = getPicker(jQuery(this));
                i && hidePicker(i);
            });
        },
        destroy: function (callback) {
            return jQuery(this).each(function () {
                var options = getPicker(jQuery(this));
                if (options) {
                    if (picker && options.identifier === picker.identifier) {
                        hidePicker(picker);
                    }
                    jQuery(this).removeAttr('data-datedropper-id').removeClass('picker-trigger').off(options.eventListener);
                    options = undefined;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },
        set: function (val) {
            return jQuery(this).each(function () {
                var pick = getPicker(jQuery(this));
                if (pick) {
                    jQuery.each(val, function (index, value) {
                        if (value === 'true') {
                            value = true;
                        } else if (i === 'false') {
                            value = false;
                        }
                        if (index !== 'roundtrip') {
                            pick[index] = value;
                        } else {
                            console.error('[DATEDROPPER] You can\'t set roundtrip after main initialization');
                        }
                    });
                    pick.selector.off(pick.eventListener);
                    if (pick.trigger) {
                        jQuery(pick.trigger).off('click');
                    }
                    initPicker(pick);
                    if (picker && picker.element === pick.element) {
                        removePicker(pick);
                    }
                }
            });
        },
        setDate: function (e) {
            return jQuery(this).each(function () {
                var pick = getPicker(jQuery(this));
                if (pick) {
                    jQuery.each(e, function (index, value) {
                        if (index === 'y' && pick.key[index] && value > pick.key[index].max) {
                            pick.key[index].max = value;
                        }
                        pick.key[index].current = value;
                    });
                    if (picker && picker.element === pick.element) {
                        removePicker(pick);
                    }
                }
            });
        },
        getDate: function (callback) {
            var dates = [];
            jQuery(this).each(function () {
                var pick = getPicker(jQuery(this));
                if (pick) {
                    var dateObject = getDateObject(pick);
                    if (callback) {
                        callback(dateObject);
                    }
                    dates.push(dateObject);
                }
            });
            return (dates.length === 1) ? dates[0] : dates;
        }
    }, isClick = false, isIE = function () {
        var e = navigator.userAgent.toLowerCase();
        return -1 !== e.indexOf('msie') && parseInt(e.split('msie')[1]);
    }, isTouch = function () {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, isFxMobile = function (e) {
        e.fx && !e.fxMobile && (jQuery(window).width() < 480 ? e.element.removeClass('picker-fxs') : e.element.addClass('picker-fxs'));
    }, isInt = function (e) {
        return e % 1 === 0 && e;
    }, isDate = function (e) {
        return !!/(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/.test(e) && e;
    };
    var uiEvent;
    if (isTouch()) {
        uiEvent = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        };
    } else {
        uiEvent = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };
    }
    var getDataOptions = function ($el) {
        var options = {}, regExp = /^data-dd-(.+)$/;
        jQuery.each($el.get(0).attributes, function (e, i) {
            if (regExp.test(i.nodeName)) {
                var t = (a = i.nodeName.match(regExp)[1], a.replace(/(?:^\w|[A-Z]|\b\w)/g, function (e, i) {
                    return 0 == i ? e.toLowerCase() : e.toUpperCase();
                }).replace(/\s+/g, '')).replace(new RegExp('-', 'g'), ''), r = !1;
                switch (i.nodeValue) {
                    case 'true':
                        r = true;
                        break;
                    case 'false':
                        r = false;
                        break;
                    default:
                        r = i.nodeValue;
                }
                options[t] = r;
            }
            var a;
        });
        return options;
    }, updateRoundTrip = function (options, element) {
        var roundtripData, roundtrip = getRoundtrip(options), roundtripStart = false, roundtripEnd = false,
            hasDatesBetween = false, s = true;
        if (roundtrip) {
            jQuery.each(roundtrip, function (index, value) {
                var current = getDate(value.value);
                if (current.m === getCurrent(options, 'm') && current.y === getCurrent(options, 'y')) {
                    getPickerEls(options, '.pick-lg-b li.pick-v[data-value=' + current.d + ']').addClass('pick-sl pick-sl-' + index);
                }
            });
            roundtripStart = getPickerEls(options, '.pick-lg-b li.pick-sl-a');
            roundtripEnd = (element) ? element : getPickerEls(options, '.pick-lg-b li.pick-sl-b');
            roundtripData = {
                a: roundtripStart.length ? getPickerEls(options, '.pick-lg-b li').index(roundtripStart) + 1 : 0,
                b: roundtripEnd.length ? getPickerEls(options, '.pick-lg-b li').index(roundtripEnd) - 1 : getPickerEls(options, '.pick-lg-b li').last().index()
            };
            if (roundtrip.a.value !== roundtrip.b.value && element) {
                s = false;
            }
            var unixDate;
            if (element) {
                unixDate = getUnix(getCurrent(options, 'm') + '/' + element.attr('data-value') + '/' + getCurrent(options, 'y'));
                if (roundtrip.a.value === roundtrip.b.value && unixDate > roundtrip.a.value) {
                    hasDatesBetween = true;
                }
            } else {
                unixDate = getUnix(getCurrent(options));
                if ((unixDate >= roundtrip.a.value && unixDate <= roundtrip.b.value) || roundtripStart.length) {
                    hasDatesBetween = true;
                }
            }
            if (s) {
                getPickerEls(options, '.pick-lg-b li').removeClass('pick-dir pick-dir-sl pick-dir-first pick-dir-last');
            }
            if (hasDatesBetween) {
                for (var index = roundtripData.a; index <= roundtripData.b; index++) {
                    getPickerEls(options, '.pick-lg-b li').eq(index).addClass('pick-dir');
                }
            }
        }
        roundtripStart.next('.pick-dir').addClass('pick-dir-first');
        roundtripEnd.prev('.pick-dir').addClass('pick-dir-last');
    }, getCurrent = function (date, part) {
        return part ? parseInt(date.key[part].current) : getCurrent(date, 'm') + '/' + getCurrent(date, 'd') + '/' + getCurrent(date, 'y');
    }, getToday = function (date, part) {
        return part ? parseInt(date.key[part].today) : getToday(date, 'm') + '/' + getToday(date, 'd') + '/' + getToday(date, 'y');
    }, getClear = function (options, key, t) {
        var keyValues = options.key[key];
        return t > keyValues.max ? getClear(options, key, t - keyValues.max + (keyValues.min - 1)) : t < keyValues.min ? getClear(options, key, t + 1 + (keyValues.max - keyValues.min)) : t;
    }, parseDate = function (format, value, options) {
        if (format == null || value == null) {
            throw 'Invalid arguments';
        }

        value = (typeof value === 'object' ? value.toString() : value + '');
        if (value === '') {
            return null;
        }

        var iFormat, extra, iValue = 0,
            shortYearCutoffTemp = '+10',
            shortYearCutoff = new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10),
            dayNamesShort = window.dateDropperSetup.languages[options.lang].weekdays.short,
            dayNames = window.dateDropperSetup.languages[options.lang].weekdays.full,
            monthNamesShort = window.dateDropperSetup.languages[options.lang].months.short,
            monthNames = window.dateDropperSetup.languages[options.lang].months.full, year = -1, month = -1,
            day = -1, /* doy = -1, */ literal = false, date,

            // Check whether a format character is doubled
            lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },

            // Extract a number from the string value
            getNumber = function (match) {
                var /* isDoubled = lookAhead(match), */
                    size = (match === 'U' ? 14 : (match === '!' ? 20 : (match === 'y' ? 4 : (match === 'o' ? 3 : 2)))),
                    minSize = (match === 'y' ? size : 1), digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
                    num = value.substring(iValue).match(digits);
                if (!num) {
                    throw 'Missing number at position ' + iValue;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },

            // Extract a name from the string value and convert to an index
            getName = function (match, shortNames, longNames) {
                var index = -1, names = jQuery.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                    return [[k, v]];
                }).sort(function (a, b) {
                    return -(a[1].length - b[1].length);
                });

                jQuery.each(names, function (i, pair) {
                    var name = pair[1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = pair[0];
                        iValue += name.length;
                        return false;
                    }
                });
                if (index !== -1) {
                    return index + 1;
                } else {
                    throw 'Unknown name at position ' + iValue;
                }
            },

            // Confirm that a literal character matches the string value
            checkLiteral = function () {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw 'Unexpected literal at position ' + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === '\'' && !lookAhead('\'')) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case 'd':
                    case 'j':
                        day = getNumber('d');
                        break;
                    case 'D':
                    case 'l':
                        getName('D', dayNamesShort, dayNames);
                        break;
                    // case 'o':
                    //     doy = getNumber('o');
                    //     break;
                    case 'm':
                    case 'n':
                        month = getNumber('m');
                        break;
                    case 'M':
                    case 'F':
                        month = getName('M', monthNamesShort, monthNames);
                        break;
                    // case 'y':
                    case 'Y':
                        year = getNumber('y');
                        break;
                    case 'U':
                        date = new Date(getNumber('@'));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    // case '!':
                    //     date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
                    //     year = date.getFullYear();
                    //     month = date.getMonth() + 1;
                    //     day = date.getDate();
                    //     break;
                    case '\'':
                        if (lookAhead('\'')) {
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length) {
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw 'Extra/unparsed characters found in date: ' + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
        }

        // if (doy > -1) {
        //     month = 1;
        //     day = doy;
        //     do {
        //         dim = this._getDaysInMonth(year, month - 1);
        //         if (day <= dim) {
        //             break;
        //         }
        //         month++;
        //         day -= dim;
        //     } while (true);
        // }

        date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw 'Invalid date'; // E.g. 31/02/00
        }
        return date;
    }, T = function (e) {
        return !!e && {
            selector: e.selector,
            date: getDateObject(e)
        };
    }, getUl = function (e, i) {
        return getPickerEls(e, 'ul.pick[data-k="' + i + '"]');
    }, getEq = function (e, i, which) {
        var ul = getUl(e, i);
        var elements = [];
        ul.find('li').each(function () {
            elements.push(jQuery(this).attr('value'));
        });
        if ('last' === which) {
            return elements[elements.length - 1];
        }
        return elements[0];
    }, buildPicker = function (e, callback) {
        var t = false;
        if (e.format === 'Y' || e.format === 'm') {
            e.hideDay = true;

            if (e.format === 'Y') {
                e.hideMonth = true;
            }
            if (e.format === 'm') {
                e.hideYear = true;
            }
            t = true;
        }
        // 'Y' != e.format && 'm' != e.format || (e.hideDay = true, 'Y' == e.format && (e.hideMonth = !0), 'm' == e.format && (e.hideYear = !0), t = !0);
        if (e.hideDay || e.hideMonth || e.hideYear) {
            t = true;
        }
        if (e.largeOnly) {
            e.large = true;
            e.largeDefault = true;
        }
        if (e.hideMonth || e.hideDay || e.hideYear || e.showOnlyEnabledDays) {
            e.largeOnly = false;
            e.large = false;
            e.largeDefault = false;
        }
        e.element = jQuery('<div>', {
            class: 'datedropper ' + (t ? 'picker-clean' : '') + ' ' + (e.modal ? 'picker-modal' : '') + ' ' + e.theme + ' ' + (e.fx ? 'picker-fxs' : '') + ' ' + (e.large && e.largeDefault ? 'picker-lg' : ''),
            id: e.identifier,
            html: jQuery('<div>', {class: 'picker'})
        }).appendTo('body');
        for (var key in e.key) {
            var render = true;
            if ((key === 'y' && e.hideYear) || (key === 'd' && e.hideDay) || (key === 'm' && e.hideMonth)) {
                render = false;
            }
            if (render) {
                jQuery('<ul>', {
                    class: 'pick pick-' + key,
                    'data-k': key,
                    tabindex: 0
                }).appendTo(getPickerEls(e, '.picker'));
                K(e, key);
            }
            // 'y' == r && e.hideYear && (a = !1), 'd' == r && e.hideDay && (a = !1), 'm' == r && e.hideMonth && (a = !1), a && (jQuery('<ul>', {
            //     class: 'pick pick-' + r,
            //     'data-k': r,
            //     tabindex: 0
            // }).appendTo(getPickerEls(e, '.picker')), K(e, r));
        }
        if (e.large) {
            jQuery('<div>', {class: 'pick-lg'}).insertBefore(getPickerEls(e, '.pick-d'));
        }
        jQuery('<div>', {class: 'pick-btns'}).appendTo(getPickerEls(e, '.picker'));
        jQuery('<div>', {
            tabindex: 0,
            class: 'pick-submit',
            html: jQuery(window.dateDropperSetup.icons.checkmark)
        }).appendTo(getPickerEls(e, '.pick-btns'));
        if (e.large && !e.largeOnly) {
            jQuery('<div>', {
                class: 'pick-btn pick-btn-sz',
                html: jQuery(window.dateDropperSetup.icons.expand)
            }).appendTo(getPickerEls(e, '.pick-btns'));
        }
        // e.large && jQuery('<div>', {class: 'pick-lg'}).insertBefore(getPickerEls(e, '.pick-d')),
        //     jQuery('<div>', {class: 'pick-btns'}).appendTo(getPickerEls(e, '.picker')), jQuery('<div>', {
        //     tabindex: 0,
        //     class: 'pick-submit',
        //     html: jQuery(window.dateDropperSetup.icons.checkmark)
        // }).appendTo(getPickerEls(e, '.pick-btns')), e.large && !e.largeOnly && jQuery('<div>', {
        //     class: 'pick-btn pick-btn-sz',
        //     html: jQuery(window.dateDropperSetup.icons.expand)
        // }).appendTo(getPickerEls(e, '.pick-btns'));
        setTimeout(function () {
            e.element.addClass('picker-focused');
            if (e.element.hasClass('picker-modal')) {
                e.overlay = jQuery('<div class="picker-overlay"></div>').appendTo('body');
            }
            // e.element.hasClass('picker-modal') && (e.overlay = jQuery('<div class="picker-overlay"></div>').appendTo('body')),
            isFxMobile(e);
            I(e);
            W(e);
            picker = e;
            if (typeof callback === 'function') {
                callback();
            }
        }, 100);
    }, getPicker = function ($el) {
        var id = $el.attr('data-datedropper-id');
        return pickers[id] || false;
    }, getPickerEls = function (options, selector) {
        if (options.element) {
            return options.element.find(selector);
        }
    }, getDateFromString = function (string) {
        if ('string' == typeof string) {
            if (isDate(string)) {
                var parts = string.match(/\d+/g);
                jQuery.each(parts, function (index, value) {
                    parts[index] = parseInt(value);
                });
                return {
                    m: parts[0] && parts[0] <= 12 ? parts[0] : picker.key.m.today,
                    d: parts[1] && parts[1] <= 31 ? parts[1] : picker.key.d.today,
                    y: parts[2] || picker.key.y.today
                };
            }
        }
        return false;
    }, pickerFocusedSelector = 'div.datedropper.picker-focused', getDateObject = function (options, date) {
        if (!date) {
            date = {
                d: getCurrent(options, 'd'),
                m: getCurrent(options, 'm'),
                y: getCurrent(options, 'y')
            };
        }
        date || (date = {});
        var day = date.d, month = date.m, year = date.y, o = new Date(month + '/' + day + '/' + year).getDay(),
            dateObject = {
                F: window.dateDropperSetup.languages[options.lang].months.full[month - 1],
                M: window.dateDropperSetup.languages[options.lang].months.short[month - 1],
                D: window.dateDropperSetup.languages[options.lang].weekdays.full[o].substr(0, 3),
                l: window.dateDropperSetup.languages[options.lang].weekdays.full[o],
                d: getZeroFilled(day),
                m: getZeroFilled(month),
                S: getOrdinalSuffixed(day),
                Y: year,
                U: getUnix(getCurrent(options)),
                n: month,
                j: day
            },
            p = options.format.replace(/\b(F)\b/g, dateObject.F).replace(/\b(M)\b/g, dateObject.M).replace(/\b(D)\b/g, dateObject.D).replace(/\b(l)\b/g, dateObject.l).replace(/\b(d)\b/g, dateObject.d).replace(/\b(m)\b/g, dateObject.m).replace(/\b(S)\b/g, dateObject.S).replace(/\b(Y)\b/g, dateObject.Y).replace(/\b(U)\b/g, dateObject.U).replace(/\b(n)\b/g, dateObject.n).replace(/\b(j)\b/g, dateObject.j);
        dateObject.formatted = p;
        return dateObject;
    }, getZeroFilled = function (e) {
        return e < 10 ? '0' + e : e;
    }, getOrdinalSuffixed = function (e) {
        var i = ['th', 'st', 'nd', 'rd'], t = e % 100;
        return e + (i[(t - 20) % 10] || i[t] || i[0]);
    }, getUnix = function (e) {
        return Date.parse(e) / 1000;
    }, getDate = function (e) {
        var i = new Date(1000 * e);
        return {
            m: i.getMonth() + 1,
            y: i.getFullYear(),
            d: i.getDate()
        };
    }, getRoundtrip = function (options) {
        var selector = '[data-dd-roundtrip="' + options.roundtrip + '"]', returnValue = false;
        if (jQuery(selector).length) {
            returnValue = {};
            jQuery.each(['a', 'b'], function (index, value) {
                var current = jQuery(selector + '[data-dd-roundtrip-' + value + ']');
                returnValue[value] = {
                    value: (current.length && current.attr('data-dd-roundtrip-' + value)) ? current.attr('data-dd-roundtrip-' + value) : false,
                    selector: (current.length) ? current : false
                };
            });
        }
        return returnValue;
    }, enlargePicker = function (options) {
        if (options.large) {
            options.element.addClass('picker-transit').toggleClass('picker-lg');
            if (options.element.hasClass('picker-lg') && renderPickerLg(options)) {
                setTimeout(function () {
                    options.element.removeClass('picker-transit');
                }, 800);
            }
        }
    }, I = function (e) {
        if (!e.element.hasClass('picker-modal')) {
            var i = e.selector, t = i.offset().left + i.outerWidth() / 2, r = i.offset().top + i.outerHeight();
            e.element.css({
                left: t,
                top: r
            });
        }
    }, initPicker = function (options) {
        var date;
        try {
            date = parseDate(options.format, options.selector.val(), options);
        } catch (e) {
            console.log(e);
            date = false;
        }
        options.jump = isInt(options.jump) ? options.jump : 10;
        options.maxYear = isInt(options.maxYear) ? options.maxYear : (new Date).getFullYear() + 50;
        options.minYear = isInt(options.minYear) ? options.minYear : (new Date).getFullYear() - 50;
        options.lang = (options.lang in window.dateDropperSetup.languages) ? options.lang : 'en';
        options.key = {
            m: {
                min: 1,
                max: 12,
                current: date ? date.getMonth() + 1 : (new Date).getMonth() + 1,
                today: (new Date).getMonth() + 1
            },
            d: {
                min: 1,
                max: 31,
                current: date ? date.getDate() : (new Date).getDate(),
                today: (new Date).getDate()
            },
            y: {
                min: options.minYear,
                max: options.maxYear,
                current: date ? date.getFullYear() : (new Date).getFullYear(),
                today: (new Date).getFullYear()
            }
        };
        options.disabledDays = (options.disabledDays) ? options.disabledDays.split(',') : null;
        options.enabledDays = (options.enabledDays) ? options.enabledDays.split(',') : null;

        if (options.key.y.current > options.key.y.max) {
            options.key.y.current = options.key.y.max;
        }
        if (options.key.y.current < options.key.y.min) {
            options.key.y.current = options.key.y.min;
        }
        if (options.minDate) {
            var defaultDate = date ? getUnix(date) : !!options.defaultDate && getUnix(options.defaultDate),
                minDate = !!options.minDate && getUnix(options.minDate);
            if (defaultDate && defaultDate < minDate) {
                options.defaultDate = options.minDate;
            } else {
                options.defaultDate = date || options.minDate;
            }
            setCurrent(options, getDate(getUnix(options.defaultDate)));
        }
        if (options.disabledDays) {
            jQuery.each(options.disabledDays, function (index, value) {
                if (isDate(value)) {
                    options.disabledDays[index] = getUnix(value);
                }
            });
        }
        if (options.enabledDays) {
            jQuery.each(options.enabledDays, function (index, value) {
                if (isDate(value)) {
                    options.enabledDays[index] = getUnix(value);
                }
            });
        }
        if (options.showOnlyEnabledDays && options.enabledDays) {
            defaultDate = options.defaultDate ? options.defaultDate : false;
            var firstDay = (defaultDate && options.enabledDays.includes(defaultDate)) ? getDate(defaultDate) : getDate(options.enabledDays[0]);
            setCurrent(options, firstDay);
        } else {
            options.showOnlyEnabledDays = false;
        }
        if (options.roundtrip) {
            var unixDate = getUnix(getCurrent(options)),
                roundTrip = jQuery('[data-dd-roundtrip="' + options.roundtrip + '"]');
            if (roundTrip.length > 1) {
                // roundTrip.each(function () {
                    var which = roundTrip.index(options.selector) === 0 ? 'a' : 'b';
                    var defaultRoundtrip = options.selector.attr('data-dd-roundtrip-default-' + which);
                    var _new = (defaultRoundtrip) ? getUnix(i) : unixDate;
                    if (_new) {
                        options.selector.attr('data-dd-roundtrip-' + which, _new);
                    }
                // });
            } else {
                jQuery.each(['a', 'b'], function (index, value) {
                    var defaultRoundtrip = options.selector.attr('data-dd-roundtrip-default-' + value);
                    var _new = (defaultRoundtrip) ? getUnix(defaultRoundtrip) : unixDate;
                    if (_new) {
                        options.selector.attr('data-dd-roundtrip-' + value, _new);
                    }
                });
            }
            var roundtrip = getRoundtrip(options);
            date = getDate(roundtrip.a.value);
            // console.log(options.defaultDate);
            options.defaultDate = date.m + '/' + date.d + '/' + date.y;
            options.largeOnly = true;
        }
        options.selector.on(options.eventListener, function (e) {
            e.preventDefault();
            // jQuery(this).blur();
            showPicker(jQuery(this));
        });
        options.selector.on('blur', function (e) {
            picker && hidePicker(picker);
        });
        options.selector.on('change', function (e) {
            try {
                var date = parseDate(options.format, options.selector.val(), options);
                if (date) {
                    setCurrent(options, getDate(getUnix(date)));
                }
            } catch (e) {
                console.log(e);
            }
        });
        if (options.trigger) {
            jQuery(options.trigger).on('click', function (e) {
                options.selector.trigger(options.eventListener);
            });
        }
        if (options.onReady) {
            options.onReady(T(options));
        }
        if (options.defaultDate) {
            var dateFromString = getDateFromString(options.defaultDate);
            if (dateFromString) {
                jQuery.each(dateFromString, function (index, value) {
                    if (options.key[index]) {
                        options.key[index].current = value;
                    }
                });
                if (options.key.current > options.key.y.max) {
                    options.key.y.max = options.key.current;
                }
                if (options.key.current < options.key.y.min) {
                    options.key.y.min = options.key.y.current;
                }
            }
        }
    }, removePicker = function (pick) {
        if (pick.element) {
            pick.element.remove();
            if (pick.overlay) {
                pick.overlay.remove();
            }
            buildPicker(pick);
        }
    }, showPicker = function (e) {
        picker && hidePicker(picker);
        var element = getPicker(e);
        if (element) {
            buildPicker(element);
        }
    }, hidePicker = function (pick) {
        if (pick.element) {
            pick.element.removeClass('picker-focused');
            // setTimeout(function () {
            pick.element.remove();
            if (pick.overlay) {
                pick.overlay.addClass('picker-overlay-hidden');
            }
            // }, 400);
            picker = null;
        }
    }, G = function (e) {
        if (e) {
            var i, t, r = !1;
            return i = getUnix(getCurrent(e)), t = getUnix(getToday(e)), e.lock && ('from' == e.lock && (r = i < t), 'to' == e.lock && (r = t < i)), (e.minDate || e.maxDate) && (i = getUnix(getCurrent(e)), t = e.minDate ? getUnix(e.minDate) : null, c = e.maxDate ? getUnix(e.maxDate) : null, t && c ? r = i < t || i > c : t ? r = i < t : c && (r = i > c)), e.disabledDays && !e.enabledDays && (r = -1 != e.disabledDays.indexOf(i)), e.enabledDays && !e.disabledDays && (r = -1 == e.enabledDays.indexOf(i)), r ? (Z(e), e.element.addClass('picker-locked'), !0) : (e.element.removeClass('picker-locked'), !1);
        }
    }, K = function (e, key) {
        var r = getUl(e, key), a = e.key[key];
        for (r.empty(), i = a.min; i <= a.max; i++) {
            var o = i;
            'm' == key && (o = window.dateDropperSetup.languages[e.lang].months.short[i - 1]), o += 'd' == key ? '<span></span>' : '', jQuery('<li>', {
                value: i,
                html: '<div>' + o + '</div>'
            }).appendTo(r);
        }
        jQuery.each(['l', 'r'], function (e, i) {
            jQuery('<div>', {
                class: 'pick-arw pick-arw-s1 pick-arw-' + i,
                html: jQuery('<div>', {
                    class: 'pick-i-' + i,
                    html: jQuery(window.dateDropperSetup.icons.arrow[i])
                })
            }).appendTo(r);
        }), 'y' == key && jQuery.each(['l', 'r'], function (e, i) {
            jQuery('<div>', {
                class: 'pick-arw pick-arw-s2 pick-arw-' + i,
                html: jQuery('<div>', {
                    class: 'pick-i-' + i,
                    html: jQuery(window.dateDropperSetup.icons.arrow[i])
                })
            }).appendTo(r);
        }), U(e, key, getCurrent(e, key));
    }, renderPickerLg = function (options) {
        getPickerEls(options, '.pick-lg').empty().append('<ul class="pick-lg-h"></ul><ul class="pick-lg-b"></ul>');
        var days = options.startFromMonday ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
        for (var i = 0; i < 7; i++) {
            jQuery('<li>', {html: '<div>' + window.dateDropperSetup.languages[options.lang].weekdays.short[days[i]] + '</div>'}).appendTo(getPickerEls(options, '.pick-lg .pick-lg-h'));
        }
        for (i = 0; i < 42; i++) {
            jQuery('<li>', {html: jQuery('<div>')}).appendTo(getPickerEls(options, '.pick-lg .pick-lg-b'));
        }
        var t = 0, a = getPickerEls(options, '.pick-lg-b'), firstOfMonth = new Date(getCurrent(options)),
            date = new Date(getCurrent(options)), getMonthDays = function (e) {
                var month = e.getMonth(), year = e.getFullYear();
                var februaryDays = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
                return [31, februaryDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            };
        date.setMonth(date.getMonth() - 1);
        firstOfMonth.setDate(1);
        var s = firstOfMonth.getDay() - 1;
        if (s < 0) {
            s = 6;
        }
        if (options.startFromMonday && --s < 0) {
            s = 6;
        }
        for (i = getMonthDays(date) - s; i <= getMonthDays(date); i++) {
            a.find('li').eq(t).addClass('pick-b pick-n pick-h').attr('data-value', i);
            t++;
        }
        for (i = 1; i <= getMonthDays(firstOfMonth); i++) {
            a.find('li').eq(t).addClass('pick-n pick-v').attr('data-value', i);
            t++;
        }
        if (a.find('li.pick-n').length < 42) {
            var d = 42 - a.find('li.pick-n').length;
            for (i = 1; i <= d; i++) {
                a.find('li').eq(t).addClass('pick-a pick-n pick-h').attr('data-value', i);
                t++;
            }
        }
        if (options.lock) {
            if (options.lock === 'from') {
                if (getCurrent(options, 'y') <= getToday(options, 'y')) {
                    if (getCurrent(options, 'm') === getToday(options, 'm')) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + getToday(options, 'd') + '"]')
                            .prevAll('li').addClass('pick-lk');
                    } else {
                        if (getCurrent(options, 'm') < getToday(options, 'm')) {
                            getPickerEls(options, '.pick-lg .pick-lg-b li').addClass('pick-lk');
                        } else if (getCurrent(options, 'm') > getToday(options, 'm') && getCurrent(options, 'y') < getToday(options, 'y')) {
                            getPickerEls(options, '.pick-lg .pick-lg-b li').addClass('pick-lk');
                        }
                    }
                }
            } else {
                if (getCurrent(options, 'y') >= getToday(options, 'y')) {
                    if (getCurrent(options, 'm') === getToday(options, 'm')) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + getToday(options, 'd') + '"]').nextAll('li').addClass('pick-lk');
                    } else {
                        if (getCurrent(options, 'm') > getToday(options, 'm')) {
                            getPickerEls(options, '.pick-lg .pick-lg-b li').addClass('pick-lk');
                        } else if (getCurrent(options, 'm') < getToday(options, 'm') && getCurrent(options, 'y') > getToday(options, 'y')) {
                            getPickerEls(options, '.pick-lg .pick-lg-b li').addClass('pick-lk');
                        }
                    }
                }
            }
        }

        if (options.maxDate) {
            var maxDate = getDateFromString(options.maxDate);
            if (maxDate) {
                if (getCurrent(options, 'y') === maxDate.y && getCurrent(options, 'm') === maxDate.m) {
                    getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + maxDate.d + '"]').nextAll('li').addClass('pick-lk');
                } else {
                    if (getUnix(options.maxDate) < getUnix(getCurrent(options))) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v').addClass('pick-lk');
                    }
                }
            }
        }
        if (options.minDate) {
            var minDate = getDateFromString(options.minDate);
            if (minDate) {
                if (getCurrent(options, 'y') === minDate.y && getCurrent(options, 'm') === minDate.m) {
                    getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + minDate.d + '"]').prevAll('li').addClass('pick-lk');
                } else {
                    if (getUnix(getCurrent(options)) < getUnix(options.minDate)) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v').addClass('pick-lk');
                    }
                }
            }
        }
        if (options.disabledDays && !options.enabledDays) {
            jQuery.each(options.disabledDays, function (index, value) {
                if (value) {
                    var disabledDate = getDate(value);
                    if (disabledDate.m === getCurrent(options, 'm') && disabledDate.y === getCurrent(options, 'y')) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + t.d + '"]').addClass('pick-lk');
                    }
                }
            });
        } else if (options.enabledDays && !options.disabledDays) {
            getPickerEls(options, '.pick-lg .pick-lg-b li').addClass('pick-lk');
            jQuery.each(options.enabledDays, function (index, value) {
                if (value) {
                    var enabledDate = getDate(value);
                    if (enabledDate.m === getCurrent(options, 'm') && enabledDate.y === getCurrent(options, 'y')) {
                        getPickerEls(options, '.pick-lg .pick-lg-b li.pick-v[data-value="' + enabledDate.d + '"]').removeClass('pick-lk');
                    }
                }
            });
        }
        if (options.roundtrip) {
            updateRoundTrip(options);
        } else {
            getPickerEls(options, '.pick-lg-b li.pick-v[data-value=' + getCurrent(options, 'd') + ']').addClass('pick-sl');
        }
    }, setCurrent = function (options, date) {
        jQuery.each(date, function (index, value) {
            options.key[index].current = value;
        });
    }, W = function (e, i) {
        var t, r, a, o;
        e.element.hasClass('picker-lg') && renderPickerLg(e), r = getCurrent(t = e, 'm'), a = getCurrent(t, 'y'), o = a % 4 == 0 && (a % 100 != 0 || a % 400 == 0), t.key.d.max = [31, o ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][r - 1], getCurrent(t, 'd') > t.key.d.max && (t.key.d.current = t.key.d.max, U(t, 'd', getCurrent(t, 'd'))), getPickerEls(t, '.pick-d li').removeClass('pick-wke').each(function () {
            var e = new Date(r + '/' + jQuery(this).attr('value') + '/' + a).getDay();
            jQuery(this).find('span').html(window.dateDropperSetup.languages[t.lang].weekdays.full[e]), 0 != e && 6 != e || jQuery(this).addClass('pick-wke');
        }), t.element.hasClass('picker-lg') && (getPickerEls(t, '.pick-lg-b li').removeClass('pick-wke'), getPickerEls(t, '.pick-lg-b li.pick-v').each(function () {
            var e = new Date(r + '/' + jQuery(this).attr('data-value') + '/' + a).getDay();
            0 != e && 6 != e || jQuery(this).addClass('pick-wke');
        })), G(e) || (!function (e) {
            clearInterval(pickDragOffset);
            var i = e.minYear || e.key.y.current - 50, t = e.maxYear || e.key.y.current + 50;
            e.key.y.max = t, e.key.y.min = i, pickDragOffset = setTimeout(function () {
                K(e, 'y');
            }, 400);
        }(e), ee(e), i && i(e));
    }, U = function (e, i, t) {
        var r, a = getUl(e, i);
        (a.find('li').removeClass('pick-sl pick-bfr pick-afr'), t == getEq(e, i, 'last')) && ((r = a.find('li[value="' + getEq(e, i, 'first') + '"]')).clone().insertAfter(a.find('li[value=' + t + ']')), r.remove());
        t == getEq(e, i, 'first') && ((r = a.find('li[value="' + getEq(e, i, 'last') + '"]')).clone().insertBefore(a.find('li[value=' + t + ']')), r.remove());
        a.find('li[value=' + t + ']').addClass('pick-sl'), a.find('li.pick-sl').nextAll('li').addClass('pick-afr'), a.find('li.pick-sl').prevAll('li').addClass('pick-bfr');
    }, getCorrectValueForKey = function (e, key, value) {
        var r = e.key[key];
        if (value > r.max) {
            if (key === 'd' && e.autoIncrease) {
                incDec(e, 'm', 'right');
            }
            if (key === 'm' && e.autoIncrease) {
                incDec(e, 'y', 'right');
            }
            value = r.min;
        }
        if (value < r.min) {
            if (key === 'd' && e.autoIncrease) {
                incDec(e, 'm', 'left');
            }
            if (key === 'm' && e.autoIncrease) {
                incDec(e, 'y', 'left');
            }
            value = r.max;
        }
        e.key[key].current = value;
        U(e, key, value);
    }, incDec = function (e, key, direction) {
        if (e.showOnlyEnabledDays && e.enabledDays) {
            !function (t, e) {
                for (var i = getUnix(getCurrent(t)), r = t.enabledDays, a = (r.length, null), o = 0; o < r.length; o++) {
                    r[o] === i && (a = o);
                }
                'right' == e ? a++ : a--;
                var n = !!r[a] && getDate(r[a]);
                n && jQuery.each(n, function (e, i) {
                    t.key[e].current = i, getCorrectValueForKey(t, e, i);
                });
            }(e, direction);
        } else {
            var r = getCurrent(e, key);
            'right' == direction ? r++ : r--, getCorrectValueForKey(e, key, r);
        }
    }, Z = function (e) {
        e.element.find('.picker').addClass('picker-rumble');
    }, ee = function (options, e) {
        var i;
        if (options.roundtrip) {
            i = false;
            var roundTrip = getRoundtrip(options);
            var $el = jQuery('.picker-trigger[data-dd-roundtrip="' + options.selector.data('dd-roundtrip') + '"]');
            if (roundTrip) {
                var aValue, bValue;
                if (1 < $el.length) {
                    jQuery.each(roundTrip, function (which, i) {
                        var t = i.selector.attr('data-datedropper-id'),
                            r = getDate(i.value),
                            a = getDateObject(options, r);
                        if (which === 'a') {
                            aValue = parseInt(i.selector.data('ddRoundtripA'));
                        } else {
                            bValue = parseInt(i.selector.data('ddRoundtripB'));
                        }
                        options.identifier != t && pickers[t] && (pickers[t].key.m.current = r.m, pickers[t].key.d.current = r.d, pickers[t].key.y.current = r.y), i.selector.is('input') && i.selector.val(a.formatted).change();
                    });
                } else {
                    var r = getDateObject(options, getDate(roundTrip.a.value)), a = getDateObject(options, getDate(roundTrip.b.value));
                    aValue = parseInt($el.data('ddRoundtripA'));
                    bValue = parseInt($el.data('ddRoundtripB'));
                    options.selector.val(r.formatted + ' - ' + a.formatted);
                }
                var changed = (parseInt(roundTrip.a.value) !== aValue || parseInt(roundTrip.b.value) !== bValue) && roundTrip.a.value !== roundTrip.b.value;
                changed && options.onRoundTripChange && options.onRoundTripChange({
                    outward: getDate(roundTrip.a.value),
                    return: getDate(roundTrip.b.value)
                }), options.onChange && options.onChange(T(options));
            }
        } else {
            i = !!e || options.autofill;
        }
        if (i) {
            var n = getDateObject(options);
            options.selector.is('input') && options.selector.val(n.formatted).change(), options.changeValueTo && ie(options, n.formatted), options.onChange && options.onChange(T(options));
        }
    }, ie = function (e, i) {
        var t = jQuery(e.changeValueTo);
        t.length && t.is('input') && t.val(i).change();
    };
    jQuery(document).on('keydown', function (e) {
        var i = e.which;
        if (picker && !isTouch()) {
            if (32 == i) {
                getPickerEls(picker, ':focus').click(), e.preventDefault();
            } else if (9 == i && e.shiftKey) {
                jQuery(e.target).is('.pick-m') && (e.preventDefault(), jQuery('.datedropper .pick-submit').focus());
            } else if (9 == i) {
                jQuery(e.target).is('.pick-submit') && (e.preventDefault(), jQuery('.datedropper .pick-m').focus());
            } else if (27 == i) {
                hidePicker(picker);
            } else if (13 == i) {
                getPickerEls(picker, '.pick-submit').trigger(uiEvent.start);
            } else if (37 == i || 39 == i) {
                var t = getPickerEls(picker, '.pick:focus');
                if (t.length && (37 == i || 39 == i)) {
                    if (37 == i) {
                        var r = 'left';
                    }
                    if (39 == i) {
                        r = 'right';
                    }
                    var a = t.attr('data-k');
                    incDec(picker, a, r), W(picker);
                }
            }
        }
    }).on('focus', '.pick-d', function () {
        if (picker) {
            var e = picker.element.find('.pick-lg');
            e.length && !e.hasClass('pick-lg-focused') && e.addClass('pick-lg-focused');
        }
    }).on('blur', '.pick-d', function () {
        if (picker) {
            var e = picker.element.find('.pick-lg');
            e.length && e.hasClass('pick-lg-focused') && e.removeClass('pick-lg-focused');
        }
    }).on('click', function (e) {
        picker && (picker.selector.is(e.target) || picker.element.is(e.target) || 0 !== picker.element.has(e.target).length || (hidePicker(picker), pickerCtrl = null));
    }).on(animationEvents, pickerFocusedSelector + ' .picker-rumble', function () {
        jQuery(this).removeClass('picker-rumble');
    }).on(transitionEvents, '.picker-overlay', function () {
        jQuery(this).remove();
    }).on(uiEvent.start, pickerFocusedSelector + ' .pick-lg li.pick-v', function (e) {
        if (picker) {
            e.preventDefault();
            if (getPickerEls(picker, '.pick-lg-b li').removeClass('pick-sl'), jQuery(this).addClass('pick-sl'), picker.key.d.current = jQuery(this).attr('data-value'), U(picker, 'd', jQuery(this).attr('data-value')), picker.roundtrip) {
                var i = getRoundtrip(picker), t = getUnix(getCurrent(picker));
                if (i) {
                    var r = i.a.value == i.b.value ? 'b' : 'a';
                    'b' == r && t <= i.a.value && (r = 'a'), 'a' == r ? jQuery.each(i, function (e) {
                        i[e].selector.attr('data-dd-roundtrip-' + e, t).attr('data-dd-roundtrip-selector', r);
                    }) : i[r].selector.attr('data-dd-roundtrip-' + r, t).attr('data-dd-roundtrip-selector', r), r = 'b' == r ? 'a' : 'b';
                }
            }
            W(picker);
        }
    }).on('mouseleave', pickerFocusedSelector + ' .pick-lg .pick-lg-b li', function () {
        if (picker && picker.roundtrip) {
            updateRoundTrip(picker);
        }
    }).on('mouseenter', pickerFocusedSelector + ' .pick-lg .pick-lg-b li', function () {
        if (picker && picker.roundtrip) {
            updateRoundTrip(picker, jQuery(this));
        }
    }).on('mousedown', pickerFocusedSelector + ' .pick-btn-sz', function (e) {
        if (picker) {
            e.preventDefault();
            enlargePicker(picker);
        }
    }).on(uiEvent.start, pickerFocusedSelector + ' .pick-arw.pick-arw-s2', function (e) {
        if (picker) {
            var i;
            e.preventDefault(), pickerCtrl = null;
            jQuery(this).closest('ul').data('k');
            var t = picker.jump;
            i = jQuery(this).hasClass('pick-arw-r') ? getCurrent(picker, 'y') + t : getCurrent(picker, 'y') - t;
            var r = function (e, i, t) {
                for (var r = [], a = e.key[i], o = a.min; o <= a.max; o++) {
                    o % t == 0 && r.push(o);
                }
                return r;
            }(picker, 'y', t);
            i > r[r.length - 1] && (i = r[0]), i < r[0] && (i = r[r.length - 1]), picker.key.y.current = i, U(picker, 'y', getCurrent(picker, 'y'));
        }
    }).on(uiEvent.start, pickerFocusedSelector, function (e) {
        picker && getPickerEls(picker, '*:focus').blur();
    }).on(uiEvent.start, pickerFocusedSelector + ' .pick-arw.pick-arw-s1', function (e) {
        if (picker) {
            e.preventDefault(), pickerCtrl = null;
            var i = jQuery(this).closest('ul').data('k'), t = jQuery(this).hasClass('pick-arw-r') ? 'right' : 'left';
            incDec(picker, i, t);
        }
    }).on(uiEvent.start, pickerFocusedSelector + ' ul.pick.pick-y li', function () {
        isClick = !0;
    }).on(uiEvent.end, pickerFocusedSelector + ' ul.pick.pick-y li', function () {
        var e;
        picker && (!isClick || (e = picker).jump >= e.key.y.max - e.key.y.min || (!function (t) {
            var e = getPickerEls(t, '.picker-jumped-years');
            e.length && e.remove();
            var r = jQuery('<div>', {class: 'picker-jumped-years'}).appendTo(getPickerEls(t, '.picker'));
            setTimeout(function () {
                r.addClass('picker-jumper-years-visible');
            }, 100);
            for (var i = t.key.y.min; i <= t.key.y.max; i++) {
                i % t.jump == 0 && jQuery('<div>', {'data-id': i}).click(function (e) {
                    var i = jQuery(this).data('id');
                    getCorrectValueForKey(t, 'y', i), W(t), r.removeClass('picker-jumper-years-visible'), setTimeout(function () {
                        r.remove();
                    }, 300);
                }).appendTo(r);
            }
        }(picker), isClick = !1));
    }).on(uiEvent.start, pickerFocusedSelector + ' ul.pick.pick-d li', function () {
        picker && (isClick = !0);
    }).on(uiEvent.end, pickerFocusedSelector + ' ul.pick.pick-d li', function () {
        picker && isClick && (enlargePicker(picker), isClick = !1);
    }).on(uiEvent.start, pickerFocusedSelector + ' ul.pick', function (e) {
        if (picker && (pickerCtrl = jQuery(this))) {
            var i = pickerCtrl.data('k');
            pickDragged = isTouch() ? e.originalEvent.touches[0].pageY : e.pageY, pickDragTemp = getCurrent(picker, i);
        }
    }).on(uiEvent.move, function (e) {
        if (picker && (isClick = !1, pickerCtrl)) {
            e.preventDefault();
            var i = pickerCtrl.data('k'), t = isTouch() ? e.originalEvent.touches[0].pageY : e.pageY;
            t = pickDragged - t, t = Math.round(.026 * t);
            var r = getClear(picker, i, pickDragTemp + t);
            r != picker.key[i].current && getCorrectValueForKey(picker, i, r), picker.onPickerDragging && picker.onPickerDragging({
                key: i,
                value: r
            });
        }
    }).on(uiEvent.end, function (e) {
        pickerCtrl && (pickDragTemp = pickDragged = pickerCtrl = null, picker && (W(picker), picker.onPickerRelease && picker.onPickerRelease(getDateObject(picker))));
    }).on(uiEvent.start, pickerFocusedSelector + ' .pick-submit', function () {
        picker && (G(picker) || (ee(picker, !0), hidePicker(picker)));
    });
    jQuery(window).on('resize', function () {
        if (picker) {
            I(picker);
            isFxMobile(picker);
        }
    });
    document.addEventListener('touchmove', function (e) {
        var cnt = jQuery(e.target).closest('.picker-jumped-years').length;
        if (picker && !cnt) {
            jQuery('html,body').css('touch-action', 'none');
            e.preventDefault();
        } else {
            jQuery('html,body').css('touch-action', 'unset');
        }
    }, {passive: !1});
    jQuery.fn.dateDropper = function (options) {
        if (isIE() && isIE() < 10) {
            console.error('[DATEDROPPER] This browser is not supported');
        } else {
            if ('object' === typeof options || !options) {
                return DateDropper.init.apply(this, arguments);
            } else if ('string' === typeof options && DateDropper[options]) {
                return DateDropper[options].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            console.error('[DATEDROPPER] This method not exist');
        }
    };
    jQuery(document).ready(function () {
        if (window.dateDropperSetup && window.dateDropperSetup.autoInit) {
            jQuery('.datedropper-init,[data-datedropper]').each(function () {
                jQuery(this).dateDropper();
            });
        }
    });
})(jQuery);
