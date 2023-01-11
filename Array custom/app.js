var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
;
Array.prototype.all = function (fn) {
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (!fn(e))
            return false;
    }
    return true;
};
;
Array.prototype.any = function (fn) {
    if (!fn)
        return Boolean(this.length);
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (fn(e))
            return true;
    }
    return false;
};
;
Array.prototype.filterNonNative = function (fn) {
    var seq = []; //??? 
    // const seq: typeof this = []
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (fn(e)) {
            seq.push(e);
        }
    }
    return seq;
};
;
Array.prototype.filterNot = function (fn) {
    var seq = []; //??? 
    // const seq: typeof this = []
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (!fn(e)) {
            seq.push(e);
        }
    }
    return seq;
};
;
Array.prototype.filterIndexed = function (fn) {
    var seq = []; //??? 
    // const seq: typeof this = []
    for (var i = 0; i <= this.length - 1; i++) {
        var e = this[i];
        if (fn(i, e)) {
            seq.push(e);
        }
    }
    return seq;
};
;
Array.prototype.findNonNative = function (fn) {
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (fn(e)) {
            return e;
        }
    }
    return null;
};
;
Array.prototype.findLast = function (fn) {
    for (var index = this.length - 1; index >= 0; index--) {
        var e = this[index];
        if (fn(e)) {
            return e;
        }
    }
    return null;
};
Array.prototype.average = function () {
    if (this.length === 0)
        return 0;
    var sum = 0;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        sum += e;
    }
    console.log(sum);
    return sum / this.length;
};
Array.prototype.associateBy = function (keySelector, valueTransform) {
    var map = new Map();
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        var key = keySelector(e);
        if (valueTransform) {
            e = valueTransform(e);
        }
        map.set(key, e);
    }
    return map;
};
Array.prototype.groupBy = function (keySelector, valueTransform) {
    var map = new Map();
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        var key = keySelector(e);
        if (valueTransform) {
            e = valueTransform(e);
        }
        if (!map.has(key))
            map.set(key, [e]);
        else
            map.set(key, __spreadArray(__spreadArray([], map.get(key), true), [e], false));
    }
    return map;
};
Array.prototype.count = function (fn, selector) {
    var total = 0;
    if (!fn && !selector)
        return this.length;
    if (fn && selector) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var e = _a[_i];
            if (fn(e))
                total += e[selector];
        }
        return total;
    }
    if (fn && !selector) {
        for (var _b = 0, _c = this; _b < _c.length; _b++) {
            var e = _c[_b];
            if (fn(e))
                total += 1;
        }
        return total;
    }
    if (!fn && selector) {
        for (var _d = 0, _e = this; _d < _e.length; _d++) {
            var e = _e[_d];
            total += e[selector];
        }
        return total;
    }
};
Array.prototype.minByOrNull = function (fn) {
    var answer;
    var value;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        value = fn(e);
        answer = !answer || answer.value > value ? { value: value, element: e } : answer;
    }
    return this.length ? answer.element : null;
};
Array.prototype.maxByOrNull = function (fn) {
    var answer;
    var value;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        value = fn(e);
        answer = !answer || answer.value < value ? { value: value, element: e } : answer;
    }
    return this.length ? answer.element : null;
};
Array.prototype.flatten = function () {
    var seq = [];
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (Array.isArray(e)) {
            seq.push.apply(seq, e.flatten());
        }
        else {
            seq.push(e);
        }
    }
    return seq;
};
Array.prototype.chunked = function (size, transform) {
    if (size <= 0)
        throw new Error("size must be positive number");
    var answer = [];
    var chunk = [];
    var counter = 0;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        if (size != counter)
            chunk.push(e);
        else {
            answer.push(chunk);
            chunk = [];
            counter = 0;
            chunk.push(e);
        }
        counter++;
    }
    if (chunk.length !== 0)
        answer.push(chunk);
    var transformedAnswer = [];
    if (transform) {
        for (var _b = 0, answer_1 = answer; _b < answer_1.length; _b++) {
            var e = answer_1[_b];
            transformedAnswer.push(transform(e));
        }
    }
    return transform ? transformedAnswer : answer;
};
Array.prototype.distinctBy = function (selector) {
    var values = {};
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        var key = selector(e);
        if (values.hasOwnProperty(key))
            continue;
        else {
            values[key] = e;
        }
    }
    console.log(values);
    return Object.values(values); // not numbers???
};
Array.prototype.fold = function (initial, operation) {
    var acc = initial;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var e = _a[_i];
        acc = operation(acc, e);
    }
    return acc;
};
