//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var NOOP = () => {};
var NO = () => false;
var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
var isModelListener = (key) => key.startsWith("onUpdate:");
var extend = Object.assign;
var remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isSet = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => toTypeString(val) === "[object Date]";
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isPlainObject = (val) => toTypeString(val) === "[object Object]";
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
var cacheStringFunction = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
};
var camelizeRE = /-\w/g;
var camelize = cacheStringFunction((str) => {
	return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = cacheStringFunction((str) => {
	return str ? `on${capitalize(str)}` : ``;
});
var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
var invokeArrayFns = (fns, ...arg) => {
	for (let i = 0; i < fns.length; i++) fns[i](...arg);
};
var def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
var looseToNumber = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
var toNumber = (val) => {
	const n = isString(val) ? Number(val) : NaN;
	return isNaN(n) ? val : n;
};
var _globalThis;
var getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString(value) || isObject(value)) return value;
}
var listDelimiterRE = /;(?![^(]*\))/g;
var propertyDelimiterRE = /:([^]+)/;
var styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) res = value;
	else if (isArray(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
specialBooleanAttrs + "";
function includeBooleanAttr(value) {
	return !!value || value === "";
}
function looseCompareArrays(a, b) {
	if (a.length !== b.length) return false;
	let equal = true;
	for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
	return equal;
}
function looseEqual(a, b) {
	if (a === b) return true;
	let aValidType = isDate(a);
	let bValidType = isDate(b);
	if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
	aValidType = isSymbol(a);
	bValidType = isSymbol(b);
	if (aValidType || bValidType) return a === b;
	aValidType = isArray(a);
	bValidType = isArray(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
	aValidType = isObject(a);
	bValidType = isObject(b);
	if (aValidType || bValidType) {
		if (!aValidType || !bValidType) return false;
		if (Object.keys(a).length !== Object.keys(b).length) return false;
		for (const key in a) {
			const aHasKey = a.hasOwnProperty(key);
			const bHasKey = b.hasOwnProperty(key);
			if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
		}
	}
	return String(a) === String(b);
}
function looseIndexOf(arr, val) {
	return arr.findIndex((item) => looseEqual(item, val));
}
var isRef$1 = (val) => {
	return !!(val && val["__v_isRef"] === true);
};
var toDisplayString = (val) => {
	return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
var replacer = (_key, val) => {
	if (isRef$1(val)) return replacer(_key, val.value);
	else if (isMap(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
		entries[stringifySymbol(key, i) + " =>"] = val2;
		return entries;
	}, {}) };
	else if (isSet(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
	else if (isSymbol(val)) return stringifySymbol(val);
	else if (isObject(val) && !isArray(val) && !isPlainObject(val)) return String(val);
	return val;
};
var stringifySymbol = (v, i = "") => {
	var _a;
	return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
/**
* @vue/reactivity v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var activeEffectScope;
var EffectScope = class {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this._warnOnRun = true;
		this.__v_skip = true;
		if (!detached && activeEffectScope) if (activeEffectScope.active) {
			this.parent = activeEffectScope;
			this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		} else {
			this._active = false;
			this._warnOnRun = false;
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].pause();
			}
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) {
					const scopes = this.scopes.slice();
					for (i = 0, l = scopes.length; i < l; i++) scopes[i].resume();
				}
				const effects = this.effects.slice();
				for (i = 0, l = effects.length; i < l; i++) effects[i].resume();
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (activeEffectScope === this) activeEffectScope = this.prevScope;
			else {
				let current = activeEffectScope;
				while (current) {
					if (current.prevScope === this) {
						current.prevScope = this.prevScope;
						break;
					}
					current = current.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
			this.cleanups.length = 0;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].stop(true);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
};
function getCurrentScope() {
	return activeEffectScope;
}
var activeSub;
var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
var ReactiveEffect = class {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope) if (activeEffectScope.active) activeEffectScope.effects.push(this);
		else this.flags &= -2;
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) return;
		if (!(this.flags & 8)) batch(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) removeSub(link);
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) pausedQueueEffects.add(this);
		else if (this.scheduler) this.scheduler();
		else this.runIfDirty();
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) this.run();
	}
	get dirty() {
		return isDirty(this);
	}
};
var batchDepth = 0;
var batchedSub;
var batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) return;
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) try {
				e.trigger();
			} catch (err) {
				if (!error) error = err;
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else head = link;
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
	if (sub._dirty) return true;
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) return;
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) return;
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
		}
	}
	if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
var globalVersion = 0;
var Link = class {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
};
var Dep = class {
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
	}
	track(debugInfo) {
		if (!activeSub || !shouldTrack || activeSub === this.computed) return;
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
			else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) link.prevDep.nextDep = next;
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) activeSub.deps = next;
			}
		}
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify(debugInfo) {
		startBatch();
		try {
			for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
		} finally {
			endBatch();
		}
	}
};
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) addSub(l);
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		link.dep.subs = link;
	}
}
var targetMap = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = /* @__PURE__ */ Symbol("");
var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
function track(target, type, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		dep.track();
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) dep.trigger();
	};
	startBatch();
	if (type === "clear") depsMap.forEach(run);
	else {
		const targetIsArray = isArray(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
			if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					} else if (isArrayIndex) run(depsMap.get("length"));
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					}
					break;
				case "set":
					if (isMap(target)) run(depsMap.get(ITERATE_KEY));
					break;
			}
		}
	}
	endBatch();
}
function reactiveReadArray(array) {
	const raw = /* @__PURE__ */ toRaw(array);
	if (raw === array) return raw;
	track(raw, "iterate", ARRAY_ITERATE_KEY);
	return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
	track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
	return arr;
}
function toWrapped(target, item) {
	if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
	return toReactive(item);
}
var arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const iter = arr[method]();
	if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
		iter._next = iter.next;
		iter.next = () => {
			const result = iter._next();
			if (!result.done) result.value = wrapValue(result.value);
			return result;
		};
	}
	return iter;
}
var arrayProto = Array.prototype;
function apply(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) wrappedFn = function(item, index) {
			return fn.call(this, toWrapped(self, item), index, self);
		};
		else if (fn.length > 2) wrappedFn = function(item, index) {
			return fn.call(this, item, index, self);
		};
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	let wrappedFn = fn;
	let wrapInitialAccumulator = false;
	if (arr !== self) {
		if (needsWrap) {
			wrapInitialAccumulator = args.length === 0;
			wrappedFn = function(acc, item, index) {
				if (wrapInitialAccumulator) {
					wrapInitialAccumulator = false;
					acc = toWrapped(self, acc);
				}
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
			return fn.call(this, acc, item, index, self);
		};
	}
	const result = arr[method](wrappedFn, ...args);
	return wrapInitialAccumulator ? toWrapped(self, result) : result;
}
function searchProxy(self, method, args) {
	const arr = /* @__PURE__ */ toRaw(self);
	track(arr, "iterate", ARRAY_ITERATE_KEY);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
		args[0] = /* @__PURE__ */ toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
function hasOwnProperty(key) {
	if (!isSymbol(key)) key = String(key);
	const obj = /* @__PURE__ */ toRaw(this);
	track(obj, "has", key);
	return obj.hasOwnProperty(key);
}
var BaseReactiveHandler = class {
	constructor(_isReadonly = false, _isShallow = false) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return isShallow2;
		else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
			return;
		}
		const targetIsArray = isArray(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
			if (key === "hasOwnProperty") return hasOwnProperty;
		}
		const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly2) track(target, "get", key);
		if (isShallow2) return res;
		if (/* @__PURE__ */ isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
		}
		if (isObject(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
		return res;
	}
};
var MutableReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
			if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
				oldValue = /* @__PURE__ */ toRaw(oldValue);
				value = /* @__PURE__ */ toRaw(value);
			}
			if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) if (isOldValueReadonly) return true;
			else {
				oldValue.value = value;
				return true;
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (target === /* @__PURE__ */ toRaw(receiver) && result) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const oldValue = target[key];
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
		return result;
	}
	ownKeys(target) {
		track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
};
var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(true, isShallow2);
	}
	set(target, key) {
		return true;
	}
	deleteProperty(target, key) {
		return true;
	}
};
var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = /* @__PURE__ */ toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
		!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend(Object.create(innerIterator), { next() {
			const { value, done } = innerIterator.next();
			return done ? {
				value,
				done
			} : {
				value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
				done
			};
		} });
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		return type === "delete" ? false : type === "clear" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
				track(rawTarget, "get", rawKey);
			}
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			if (has.call(rawTarget, key)) return wrap(target.get(key));
			else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
			else if (target !== rawTarget) target.get(key);
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
				track(rawTarget, "has", rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			!readonly && track(rawTarget, "iterate", ITERATE_KEY);
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend(instrumentations, readonly ? {
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear")
	} : {
		add(value) {
			const target = /* @__PURE__ */ toRaw(this);
			const proto = getProto(target);
			const rawValue = /* @__PURE__ */ toRaw(value);
			const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
			if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
				target.add(valueToAdd);
				trigger(target, "add", valueToAdd, valueToAdd);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			return this;
		},
		delete(key) {
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get ? get.call(target, key) : void 0;
			const result = target.delete(key);
			if (hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		},
		clear() {
			const target = /* @__PURE__ */ toRaw(this);
			const hadItems = target.size !== 0;
			const oldTarget = void 0;
			const result = target.clear();
			if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
			return result;
		}
	});
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
	if (/* @__PURE__ */ isReadonly(target)) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject(target)) return target;
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
	if (target["__v_skip"] || !Object.isExtensible(target)) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const targetType = targetTypeMap(toRawType(target));
	if (targetType === 0) return target;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
	if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
	return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
	return value;
}
var toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
var toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
	return createRef(value, false);
}
function createRef(rawValue, shallow) {
	if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
	return new RefImpl(rawValue, shallow);
}
var RefImpl = class {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this["__v_isShallow"] = false;
		this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
		this._value = isShallow2 ? value : toReactive(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		this.dep.track();
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
		newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive(newValue);
			this.dep.trigger();
		}
	}
};
function unref(ref2) {
	return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
var shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
			oldValue.value = value;
			return true;
		} else return Reflect.set(target, key, value, receiver);
	}
};
function proxyRefs(objectWithRefs) {
	return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var ComputedRefImpl = class {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track();
		refreshComputed(this);
		if (link) link.version = this.dep.version;
		return this._value;
	}
	set value(newValue) {
		if (this.setter) this.setter(newValue);
	}
};
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
	let getter;
	let setter;
	if (isFunction(getterOrOptions)) getter = getterOrOptions;
	else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}
	return new ComputedRefImpl(getter, setter, isSSR);
}
var INITIAL_WATCHER_VALUE = {};
var cleanupMap = /* @__PURE__ */ new WeakMap();
var activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
	if (owner) {
		let cleanups = cleanupMap.get(owner);
		if (!cleanups) cleanupMap.set(owner, cleanups = []);
		cleanups.push(cleanupFn);
	}
}
function watch$1(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (/* @__PURE__ */ isRef(source)) {
		getter = () => source.value;
		forceTrigger = /* @__PURE__ */ isShallow(source);
	} else if (/* @__PURE__ */ isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
		getter = () => source.map((s) => {
			if (/* @__PURE__ */ isRef(s)) return s.value;
			else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
			else if (isFunction(s)) return call ? call(s, 2) : s();
		});
	} else if (isFunction(source)) if (cb) getter = call ? () => call(source, 2) : source;
	else getter = () => {
		if (cleanup) {
			pauseTracking();
			try {
				cleanup();
			} finally {
				resetTracking();
			}
		}
		const currentEffect = activeWatcher;
		activeWatcher = effect;
		try {
			return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
		} finally {
			activeWatcher = currentEffect;
		}
	};
	else getter = NOOP;
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) remove(scope.effects, effect);
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			const res = _cb(...args);
			watchHandle();
			return res;
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
		if (cb) {
			const newValue = effect.run();
			if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				if (cleanup) cleanup();
				const currentWatcher = activeWatcher;
				activeWatcher = effect;
				try {
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} finally {
					activeWatcher = currentWatcher;
				}
			}
		} else effect.run();
	};
	if (augmentJob) augmentJob(job);
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) call(cleanups, 4);
			else for (const cleanup2 of cleanups) cleanup2();
			cleanupMap.delete(effect);
		}
	};
	if (cb) if (immediate) job(true);
	else oldValue = effect.run();
	else if (scheduler) scheduler(job.bind(null, true), true);
	else effect.run();
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject(value) || value["__v_skip"]) return value;
	seen = seen || /* @__PURE__ */ new Map();
	if ((seen.get(value) || 0) >= depth) return value;
	seen.set(value, depth);
	depth--;
	if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
	else if (isArray(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
	else if (isSet(value) || isMap(value)) value.forEach((v) => {
		traverse(v, depth, seen);
	});
	else if (isPlainObject(value)) {
		for (const key in value) traverse(value[key], depth, seen);
		for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
	}
	return value;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
/**
* @vue/runtime-core v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) res.catch((err) => {
			handleError(err, instance, type);
		});
		return res;
	}
	if (isArray(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		return values;
	}
}
function handleError(err, instance, type, throwInDev = true) {
	const contextVNode = instance ? instance.vnode : null;
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks) {
				for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 10, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
	if (throwInProd) throw err;
	else console.error(err);
}
var queue = [];
var flushIndex = -1;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = /* @__PURE__ */ Promise.resolve();
var currentFlushPromise = null;
function nextTick(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
		else end = middle;
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
		else queue.splice(findInsertionIndex(jobId), 0, job);
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
}
function queuePostFlushCb(cb) {
	if (!isArray(cb)) {
		if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else pendingPostFlushCbs.push(...cb);
	queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid) continue;
			queue.splice(i, 1);
			i--;
			if (cb.flags & 4) cb.flags &= -2;
			cb();
			if (!(cb.flags & 4)) cb.flags &= -2;
		}
	}
}
function flushPostFlushCbs(seen) {
	if (pendingPostFlushCbs.length) {
		const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = 0;
		if (activePostFlushCbs) {
			activePostFlushCbs.push(...deduped);
			return;
		}
		activePostFlushCbs = deduped;
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (cb.flags & 4) cb.flags &= -2;
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (job.flags & 4) job.flags &= -2;
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) job.flags &= -2;
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) job.flags &= -2;
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs(seen);
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
	}
}
var currentRenderingInstance = null;
var currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
	if (!ctx) return fn;
	if (fn._n) return fn;
	const renderFnWithContext = (...args) => {
		if (renderFnWithContext._d) setBlockTracking(-1);
		const prevInstance = setCurrentRenderingInstance(ctx);
		const prevStackSize = blockStack.length;
		let res;
		try {
			res = fn(...args);
		} finally {
			for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
			setCurrentRenderingInstance(prevInstance);
			if (renderFnWithContext._d) setBlockTracking(1);
		}
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function withDirectives(vnode, directives) {
	if (currentRenderingInstance === null) return vnode;
	const instance = getComponentPublicInstance(currentRenderingInstance);
	const bindings = vnode.dirs || (vnode.dirs = []);
	for (let i = 0; i < directives.length; i++) {
		let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
		if (dir) {
			if (isFunction(dir)) dir = {
				mounted: dir,
				updated: dir
			};
			if (dir.deep) traverse(value);
			bindings.push({
				dir,
				instance,
				value,
				oldValue: void 0,
				arg,
				modifiers
			});
		}
	}
	return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	const bindings = vnode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		const binding = bindings[i];
		if (oldBindings) binding.oldValue = oldBindings[i].value;
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				vnode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) return provides[key];
		else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
	}
}
var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
var useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		if (!ctx) {}
		return ctx;
	}
};
function watch(source, cb, options) {
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, flush, once } = options;
	const baseWatchOptions = extend({}, options);
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			const watchStopHandle = () => {};
			watchStopHandle.stop = NOOP;
			watchStopHandle.resume = NOOP;
			watchStopHandle.pause = NOOP;
			return watchStopHandle;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") baseWatchOptions.scheduler = (job) => {
		queuePostRenderEffect(job, instance && instance.suspense);
	};
	else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) job();
			else queueJob(job);
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) job.flags |= 4;
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) ssrCleanup.push(watchHandle);
		else if (runsImmediately) watchHandle();
	}
	return watchHandle;
}
function instanceWatch(source, value, options) {
	const publicThis = this.proxy;
	const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
	let cb;
	if (isFunction(value)) cb = value;
	else {
		cb = value.handler;
		options = value;
	}
	const reset = setCurrentInstance(this);
	const res = doWatch(getter, cb.bind(publicThis), options);
	reset();
	return res;
}
function createPathGetter(ctx, path) {
	const segments = path.split(".");
	return () => {
		let cur = ctx;
		for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
		return cur;
	};
}
var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
var isTeleport = (type) => type.__isTeleport;
var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		setTransitionHooks(vnode.component.subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		vnode.ssContent.transition = hooks.clone(vnode.ssContent);
		vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
	} else vnode.transition = hooks;
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
	return isFunction(options) ? /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))() : options;
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
function isTemplateRefKey(refs, key) {
	let desc;
	return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = /* @__PURE__ */ toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		if (isTemplateRefKey(refs, key)) return false;
		return hasOwn(rawSetupState, key);
	};
	const canSetRef = (ref2, key) => {
		if (key && isTemplateRefKey(refs, key)) return false;
		return true;
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
		} else if (/* @__PURE__ */ isRef(oldRef)) {
			const oldRawRefAtom = oldRawRef;
			if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
	else {
		const _isString = isString(ref);
		const _isRef = /* @__PURE__ */ isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
					if (isUnmount) isArray(existing) && remove(existing, refValue);
					else if (!isArray(existing)) if (_isString) {
						refs[ref] = [refValue];
						if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
					} else {
						const newVal = [refValue];
						if (canSetRef(ref, rawRef.k)) ref.value = newVal;
						if (rawRef.k) refs[rawRef.k] = newVal;
					}
					else if (!existing.includes(refValue)) existing.push(refValue);
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) setupState[ref] = value;
				} else if (_isRef) {
					if (canSetRef(ref, rawRef.k)) ref.value = value;
					if (rawRef.k) refs[rawRef.k] = value;
				}
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		}
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
	registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
	registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
	const wrappedHook = hook.__wdc || (hook.__wdc = () => {
		let current = target;
		while (current) {
			if (current.isDeactivated) return;
			current = current.parent;
		}
		return hook();
	});
	injectHook(type, wrappedHook, target);
	if (target) {
		let current = target.parent;
		while (current && current.parent) {
			if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
			current = current.parent;
		}
	}
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
	const injected = injectHook(type, hook, keepAliveRoot, true);
	onUnmounted(() => {
		remove(keepAliveRoot[type], injected);
	}, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		});
		if (prepend) hooks.unshift(wrappedHook);
		else hooks.push(wrappedHook);
		return wrappedHook;
	}
}
var createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
};
var onBeforeMount = createHook("bm");
var onMounted = createHook("m");
var onBeforeUpdate = createHook("bu");
var onUpdated = createHook("u");
var onBeforeUnmount = createHook("bum");
var onUnmounted = createHook("um");
var onServerPrefetch = createHook("sp");
var onRenderTriggered = createHook("rtg");
var onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
	injectHook("ec", hook, target);
}
var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
	let ret;
	const cached = cache && cache[index];
	const sourceIsArray = isArray(source);
	if (sourceIsArray || isString(source)) {
		const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
		let needsWrap = false;
		let isReadonlySource = false;
		if (sourceIsReactiveArray) {
			needsWrap = !/* @__PURE__ */ isShallow(source);
			isReadonlySource = /* @__PURE__ */ isReadonly(source);
			source = shallowReadArray(source);
		}
		ret = new Array(source.length);
		for (let i = 0, l = source.length; i < l; i++) ret[i] = renderItem(needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i], i, void 0, cached && cached[i]);
	} else if (typeof source === "number") {
		ret = new Array(source);
		for (let i = 0; i < source; i++) ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
	} else if (isObject(source)) if (source[Symbol.iterator]) ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
	else {
		const keys = Object.keys(source);
		ret = new Array(keys.length);
		for (let i = 0, l = keys.length; i < l; i++) {
			const key = keys[i];
			ret[i] = renderItem(source[key], key, i, cached && cached[i]);
		}
	}
	else ret = [];
	if (cache) cache[index] = ret;
	return ret;
}
var getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
var publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => i.props,
	$attrs: (i) => i.attrs,
	$slots: (i) => i.slots,
	$refs: (i) => i.refs,
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => resolveMergedOptions(i),
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
	$watch: (i) => instanceWatch.bind(i)
});
var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
var PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") return true;
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) switch (n) {
				case 1: return setupState[key];
				case 2: return data[key];
				case 4: return ctx[key];
				case 3: return props[key];
			}
			else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				accessCache[key] = 2;
				return data[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (shouldCacheAccess) accessCache[key] = 0;
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") track(instance.attrs, "get", "");
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
		else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
	},
	set({ _: instance }, key, value) {
		const { data, setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
			data[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) return false;
		if (key[0] === "$" && key.slice(1) in instance) return false;
		else ctx[key] = value;
		return true;
	},
	has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) target._.accessCache[key] = 0;
		else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
		return Reflect.defineProperty(target, key, descriptor);
	}
};
function normalizePropsOrEmits(props) {
	return isArray(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
}
var shouldCacheAccess = true;
function applyOptions(instance) {
	const options = resolveMergedOptions(instance);
	const publicThis = instance.proxy;
	const ctx = instance.ctx;
	shouldCacheAccess = false;
	if (options.beforeCreate) callHook(options.beforeCreate, instance, "bc");
	const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
	const checkDuplicateProperties = null;
	if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
	if (methods) for (const key in methods) {
		const methodHandler = methods[key];
		if (isFunction(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
	}
	if (dataOptions) {
		const data = dataOptions.call(publicThis, publicThis);
		if (!isObject(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
	}
	shouldCacheAccess = true;
	if (computedOptions) for (const key in computedOptions) {
		const opt = computedOptions[key];
		const c = computed({
			get: isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
			set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP
		});
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => c.value,
			set: (v) => c.value = v
		});
	}
	if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
	if (provideOptions) {
		const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
		Reflect.ownKeys(provides).forEach((key) => {
			provide(key, provides[key]);
		});
	}
	if (created) callHook(created, instance, "c");
	function registerLifecycleHook(register, hook) {
		if (isArray(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
		else if (hook) register(hook.bind(publicThis));
	}
	registerLifecycleHook(onBeforeMount, beforeMount);
	registerLifecycleHook(onMounted, mounted);
	registerLifecycleHook(onBeforeUpdate, beforeUpdate);
	registerLifecycleHook(onUpdated, updated);
	registerLifecycleHook(onActivated, activated);
	registerLifecycleHook(onDeactivated, deactivated);
	registerLifecycleHook(onErrorCaptured, errorCaptured);
	registerLifecycleHook(onRenderTracked, renderTracked);
	registerLifecycleHook(onRenderTriggered, renderTriggered);
	registerLifecycleHook(onBeforeUnmount, beforeUnmount);
	registerLifecycleHook(onUnmounted, unmounted);
	registerLifecycleHook(onServerPrefetch, serverPrefetch);
	if (isArray(expose)) {
		if (expose.length) {
			const exposed = instance.exposed || (instance.exposed = {});
			expose.forEach((key) => {
				Object.defineProperty(exposed, key, {
					get: () => publicThis[key],
					set: (val) => publicThis[key] = val,
					enumerable: true
				});
			});
		} else if (!instance.exposed) instance.exposed = {};
	}
	if (render && instance.render === NOOP) instance.render = render;
	if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
	if (components) instance.components = components;
	if (directives) instance.directives = directives;
	if (serverPrefetch) markAsyncBoundary(instance);
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
	if (isArray(injectOptions)) injectOptions = normalizeInject(injectOptions);
	for (const key in injectOptions) {
		const opt = injectOptions[key];
		let injected;
		if (isObject(opt)) if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
		else injected = inject(opt.from || key);
		else injected = inject(opt);
		if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => injected.value,
			set: (v) => injected.value = v
		});
		else ctx[key] = injected;
	}
}
function callHook(hook, instance, type) {
	callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
	let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
	if (isString(raw)) {
		const handler = ctx[raw];
		if (isFunction(handler)) watch(getter, handler);
	} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
	else if (isObject(raw)) if (isArray(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
	else {
		const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
		if (isFunction(handler)) watch(getter, handler, raw);
	}
}
function resolveMergedOptions(instance) {
	const base = instance.type;
	const { mixins, extends: extendsOptions } = base;
	const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
	const cached = cache.get(base);
	let resolved;
	if (cached) resolved = cached;
	else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
	else {
		resolved = {};
		if (globalMixins.length) globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
		mergeOptions(resolved, base, optionMergeStrategies);
	}
	if (isObject(base)) cache.set(base, resolved);
	return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
	const { mixins, extends: extendsOptions } = from;
	if (extendsOptions) mergeOptions(to, extendsOptions, strats, true);
	if (mixins) mixins.forEach((m) => mergeOptions(to, m, strats, true));
	for (const key in from) if (asMixin && key === "expose") {} else {
		const strat = internalOptionMergeStrats[key] || strats && strats[key];
		to[key] = strat ? strat(to[key], from[key]) : from[key];
	}
	return to;
}
var internalOptionMergeStrats = {
	data: mergeDataFn,
	props: mergeEmitsOrPropsOptions,
	emits: mergeEmitsOrPropsOptions,
	methods: mergeObjectOptions,
	computed: mergeObjectOptions,
	beforeCreate: mergeAsArray,
	created: mergeAsArray,
	beforeMount: mergeAsArray,
	mounted: mergeAsArray,
	beforeUpdate: mergeAsArray,
	updated: mergeAsArray,
	beforeDestroy: mergeAsArray,
	beforeUnmount: mergeAsArray,
	destroyed: mergeAsArray,
	unmounted: mergeAsArray,
	activated: mergeAsArray,
	deactivated: mergeAsArray,
	errorCaptured: mergeAsArray,
	serverPrefetch: mergeAsArray,
	components: mergeObjectOptions,
	directives: mergeObjectOptions,
	watch: mergeWatchOptions,
	provide: mergeDataFn,
	inject: mergeInject
};
function mergeDataFn(to, from) {
	if (!from) return to;
	if (!to) return from;
	return function mergedDataFn() {
		return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
	};
}
function mergeInject(to, from) {
	return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
	if (isArray(raw)) {
		const res = {};
		for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
		return res;
	}
	return raw;
}
function mergeAsArray(to, from) {
	return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
	return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
	if (to) {
		if (isArray(to) && isArray(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
		return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
	} else return from;
}
function mergeWatchOptions(to, from) {
	if (!to) return from;
	if (!from) return to;
	const merged = extend(/* @__PURE__ */ Object.create(null), to);
	for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
	return merged;
}
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var uid$1 = 0;
function createAppAPI(render, hydrate) {
	return function createApp(rootComponent, rootProps = null) {
		if (!isFunction(rootComponent)) rootComponent = extend({}, rootComponent);
		if (rootProps != null && !isObject(rootProps)) rootProps = null;
		const context = createAppContext();
		const installedPlugins = /* @__PURE__ */ new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: uid$1++,
			_component: rootComponent,
			_props: rootProps,
			_container: null,
			_context: context,
			_instance: null,
			version,
			get config() {
				return context.config;
			},
			set config(v) {},
			use(plugin, ...options) {
				if (installedPlugins.has(plugin)) {} else if (plugin && isFunction(plugin.install)) {
					installedPlugins.add(plugin);
					plugin.install(app, ...options);
				} else if (isFunction(plugin)) {
					installedPlugins.add(plugin);
					plugin(app, ...options);
				}
				return app;
			},
			mixin(mixin) {
				if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
				return app;
			},
			component(name, component) {
				if (!component) return context.components[name];
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				if (!directive) return context.directives[name];
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, isHydrate, namespace) {
				if (!isMounted) {
					const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
					vnode.appContext = context;
					if (namespace === true) namespace = "svg";
					else if (namespace === false) namespace = void 0;
					if (isHydrate && hydrate) hydrate(vnode, rootContainer);
					else render(vnode, rootContainer, namespace);
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					return getComponentPublicInstance(vnode.component);
				}
			},
			onUnmount(cleanupFn) {
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					delete app._container.__vue_app__;
				}
			},
			provide(key, value) {
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
var currentApp = null;
var getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		if (modifiers.number) args = rawArgs.map(looseToNumber);
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
	if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate(event))];
	if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
	const onceHandler = props[handlerName + `Once`];
	if (onceHandler) {
		if (!instance.emitted) instance.emitted = {};
		else if (instance.emitted[handlerName]) return;
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) return cached;
	const raw = comp.emits;
	let normalized = {};
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendEmits = (raw2) => {
			const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
			if (normalizedFromExtend) {
				hasExtends = true;
				extend(normalized, normalizedFromExtend);
			}
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
		if (comp.extends) extendEmits(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendEmits);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, null);
		return null;
	}
	if (isArray(raw)) raw.forEach((key) => normalized[key] = null);
	else extend(normalized, raw);
	if (isObject(comp)) cache.set(comp, normalized);
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) return false;
	key = key.slice(2);
	key = key === "Once" ? key : key.replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			result = normalizeVNode(render2.length > 1 ? render2(props, {
				attrs,
				slots,
				emit
			}) : render2(props, null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		blockStack.length = 0;
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				root = cloneVNode(root, fallthroughAttrs, false, true);
			}
		}
	}
	if (vnode.dirs) {
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) setTransitionHooks(root, vnode.transition);
	result = root;
	setCurrentRenderingInstance(prev);
	return result;
}
var getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
	return res;
};
var filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
	return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if (nextVNode.dirs || nextVNode.transition) return true;
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) return true;
		if (patchFlag & 16) {
			if (!prevProps) return !!nextProps;
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) return true;
		}
		if (prevProps === nextProps) return false;
		if (!prevProps) return !!nextProps;
		if (!nextProps) return true;
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) return true;
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
	}
	return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
	const nextProp = nextProps[key];
	const prevProp = prevProps[key];
	if (key === "style" && isObject(nextProp) && isObject(prevProp)) return !looseEqual(nextProp, prevProp);
	return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.suspense.vnode.el = root.el = el;
			vnode = root;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else break;
	}
	if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
}
var internalObjectProto = {};
var createInternalObject = () => Object.create(internalObjectProto);
var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = /* @__PURE__ */ Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
	if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
	else if (!instance.type.props) instance.props = attrs;
	else instance.props = props;
	instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = /* @__PURE__ */ toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) continue;
				const value = rawProps[key];
				if (options) if (hasOwn(attrs, key)) {
					if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				} else {
					const camelizedKey = camelize(key);
					props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
				}
				else if (value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
		let kebabKey;
		for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) if (options) {
			if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
		} else delete props[key];
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
				delete attrs[key];
				hasAttrsChanged = true;
			}
		}
	}
	if (hasAttrsChanged) trigger(instance.attrs, "set", "");
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) for (let key in rawProps) {
		if (isReservedProp(key)) continue;
		const value = rawProps[key];
		let camelKey;
		if (options && hasOwn(options, camelKey = camelize(key))) if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
		else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
		else if (!isEmitListener(instance.emitsOptions, key)) {
			if (!(key in attrs) || value !== attrs[key]) {
				attrs[key] = value;
				hasAttrsChanged = true;
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) value = propsDefaults[key];
				else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else value = defaultValue;
			if (instance.ce) instance.ce._setProp(key, value);
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) value = false;
			else if (opt[1] && (value === "" || value === hyphenate(key))) value = true;
		}
	}
	return value;
}
var mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinPropsCache : appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) return cached;
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendProps = (raw2) => {
			hasExtends = true;
			const [props, keys] = normalizePropsOptions(raw2, appContext, true);
			extend(normalized, props);
			if (keys) needCastKeys.push(...keys);
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
		if (comp.extends) extendProps(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendProps);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, EMPTY_ARR);
		return EMPTY_ARR;
	}
	if (isArray(raw)) for (let i = 0; i < raw.length; i++) {
		const normalizedKey = camelize(raw[i]);
		if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
	}
	else if (raw) for (const key in raw) {
		const normalizedKey = camelize(key);
		if (validatePropName(normalizedKey)) {
			const opt = raw[key];
			const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
			const propType = prop.type;
			let shouldCast = false;
			let shouldCastTrue = true;
			if (isArray(propType)) for (let index = 0; index < propType.length; ++index) {
				const type = propType[index];
				const typeName = isFunction(type) && type.name;
				if (typeName === "Boolean") {
					shouldCast = true;
					break;
				} else if (typeName === "String") shouldCastTrue = false;
			}
			else shouldCast = isFunction(propType) && propType.name === "Boolean";
			prop[0] = shouldCast;
			prop[1] = shouldCastTrue;
			if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject(comp)) cache.set(comp, res);
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) return true;
	return false;
}
var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
var normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
var normalizeSlot = (key, rawSlot, ctx) => {
	if (rawSlot._n) return rawSlot;
	const normalized = withCtx((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
var normalizeObjectSlots = (rawSlots, slots, instance) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction(value)) slots[key] = normalizeSlot(key, value, ctx);
		else if (value != null) {
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
var normalizeVNodeSlots = (instance, children) => {
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
var assignSlots = (slots, children, optimized) => {
	for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
};
var initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) def(slots, "_", type, true);
		} else normalizeObjectSlots(children, slots);
	} else if (children) normalizeVNodeSlots(instance, children);
};
var updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) if (optimized && type === 1) needDeletionCheck = false;
		else assignSlots(slots, children, optimized);
		else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
	}
};
var queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
	const target = getGlobalThis();
	target.__VUE__ = true;
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
		if (n1 === n2) return;
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
		}
		if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) hostSetText(el, n2.children);
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		else n2.el = n1.el;
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") namespace = "svg";
		else if (n2.type === "math") namespace = "mathml";
		if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else {
			const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
			try {
				if (customElement) customElement._beginPatch();
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) customElement._endPatch();
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) hostSetElementText(el, vnode.children);
		else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
			if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
			if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) transition.beforeEnter(el);
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
			try {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			} finally {}
		}, parentSuspense);
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) hostSetScopeId(el, scopeId);
		if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) {
			const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
			patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		parentComponent && toggleRecurse(parentComponent, true);
		if (dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
		if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
		else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		if (patchFlag > 0) {
			if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
			else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
				}
				if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) hostSetElementText(el, n2.children);
			}
		} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
		}, parentSuspense);
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer;
			patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
			}
			if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
			if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
		} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
		else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
		else updateComponent(n1, n2, optimized);
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
		setupComponent(instance, false, optimized);
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) if (instance.asyncDep && !instance.asyncResolved) {
			updateComponentPreRender(instance, n2, optimized);
			return;
		} else {
			instance.next = n2;
			instance.update();
		}
		else {
			n2.el = n1.el;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { el, props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) invokeArrayFns(bm);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
				toggleRecurse(instance, true);
				if (el && hydrateNode) {
					const hydrateSubTree = () => {
						instance.subTree = renderComponentRoot(instance);
						hydrateNode(el, instance.subTree, instance, parentSuspense, null);
					};
					if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
					else hydrateSubTree();
				} else {
					if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
					const subTree = instance.subTree = renderComponentRoot(instance);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					initialVNode.el = subTree.el;
				}
				if (m) queuePostRenderEffect(m, parentSuspense);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				instance.isMounted = true;
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
					if (nonHydratedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						nonHydratedAsyncRoot.asyncDep.then(() => {
							queuePostRenderEffect(() => {
								if (!instance.isUnmounted) update();
							}, parentSuspense);
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else next = vnode;
				if (bu) invokeArrayFns(bu);
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
				toggleRecurse(instance, true);
				const nextTree = renderComponentRoot(instance);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
				next.el = nextTree.el;
				if (originNext === null) updateHOCHostEl(instance, nextTree.el);
				if (u) queuePostRenderEffect(u, parentSuspense);
				if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => queueJob(job);
		toggleRecurse(instance, true);
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
			if (c2 !== c1) hostSetElementText(container, c2);
		} else if (prevShapeFlag & 16) if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else unmountChildren(c1, parentComponent, parentSuspense, true);
		else {
			if (prevShapeFlag & 8) hostSetElementText(container, "");
			if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i;
		for (i = 0; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) while (i <= e1) {
			unmount(c1[i], parentComponent, parentSuspense, true);
			i++;
		}
		else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = /* @__PURE__ */ new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
				else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
					newIndex = j;
					break;
				}
				if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
				else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
					else moved = true;
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (moved) if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
				else j--;
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		if (moveType !== 2 && shapeFlag & 1 && transition) if (moveType === 0) if (transition.persisted && !el[leaveCbKey]) hostInsert(el, container, anchor);
		else {
			transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			queuePostRenderEffect(() => transition.enter(el), parentSuspense);
		}
		else {
			const { leave, delayLeave, afterLeave } = transition;
			const remove2 = () => {
				if (vnode.ctx.isUnmounted) hostRemove(el);
				else hostInsert(el, container, anchor);
			};
			const performLeave = () => {
				const wasLeaving = el._isLeaving || !!el[leaveCbKey];
				if (el._isLeaving) el[leaveCbKey](true);
				if (transition.persisted && !wasLeaving) remove2();
				else leave(el, () => {
					remove2();
					afterLeave && afterLeave();
				});
			};
			if (delayLeave) delayLeave(el, remove2, performLeave);
			else performLeave();
		}
		else hostInsert(el, container, anchor);
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
		if (patchFlag === -2) optimized = false;
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
		if (shapeFlag & 256) {
			parentComponent.ctx.deactivate(vnode);
			return;
		}
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
		else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
			if (doRemove) remove(vnode);
		}
		const shouldInvalidateMemo = memo != null && cacheIndex == null;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
			shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			if (shouldInvalidateMemo) vnode.el = null;
		}, parentSuspense);
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		if (type === Fragment) {
			removeFragment(el, anchor);
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			return;
		}
		const performRemove = () => {
			hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
		};
		if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const performLeave = () => leave(el, performRemove);
			if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
			else performLeave();
		} else performRemove();
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) invokeArrayFns(bum);
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) queuePostRenderEffect(um, parentSuspense);
		queuePostRenderEffect(() => {
			instance.isUnmounted = true;
		}, parentSuspense);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
		if (vnode.shapeFlag & 128) return vnode.suspense.next();
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	let isFlushing = false;
	const render = (vnode, container, namespace) => {
		let instance;
		if (vnode == null) {
			if (container._vnode) {
				unmount(container._vnode, null, null, true);
				instance = container._vnode.component;
			}
		} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
		container._vnode = vnode;
		if (!isFlushing) {
			isFlushing = true;
			flushPreFlushCbs(instance);
			flushPostFlushCbs();
			isFlushing = false;
		}
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	let hydrate;
	let hydrateNode;
	if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
	return {
		render,
		hydrate,
		createApp: createAppAPI(render, hydrate)
	};
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray(ch1) && isArray(ch2)) for (let i = 0; i < ch1.length; i++) {
		const c1 = ch1[i];
		let c2 = ch2[i];
		if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
			if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
				c2 = ch2[i] = cloneIfMounted(ch2[i]);
				c2.el = c1.el;
			}
			if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
		}
		if (c2.type === Text) {
			if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
			c2.el = c1.el;
		}
		if (c2.type === Comment && !c2.el) c2.el = c1.el;
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) u = c + 1;
				else v = c;
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) p[i] = result[u - 1];
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateNonHydratedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
	else return locateNonHydratedAsyncRoot(subComponent);
}
function invalidateMount(hooks) {
	if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) return anchorVnode.placeholder;
	const instance = anchorVnode.component;
	if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
	return null;
}
var isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) if (isArray(fn)) suspense.effects.push(...fn);
	else suspense.effects.push(fn);
	else queuePostFlushCb(fn);
}
var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
var Text = /* @__PURE__ */ Symbol.for("v-txt");
var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
var Static = /* @__PURE__ */ Symbol.for("v-stc");
var blockStack = [];
var currentBlock = null;
function openBlock(disableTracking = false) {
	blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
	blockStack.pop();
	currentBlock = blockStack[blockStack.length - 1] || null;
}
var isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
	isBlockTreeEnabled += value;
	if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
}
function setupBlock(vnode) {
	vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
	closeBlock();
	if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
	return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
	return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
	return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	return n1.type === n2.type && n1.key === n2.key;
}
var normalizeKey = ({ key }) => key != null ? key : null;
var normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") ref = "" + ref;
	return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) type.normalize(vnode);
	} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
	if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
	return vnode;
}
var createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
	if (isVNode(type)) {
		const cloned = cloneVNode(type, props, true);
		if (children) normalizeChildren(cloned, children);
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
		else currentBlock.push(cloned);
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) type = type.__vccOpts;
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (isObject(style)) {
			if (/* @__PURE__ */ isProxy(style) && !isArray(style)) style = extend({}, style);
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce
	};
	if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
	return cloned;
}
function createTextVNode(text = " ", flag = 0) {
	return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
	const vnode = createVNode(Static, null, content);
	vnode.staticCount = numberOfNodes;
	return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
	return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") return createVNode(Comment);
	else if (isArray(child)) return createVNode(Fragment, null, child.slice());
	else if (isVNode(child)) return cloneIfMounted(child);
	else return createVNode(Text, null, String(child));
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) children = null;
	else if (isArray(children)) type = 16;
	else if (typeof children === "object") if (shapeFlag & 65) {
		const slot = children.default;
		if (slot) {
			slot._c && (slot._d = false);
			normalizeChildren(vnode, slot());
			slot._c && (slot._d = true);
		}
		return;
	} else {
		type = 32;
		const slotFlag = children._;
		if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
		else if (slotFlag === 3 && currentRenderingInstance) if (currentRenderingInstance.slots._ === 1) children._ = 1;
		else {
			children._ = 2;
			vnode.patchFlag |= 1024;
		}
	}
	else if (isFunction(children)) {
		if (shapeFlag & 65) {
			normalizeChildren(vnode, { default: children });
			return;
		}
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else type = 8;
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < args.length; i++) {
		const toMerge = args[i];
		for (const key in toMerge) if (key === "class") {
			if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
		} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
		else if (isOn(key)) {
			const existing = ret[key];
			const incoming = toMerge[key];
			if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
			else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
		} else if (key !== "") ret[key] = toMerge[key];
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
var emptyAppContext = createAppContext();
var uid = 0;
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(true),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emit: null,
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		ctx: EMPTY_OBJ,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	instance.ctx = { _: instance };
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(null, instance);
	if (vnode.ce) vnode.ce(instance);
	return instance;
}
var currentInstance = null;
var getCurrentInstance = () => currentInstance || currentRenderingInstance;
var internalSetCurrentInstance;
var setInSSRSetupState;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
	setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
}
var setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
var unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
var isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
	isSSR && setInSSRSetupState(isSSR);
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful, isSSR);
	initSlots(instance, children, optimized || isSSR);
	const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
	isSSR && setInSSRSetupState(false);
	return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
	const Component = instance.type;
	instance.accessCache = /* @__PURE__ */ Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			if (isSSR) return setupResult.then((resolvedResult) => {
				handleSetupResult(instance, resolvedResult, isSSR);
			}).catch((e) => {
				handleError(e, instance, 0);
			});
			else instance.asyncDep = setupResult;
		} else handleSetupResult(instance, setupResult, isSSR);
	} else finishComponentSetup(instance, isSSR);
}
function handleSetupResult(instance, setupResult, isSSR) {
	if (isFunction(setupResult)) if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
	else instance.render = setupResult;
	else if (isObject(setupResult)) instance.setupState = proxyRefs(setupResult);
	finishComponentSetup(instance, isSSR);
}
var compile;
var installWithProxy;
function finishComponentSetup(instance, isSSR, skipOptions) {
	const Component = instance.type;
	if (!instance.render) {
		if (!isSSR && compile && !Component.render) {
			const template = Component.template || resolveMergedOptions(instance).template;
			if (template) {
				const { isCustomElement, compilerOptions } = instance.appContext.config;
				const { delimiters, compilerOptions: componentCompilerOptions } = Component;
				Component.render = compile(template, extend(extend({
					isCustomElement,
					delimiters
				}, compilerOptions), componentCompilerOptions));
			}
		}
		instance.render = Component.render || NOOP;
		if (installWithProxy) installWithProxy(instance);
	}
	{
		const reset = setCurrentInstance(instance);
		pauseTracking();
		try {
			applyOptions(instance);
		} finally {
			resetTracking();
			reset();
		}
	}
}
var attrsProxyHandlers = { get(target, key) {
	track(target, "get", "");
	return target[key];
} };
function createSetupContext(instance) {
	const expose = (exposed) => {
		instance.exposed = exposed || {};
	};
	return {
		attrs: new Proxy(instance.attrs, attrsProxyHandlers),
		slots: instance.slots,
		emit: instance.emit,
		expose
	};
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
		get(target, key) {
			if (key in target) return target[key];
			else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
		},
		has(target, key) {
			return key in target || key in publicPropertiesMap;
		}
	}));
	else return instance.proxy;
}
function isClassComponent(value) {
	return isFunction(value) && "__vccOpts" in value;
}
var computed = (getterOrOptions, debugOptions) => {
	return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
var version = "3.5.40";
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
/**
* @vue/runtime-dom v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var policy = void 0;
var tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) try {
	policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
} catch (e) {}
var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
var svgNS = "http://www.w3.org/2000/svg";
var mathmlNS = "http://www.w3.org/1998/Math/MathML";
var doc = typeof document !== "undefined" ? document : null;
var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
var nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) parent.removeChild(child);
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) while (true) {
			parent.insertBefore(start.cloneNode(true), anchor);
			if (start === end || !(start = start.nextSibling)) break;
		}
		else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
var vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	if (value == null) el.removeAttribute("class");
	else if (isSVG) el.setAttribute("class", value);
	else el.className = value;
}
var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
var displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) if (!isString(prev)) {
			for (const key in prev) if (next[key] == null) setStyle(style, key, "");
		} else for (const prevStyle of prev.split(";")) {
			const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
			if (next[key] == null) setStyle(style, key, "");
		}
		for (const key in next) {
			if (key === "display") hasControlledDisplay = true;
			const value = next[key];
			if (value != null) {
				if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle(style, key, value);
			} else setStyle(style, key, "");
		}
	} else if (isCssString) {
		if (prev !== next) {
			const cssVarText = style[CSS_VAR_TEXT];
			if (cssVarText) next += ";" + cssVarText;
			style.cssText = next;
			hasControlledDisplay = displayRE.test(next);
		}
	} else if (prev) el.removeAttribute("style");
	if (vShowOriginalDisplay in el) {
		el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) style.display = "none";
	}
}
var importantRE = /\s*!important$/;
function setStyle(style, name, val) {
	if (isArray(val)) val.forEach((v) => setStyle(style, name, v));
	else {
		if (val == null) val = "";
		if (name.startsWith("--")) style.setProperty(name, val);
		else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
			else style[prefixed] = val;
		}
	}
}
var prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
var prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) return cached;
	let name = camelize(rawName);
	if (name !== "filter" && name in style) return prefixCache[rawName] = name;
	name = capitalize(name);
	for (let i = 0; i < prefixes.length; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) return prefixCache[rawName] = prefixed;
	}
	return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
	return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
var xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
	else el.setAttributeNS(xlinkNS, key, value);
	else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
	else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
		if (value == null) el.removeAttribute(key);
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") value = includeBooleanAttr(value);
		else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch (e) {}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
var veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) existingInvoker.value = nextValue;
	else {
		const [name, options] = parseName(rawName);
		if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
		else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
var optionsModifierRE = /(Once|Passive|Capture)$/;
var optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	let m;
	while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
		if (!options) options = {};
		name = name.slice(0, name.length - m[1].length);
		options[m[1].toLowerCase()] = true;
	}
	return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
}
var cachedNow = 0;
var p = /* @__PURE__ */ Promise.resolve();
var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= invoker.attached) return;
		const value = invoker.value;
		if (isArray(value)) {
			const originalStop = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				originalStop.call(e);
				e._stopped = true;
			};
			const handlers = value.slice();
			const args = [e];
			for (let i = 0; i < handlers.length; i++) {
				if (e._stopped) break;
				const handler = handlers[i];
				if (handler) callWithAsyncErrorHandling(handler, instance, 5, args);
			}
		} else callWithAsyncErrorHandling(value, instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") patchClass(el, nextValue, isSVG);
	else if (key === "style") patchStyle(el, prevValue, nextValue);
	else if (isOn(key)) {
		if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
	} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
	else {
		if (key === "true-value") el._trueValue = nextValue;
		else if (key === "false-value") el._falseValue = nextValue;
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") return true;
		if (key in el && isNativeOn(key) && isFunction(value)) return true;
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
	if (key === "sandbox" && el.tagName === "IFRAME") return false;
	if (key === "form") return false;
	if (key === "list" && el.tagName === "INPUT") return false;
	if (key === "type" && el.tagName === "TEXTAREA") return false;
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
	}
	if (isNativeOn(key) && isString(value)) return false;
	return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
	const props = el._def.props;
	if (!props) return false;
	const camelKey = camelize(key);
	return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
var REMOVAL = {};
// @__NO_SIDE_EFFECTS__
function defineCustomElement(options, extraOptions, _createApp) {
	let Comp = /* @__PURE__ */ defineComponent(options, extraOptions);
	if (isPlainObject(Comp)) Comp = extend({}, Comp, extraOptions);
	class VueCustomElement extends VueElement {
		constructor(initialProps) {
			super(Comp, initialProps, _createApp);
		}
	}
	VueCustomElement.def = Comp;
	return VueCustomElement;
}
var BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
var VueElement = class VueElement extends BaseClass {
	constructor(_def, _props = {}, _createApp = createApp) {
		super();
		this._def = _def;
		this._props = _props;
		this._createApp = _createApp;
		this._isVueCE = true;
		/**
		* @internal
		*/
		this._instance = null;
		/**
		* @internal
		*/
		this._app = null;
		/**
		* @internal
		*/
		this._nonce = this._def.nonce;
		this._connected = false;
		this._resolved = false;
		this._patching = false;
		this._dirty = false;
		this._numberProps = null;
		this._styleChildren = /* @__PURE__ */ new WeakSet();
		this._styleAnchors = /* @__PURE__ */ new WeakMap();
		this._ob = null;
		if (this.shadowRoot && _createApp !== createApp) this._root = this.shadowRoot;
		else if (_def.shadowRoot !== false) {
			this.attachShadow(extend({}, _def.shadowRootOptions, { mode: "open" }));
			this._root = this.shadowRoot;
		} else this._root = this;
	}
	connectedCallback() {
		if (!this.isConnected) return;
		if (!this.shadowRoot && !this._resolved) this._parseSlots();
		this._connected = true;
		let parent = this;
		while (parent = parent && (parent.assignedSlot || parent.parentNode || parent.host)) if (parent instanceof VueElement) {
			this._parent = parent;
			break;
		}
		if (!this._instance) if (this._resolved) this._mount(this._def);
		else if (parent && parent._pendingResolve) this._pendingResolve = parent._pendingResolve.then(() => {
			this._pendingResolve = void 0;
			this._resolveDef();
		});
		else this._resolveDef();
	}
	_setParent(parent = this._parent) {
		if (parent) {
			this._instance.parent = parent._instance;
			this._inheritParentContext(parent);
		}
	}
	_inheritParentContext(parent = this._parent) {
		if (parent && this._app) Object.setPrototypeOf(this._app._context.provides, parent._instance.provides);
	}
	disconnectedCallback() {
		this._connected = false;
		nextTick(() => {
			if (!this._connected) {
				if (this._ob) {
					this._ob.disconnect();
					this._ob = null;
				}
				this._app && this._app.unmount();
				if (this._instance) this._instance.ce = void 0;
				this._app = this._instance = null;
				if (this._teleportTargets) {
					this._teleportTargets.clear();
					this._teleportTargets = void 0;
				}
			}
		});
	}
	_processMutations(mutations) {
		for (const m of mutations) this._setAttr(m.attributeName);
	}
	/**
	* resolve inner component definition (handle possible async component)
	*/
	_resolveDef() {
		if (this._pendingResolve) return;
		for (let i = 0; i < this.attributes.length; i++) this._setAttr(this.attributes[i].name);
		this._ob = new MutationObserver(this._processMutations.bind(this));
		this._ob.observe(this, { attributes: true });
		const resolve = (def, isAsync = false) => {
			this._resolved = true;
			this._pendingResolve = void 0;
			const { props, styles } = def;
			let numberProps;
			if (props && !isArray(props)) for (const key in props) {
				const opt = props[key];
				if (opt === Number || opt && opt.type === Number) {
					if (key in this._props) this._props[key] = toNumber(this._props[key]);
					(numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
				}
			}
			this._numberProps = numberProps;
			this._resolveProps(def);
			if (this.shadowRoot) this._applyStyles(styles);
			this._mount(def);
		};
		const asyncDef = this._def.__asyncLoader;
		if (asyncDef) this._pendingResolve = asyncDef().then((def) => {
			def.configureApp = this._def.configureApp;
			resolve(this._def = def, true);
		});
		else resolve(this._def);
	}
	_mount(def) {
		this._app = this._createApp(def);
		this._inheritParentContext();
		if (def.configureApp) def.configureApp(this._app);
		this._app._ceVNode = this._createVNode();
		this._app.mount(this._root);
		const exposed = this._instance && this._instance.exposed;
		if (!exposed) return;
		for (const key in exposed) if (!hasOwn(this, key)) Object.defineProperty(this, key, { get: () => unref(exposed[key]) });
	}
	_resolveProps(def) {
		const { props } = def;
		const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
		for (const key of Object.keys(this)) if (key[0] !== "_" && declaredPropKeys.includes(key)) this._setProp(key, this[key]);
		for (const key of declaredPropKeys.map(camelize)) Object.defineProperty(this, key, {
			get() {
				return this._getProp(key);
			},
			set(val) {
				this._setProp(key, val, true, !this._patching);
			}
		});
	}
	_setAttr(key) {
		if (key.startsWith("data-v-")) return;
		const has = this.hasAttribute(key);
		let value = has ? this.getAttribute(key) : REMOVAL;
		const camelKey = camelize(key);
		if (has && this._numberProps && this._numberProps[camelKey]) value = toNumber(value);
		this._setProp(camelKey, value, false, true);
	}
	/**
	* @internal
	*/
	_getProp(key) {
		return this._props[key];
	}
	/**
	* @internal
	*/
	_setProp(key, val, shouldReflect = true, shouldUpdate = false) {
		if (val !== this._props[key]) {
			this._dirty = true;
			if (val === REMOVAL) delete this._props[key];
			else {
				this._props[key] = val;
				if (key === "key" && this._app) this._app._ceVNode.key = val;
			}
			if (shouldUpdate && this._instance) this._update();
			if (shouldReflect) {
				const ob = this._ob;
				if (ob) {
					this._processMutations(ob.takeRecords());
					ob.disconnect();
				}
				if (val === true) this.setAttribute(hyphenate(key), "");
				else if (typeof val === "string" || typeof val === "number") this.setAttribute(hyphenate(key), val + "");
				else if (!val) this.removeAttribute(hyphenate(key));
				ob && ob.observe(this, { attributes: true });
			}
		}
	}
	_update() {
		const vnode = this._createVNode();
		if (this._app) vnode.appContext = this._app._context;
		render(vnode, this._root);
	}
	_createVNode() {
		const baseProps = {};
		if (!this.shadowRoot) baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
		const vnode = createVNode(this._def, extend(baseProps, this._props));
		if (!this._instance) vnode.ce = (instance) => {
			this._instance = instance;
			instance.ce = this;
			instance.isCE = true;
			const dispatch = (event, args) => {
				this.dispatchEvent(new CustomEvent(event, isPlainObject(args[0]) ? extend({ detail: args }, args[0]) : { detail: args }));
			};
			instance.emit = (event, ...args) => {
				dispatch(event, args);
				if (hyphenate(event) !== event) dispatch(hyphenate(event), args);
			};
			this._setParent();
		};
		return vnode;
	}
	_applyStyles(styles, owner, parentComp) {
		if (!styles) return;
		if (owner) {
			if (owner === this._def || this._styleChildren.has(owner)) return;
			this._styleChildren.add(owner);
		}
		const nonce = this._nonce;
		const root = this.shadowRoot;
		const insertionAnchor = parentComp ? this._getStyleAnchor(parentComp) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(root);
		let last = null;
		for (let i = styles.length - 1; i >= 0; i--) {
			const s = document.createElement("style");
			if (nonce) s.setAttribute("nonce", nonce);
			s.textContent = styles[i];
			root.insertBefore(s, last || insertionAnchor);
			last = s;
			if (i === 0) {
				if (!parentComp) this._styleAnchors.set(this._def, s);
				if (owner) this._styleAnchors.set(owner, s);
			}
		}
	}
	_getStyleAnchor(comp) {
		if (!comp) return null;
		const anchor = this._styleAnchors.get(comp);
		if (anchor && anchor.parentNode === this.shadowRoot) return anchor;
		if (anchor) this._styleAnchors.delete(comp);
		return null;
	}
	_getRootStyleInsertionAnchor(root) {
		for (let i = 0; i < root.childNodes.length; i++) {
			const node = root.childNodes[i];
			if (!(node instanceof HTMLStyleElement)) return node;
		}
		return null;
	}
	/**
	* Only called when shadowRoot is false
	*/
	_parseSlots() {
		const slots = this._slots = {};
		let n;
		while (n = this.firstChild) {
			const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
			(slots[slotName] || (slots[slotName] = [])).push(n);
			this.removeChild(n);
		}
	}
	/**
	* Only called when shadowRoot is false
	*/
	_renderSlots() {
		const outlets = this._getSlots();
		const scopeId = this._instance.type.__scopeId;
		for (let i = 0; i < outlets.length; i++) {
			const o = outlets[i];
			const slotName = o.getAttribute("name") || "default";
			const content = this._slots[slotName];
			const parent = o.parentNode;
			if (content) for (const n of content) {
				if (scopeId && n.nodeType === 1) {
					const id = scopeId + "-s";
					const walker = document.createTreeWalker(n, 1);
					n.setAttribute(id, "");
					let child;
					while (child = walker.nextNode()) child.setAttribute(id, "");
				}
				parent.insertBefore(n, o);
			}
			else while (o.firstChild) parent.insertBefore(o.firstChild, o);
			parent.removeChild(o);
		}
	}
	/**
	* @internal
	*/
	_getSlots() {
		const roots = [this];
		if (this._teleportTargets) roots.push(...this._teleportTargets);
		const slots = /* @__PURE__ */ new Set();
		for (const root of roots) {
			const found = root.querySelectorAll("slot");
			for (let i = 0; i < found.length; i++) slots.add(found[i]);
		}
		return Array.from(slots);
	}
	/**
	* @internal
	*/
	_injectChildStyle(comp, parentComp) {
		this._applyStyles(comp.styles, comp, parentComp);
	}
	/**
	* @internal
	*/
	_beginPatch() {
		this._patching = true;
		this._dirty = false;
	}
	/**
	* @internal
	*/
	_endPatch() {
		this._patching = false;
		if (this._dirty && this._instance) this._update();
	}
	/**
	* @internal
	*/
	_hasShadowRoot() {
		return this._def.shadowRoot !== false;
	}
	/**
	* @internal
	*/
	_removeChildStyle(comp) {}
};
var getModelAssigner = (vnode) => {
	const fn = vnode.props["onUpdate:modelValue"] || false;
	return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
	e.target.composing = true;
}
function onCompositionEnd(e) {
	const target = e.target;
	if (target.composing) {
		target.composing = false;
		target.dispatchEvent(new Event("input"));
	}
}
var assignKey = /* @__PURE__ */ Symbol("_assign");
function castValue(value, trim, number) {
	if (trim) value = value.trim();
	if (number) value = looseToNumber(value);
	return value;
}
var vModelText = {
	created(el, { modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		const castToNumber = number || vnode.props && vnode.props.type === "number";
		addEventListener(el, lazy ? "change" : "input", (e) => {
			if (e.target.composing) return;
			el[assignKey](castValue(el.value, trim, castToNumber));
		});
		if (trim || castToNumber) addEventListener(el, "change", () => {
			el.value = castValue(el.value, trim, castToNumber);
		});
		if (!lazy) {
			addEventListener(el, "compositionstart", onCompositionStart);
			addEventListener(el, "compositionend", onCompositionEnd);
			addEventListener(el, "change", onCompositionEnd);
		}
	},
	mounted(el, { value }) {
		el.value = value == null ? "" : value;
	},
	beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (el.composing) return;
		const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
		const newValue = value == null ? "" : value;
		if (elValue === newValue) return;
		const rootNode = el.getRootNode();
		if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
			if (lazy && value === oldValue) return;
			if (trim && el.value.trim() === newValue) return;
		}
		el.value = newValue;
	}
};
var vModelCheckbox = {
	deep: true,
	created(el, _, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			const modelValue = el._modelValue;
			const elementValue = getValue(el);
			const checked = el.checked;
			const assign = el[assignKey];
			if (isArray(modelValue)) {
				const index = looseIndexOf(modelValue, elementValue);
				const found = index !== -1;
				if (checked && !found) assign(modelValue.concat(elementValue));
				else if (!checked && found) {
					const filtered = [...modelValue];
					filtered.splice(index, 1);
					assign(filtered);
				}
			} else if (isSet(modelValue)) {
				const cloned = new Set(modelValue);
				if (checked) cloned.add(elementValue);
				else cloned.delete(elementValue);
				assign(cloned);
			} else assign(getCheckboxValue(el, checked));
		});
	},
	mounted: setChecked,
	beforeUpdate(el, binding, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		setChecked(el, binding, vnode);
	}
};
function setChecked(el, { value, oldValue }, vnode) {
	el._modelValue = value;
	let checked;
	if (isArray(value)) checked = looseIndexOf(value, vnode.props.value) > -1;
	else if (isSet(value)) checked = value.has(vnode.props.value);
	else {
		if (value === oldValue) return;
		checked = looseEqual(value, getCheckboxValue(el, true));
	}
	if (el.checked !== checked) el.checked = checked;
}
var vModelRadio = {
	created(el, { value }, vnode) {
		el.checked = looseEqual(value, vnode.props.value);
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			el[assignKey](getValue(el));
		});
	},
	beforeUpdate(el, { value, oldValue }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (value !== oldValue) el.checked = looseEqual(value, vnode.props.value);
	}
};
var vModelSelect = {
	deep: true,
	created(el, { value, modifiers: { number } }, vnode) {
		el._modelValue = value;
		addEventListener(el, "change", () => {
			const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map((o) => number ? looseToNumber(getValue(o)) : getValue(o));
			el[assignKey](el.multiple ? isSet(el._modelValue) ? new Set(selectedVal) : selectedVal : selectedVal[0]);
			el._assigning = true;
			nextTick(() => {
				el._assigning = false;
			});
		});
		el[assignKey] = getModelAssigner(vnode);
	},
	mounted(el, { value }) {
		setSelected(el, value);
	},
	beforeUpdate(el, { value }, vnode) {
		el._modelValue = value;
		el[assignKey] = getModelAssigner(vnode);
	},
	updated(el, { value }) {
		if (!el._assigning) setSelected(el, value);
	}
};
function setSelected(el, value) {
	const isMultiple = el.multiple;
	const isArrayValue = isArray(value);
	if (isMultiple && !isArrayValue && !isSet(value)) return;
	for (let i = 0, l = el.options.length; i < l; i++) {
		const option = el.options[i];
		const optionValue = getValue(option);
		if (isMultiple) if (isArrayValue) {
			const optionType = typeof optionValue;
			if (optionType === "string" || optionType === "number") option.selected = value.some((v) => String(v) === String(optionValue));
			else option.selected = looseIndexOf(value, optionValue) > -1;
		} else option.selected = value.has(optionValue);
		else if (looseEqual(getValue(option), value)) {
			if (el.selectedIndex !== i) el.selectedIndex = i;
			return;
		}
	}
	if (!isMultiple && el.selectedIndex !== -1) el.selectedIndex = -1;
}
function getValue(el) {
	return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
	const key = checked ? "_trueValue" : "_falseValue";
	return key in el ? el[key] : checked;
}
var systemModifiers = [
	"ctrl",
	"shift",
	"alt",
	"meta"
];
var modifierGuards = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
var withModifiers = (fn, modifiers) => {
	if (!fn) return fn;
	const cache = fn._withMods || (fn._withMods = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
		for (let i = 0; i < modifiers.length; i++) {
			const guard = modifierGuards[modifiers[i]];
			if (guard && guard(event, modifiers)) return;
		}
		return fn(event, ...args);
	}));
};
var keyNames = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
};
var withKeys = (fn, modifiers) => {
	const cache = fn._withKeys || (fn._withKeys = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event) => {
		if (!("key" in event)) return;
		const eventKey = hyphenate(event.key);
		if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) return fn(event);
	}));
};
var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
var renderer;
function ensureRenderer() {
	return renderer || (renderer = createRenderer(rendererOptions));
}
var render = ((...args) => {
	ensureRenderer().render(...args);
});
var createApp = ((...args) => {
	const app = ensureRenderer().createApp(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
		if (container.nodeType === 1) container.textContent = "";
		const proxy = mount(container, false, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
});
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) return "svg";
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
}
function normalizeContainer(container) {
	if (isString(container)) return document.querySelector(container);
	return container;
}
//#endregion
//#region src/App.ce.vue?vue&type=style&index=0&inline&lang.css
var App_ce_vue_vue_type_style_index_0_inline_lang_default = "\n:host {\r\n  color: #193330;\r\n  display: block;\r\n  font-family:\r\n    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\",\r\n    sans-serif;\n}\n* {\r\n  box-sizing: border-box;\n}\n.showcase-shell {\r\n  display: grid;\r\n  gap: 1.5rem;\n}\n.showcase-header,\r\nsection {\r\n  background: #f5fbf8;\r\n  border: 1px solid #c9ddd5;\r\n  border-radius: 1rem;\r\n  padding: clamp(1.25rem, 4vw, 2.5rem);\n}\n.section-intro {\r\n  color: #4c625e;\n}\n.notice {\r\n  align-items: center;\r\n  background: #dff6e9;\r\n  border: 1px solid #58a27e;\r\n  border-radius: 0.75rem;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  margin: 1rem 0;\r\n  padding: 0.75rem 1rem;\n}\n.gallery-grid,\r\n.gallery-stack {\r\n  display: grid;\r\n  gap: 1rem;\r\n  min-width: 0;\n}\n.gallery-grid {\r\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\r\n  margin-top: 1.5rem;\n}\n.gallery-card {\r\n  background: rgb(255 255 255 / 72%);\r\n  border: 1px solid #c9ddd5;\r\n  border-radius: 0.8rem;\r\n  display: grid;\r\n  gap: 1rem;\r\n  min-width: 0;\r\n  padding: 1.25rem;\n}\n.card-heading h3,\r\n.card-heading p {\r\n  margin-bottom: 0;\n}\n.card-kicker {\r\n  color: #287a5b;\r\n  font-size: 0.7rem;\r\n  font-weight: 800;\r\n  letter-spacing: 0.1em;\r\n  text-transform: uppercase;\n}\nlabel {\r\n  display: grid;\r\n  font-weight: 700;\r\n  gap: 0.4rem;\n}\ninput,\r\nselect {\r\n  background: white;\r\n  border: 1px solid #84a69a;\r\n  border-radius: 0.45rem;\r\n  color: #193330;\r\n  font: inherit;\r\n  min-width: 0;\r\n  padding: 0.65rem 0.75rem;\n}\ninput:focus-visible,\r\nselect:focus-visible,\r\nsummary:focus-visible {\r\n  outline: 3px solid #41b883;\r\n  outline-offset: 2px;\n}\n.field-pair {\r\n  display: grid;\r\n  gap: 0.75rem;\r\n  grid-template-columns: 1fr 1fr;\n}\nfieldset {\r\n  border: 0;\r\n  margin: 0;\r\n  padding: 0;\n}\nlegend {\r\n  font-weight: 700;\r\n  margin-bottom: 0.5rem;\n}\n.choice-row,\r\n.button-row,\r\n[role=\"tablist\"] {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 0.65rem;\n}\n.choice-row label {\r\n  align-items: center;\r\n  display: flex;\r\n  font-weight: 500;\n}\n.field-error {\r\n  color: #a32424;\r\n  font-size: 0.85rem;\r\n  margin: -0.75rem 0 0;\n}\n.switch-row {\r\n  align-items: center;\r\n  display: flex;\r\n  justify-content: space-between;\n}\n.switch-row span {\r\n  display: grid;\n}\n.switch-row small {\r\n  font-weight: 400;\n}\n.switch-row input {\r\n  height: 1.4rem;\r\n  width: 2.6rem;\n}\ninput[type=\"range\"],\r\nprogress {\r\n  accent-color: #287a5b;\r\n  width: 100%;\n}\n.primary-button {\r\n  background: #287a5b;\r\n  color: white;\n}\n.secondary-button {\r\n  background: white;\n}\nbutton:disabled {\r\n  cursor: not-allowed;\r\n  opacity: 0.5;\n}\n.icon-button {\r\n  border: 0;\r\n  font-size: 1.25rem;\r\n  padding: 0.2rem 0.5rem;\n}\n[role=\"tab\"][aria-selected=\"true\"] {\r\n  background: #287a5b;\r\n  color: white;\n}\ndl {\r\n  display: grid;\r\n  gap: 0.6rem;\r\n  margin: 0;\n}\ndl div {\r\n  display: flex;\r\n  gap: 1rem;\r\n  justify-content: space-between;\n}\ndt {\r\n  font-weight: 700;\n}\ndd {\r\n  margin: 0;\r\n  overflow-wrap: anywhere;\r\n  text-align: right;\n}\ndetails {\r\n  border-top: 1px solid #c9ddd5;\r\n  padding-top: 1rem;\n}\nsummary {\r\n  cursor: pointer;\r\n  font-weight: 700;\n}\ndialog {\r\n  background: #f5fbf8;\r\n  border: 1px solid #72a790;\r\n  border-radius: 1rem;\r\n  color: #193330;\r\n  max-width: min(30rem, calc(100vw - 2rem));\r\n  padding: 0;\n}\ndialog::backdrop {\r\n  background: rgb(7 28 24 / 72%);\n}\n.dialog-content {\r\n  padding: 1.5rem;\n}\n.data-card {\r\n  background: rgb(255 255 255 / 72%);\r\n  border: 1px solid #c9ddd5;\r\n  border-radius: 0.8rem;\r\n  margin-top: 1.5rem;\r\n  min-width: 0;\r\n  padding: 1.25rem;\n}\n.data-heading,\r\n.pagination {\r\n  align-items: center;\r\n  display: flex;\r\n  gap: 1rem;\r\n  justify-content: space-between;\n}\n.data-heading h3,\r\n.data-heading p {\r\n  margin-bottom: 0;\n}\n.filter-grid {\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: minmax(0, 2fr) minmax(12rem, 1fr);\r\n  margin: 1.25rem 0;\n}\n.loading-state,\r\n.empty-state,\r\n.request-error {\r\n  border: 1px dashed #84a69a;\r\n  border-radius: 0.6rem;\r\n  margin: 1rem 0;\r\n  padding: 1rem;\n}\n.request-error {\r\n  background: #fff0f0;\r\n  border-color: #c76b6b;\r\n  color: #7e1f1f;\n}\n.table-scroll {\r\n  max-width: 100%;\r\n  overflow-x: auto;\n}\ntable {\r\n  border-collapse: collapse;\r\n  min-width: 48rem;\r\n  width: 100%;\n}\nth,\r\ntd {\r\n  border-bottom: 1px solid #c9ddd5;\r\n  padding: 0.75rem;\r\n  text-align: left;\n}\nth {\r\n  background: #eaf7f1;\n}\ntbody tr {\r\n  cursor: pointer;\n}\ntbody tr:hover,\r\ntbody tr.selected {\r\n  background: #dff6e9;\n}\n.sort-button {\n  border: 0;\r\n  border-radius: 0.25rem;\r\n  padding: 0.2rem;\r\n  text-align: left;\n}\n.sort-button {\r\n  align-items: center;\r\n  display: inline-flex;\r\n  gap: 0.35rem;\n}\n.pagination {\r\n  margin-top: 1rem;\n}\n.selection-status {\r\n  color: #4c625e;\r\n  margin: 1rem 0 0;\n}\n.visually-hidden {\r\n  clip: rect(0 0 0 0);\r\n  clip-path: inset(50%);\r\n  height: 1px;\r\n  overflow: hidden;\r\n  position: absolute;\r\n  white-space: nowrap;\r\n  width: 1px;\n}\n.customer-detail-layout {\r\n  display: grid;\r\n  gap: 1.25rem;\r\n  margin-top: 1.25rem;\n}\n.sandbox-panel {\r\n  align-items: center;\r\n  background: #eaf7f1;\r\n  border: 1px solid #72a790;\r\n  border-radius: 0.8rem;\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: minmax(0, 1fr) auto auto;\r\n  margin-top: 1.25rem;\r\n  padding: 1.25rem;\n}\n.sandbox-panel h3,\r\n.sandbox-panel p {\r\n  margin-bottom: 0.35rem;\n}\n.sandbox-panel .notice,\r\n.sandbox-panel .request-error,\r\n.sandbox-panel > small {\r\n  grid-column: 1 / -1;\r\n  margin: 0;\n}\n.customer-edit-form {\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.customer-edit-form .button-row,\r\n.customer-edit-form .dirty-status,\r\n.customer-edit-form .field-error {\r\n  grid-column: 1 / -1;\n}\n.dirty-status {\r\n  color: #4c625e;\r\n  font-weight: 700;\r\n  margin: 0;\n}\n.metric-grid,\r\n.detail-grid {\r\n  display: grid;\r\n  gap: 0.75rem;\n}\n.metric-grid {\r\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.metric-grid div {\r\n  background: #eaf7f1;\r\n  border-radius: 0.6rem;\r\n  display: grid;\r\n  gap: 0.3rem;\r\n  justify-content: initial;\r\n  padding: 1rem;\n}\n.metric-grid dd {\r\n  color: #146247;\r\n  font-size: 1.25rem;\r\n  font-weight: 800;\r\n  text-align: left;\n}\n.detail-grid {\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.detail-grid div {\r\n  border-bottom: 1px solid #c9ddd5;\r\n  padding: 0.6rem 0;\n}\n.order-workspace {\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: minmax(14rem, 0.7fr) minmax(0, 1.8fr);\r\n  margin-top: 1.25rem;\r\n  min-width: 0;\n}\n.order-list {\r\n  display: grid;\r\n  gap: 0.65rem;\r\n  max-height: 38rem;\r\n  overflow-y: auto;\n}\n.order-card {\r\n  align-items: center;\r\n  border-radius: 0.6rem;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  padding: 0.85rem;\r\n  text-align: left;\n}\n.order-card span {\r\n  display: grid;\r\n  gap: 0.25rem;\n}\n.order-card span:last-child {\r\n  text-align: right;\n}\n.order-card small {\r\n  font-weight: 400;\n}\n.order-card[aria-pressed=\"true\"] {\r\n  background: #287a5b;\r\n  color: white;\n}\n.order-detail {\r\n  min-width: 0;\n}\n.order-summary {\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: minmax(10rem, 0.7fr) minmax(0, 1fr);\r\n  margin-bottom: 1rem;\n}\n.order-summary h4 {\r\n  font-size: 1.5rem;\r\n  margin: 0 0 0.35rem;\n}\n.order-totals {\r\n  margin-left: auto;\r\n  margin-top: 1rem;\r\n  max-width: 20rem;\n}\n.order-totals .grand-total {\r\n  border-top: 2px solid #72a790;\r\n  font-size: 1.1rem;\r\n  margin-top: 0.4rem;\r\n  padding-top: 0.6rem;\n}\n.showcase-header {\r\n  background:\r\n    radial-gradient(circle at top right, rgb(65 184 131 / 28%), transparent 42%),\r\n    #eaf7f1;\n}\n.eyebrow,\r\n.section-number {\r\n  color: #287a5b;\r\n  font-size: 0.75rem;\r\n  font-weight: 800;\r\n  letter-spacing: 0.12em;\r\n  margin: 0 0 0.5rem;\r\n  text-transform: uppercase;\n}\nh1,\r\nh2,\r\np {\r\n  margin-top: 0;\n}\nh1 {\r\n  font-size: clamp(2rem, 6vw, 4rem);\r\n  line-height: 1;\r\n  margin-bottom: 1rem;\n}\nnav {\r\n  display: flex;\r\n  gap: 0.75rem;\r\n  overflow-x: auto;\n}\nbutton {\r\n  background: transparent;\r\n  border: 1px solid #72a790;\r\n  border-radius: 999px;\r\n  color: inherit;\r\n  cursor: pointer;\r\n  font: inherit;\r\n  font-weight: 700;\r\n  padding: 0.65rem 1rem;\r\n  white-space: nowrap;\n}\nbutton:hover,\r\nbutton:focus-visible,\r\nbutton[aria-current=\"page\"] {\r\n  background: #287a5b;\r\n  color: white;\n}\nbutton:focus-visible {\r\n  outline: 3px solid #41b883;\r\n  outline-offset: 3px;\n}\n@media (prefers-color-scheme: dark) {\n:host {\r\n    color: #e6f4ee;\n}\n.showcase-header,\r\n  section {\r\n    background: #102c28;\r\n    border-color: #35645a;\n}\n.showcase-header {\r\n    background:\r\n      radial-gradient(circle at top right, rgb(65 184 131 / 24%), transparent 42%),\r\n      #143832;\n}\n.eyebrow,\r\n  .section-number,\r\n  .card-kicker {\r\n    color: #75d5aa;\n}\n.section-intro {\r\n    color: #b8cec5;\n}\n.gallery-card,\r\n  .data-card,\r\n  dialog {\r\n    background: #173a34;\r\n    border-color: #467569;\r\n    color: #e6f4ee;\n}\ninput,\r\n  select,\r\n  .secondary-button {\r\n    background: #0d2925;\r\n    border-color: #56877a;\r\n    color: #e6f4ee;\n}\n.notice {\r\n    background: #164c3c;\n}\nth {\r\n    background: #16453c;\n}\ntbody tr:hover,\r\n  tbody tr.selected {\r\n    background: #1e5447;\n}\n.selection-status {\r\n    color: #b8cec5;\n}\n.request-error {\r\n    background: #4a2020;\r\n    color: #ffd8d8;\n}\n.metric-grid div {\r\n    background: #16453c;\n}\n.sandbox-panel {\r\n    background: #16453c;\r\n    border-color: #467569;\n}\n.dirty-status {\r\n    color: #b8cec5;\n}\n.metric-grid dd {\r\n    color: #75d5aa;\n}\n}\n@media (max-width: 1100px) {\n.gallery-grid,\r\n  .order-workspace {\r\n    grid-template-columns: 1fr;\n}\n.order-list {\r\n    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));\r\n    max-height: none;\n}\n.sandbox-panel {\r\n    align-items: start;\r\n    grid-template-columns: 1fr;\n}\n.sandbox-panel .notice,\r\n  .sandbox-panel .request-error,\r\n  .sandbox-panel > small {\r\n    grid-column: auto;\n}\n}\n@media (max-width: 760px) {\n.field-pair,\r\n  .filter-grid,\r\n  .metric-grid,\r\n  .detail-grid,\r\n  .customer-edit-form {\r\n    grid-template-columns: 1fr;\n}\n.data-heading,\r\n  .pagination,\r\n  .order-summary {\r\n    align-items: flex-start;\r\n    flex-direction: column;\n}\n.order-summary {\r\n    display: flex;\n}\n}\n@media (prefers-reduced-motion: reduce) {\n*,\r\n  *::before,\r\n  *::after {\r\n    scroll-behavior: auto !important;\r\n    transition-duration: 0.01ms !important;\n}\n}\n@media (forced-colors: active) {\nbutton,\r\n  input,\r\n  select,\r\n  .gallery-card,\r\n  .notice {\r\n    border: 1px solid CanvasText;\n}\n}\n\n/* Shared Frontend Lab visual contract. Keep these tokens and structural rules\n   aligned with the React and Angular implementations. */\n:host {\n  --text: #6b6375;\n  --text-h: #08060d;\n  --bg: #fff;\n  --border: #e5e4e7;\n  --code-bg: #f4f3ec;\n  --accent: #aa3bff;\n  --accent-bg: rgb(170 59 255 / 10%);\n  --accent-border: rgb(170 59 255 / 50%);\n  --shadow: rgb(0 0 0 / 10%) 0 10px 15px -3px, rgb(0 0 0 / 5%) 0 4px 6px -2px;\n  background: var(--bg);\n  color: var(--text);\n  color-scheme: light dark;\n  border-radius: 14px;\n  font: 16px/160% Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  letter-spacing: 0.18px;\n  overflow: hidden;\n}\n.showcase {\n  background: transparent;\n  display: block;\n  padding: 48px;\n  text-align: left;\n}\n.showcase-header {\n  align-items: flex-start;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  display: flex;\n  gap: 32px;\n  justify-content: space-between;\n  margin-bottom: 32px;\n  padding: 0;\n}\n.showcase-header h1 {\n  color: var(--text-h);\n  font-size: 32px;\n  font-weight: 500;\n  letter-spacing: -1.68px;\n  line-height: 160%;\n  margin: 6px 0 10px;\n}\n.showcase-header p {\n  font-size: 17px;\n  max-width: 680px;\n}\n.framework-badge {\n  align-items: center;\n  background: var(--accent-bg);\n  border: 1px solid var(--accent-border);\n  border-radius: 999px;\n  color: var(--text-h);\n  display: flex;\n  flex: 0 0 auto;\n  font-weight: 650;\n  gap: 10px;\n  padding: 10px 14px;\n}\n.framework-badge > span {\n  align-items: center;\n  background: var(--accent);\n  border-radius: 50%;\n  color: white;\n  display: inline-flex;\n  height: 24px;\n  justify-content: center;\n  width: 24px;\n}\n.showcase-nav {\n  display: flex;\n  gap: 10px;\n  margin: 0 0 28px;\n  overflow-x: auto;\n  padding: 0 0 4px;\n}\n.showcase-nav a {\n  background: var(--code-bg);\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  color: var(--text-h);\n  flex: 0 0 auto;\n  font-size: 13px;\n  font-weight: 700;\n  padding: 7px 11px;\n  text-decoration: none;\n}\n.showcase-nav a:hover {\n  border-color: var(--accent-border);\n  color: var(--accent);\n}\n.controls-section,\n.data-section {\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  padding: 32px 0 16px;\n}\n.controls-section {\n  border-top: 1px solid var(--border);\n}\n.data-section {\n  border-top: 1px solid var(--border);\n  margin-top: 42px;\n}\n.section-heading {\n  align-items: end;\n  display: flex;\n  gap: 32px;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.section-heading h2 {\n  color: var(--text-h);\n  font-size: 24px;\n  font-weight: 500;\n  letter-spacing: -0.24px;\n  line-height: 160%;\n  margin: 4px 0 0;\n}\n.section-heading p {\n  font-size: 15px;\n  max-width: 560px;\n}\n.eyebrow,\n.card-kicker {\n  color: var(--accent);\n  font-size: 12px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n}\n.control-layout {\n  display: grid;\n  gap: 18px;\n  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);\n}\n.control-layout > *,\n.control-stack,\n.data-card,\n.order-workspace > * {\n  min-width: 0;\n}\n.control-stack {\n  display: grid;\n  gap: 18px;\n}\n.control-card,\n.data-card,\n.sandbox-panel {\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow);\n  color: var(--text);\n  padding: 22px;\n}\n.control-card {\n  display: block;\n}\n.control-card h3,\n.data-card h3,\n.sandbox-panel h3 {\n  color: var(--text-h);\n}\nlabel {\n  font-size: 13px;\n  line-height: 160%;\n}\n.data-card {\n  margin-top: 18px;\n}\n.gallery-card,\n.gallery-stack,\n.gallery-grid {\n  min-width: 0;\n}\n.filter-grid {\n  grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.55fr);\n}\n.table-scroll {\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  overflow-x: auto;\n}\ntable {\n  min-width: 720px;\n  width: 100%;\n}\nth {\n  background: var(--code-bg);\n}\ntbody tr.selected {\n  background: var(--accent-bg);\n  box-shadow: inset 3px 0 0 var(--accent);\n}\n.order-workspace {\n  grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);\n}\nbutton,\ninput,\nselect {\n  font: inherit;\n}\n.primary-button,\n.secondary-button {\n  border-radius: 7px;\n  cursor: pointer;\n  font-weight: 700;\n  min-height: 40px;\n  padding: 8px 13px;\n}\n.primary-button,\n.primary-button:hover,\n.primary-button:focus-visible {\n  background: var(--accent);\n  border: 1px solid var(--accent);\n  color: white;\n}\n.secondary-button,\n.secondary-button:hover,\n.secondary-button:focus-visible {\n  background: var(--code-bg);\n  border: 1px solid var(--border);\n  color: var(--text-h);\n}\n.tabs {\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  gap: 4px;\n  padding-bottom: 12px;\n}\n.tabs button {\n  background: transparent;\n  border: 0;\n  border-radius: 6px;\n  color: var(--text);\n  padding: 7px 10px;\n}\n.tabs button[aria-selected='true'],\n.tabs button[aria-selected='true']:hover,\n.tabs button[aria-selected='true']:focus-visible {\n  background: var(--accent-bg);\n  color: var(--accent);\n}\n.tab-panel {\n  min-height: 155px;\n  padding-top: 18px;\n}\n.summary-list {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.summary-list div,\n.metric-grid div {\n  background: var(--code-bg);\n  border-radius: 7px;\n  padding: 10px;\n}\n.metric-grid dd {\n  color: var(--accent);\n}\n.sandbox-panel {\n  align-items: center;\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow);\n  display: grid;\n  gap: 16px;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  margin: 0 0 18px;\n  padding: 22px;\n}\n.sandbox-panel h3,\n.sandbox-panel p {\n  margin: 4px 0 0;\n}\n.sandbox-panel .notice,\n.sandbox-panel .request-error,\n.sandbox-panel > small {\n  grid-column: 1 / -1;\n  margin: 0;\n}\n.order-card[aria-pressed='true'],\n.order-card[aria-pressed='true']:hover,\n.order-card[aria-pressed='true']:focus-visible {\n  background: var(--accent-bg);\n  border-color: var(--accent-border);\n  color: var(--text-h);\n}\ninput:not([type='checkbox']):not([type='radio']):not([type='range']),\nselect {\n  background: var(--bg);\n  border: 1px solid var(--border);\n  color: var(--text-h);\n}\ninput[type='checkbox'],\ninput[type='radio'],\ninput[type='range'],\nprogress {\n  accent-color: var(--accent);\n}\nbutton:focus-visible,\ninput:focus-visible,\nselect:focus-visible,\nsummary:focus-visible,\na:focus-visible {\n  outline: 3px solid var(--accent-border);\n  outline-offset: 2px;\n}\n@media (prefers-color-scheme: dark) {\n:host {\n    --text: #9ca3af;\n    --text-h: #f3f4f6;\n    --bg: #16171d;\n    --border: #2e303a;\n    --code-bg: #1f2028;\n    --accent: #c084fc;\n    --accent-bg: rgb(192 132 252 / 15%);\n    --accent-border: rgb(192 132 252 / 50%);\n    --shadow: rgb(0 0 0 / 40%) 0 10px 15px -3px, rgb(0 0 0 / 25%) 0 4px 6px -2px;\n}\n}\n@media (max-width: 1100px) {\n.control-layout,\n  .order-workspace {\n    grid-template-columns: 1fr;\n}\n.sandbox-panel {\n    align-items: start;\n    grid-template-columns: 1fr;\n}\n.sandbox-panel .notice,\n  .sandbox-panel .request-error,\n  .sandbox-panel > small {\n    grid-column: auto;\n}\n}\n@media (max-width: 760px) {\n.showcase {\n    padding: 24px 16px 40px;\n}\n.showcase-header,\n  .section-heading {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 14px;\n}\n.framework-badge {\n    align-self: flex-start;\n}\n.field-pair,\n  .filter-grid,\n  .customer-detail-layout,\n  .metric-grid {\n    grid-template-columns: 1fr;\n}\n}\n";
//#endregion
//#region ../shared/showcase-contract.css?vue&type=style&index=1&src=true&inline&lang.css
var showcase_contract_css_vue_type_style_index_1_src_true_inline_lang_default = "/* Shared visual contract bundled into each framework's Shadow DOM. */\n:host {\n  --lab-font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  --lab-title-size: 32px;\n  --lab-section-size: 24px;\n  --lab-card-title-size: 18px;\n\n  color: var(--text);\n  border: 1px solid var(--border);\n  font: 16px/1.6 var(--lab-font);\n  font-synthesis: none;\n  letter-spacing: 0.18px;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n* {\n  box-sizing: border-box;\n}\n#root {\n  border-inline: 0;\n}\nbutton,\ninput,\nselect,\ntextarea {\n  font: inherit;\n}\n.showcase-header h1,\n.section-heading h2,\n.control-card h3,\n.grid-card h3,\n.data-card h3,\n.detail-card h3,\n.orders-card h3,\n.sandbox-panel h3,\ndialog h2 {\n  color: var(--text-h);\n  font-family: var(--lab-font);\n  font-style: normal;\n}\n.showcase-header h1 {\n  font-size: var(--lab-title-size);\n  font-weight: 500;\n  letter-spacing: -1.68px;\n  line-height: 1.6;\n  margin: 6px 0 10px;\n}\n.showcase-header .eyebrow {\n  display: block;\n  margin: 0;\n}\n.showcase-header p {\n  font-size: 17px;\n  line-height: 1.6;\n  margin: 0;\n  max-width: 680px;\n}\n.eyebrow,\n.card-kicker {\n  color: var(--accent);\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n  line-height: 1.6;\n  text-transform: uppercase;\n}\n.section-heading .eyebrow,\n.sandbox-panel .eyebrow,\n.sandbox-panel .card-kicker {\n  margin: 0;\n}\n.framework-badge {\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  gap: 10px;\n  min-height: 46px;\n  padding: 10px 14px;\n}\n.framework-badge > span,\n.framework-badge > img {\n  height: 24px;\n  width: 24px;\n}\n.section-heading {\n  align-items: end;\n  display: flex;\n  gap: 32px;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.section-heading p {\n  font-size: 15px;\n  margin: 0;\n  max-width: 560px;\n}\n.showcase-nav {\n  display: flex;\n  gap: 8px;\n  margin: -12px 0 32px;\n  overflow: visible;\n  padding: 0;\n}\n.controls-section,\n.data-section {\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  padding: 0;\n}\n.controls-section {\n  margin-bottom: 32px;\n}\n.data-section {\n  margin-top: 40px;\n}\n.section-heading h2 {\n  font-size: var(--lab-section-size);\n  font-weight: 500;\n  letter-spacing: -0.24px;\n  line-height: 1.6;\n  margin: 4px 0 0;\n}\n.control-card h3,\n.grid-card h3,\n.data-card h3,\n.detail-card h3,\n.orders-card h3,\n.sandbox-panel h3 {\n  font-size: var(--lab-card-title-size);\n  font-weight: 650;\n  line-height: 1.4;\n}\n.card-heading {\n  align-items: center;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.card-heading h3 {\n  margin: 0;\n}\n.control-card,\n.grid-card,\n.data-card,\n.detail-card,\n.orders-card,\n.sandbox-panel {\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow);\n  color: var(--text);\n  padding: 22px;\n}\n.control-layout {\n  display: grid;\n  gap: 18px;\n  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);\n}\n.control-layout > *,\n.control-stack {\n  min-width: 0;\n}\n.control-stack,\n.form-card {\n  display: grid;\n  gap: 18px;\n}\n.profile-fields {\n  display: grid;\n  gap: 14px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.profile-fields > label,\n.field-pair > label {\n  display: grid;\n  gap: 6px;\n}\n.profile-fields .field-span {\n  grid-column: 1 / -1;\n}\n.field-pair {\n  display: grid;\n  gap: 14px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n:host input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"range\"]),\n:host select,\n:host textarea {\n  border-radius: 7px;\n  font-weight: 650;\n  min-height: 42px;\n  padding: 8px 11px;\n}\nfieldset {\n  border: 0;\n  margin: 0;\n  min-width: 0;\n  padding: 0;\n}\nlegend,\nlabel {\n  color: var(--text-h);\n  font-size: 13px;\n  line-height: 1.6;\n}\n.choice-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.choice-row .choice,\n.choice-row > label {\n  align-items: center;\n  background: var(--code-bg);\n  border: 1px solid var(--border);\n  border-radius: 7px;\n  cursor: pointer;\n  display: inline-flex;\n  gap: 7px;\n  min-height: 40px;\n  padding: 7px 11px;\n  font-weight: 650;\n}\n.choice-row .choice:has(input:checked),\n.choice-row > label:has(input:checked) {\n  background: var(--accent-bg);\n  border-color: var(--accent-border);\n}\n.form-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-top: 22px;\n}\n.form-card small {\n  font-size: 12px;\n  font-weight: 450;\n  line-height: 1.6;\n}\n.form-card .field-help {\n  color: var(--text);\n}\n.switch-row {\n  align-items: center;\n  display: flex;\n  gap: 16px;\n  justify-content: space-between;\n  font-weight: 650;\n}\n.switch-row small {\n  color: var(--text);\n}\n.range-field {\n  display: grid;\n  font-weight: 650;\n  gap: 5px;\n  margin-top: 22px;\n  width: 100%;\n}\n.range-field > span {\n  display: flex;\n  justify-content: space-between;\n}\n.range-field input[type=\"range\"] {\n  background: transparent;\n  border: 0;\n  font-weight: 650;\n  height: 16px;\n  padding: 0;\n  width: 100%;\n}\n.range-field input[type=\"range\"]::-webkit-slider-runnable-track {\n  height: 4px;\n}\n.range-field input[type=\"range\"]::-moz-range-track,\n.range-field input[type=\"range\"]::-moz-range-progress {\n  height: 4px;\n}\n.control-card progress {\n  height: 8px;\n  margin-top: 12px;\n  width: 100%;\n}\n:host input[role=\"switch\"] {\n  background: transparent;\n  border: 0;\n  color: white;\n  height: 24px;\n  padding: 0;\n  width: 44px;\n}\n:host input[aria-label=\"Editing sandbox\"]:focus,\n:host input[aria-label=\"Editing sandbox\"]:focus-visible {\n  box-shadow: none;\n  outline: none;\n}\n.tabs {\n  margin-top: 0;\n}\n.tabs button {\n  font-weight: 700;\n}\n.tabs button[aria-selected='true'] {\n  font-weight: 700;\n}\n.tab-panel {\n  min-height: 155px;\n  padding-top: 18px;\n}\n.tab-panel > h3 {\n  margin: 0 0 18px;\n}\n.summary-list {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  margin: 0;\n}\n.summary-list > div {\n  display: block;\n  gap: normal;\n  justify-content: normal;\n}\n.summary-list dt {\n  color: var(--text);\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1.6;\n  margin: 0;\n}\n.summary-list dd {\n  color: var(--text-h);\n  font-size: 16px;\n  font-weight: 700;\n  line-height: 1.6;\n  margin: 2px 0 0;\n  text-align: left;\n}\n.control-card details {\n  border-top: 1px solid var(--border);\n  color: var(--text);\n  font-size: 14px;\n  line-height: 1.6;\n  margin-top: 16px;\n  padding-top: 12px;\n}\n.control-card summary {\n  color: var(--text-h);\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1.6;\n}\n.notification {\n  align-items: center;\n  background: var(--accent-bg);\n  border: 1px solid var(--accent-border);\n  border-radius: 8px;\n  color: var(--text-h);\n  display: flex;\n  gap: 20px;\n  justify-content: space-between;\n  margin-top: 14px;\n  padding: 12px 16px;\n}\n.notification button {\n  background: transparent;\n  border: 0;\n  color: var(--text-h);\n  cursor: pointer;\n  font-size: 22px;\n  padding: 1px 6px;\n}\ndialog {\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow);\n  color: var(--text);\n  max-width: 430px;\n  padding: 26px;\n}\ndialog::backdrop {\n  backdrop-filter: blur(3px);\n  background: rgb(8 6 13 / 68%);\n}\ndialog h2 {\n  font-weight: 500;\n  margin: 8px 0 10px;\n}\ndialog .primary-button {\n  margin-top: 22px;\n}\n.data-card {\n  margin-top: 18px;\n  overflow: hidden;\n  padding: 22px;\n}\n.data-heading {\n  align-items: start;\n  display: flex;\n  gap: 24px;\n  justify-content: space-between;\n  margin-bottom: 18px;\n}\n.data-heading h3,\n.data-heading p {\n  margin: 0;\n}\n.detail-card .data-heading code {\n  background: var(--code-bg);\n  border: 0;\n  border-radius: 4px;\n  color: var(--text-h);\n  display: flex;\n  font: 400 15px/1.35 var(--mono, ui-monospace, Consolas, monospace);\n  padding: 4px 8px;\n}\n.data-card > .empty-state,\n.data-card > .status,\n.data-card > .detail-status {\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  color: var(--text);\n  inset: auto;\n  margin: 0;\n  padding: 12px 0;\n  position: static;\n  text-align: left;\n  transform: none;\n}\n.filter-grid,\n.filters {\n  display: grid;\n  gap: 14px;\n  grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.55fr);\n  margin: 0 0 18px;\n}\n.filter-grid label,\n.filters label {\n  display: grid;\n  gap: 6px;\n}\n.table-scroll,\n.table-wrap,\n.line-items-wrap {\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  overflow-x: auto;\n}\n.grid-card table,\n.data-card table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  color: var(--text);\n  font: 15px/1.6 var(--lab-font);\n  min-width: 720px;\n  width: 100%;\n}\n.grid-card table {\n  table-layout: fixed;\n}\n.grid-card th:nth-child(1) {\n  width: 39%;\n}\n.grid-card th:nth-child(2) {\n  width: 22%;\n}\n.grid-card th:nth-child(3),\n.grid-card th:nth-child(4) {\n  width: 14%;\n}\n.grid-card th:nth-child(5) {\n  width: 11%;\n}\n.grid-card th,\n.data-card th,\n.grid-card td,\n.data-card td {\n  border-bottom: 1px solid var(--border);\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  height: 53px;\n  padding: 13px 16px;\n  text-align: left;\n  vertical-align: middle;\n}\n.grid-card th,\n.data-card th {\n  background: var(--code-bg);\n  color: var(--text-h);\n  font-size: 13px;\n  font-weight: 700;\n  padding: 0;\n}\n.grid-card th button,\n.data-card th button,\n.sort-button {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  color: var(--text-h);\n  display: flex;\n  font: 700 13px/1.6 var(--lab-font);\n  gap: 8px;\n  height: 53px;\n  justify-content: space-between;\n  padding: 13px 16px;\n  text-align: left;\n  width: 100%;\n}\n.grid-card th[aria-sort=\"ascending\"] button,\n.grid-card th[aria-sort=\"descending\"] button,\n.data-card th[aria-sort=\"ascending\"] button,\n.data-card th[aria-sort=\"descending\"] button,\n.grid-card th button.active-sort,\n.data-card th button.active-sort {\n  color: var(--accent);\n}\n.grid-card tbody td,\n.data-card tbody td {\n  background: transparent;\n  color: var(--text);\n  font: 400 15px/1.6 var(--lab-font);\n}\n.grid-card tbody td:first-child,\n.data-card tbody td:first-child {\n  color: var(--text-h);\n  font-weight: 650;\n}\n.grid-card tbody td:last-child code,\n.data-card tbody td:last-child code {\n  align-items: center;\n  background: var(--code-bg);\n  border: 1px solid var(--border);\n  border-radius: 4px;\n  color: var(--text-h);\n  display: inline-flex;\n  font: 400 12px/1.6 var(--mono, ui-monospace, Consolas, monospace);\n  min-height: 25px;\n  padding: 2px 6px;\n}\n.grid-card tbody tr:last-child td,\n.data-card tbody tr:last-child td {\n  border-bottom: 0;\n}\n.grid-card tbody tr.selected,\n.data-card tbody tr.selected {\n  background: var(--accent-bg);\n  box-shadow: inset 3px 0 0 var(--accent);\n}\n.pagination {\n  align-items: center;\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n  margin-top: 16px;\n}\n.pagination button {\n  background: var(--code-bg);\n  border: 1px solid var(--border);\n  border-radius: 7px;\n  color: var(--text-h);\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 1.6;\n  min-height: 36px;\n  padding: 6px 10px;\n}\n.selection-status {\n  color: var(--text);\n  margin: 12px 0 0;\n  text-align: right;\n}\n.metric-grid {\n  display: grid;\n  gap: 12px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  margin: 0 0 18px;\n}\n.customer-detail-layout {\n  display: contents;\n}\n.metric-grid div,\n.detail-grid div,\n.customer-detail div {\n  background: var(--code-bg);\n  border: 0;\n  border-radius: 8px;\n  padding: 12px;\n}\n.metric-grid > div,\n.detail-grid > div,\n.customer-detail > div {\n  display: block;\n  gap: normal;\n}\n.metric-grid dt,\n.detail-grid dt,\n.customer-detail dt,\n.order-summary dt,\n.order-totals dt {\n  color: var(--text);\n  font: 400 12px/1.6 var(--lab-font);\n}\n.metric-grid dd,\n.detail-grid dd,\n.customer-detail dd,\n.order-summary dd {\n  color: var(--text-h);\n  font: 650 16px/1.6 var(--lab-font);\n  margin: 3px 0 0;\n}\n.metric-grid dd {\n  color: var(--accent);\n  font-weight: 700;\n}\n.detail-grid,\n.customer-detail {\n  display: grid;\n  gap: 12px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  margin: 0;\n  padding: 0;\n}\n.detail-grid dt,\n.detail-grid dd,\n.customer-detail dt,\n.customer-detail dd {\n  text-align: left;\n}\n.detail-form {\n  display: grid;\n  gap: 14px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.detail-form label {\n  display: grid;\n  gap: 6px;\n}\n.dirty-status,\n.detail-actions {\n  grid-column: 1 / -1;\n}\n.detail-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.order-workspace,\n.orders-layout {\n  display: grid;\n  gap: 0;\n  grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);\n  margin: 0;\n}\n.order-workspace .order-list,\n.orders-layout .order-list {\n  max-height: none;\n  overflow: visible;\n  display: grid;\n  align-content: start;\n  gap: 8px;\n  padding: 20px 18px 20px 20px;\n}\n.order-card,\n.order-list > button {\n  align-items: center;\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  color: var(--text-h);\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  height: 69px;\n  padding: 10px 12px;\n  text-align: left;\n  width: 100%;\n}\n.order-card > span,\n.order-list > button > span {\n  display: grid;\n  gap: 0;\n}\n.order-card strong,\n.order-list > button strong {\n  font: 650 15px/1.6 var(--lab-font);\n}\n.order-card small,\n.order-list > button small {\n  color: var(--text);\n  font: 400 12px/1.6 var(--lab-font);\n}\n.order-status {\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n.order-status.shipped {\n  color: #039855;\n}\n.order-status.overdue {\n  color: #d92d20;\n}\n.order-status.processing {\n  color: #dc6803;\n}\n.order-card[aria-pressed=\"true\"],\n.order-list > button[aria-pressed=\"true\"] {\n  background: var(--accent-bg);\n  border-color: var(--accent-border);\n}\n.order-workspace .order-detail,\n.orders-layout .order-detail {\n  border-left: 1px solid var(--border);\n  min-width: 0;\n  padding: 20px 20px 20px 18px;\n}\n.order-detail-heading {\n  display: grid;\n  gap: 0;\n  margin-bottom: 16px;\n}\n.order-detail-heading h4,\n.order-detail-heading p {\n  margin: 0;\n}\n.order-detail-heading h4 {\n  color: var(--text-h);\n  font: 650 18px/1.4 var(--lab-font);\n}\n.order-detail-heading .card-kicker {\n  font: 800 12px/1.6 var(--lab-font);\n  letter-spacing: 0.12em;\n}\n.order-summary {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  margin: 0 0 16px;\n}\n.order-summary > div,\n.order-summary dl > div {\n  background: var(--code-bg);\n  border-radius: 8px;\n  display: block;\n  gap: normal;\n  padding: 10px;\n}\n.order-summary dt,\n.order-summary dd {\n  text-align: left;\n}\n.order-detail .line-items-wrap,\n.order-detail .table-scroll {\n  margin: 16px 0 0;\n  overflow-x: hidden;\n}\n.order-detail .line-items-wrap table,\n.order-detail .table-scroll table {\n  min-width: 0;\n  table-layout: fixed;\n  width: 100%;\n}\n.order-detail .line-items-wrap th,\n.order-detail .line-items-wrap td,\n.order-detail .table-scroll th,\n.order-detail .table-scroll td {\n  padding: 10px 12px;\n}\n.order-detail .line-items-wrap th:nth-child(1),\n.order-detail .table-scroll th:nth-child(1) {\n  width: 42%;\n}\n.order-detail .line-items-wrap th:nth-child(2),\n.order-detail .table-scroll th:nth-child(2) {\n  width: 14%;\n}\n.order-detail .line-items-wrap th:nth-child(3),\n.order-detail .line-items-wrap th:nth-child(4),\n.order-detail .table-scroll th:nth-child(3),\n.order-detail .table-scroll th:nth-child(4) {\n  width: 22%;\n}\n.order-detail .line-items-wrap th:nth-child(n + 2),\n.order-detail .line-items-wrap td:nth-child(n + 2),\n.order-detail .table-scroll th:nth-child(n + 2),\n.order-detail .table-scroll td:nth-child(n + 2) {\n  text-align: right;\n}\n.order-totals {\n  display: grid;\n  gap: 6px;\n  grid-template-columns: minmax(0, 1fr);\n  height: auto;\n  justify-content: stretch;\n  justify-items: stretch;\n  margin: 16px 0 0 auto;\n  max-width: 260px;\n  text-align: right;\n  width: 100%;\n}\n.order-detail .order-totals {\n  grid-template-columns: minmax(0, 1fr);\n  justify-content: stretch;\n  justify-items: stretch;\n}\n.order-totals > div {\n  align-items: center;\n  border: 0;\n  display: grid;\n  gap: 12px;\n  grid-template-columns: minmax(0, 1fr) 110px;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n}\n.order-totals > div:last-child,\n.order-totals > div.grand-total:last-child {\n  border-top: 1px solid var(--border);\n  font-size: inherit;\n  margin: 1px 0 0;\n  padding: 7px 0 0;\n}\n.order-totals dt,\n.order-totals dd {\n  line-height: 1.6;\n  margin: 0;\n}\n.order-totals dd {\n  color: var(--text-h);\n  font-weight: 700;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"],\ninput[type=\"range\"],\nprogress {\n  accent-color: var(--accent);\n}\n@media (max-width: 760px) {\n:host {\n    --lab-title-size: 32px;\n    --lab-section-size: 20px;\n}\n.profile-fields,\n  .field-pair {\n    grid-template-columns: 1fr;\n}\n.profile-fields .field-span {\n    grid-column: auto;\n}\n.section-heading {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 14px;\n}\n.filter-grid,\n  .filters,\n  .metric-grid,\n  .detail-grid,\n  .customer-detail,\n  .detail-form,\n  .order-summary {\n    grid-template-columns: 1fr;\n}\n.dirty-status,\n  .detail-actions {\n    grid-column: auto;\n}\n.pagination,\n  .selection-status {\n    justify-content: flex-start;\n    text-align: left;\n}\n}\n@media (max-width: 1100px) {\n.control-layout {\n    grid-template-columns: 1fr;\n}\n.order-workspace,\n  .orders-layout {\n    grid-template-columns: 1fr;\n}\n.order-workspace .order-list,\n  .orders-layout .order-list {\n    border-bottom: 1px solid var(--border);\n    padding: 0 0 18px;\n}\n.order-workspace .order-detail,\n  .orders-layout .order-detail {\n    border-left: 0;\n    padding: 18px 0 0;\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/App.ce.vue
var _hoisted_1 = { class: "showcase" };
var _hoisted_2 = {
	id: "vue-controls",
	class: "controls-section",
	"aria-labelledby": "controls-heading"
};
var _hoisted_3 = { class: "control-layout" };
var _hoisted_4 = { class: "profile-fields" };
var _hoisted_5 = { class: "field-span" };
var _hoisted_6 = {
	key: 0,
	id: "name-error",
	class: "field-error"
};
var _hoisted_7 = { class: "field-span" };
var _hoisted_8 = ["aria-invalid"];
var _hoisted_9 = { class: "field-pair field-span" };
var _hoisted_10 = { class: "field-span" };
var _hoisted_11 = { class: "choice-row" };
var _hoisted_12 = { class: "choice" };
var _hoisted_13 = { class: "choice" };
var _hoisted_14 = { class: "choice" };
var _hoisted_15 = { class: "choice-row" };
var _hoisted_16 = { class: "choice" };
var _hoisted_17 = { class: "choice" };
var _hoisted_18 = { class: "choice" };
var _hoisted_19 = { class: "form-actions" };
var _hoisted_20 = ["disabled"];
var _hoisted_21 = { class: "control-stack" };
var _hoisted_22 = {
	class: "control-card",
	"aria-labelledby": "preferences-heading"
};
var _hoisted_23 = { class: "switch-row" };
var _hoisted_24 = { class: "range-field" };
var _hoisted_25 = ["value", "aria-label"];
var _hoisted_26 = {
	class: "control-card",
	"aria-labelledby": "preview-heading"
};
var _hoisted_27 = {
	class: "tabs",
	role: "tablist",
	"aria-label": "Profile views"
};
var _hoisted_28 = ["aria-selected"];
var _hoisted_29 = ["aria-selected"];
var _hoisted_30 = {
	key: 0,
	id: "profile-summary-panel",
	class: "tab-panel",
	role: "tabpanel",
	"aria-labelledby": "profile-summary-tab",
	tabindex: "0"
};
var _hoisted_31 = { class: "summary-list" };
var _hoisted_32 = {
	key: 1,
	id: "profile-settings-panel",
	class: "tab-panel",
	role: "tabpanel",
	"aria-labelledby": "profile-settings-tab",
	tabindex: "0"
};
var _hoisted_33 = {
	key: 0,
	class: "notification",
	role: "status",
	"aria-live": "polite"
};
var _hoisted_34 = {
	id: "vue-northwind",
	class: "data-section",
	"aria-labelledby": "data-heading"
};
var _hoisted_35 = {
	class: "sandbox-panel",
	"aria-labelledby": "sandbox-heading"
};
var _hoisted_36 = { class: "switch-row" };
var _hoisted_37 = ["checked"];
var _hoisted_38 = { key: 1 };
var _hoisted_39 = {
	key: 2,
	class: "notice",
	role: "status"
};
var _hoisted_40 = {
	key: 3,
	class: "request-error",
	role: "alert"
};
var _hoisted_41 = {
	class: "data-card grid-card",
	"aria-labelledby": "explorer-heading"
};
var _hoisted_42 = { class: "data-heading" };
var _hoisted_43 = { class: "filter-grid" };
var _hoisted_44 = ["value"];
var _hoisted_45 = {
	key: 0,
	class: "request-error",
	role: "alert"
};
var _hoisted_46 = {
	key: 1,
	class: "loading-state",
	role: "status",
	"aria-live": "polite"
};
var _hoisted_47 = {
	key: 2,
	class: "request-error",
	role: "alert"
};
var _hoisted_48 = {
	key: 3,
	class: "empty-state",
	role: "status"
};
var _hoisted_49 = {
	key: 4,
	class: "table-scroll"
};
var _hoisted_50 = ["aria-sort"];
var _hoisted_51 = ["onClick"];
var _hoisted_52 = {
	key: 0,
	"aria-hidden": "true"
};
var _hoisted_53 = {
	key: 1,
	"aria-hidden": "true"
};
var _hoisted_54 = [
	"aria-selected",
	"onClick",
	"onKeydown"
];
var _hoisted_55 = { "data-label": "Company" };
var _hoisted_56 = { "data-label": "Contact" };
var _hoisted_57 = { "data-label": "City" };
var _hoisted_58 = { "data-label": "Country" };
var _hoisted_59 = { "data-label": "ID" };
var _hoisted_60 = {
	class: "pagination",
	"aria-label": "Customer pages"
};
var _hoisted_61 = ["disabled"];
var _hoisted_62 = ["disabled"];
var _hoisted_63 = {
	class: "selection-status",
	"aria-live": "polite"
};
var _hoisted_64 = {
	class: "data-card detail-card",
	"aria-labelledby": "customer-details-heading"
};
var _hoisted_65 = { class: "data-heading" };
var _hoisted_66 = { key: 0 };
var _hoisted_67 = {
	key: 0,
	class: "empty-state"
};
var _hoisted_68 = {
	key: 1,
	class: "loading-state",
	role: "status",
	"aria-live": "polite"
};
var _hoisted_69 = {
	key: 2,
	class: "request-error",
	role: "alert"
};
var _hoisted_70 = {
	key: 3,
	class: "customer-detail-layout"
};
var _hoisted_71 = {
	class: "metric-grid",
	"aria-label": "Customer sales metrics"
};
var _hoisted_72 = ["onUpdate:modelValue", "required"];
var _hoisted_73 = {
	key: 0,
	class: "field-error"
};
var _hoisted_74 = {
	class: "dirty-status",
	"aria-live": "polite"
};
var _hoisted_75 = { class: "button-row detail-actions" };
var _hoisted_76 = ["disabled"];
var _hoisted_77 = ["disabled"];
var _hoisted_78 = {
	key: 1,
	class: "detail-grid customer-detail"
};
var _hoisted_79 = {
	class: "data-card orders-card",
	"aria-labelledby": "orders-heading"
};
var _hoisted_80 = { class: "data-heading" };
var _hoisted_81 = { key: 0 };
var _hoisted_82 = {
	key: 0,
	class: "empty-state"
};
var _hoisted_83 = {
	key: 1,
	class: "loading-state",
	role: "status",
	"aria-live": "polite"
};
var _hoisted_84 = {
	key: 2,
	class: "request-error",
	role: "alert"
};
var _hoisted_85 = {
	key: 3,
	class: "empty-state"
};
var _hoisted_86 = {
	key: 4,
	class: "order-workspace orders-layout"
};
var _hoisted_87 = {
	class: "order-list",
	"aria-label": "Customer orders"
};
var _hoisted_88 = ["aria-pressed", "onClick"];
var _hoisted_89 = {
	class: "order-detail",
	"aria-live": "polite"
};
var _hoisted_90 = {
	key: 0,
	class: "loading-state",
	role: "status"
};
var _hoisted_91 = {
	key: 1,
	class: "request-error",
	role: "alert"
};
var _hoisted_92 = { key: 2 };
var _hoisted_93 = { class: "order-detail-heading" };
var _hoisted_94 = { class: "card-kicker" };
var _hoisted_95 = { class: "order-summary" };
var _hoisted_96 = { class: "table-scroll line-items-wrap" };
var _hoisted_97 = { class: "order-totals" };
var _hoisted_98 = { class: "grand-total" };
var pageSize = 10;
var App_ce_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "App.ce",
	setup(__props) {
		const name = /* @__PURE__ */ ref("Ada Lovelace");
		const email = /* @__PURE__ */ ref("ada@example.com");
		const seats = /* @__PURE__ */ ref(3);
		const startDate = /* @__PURE__ */ ref("2026-08-01");
		const role = /* @__PURE__ */ ref("Developer");
		const interests = /* @__PURE__ */ ref(["Data"]);
		const contact = /* @__PURE__ */ ref("Email");
		const notifications = /* @__PURE__ */ ref(true);
		const confidence = /* @__PURE__ */ ref(72);
		const activeTab = /* @__PURE__ */ ref("summary");
		const successMessage = /* @__PURE__ */ ref("");
		const dialog = /* @__PURE__ */ ref(null);
		const tabNames = ["summary", "settings"];
		const columns = [
			["companyName", "Company"],
			["contactName", "Contact"],
			["city", "City"],
			["country", "Country"],
			["customerId", "ID"]
		];
		const editableCustomerFields = [
			["companyName", "Company"],
			["contactName", "Contact"],
			["contactTitle", "Title"],
			["address", "Address"],
			["city", "City"],
			["region", "Region"],
			["postalCode", "Postal code"],
			["country", "Country"],
			["phone", "Phone"],
			["fax", "Fax"]
		];
		const countries = /* @__PURE__ */ ref([]);
		const customers = /* @__PURE__ */ ref([]);
		const search = /* @__PURE__ */ ref("");
		const debouncedSearch = /* @__PURE__ */ ref("");
		const country = /* @__PURE__ */ ref("");
		const sort = /* @__PURE__ */ ref("companyName");
		const direction = /* @__PURE__ */ ref("asc");
		const page = /* @__PURE__ */ ref(1);
		const totalCount = /* @__PURE__ */ ref(0);
		const totalPages = /* @__PURE__ */ ref(0);
		const selectedId = /* @__PURE__ */ ref(null);
		const customerDetail = /* @__PURE__ */ ref(null);
		const customerDetailLoading = /* @__PURE__ */ ref(false);
		const customerDetailError = /* @__PURE__ */ ref("");
		const orders = /* @__PURE__ */ ref([]);
		const ordersLoading = /* @__PURE__ */ ref(false);
		const ordersError = /* @__PURE__ */ ref("");
		const selectedOrderId = /* @__PURE__ */ ref(null);
		const orderDetail = /* @__PURE__ */ ref(null);
		const orderDetailLoading = /* @__PURE__ */ ref(false);
		const orderDetailError = /* @__PURE__ */ ref("");
		const sandboxEnabled = /* @__PURE__ */ ref(false);
		const sandboxHasChanges = /* @__PURE__ */ ref(false);
		const sandboxExpiresAt = /* @__PURE__ */ ref(null);
		const sandboxNotice = /* @__PURE__ */ ref("");
		const sandboxError = /* @__PURE__ */ ref("");
		const sandboxSaving = /* @__PURE__ */ ref(false);
		const customerDraft = /* @__PURE__ */ ref(null);
		const customersLoading = /* @__PURE__ */ ref(true);
		const customersError = /* @__PURE__ */ ref("");
		const countriesError = /* @__PURE__ */ ref("");
		let searchTimer;
		let customerController;
		let countryController;
		let customerDetailController;
		let ordersController;
		let orderDetailController;
		const isNameValid = computed(() => name.value.trim().length > 0);
		const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
		const isProfileValid = computed(() => isNameValid.value && isEmailValid.value);
		const pageDescription = computed(() => totalPages.value === 0 ? "No pages" : `Page ${page.value} of ${totalPages.value}`);
		const customerDraftDirty = computed(() => {
			if (!customerDetail.value || !customerDraft.value) return false;
			return editableCustomerFields.some(([key]) => (customerDraft.value[key] ?? "") !== (customerDetail.value[key] ?? ""));
		});
		const draftCompanyValid = computed(() => customerDraft.value?.companyName?.trim().length > 0);
		async function loadCountries() {
			countryController?.abort();
			const controller = new AbortController();
			countryController = controller;
			countriesError.value = "";
			try {
				const response = await fetch("/api/northwind/countries", { signal: controller.signal });
				if (!response.ok) throw new Error("Countries could not be loaded.");
				countries.value = await response.json();
			} catch (error) {
				if (error.name !== "AbortError") countriesError.value = error.message;
			}
		}
		async function loadCustomers() {
			customerController?.abort();
			const controller = new AbortController();
			customerController = controller;
			customersLoading.value = true;
			customersError.value = "";
			const query = new URLSearchParams({
				search: debouncedSearch.value,
				country: country.value,
				sort: sort.value,
				direction: direction.value,
				page: String(page.value),
				pageSize: String(pageSize)
			});
			try {
				const collectionPath = sandboxEnabled.value ? "/api/northwind/sandbox/customers" : "/api/northwind/customers";
				const response = await fetch(`${collectionPath}?${query}`, { signal: controller.signal });
				if (!response.ok) {
					const message = response.status === 400 ? "The customer query is invalid." : "Customers could not be loaded.";
					throw new Error(message);
				}
				const result = await response.json();
				customers.value = result.items;
				totalCount.value = result.totalCount;
				totalPages.value = result.totalPages;
				selectedId.value = result.items.some((customer) => customer.customerId === selectedId.value) ? selectedId.value : null;
			} catch (error) {
				if (error.name !== "AbortError") {
					customers.value = [];
					totalCount.value = 0;
					totalPages.value = 0;
					customersError.value = error.message;
				}
			} finally {
				if (!controller.signal.aborted) customersLoading.value = false;
			}
		}
		function changeSort(column) {
			if (sort.value === column) direction.value = direction.value === "asc" ? "desc" : "asc";
			else {
				sort.value = column;
				direction.value = "asc";
			}
			page.value = 1;
		}
		function ariaSort(column) {
			if (sort.value !== column) return "none";
			return direction.value === "asc" ? "ascending" : "descending";
		}
		function selectCustomer(customerId) {
			selectedId.value = customerId;
		}
		async function loadCustomerDetail() {
			customerDetailController?.abort();
			customerDetail.value = null;
			customerDetailError.value = "";
			if (!selectedId.value) {
				customerDetailLoading.value = false;
				return;
			}
			const controller = new AbortController();
			customerDetailController = controller;
			customerDetailLoading.value = true;
			try {
				const detailPath = sandboxEnabled.value ? `/api/northwind/sandbox/customers/${selectedId.value}` : `/api/northwind/customers/${selectedId.value}`;
				const response = await fetch(detailPath, { signal: controller.signal });
				if (!response.ok) throw new Error("Customer details could not be loaded.");
				customerDetail.value = await response.json();
				customerDraft.value = Object.fromEntries(editableCustomerFields.map(([key]) => [key, customerDetail.value[key] ?? ""]));
			} catch (error) {
				if (error.name !== "AbortError") customerDetailError.value = error.message;
			} finally {
				if (!controller.signal.aborted) customerDetailLoading.value = false;
			}
		}
		async function loadOrders() {
			ordersController?.abort();
			orders.value = [];
			selectedOrderId.value = null;
			ordersError.value = "";
			if (!selectedId.value) {
				ordersLoading.value = false;
				return;
			}
			const controller = new AbortController();
			ordersController = controller;
			ordersLoading.value = true;
			try {
				const response = await fetch(`/api/northwind/customers/${selectedId.value}/orders`, { signal: controller.signal });
				if (!response.ok) throw new Error("Customer orders could not be loaded.");
				orders.value = await response.json();
				selectedOrderId.value = orders.value[0]?.orderId ?? null;
			} catch (error) {
				if (error.name !== "AbortError") ordersError.value = error.message;
			} finally {
				if (!controller.signal.aborted) ordersLoading.value = false;
			}
		}
		async function loadOrderDetail() {
			orderDetailController?.abort();
			orderDetail.value = null;
			orderDetailError.value = "";
			if (!selectedOrderId.value) {
				orderDetailLoading.value = false;
				return;
			}
			const controller = new AbortController();
			orderDetailController = controller;
			orderDetailLoading.value = true;
			try {
				const response = await fetch(`/api/northwind/orders/${selectedOrderId.value}`, { signal: controller.signal });
				if (!response.ok) throw new Error("Order details could not be loaded.");
				orderDetail.value = await response.json();
			} catch (error) {
				if (error.name !== "AbortError") orderDetailError.value = error.message;
			} finally {
				if (!controller.signal.aborted) orderDetailLoading.value = false;
			}
		}
		function formatCurrency(value) {
			return `$${Number(value).toLocaleString()}`;
		}
		function formatDate(value) {
			if (!value) return "No orders";
			return new Date(value).toLocaleDateString();
		}
		async function loadSandboxStatus() {
			sandboxError.value = "";
			try {
				const response = await fetch("/api/northwind/sandbox/status");
				if (!response.ok) throw new Error("Sandbox status could not be loaded.");
				const status = await response.json();
				sandboxHasChanges.value = status.hasChanges;
				sandboxExpiresAt.value = status.expiresAt;
			} catch (error) {
				sandboxError.value = error.message;
			}
		}
		async function setSandboxEnabled(enabled, control) {
			if (!enabled && customerDraftDirty.value) {
				control.checked = true;
				sandboxNotice.value = "Save or discard unsaved fields before leaving Editing Sandbox.";
				return;
			}
			sandboxEnabled.value = enabled;
			sandboxNotice.value = "";
			if (enabled) await loadSandboxStatus();
			await Promise.all([loadCustomers(), loadCustomerDetail()]);
		}
		function discardCustomerChanges() {
			if (!customerDetail.value) return;
			customerDraft.value = Object.fromEntries(editableCustomerFields.map(([key]) => [key, customerDetail.value[key] ?? ""]));
			sandboxNotice.value = "Unsaved fields discarded.";
		}
		async function saveCustomer() {
			if (!selectedId.value || !customerDraftDirty.value || !draftCompanyValid.value) return;
			sandboxSaving.value = true;
			sandboxError.value = "";
			try {
				if (!(await fetch(`/api/northwind/sandbox/customers/${selectedId.value}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(customerDraft.value)
				})).ok) throw new Error("Customer changes could not be saved.");
				sandboxNotice.value = "Customer changes saved in this browser session.";
				sandboxHasChanges.value = true;
				await Promise.all([
					loadCustomers(),
					loadCustomerDetail(),
					loadSandboxStatus()
				]);
			} catch (error) {
				sandboxError.value = error.message;
			} finally {
				sandboxSaving.value = false;
			}
		}
		async function resetSandbox() {
			sandboxError.value = "";
			try {
				if (!(await fetch("/api/northwind/sandbox/reset", { method: "POST" })).ok) throw new Error("Sandbox could not be reset.");
				selectedId.value = null;
				sandboxHasChanges.value = false;
				sandboxExpiresAt.value = null;
				sandboxNotice.value = "Editing Sandbox reset to the vanilla Northwind copy.";
				await Promise.all([loadCustomers(), loadSandboxStatus()]);
			} catch (error) {
				sandboxError.value = error.message;
			}
		}
		function validateProfile() {
			if (!isProfileValid.value) return;
			successMessage.value = "Example profile validated successfully.";
		}
		function openDialog() {
			dialog.value?.showModal();
		}
		function handleTabKeydown(event) {
			if (![
				"ArrowLeft",
				"ArrowRight",
				"Home",
				"End"
			].includes(event.key)) return;
			event.preventDefault();
			const currentIndex = tabNames.indexOf(activeTab.value);
			const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabNames.length - 1 : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabNames.length) % tabNames.length;
			activeTab.value = tabNames[nextIndex];
			event.currentTarget.closest("[role=\"tablist\"]").querySelector(`[data-tab="${activeTab.value}"]`).focus();
		}
		watch(search, (value) => {
			clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				page.value = 1;
				debouncedSearch.value = value;
			}, 250);
		});
		watch(country, () => {
			page.value = 1;
		});
		watch([
			debouncedSearch,
			country,
			sort,
			direction,
			page
		], loadCustomers);
		watch(selectedId, loadCustomerDetail);
		watch(selectedId, loadOrders);
		watch(selectedOrderId, loadOrderDetail);
		onMounted(() => {
			loadCountries();
			loadCustomers();
		});
		onBeforeUnmount(() => {
			clearTimeout(searchTimer);
			customerController?.abort();
			countryController?.abort();
			customerDetailController?.abort();
			ordersController?.abort();
			orderDetailController?.abort();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				_cache[80] || (_cache[80] = createStaticVNode("<header class=\"showcase-header\"><div><span class=\"eyebrow\">Frontend Lab</span><h1>Vue showcase</h1><p> Interactive UI patterns, form controls, and API-backed data binding built with accessible native controls. </p></div><div class=\"framework-badge\" aria-label=\"Built with Vue\"><span aria-hidden=\"true\">V</span><strong>Vue</strong></div></header><nav class=\"showcase-nav\" aria-label=\"Vue showcase sections\"><a href=\"#vue-controls\">Control gallery</a><a href=\"#vue-northwind\">Northwind data binding</a></nav>", 2)),
				createBaseVNode("section", _hoisted_2, [
					_cache[48] || (_cache[48] = createBaseVNode("div", { class: "section-heading" }, [createBaseVNode("div", null, [createBaseVNode("span", { class: "eyebrow" }, "Reactive UI state"), createBaseVNode("h2", { id: "controls-heading" }, "Control gallery")]), createBaseVNode("p", null, " Every value below is bound to framework state and immediately reflected in the live summary. ")], -1)),
					createBaseVNode("div", _hoisted_3, [createBaseVNode("form", {
						class: "control-card form-card",
						"aria-labelledby": "profile-heading",
						onSubmit: withModifiers(validateProfile, ["prevent"])
					}, [
						_cache[36] || (_cache[36] = createBaseVNode("div", { class: "card-heading" }, [createBaseVNode("h3", { id: "profile-heading" }, "Profile inputs")], -1)),
						createBaseVNode("div", _hoisted_4, [
							createBaseVNode("label", _hoisted_5, [
								_cache[21] || (_cache[21] = createBaseVNode("span", null, "Name", -1)),
								withDirectives(createBaseVNode("input", {
									"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
									type: "text",
									required: "",
									"aria-describedby": "name-error"
								}, null, 512), [[vModelText, name.value]]),
								!isNameValid.value ? (openBlock(), createElementBlock("small", _hoisted_6, "Enter a name.")) : createCommentVNode("", true)
							]),
							createBaseVNode("label", _hoisted_7, [
								_cache[22] || (_cache[22] = createBaseVNode("span", null, "Email", -1)),
								withDirectives(createBaseVNode("input", {
									"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => email.value = $event),
									type: "email",
									required: "",
									"aria-invalid": !isEmailValid.value,
									"aria-describedby": "email-help"
								}, null, 8, _hoisted_8), [[vModelText, email.value]]),
								createBaseVNode("small", {
									id: "email-help",
									class: normalizeClass(isEmailValid.value ? "field-help" : "field-error")
								}, toDisplayString(isEmailValid.value ? "Used for example notifications." : "Enter a valid email address."), 3)
							]),
							createBaseVNode("div", _hoisted_9, [createBaseVNode("label", null, [_cache[23] || (_cache[23] = createBaseVNode("span", null, "Seats", -1)), withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => seats.value = $event),
								type: "number",
								min: "1",
								max: "20"
							}, null, 512), [[
								vModelText,
								seats.value,
								void 0,
								{ number: true }
							]])]), createBaseVNode("label", null, [_cache[24] || (_cache[24] = createBaseVNode("span", null, "Start date", -1)), withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => startDate.value = $event),
								type: "date"
							}, null, 512), [[vModelText, startDate.value]])])]),
							createBaseVNode("label", _hoisted_10, [_cache[26] || (_cache[26] = createBaseVNode("span", null, "Role", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => role.value = $event) }, [..._cache[25] || (_cache[25] = [
								createBaseVNode("option", null, "Developer", -1),
								createBaseVNode("option", null, "Designer", -1),
								createBaseVNode("option", null, "Analyst", -1),
								createBaseVNode("option", null, "Manager", -1)
							])], 512), [[vModelSelect, role.value]])])
						]),
						createBaseVNode("fieldset", null, [_cache[30] || (_cache[30] = createBaseVNode("legend", null, "Interests", -1)), createBaseVNode("div", _hoisted_11, [
							createBaseVNode("label", _hoisted_12, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => interests.value = $event),
								type: "checkbox",
								value: "Data"
							}, null, 512), [[vModelCheckbox, interests.value]]), _cache[27] || (_cache[27] = createTextVNode(" Data", -1))]),
							createBaseVNode("label", _hoisted_13, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => interests.value = $event),
								type: "checkbox",
								value: "Design"
							}, null, 512), [[vModelCheckbox, interests.value]]), _cache[28] || (_cache[28] = createTextVNode(" Design", -1))]),
							createBaseVNode("label", _hoisted_14, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => interests.value = $event),
								type: "checkbox",
								value: "Automation"
							}, null, 512), [[vModelCheckbox, interests.value]]), _cache[29] || (_cache[29] = createTextVNode(" Automation", -1))])
						])]),
						createBaseVNode("fieldset", null, [_cache[34] || (_cache[34] = createBaseVNode("legend", null, "Preferred contact", -1)), createBaseVNode("div", _hoisted_15, [
							createBaseVNode("label", _hoisted_16, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => contact.value = $event),
								type: "radio",
								value: "Email"
							}, null, 512), [[vModelRadio, contact.value]]), _cache[31] || (_cache[31] = createTextVNode(" Email", -1))]),
							createBaseVNode("label", _hoisted_17, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => contact.value = $event),
								type: "radio",
								value: "Phone"
							}, null, 512), [[vModelRadio, contact.value]]), _cache[32] || (_cache[32] = createTextVNode(" Phone", -1))]),
							createBaseVNode("label", _hoisted_18, [withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => contact.value = $event),
								type: "radio",
								value: "Chat"
							}, null, 512), [[vModelRadio, contact.value]]), _cache[33] || (_cache[33] = createTextVNode(" Chat", -1))])
						])]),
						createBaseVNode("div", _hoisted_19, [
							createBaseVNode("button", {
								class: "primary-button",
								type: "submit",
								disabled: !isProfileValid.value
							}, " Validate profile ", 8, _hoisted_20),
							createBaseVNode("button", {
								class: "secondary-button",
								type: "button",
								onClick: openDialog
							}, " Open dialog "),
							_cache[35] || (_cache[35] = createBaseVNode("button", {
								class: "secondary-button",
								type: "button",
								disabled: ""
							}, "Disabled", -1))
						])
					], 32), createBaseVNode("div", _hoisted_21, [createBaseVNode("article", _hoisted_22, [
						_cache[39] || (_cache[39] = createBaseVNode("div", { class: "card-heading" }, [createBaseVNode("h3", { id: "preferences-heading" }, "Preferences and progress")], -1)),
						createBaseVNode("label", _hoisted_23, [_cache[37] || (_cache[37] = createBaseVNode("span", null, [createBaseVNode("strong", null, "Notifications"), createBaseVNode("small", null, "Enable status updates")], -1)), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => notifications.value = $event),
							type: "checkbox",
							role: "switch"
						}, null, 512), [[vModelCheckbox, notifications.value]])]),
						createBaseVNode("label", _hoisted_24, [createBaseVNode("span", null, [_cache[38] || (_cache[38] = createTextVNode("Confidence ", -1)), createBaseVNode("strong", null, toDisplayString(confidence.value) + "%", 1)]), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => confidence.value = $event),
							type: "range",
							min: "0",
							max: "100"
						}, null, 512), [[
							vModelText,
							confidence.value,
							void 0,
							{ number: true }
						]])]),
						createBaseVNode("progress", {
							value: confidence.value,
							max: "100",
							"aria-label": `Confidence ${confidence.value}%`
						}, null, 8, _hoisted_25)
					]), createBaseVNode("article", _hoisted_26, [
						_cache[46] || (_cache[46] = createBaseVNode("div", { class: "card-heading" }, [createBaseVNode("h3", { id: "preview-heading" }, "Bound state")], -1)),
						createBaseVNode("div", _hoisted_27, [createBaseVNode("button", {
							id: "profile-summary-tab",
							type: "button",
							role: "tab",
							"data-tab": "summary",
							"aria-selected": activeTab.value === "summary",
							"aria-controls": "profile-summary-panel",
							onClick: _cache[13] || (_cache[13] = ($event) => activeTab.value = "summary"),
							onKeydown: handleTabKeydown
						}, " Summary ", 40, _hoisted_28), createBaseVNode("button", {
							id: "profile-settings-tab",
							type: "button",
							role: "tab",
							"data-tab": "settings",
							"aria-selected": activeTab.value === "settings",
							"aria-controls": "profile-settings-panel",
							onClick: _cache[14] || (_cache[14] = ($event) => activeTab.value = "settings"),
							onKeydown: handleTabKeydown
						}, " Settings ", 40, _hoisted_29)]),
						activeTab.value === "summary" ? (openBlock(), createElementBlock("div", _hoisted_30, [createBaseVNode("h3", null, toDisplayString(name.value || "Unnamed profile"), 1), createBaseVNode("dl", _hoisted_31, [
							createBaseVNode("div", null, [_cache[40] || (_cache[40] = createBaseVNode("dt", null, "Role", -1)), createBaseVNode("dd", null, toDisplayString(role.value), 1)]),
							createBaseVNode("div", null, [_cache[41] || (_cache[41] = createBaseVNode("dt", null, "Seats", -1)), createBaseVNode("dd", null, toDisplayString(seats.value), 1)]),
							createBaseVNode("div", null, [_cache[42] || (_cache[42] = createBaseVNode("dt", null, "Contact", -1)), createBaseVNode("dd", null, toDisplayString(contact.value), 1)]),
							createBaseVNode("div", null, [_cache[43] || (_cache[43] = createBaseVNode("dt", null, "Interests", -1)), createBaseVNode("dd", null, toDisplayString(interests.value.join(", ") || "None"), 1)])
						])])) : (openBlock(), createElementBlock("div", _hoisted_32, [_cache[45] || (_cache[45] = createBaseVNode("h3", null, "Current settings", -1)), createBaseVNode("p", null, [
							_cache[44] || (_cache[44] = createTextVNode(" Notifications are ", -1)),
							createBaseVNode("strong", null, toDisplayString(notifications.value ? "enabled" : "disabled"), 1),
							createTextVNode(". The selected start date is " + toDisplayString(startDate.value) + ". ", 1)
						])])),
						_cache[47] || (_cache[47] = createBaseVNode("details", null, [createBaseVNode("summary", null, "Implementation note"), createBaseVNode("p", null, " Native controls preserve keyboard behavior while framework state derives this summary. ")], -1))
					])])]),
					successMessage.value ? (openBlock(), createElementBlock("div", _hoisted_33, [createBaseVNode("span", null, toDisplayString(successMessage.value), 1), createBaseVNode("button", {
						type: "button",
						"aria-label": "Dismiss notification",
						onClick: _cache[15] || (_cache[15] = ($event) => successMessage.value = "")
					}, " × ")])) : createCommentVNode("", true)
				]),
				createBaseVNode("section", _hoisted_34, [
					_cache[78] || (_cache[78] = createBaseVNode("div", { class: "section-heading" }, [createBaseVNode("div", null, [createBaseVNode("span", { class: "eyebrow" }, "API-backed state"), createBaseVNode("h2", { id: "data-heading" }, "Northwind data binding")]), createBaseVNode("p", null, " Server-driven filtering, sorting, paging, and selection against the Northwind API. ")], -1)),
					createBaseVNode("aside", _hoisted_35, [
						_cache[49] || (_cache[49] = createBaseVNode("div", null, [
							createBaseVNode("span", { class: "eyebrow" }, "Session-isolated editing"),
							createBaseVNode("h3", { id: "sandbox-heading" }, "Editing Sandbox"),
							createBaseVNode("p", null, " Changes use an in-memory browser-session copy. Canonical Northwind customers and every order remain read-only. ")
						], -1)),
						createBaseVNode("label", _hoisted_36, [createBaseVNode("span", null, [createBaseVNode("strong", null, toDisplayString(sandboxEnabled.value ? "Enabled" : "Disabled"), 1), createBaseVNode("small", null, toDisplayString(sandboxHasChanges.value ? "Changes made" : "Vanilla copy"), 1)]), createBaseVNode("input", {
							type: "checkbox",
							role: "switch",
							"aria-label": "Editing sandbox",
							checked: sandboxEnabled.value,
							onChange: _cache[16] || (_cache[16] = ($event) => setSandboxEnabled($event.target.checked, $event.target))
						}, null, 40, _hoisted_37)]),
						sandboxEnabled.value ? (openBlock(), createElementBlock("button", {
							key: 0,
							type: "button",
							class: "secondary-button",
							onClick: resetSandbox
						}, " Reset sandbox ")) : createCommentVNode("", true),
						sandboxEnabled.value && sandboxExpiresAt.value ? (openBlock(), createElementBlock("small", _hoisted_38, " Session copy expires after 30 minutes without sandbox activity. ")) : createCommentVNode("", true),
						sandboxNotice.value ? (openBlock(), createElementBlock("p", _hoisted_39, toDisplayString(sandboxNotice.value), 1)) : createCommentVNode("", true),
						sandboxError.value ? (openBlock(), createElementBlock("p", _hoisted_40, toDisplayString(sandboxError.value), 1)) : createCommentVNode("", true)
					]),
					createBaseVNode("article", _hoisted_41, [
						createBaseVNode("div", _hoisted_42, [_cache[50] || (_cache[50] = createBaseVNode("div", null, [createBaseVNode("h3", { id: "explorer-heading" }, "Customer explorer")], -1)), createBaseVNode("p", null, toDisplayString(totalCount.value) + " Northwind records", 1)]),
						createBaseVNode("div", _hoisted_43, [createBaseVNode("label", null, [_cache[51] || (_cache[51] = createBaseVNode("span", null, "Search customers", -1)), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => search.value = $event),
							type: "search",
							placeholder: "Company or contact"
						}, null, 512), [[vModelText, search.value]])]), createBaseVNode("label", null, [_cache[53] || (_cache[53] = createBaseVNode("span", null, "Country", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => country.value = $event) }, [_cache[52] || (_cache[52] = createBaseVNode("option", { value: "" }, "All countries", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(countries.value, (item) => {
							return openBlock(), createElementBlock("option", {
								key: item,
								value: item
							}, toDisplayString(item), 9, _hoisted_44);
						}), 128))], 512), [[vModelSelect, country.value]])])]),
						countriesError.value ? (openBlock(), createElementBlock("p", _hoisted_45, toDisplayString(countriesError.value), 1)) : createCommentVNode("", true),
						customersLoading.value ? (openBlock(), createElementBlock("p", _hoisted_46, " Loading customers… ")) : customersError.value ? (openBlock(), createElementBlock("div", _hoisted_47, [createBaseVNode("p", null, toDisplayString(customersError.value), 1), createBaseVNode("button", {
							type: "button",
							class: "secondary-button",
							onClick: loadCustomers
						}, " Try again ")])) : customers.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_48, " No customers match these filters. ")) : (openBlock(), createElementBlock("div", _hoisted_49, [createBaseVNode("table", null, [
							_cache[54] || (_cache[54] = createBaseVNode("caption", { class: "visually-hidden" }, " Filtered Northwind customers ", -1)),
							createBaseVNode("thead", null, [createBaseVNode("tr", null, [(openBlock(), createElementBlock(Fragment, null, renderList(columns, ([key, label]) => {
								return createBaseVNode("th", {
									key,
									scope: "col",
									"aria-sort": ariaSort(key)
								}, [createBaseVNode("button", {
									type: "button",
									class: "sort-button",
									onClick: ($event) => changeSort(key)
								}, [
									createTextVNode(toDisplayString(label) + " ", 1),
									sort.value === key ? (openBlock(), createElementBlock("span", _hoisted_52, toDisplayString(direction.value === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true),
									sort.value !== key ? (openBlock(), createElementBlock("span", _hoisted_53, "↕")) : createCommentVNode("", true)
								], 8, _hoisted_51)], 8, _hoisted_50);
							}), 64))])]),
							createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(customers.value, (customer) => {
								return openBlock(), createElementBlock("tr", {
									key: customer.customerId,
									class: normalizeClass({ selected: selectedId.value === customer.customerId }),
									"aria-selected": selectedId.value === customer.customerId,
									tabindex: "0",
									onClick: ($event) => selectCustomer(customer.customerId),
									onKeydown: [withKeys(($event) => selectCustomer(customer.customerId), ["enter"]), withKeys(withModifiers(($event) => selectCustomer(customer.customerId), ["prevent"]), ["space"])]
								}, [
									createBaseVNode("td", _hoisted_55, toDisplayString(customer.companyName), 1),
									createBaseVNode("td", _hoisted_56, toDisplayString(customer.contactName || "—"), 1),
									createBaseVNode("td", _hoisted_57, toDisplayString(customer.city || "—"), 1),
									createBaseVNode("td", _hoisted_58, toDisplayString(customer.country || "—"), 1),
									createBaseVNode("td", _hoisted_59, [createBaseVNode("code", null, toDisplayString(customer.customerId), 1)])
								], 42, _hoisted_54);
							}), 128))])
						])])),
						createBaseVNode("div", _hoisted_60, [
							createBaseVNode("button", {
								type: "button",
								class: "secondary-button",
								disabled: page.value <= 1 || customersLoading.value,
								onClick: _cache[19] || (_cache[19] = ($event) => page.value -= 1)
							}, " Previous ", 8, _hoisted_61),
							createBaseVNode("span", null, toDisplayString(pageDescription.value), 1),
							createBaseVNode("button", {
								type: "button",
								class: "secondary-button",
								disabled: page.value >= totalPages.value || customersLoading.value,
								onClick: _cache[20] || (_cache[20] = ($event) => page.value += 1)
							}, " Next ", 8, _hoisted_62)
						]),
						createBaseVNode("p", _hoisted_63, toDisplayString(selectedId.value ? `Selected: ${selectedId.value}` : "Select a customer"), 1)
					]),
					createBaseVNode("article", _hoisted_64, [createBaseVNode("div", _hoisted_65, [_cache[55] || (_cache[55] = createBaseVNode("div", null, [createBaseVNode("h3", { id: "customer-details-heading" }, "Customer details")], -1)), selectedId.value ? (openBlock(), createElementBlock("code", _hoisted_66, toDisplayString(selectedId.value), 1)) : createCommentVNode("", true)]), !selectedId.value ? (openBlock(), createElementBlock("p", _hoisted_67, " Select a customer to bind its complete record and sales metrics. ")) : customerDetailLoading.value ? (openBlock(), createElementBlock("p", _hoisted_68, " Loading customer details… ")) : customerDetailError.value ? (openBlock(), createElementBlock("div", _hoisted_69, [createBaseVNode("p", null, toDisplayString(customerDetailError.value), 1), createBaseVNode("button", {
						type: "button",
						class: "secondary-button",
						onClick: loadCustomerDetail
					}, " Try again ")])) : customerDetail.value ? (openBlock(), createElementBlock("div", _hoisted_70, [createBaseVNode("dl", _hoisted_71, [
						createBaseVNode("div", null, [_cache[56] || (_cache[56] = createBaseVNode("dt", null, "Orders", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.orderCount), 1)]),
						createBaseVNode("div", null, [_cache[57] || (_cache[57] = createBaseVNode("dt", null, "Total sales", -1)), createBaseVNode("dd", null, toDisplayString(formatCurrency(customerDetail.value.totalSales)), 1)]),
						createBaseVNode("div", null, [_cache[58] || (_cache[58] = createBaseVNode("dt", null, "Last order", -1)), createBaseVNode("dd", null, toDisplayString(formatDate(customerDetail.value.lastOrderDate)), 1)])
					]), sandboxEnabled.value ? (openBlock(), createElementBlock("form", {
						key: 0,
						class: "customer-edit-form detail-form",
						"aria-label": "Edit selected customer",
						onSubmit: withModifiers(saveCustomer, ["prevent"])
					}, [
						(openBlock(), createElementBlock(Fragment, null, renderList(editableCustomerFields, ([key, label]) => {
							return createBaseVNode("label", { key }, [createBaseVNode("span", null, toDisplayString(label), 1), withDirectives(createBaseVNode("input", {
								"onUpdate:modelValue": ($event) => customerDraft.value[key] = $event,
								type: "text",
								required: key === "companyName"
							}, null, 8, _hoisted_72), [[vModelText, customerDraft.value[key]]])]);
						}), 64)),
						!draftCompanyValid.value ? (openBlock(), createElementBlock("p", _hoisted_73, " Company name is required. ")) : createCommentVNode("", true),
						createBaseVNode("p", _hoisted_74, toDisplayString(customerDraftDirty.value ? "Unsaved fields" : "No unsaved fields"), 1),
						createBaseVNode("div", _hoisted_75, [createBaseVNode("button", {
							class: "primary-button",
							type: "submit",
							disabled: !customerDraftDirty.value || !draftCompanyValid.value || sandboxSaving.value
						}, toDisplayString(sandboxSaving.value ? "Saving…" : "Save changes"), 9, _hoisted_76), createBaseVNode("button", {
							class: "secondary-button",
							type: "button",
							disabled: !customerDraftDirty.value || sandboxSaving.value,
							onClick: discardCustomerChanges
						}, " Discard ", 8, _hoisted_77)])
					], 32)) : (openBlock(), createElementBlock("dl", _hoisted_78, [
						createBaseVNode("div", null, [_cache[59] || (_cache[59] = createBaseVNode("dt", null, "Company", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.companyName), 1)]),
						createBaseVNode("div", null, [_cache[60] || (_cache[60] = createBaseVNode("dt", null, "Contact", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.contactName || "—"), 1)]),
						createBaseVNode("div", null, [_cache[61] || (_cache[61] = createBaseVNode("dt", null, "Title", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.contactTitle || "—"), 1)]),
						createBaseVNode("div", null, [_cache[62] || (_cache[62] = createBaseVNode("dt", null, "Address", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.address || "—"), 1)]),
						createBaseVNode("div", null, [_cache[63] || (_cache[63] = createBaseVNode("dt", null, "City", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.city || "—"), 1)]),
						createBaseVNode("div", null, [_cache[64] || (_cache[64] = createBaseVNode("dt", null, "Region", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.region || "—"), 1)]),
						createBaseVNode("div", null, [_cache[65] || (_cache[65] = createBaseVNode("dt", null, "Postal code", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.postalCode || "—"), 1)]),
						createBaseVNode("div", null, [_cache[66] || (_cache[66] = createBaseVNode("dt", null, "Country", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.country || "—"), 1)]),
						createBaseVNode("div", null, [_cache[67] || (_cache[67] = createBaseVNode("dt", null, "Phone", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.phone || "—"), 1)]),
						createBaseVNode("div", null, [_cache[68] || (_cache[68] = createBaseVNode("dt", null, "Fax", -1)), createBaseVNode("dd", null, toDisplayString(customerDetail.value.fax || "—"), 1)])
					]))])) : createCommentVNode("", true)]),
					createBaseVNode("article", _hoisted_79, [createBaseVNode("div", _hoisted_80, [_cache[69] || (_cache[69] = createBaseVNode("div", null, [createBaseVNode("h3", { id: "orders-heading" }, "Orders and line items")], -1)), orders.value.length ? (openBlock(), createElementBlock("span", _hoisted_81, toDisplayString(orders.value.length) + " orders", 1)) : createCommentVNode("", true)]), !selectedId.value ? (openBlock(), createElementBlock("p", _hoisted_82, " Select a customer to load their orders. ")) : ordersLoading.value ? (openBlock(), createElementBlock("p", _hoisted_83, " Loading customer orders… ")) : ordersError.value ? (openBlock(), createElementBlock("div", _hoisted_84, [createBaseVNode("p", null, toDisplayString(ordersError.value), 1), createBaseVNode("button", {
						type: "button",
						class: "secondary-button",
						onClick: loadOrders
					}, " Try again ")])) : orders.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_85, " This customer has no orders. ")) : (openBlock(), createElementBlock("div", _hoisted_86, [createBaseVNode("div", _hoisted_87, [(openBlock(true), createElementBlock(Fragment, null, renderList(orders.value, (order) => {
						return openBlock(), createElementBlock("button", {
							key: order.orderId,
							type: "button",
							class: "order-card",
							"aria-pressed": selectedOrderId.value === order.orderId,
							onClick: ($event) => selectedOrderId.value = order.orderId
						}, [createBaseVNode("span", null, [createBaseVNode("strong", null, "Order " + toDisplayString(order.orderId), 1), createBaseVNode("small", null, toDisplayString(formatDate(order.orderDate)), 1)]), createBaseVNode("span", null, [createBaseVNode("strong", null, toDisplayString(formatCurrency(order.total)), 1), createBaseVNode("small", { class: normalizeClass(["order-status", order.status.toLowerCase()]) }, toDisplayString(order.status), 3)])], 8, _hoisted_88);
					}), 128))]), createBaseVNode("div", _hoisted_89, [orderDetailLoading.value ? (openBlock(), createElementBlock("p", _hoisted_90, " Loading order details… ")) : orderDetailError.value ? (openBlock(), createElementBlock("div", _hoisted_91, [createBaseVNode("p", null, toDisplayString(orderDetailError.value), 1), createBaseVNode("button", {
						type: "button",
						class: "secondary-button",
						onClick: loadOrderDetail
					}, " Try again ")])) : orderDetail.value ? (openBlock(), createElementBlock("div", _hoisted_92, [
						createBaseVNode("div", _hoisted_93, [
							createBaseVNode("p", _hoisted_94, "Order " + toDisplayString(orderDetail.value.orderId), 1),
							createBaseVNode("h4", null, toDisplayString(orderDetail.value.status), 1),
							createBaseVNode("p", null, toDisplayString(formatDate(orderDetail.value.orderDate)), 1)
						]),
						createBaseVNode("dl", _hoisted_95, [
							createBaseVNode("div", null, [_cache[70] || (_cache[70] = createBaseVNode("dt", null, "Employee", -1)), createBaseVNode("dd", null, toDisplayString(orderDetail.value.employeeName || "Unassigned"), 1)]),
							createBaseVNode("div", null, [_cache[71] || (_cache[71] = createBaseVNode("dt", null, "Shipper", -1)), createBaseVNode("dd", null, toDisplayString(orderDetail.value.shipperName || "Unassigned"), 1)]),
							createBaseVNode("div", null, [_cache[72] || (_cache[72] = createBaseVNode("dt", null, "Destination", -1)), createBaseVNode("dd", null, toDisplayString(orderDetail.value.shippingAddress.city || "—") + ", " + toDisplayString(orderDetail.value.shippingAddress.country || "—"), 1)])
						]),
						createBaseVNode("div", _hoisted_96, [createBaseVNode("table", null, [
							_cache[73] || (_cache[73] = createBaseVNode("caption", { class: "visually-hidden" }, "Order line items", -1)),
							_cache[74] || (_cache[74] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
								createBaseVNode("th", { scope: "col" }, "Product"),
								createBaseVNode("th", { scope: "col" }, "Qty."),
								createBaseVNode("th", { scope: "col" }, "Price"),
								createBaseVNode("th", { scope: "col" }, "Total")
							])], -1)),
							createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(orderDetail.value.items, (item) => {
								return openBlock(), createElementBlock("tr", { key: item.productId }, [
									createBaseVNode("td", null, toDisplayString(item.productName), 1),
									createBaseVNode("td", null, toDisplayString(item.quantity), 1),
									createBaseVNode("td", null, toDisplayString(formatCurrency(item.unitPrice)), 1),
									createBaseVNode("td", null, toDisplayString(formatCurrency(item.extendedPrice)), 1)
								]);
							}), 128))])
						])]),
						createBaseVNode("dl", _hoisted_97, [
							createBaseVNode("div", null, [_cache[75] || (_cache[75] = createBaseVNode("dt", null, "Subtotal", -1)), createBaseVNode("dd", null, toDisplayString(formatCurrency(orderDetail.value.subtotal)), 1)]),
							createBaseVNode("div", null, [_cache[76] || (_cache[76] = createBaseVNode("dt", null, "Freight", -1)), createBaseVNode("dd", null, toDisplayString(formatCurrency(orderDetail.value.freight)), 1)]),
							createBaseVNode("div", _hoisted_98, [_cache[77] || (_cache[77] = createBaseVNode("dt", null, "Total", -1)), createBaseVNode("dd", null, toDisplayString(formatCurrency(orderDetail.value.total)), 1)])
						])
					])) : createCommentVNode("", true)])]))])
				]),
				createBaseVNode("dialog", {
					ref_key: "dialog",
					ref: dialog
				}, [..._cache[79] || (_cache[79] = [createBaseVNode("form", { method: "dialog" }, [
					createBaseVNode("span", { class: "eyebrow" }, "Native dialog"),
					createBaseVNode("h2", null, "Vue-controlled launch"),
					createBaseVNode("p", null, "This modal uses the browser dialog element for focus management and keyboard dismissal."),
					createBaseVNode("button", { class: "primary-button" }, "Close dialog")
				], -1)])], 512)
			]);
		};
	}
}, [["styles", [App_ce_vue_vue_type_style_index_0_inline_lang_default, showcase_contract_css_vue_type_style_index_1_src_true_inline_lang_default]]]);
//#endregion
//#region src/main.js
if (!customElements.get("vue-showcase")) customElements.define("vue-showcase", /* @__PURE__ */ defineCustomElement(App_ce_default));
//#endregion
