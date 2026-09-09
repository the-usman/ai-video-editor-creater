"use strict";
(self["webpackChunkmy_video"] = self["webpackChunkmy_video"] || []).push([["177"], {
7356(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  G: () => (ZodError),
  g: () => (ZodRealError)
});
/* import */ var _core_index_js__rspack_import_0 = __webpack_require__(3371);
/* import */ var _core_index_js__rspack_import_2 = __webpack_require__(5435);
/* import */ var _core_util_js__rspack_import_1 = __webpack_require__(7048);



const initializer = (inst, issues) => {
    _core_index_js__rspack_import_0/* .$ZodError.init */.a$.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
        format: {
            value: (mapper) => _core_index_js__rspack_import_0/* .formatError */.Wk(inst, mapper),
            // enumerable: false,
        },
        flatten: {
            value: (mapper) => _core_index_js__rspack_import_0/* .flattenError */.JM(inst, mapper),
            // enumerable: false,
        },
        addIssue: {
            value: (issue) => {
                inst.issues.push(issue);
                inst.message = JSON.stringify(inst.issues, _core_util_js__rspack_import_1.jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        addIssues: {
            value: (issues) => {
                inst.issues.push(...issues);
                inst.message = JSON.stringify(inst.issues, _core_util_js__rspack_import_1.jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        isEmpty: {
            get() {
                return inst.issues.length === 0;
            },
            // enumerable: false,
        },
    });
    // Object.defineProperty(inst, "isEmpty", {
    //   get() {
    //     return inst.issues.length === 0;
    //   },
    // });
};
const ZodError = /*@__PURE__*/ _core_index_js__rspack_import_2/* .$constructor */.xI("ZodError", initializer);
const ZodRealError = /*@__PURE__*/ _core_index_js__rspack_import_2/* .$constructor */.xI("ZodError", initializer, {
    Parent: Error,
});
// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
// export type ErrorMapCtx = core.$ZodErrorMapCtx;


},
3174(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ZodISODate: () => (ZodISODate),
  ZodISODateTime: () => (ZodISODateTime),
  ZodISODuration: () => (ZodISODuration),
  ZodISOTime: () => (ZodISOTime),
  date: () => (date),
  datetime: () => (datetime),
  duration: () => (duration),
  time: () => (time)
});
/* import */ var _core_index_js__rspack_import_0 = __webpack_require__(5435);
/* import */ var _core_index_js__rspack_import_1 = __webpack_require__(666);
/* import */ var _core_index_js__rspack_import_3 = __webpack_require__(638);
/* import */ var _schemas_js__rspack_import_2 = __webpack_require__(6687);


const ZodISODateTime = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodISODateTime", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodISODateTime.init */.Ko.init(inst, def);
    _schemas_js__rspack_import_2.ZodStringFormat.init(inst, def);
});
function datetime(params) {
    return _core_index_js__rspack_import_3/* ._isoDateTime */.G1(ZodISODateTime, params);
}
const ZodISODate = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodISODate", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodISODate.init */.v1.init(inst, def);
    _schemas_js__rspack_import_2.ZodStringFormat.init(inst, def);
});
function date(params) {
    return _core_index_js__rspack_import_3/* ._isoDate */.db(ZodISODate, params);
}
const ZodISOTime = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodISOTime", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodISOTime.init */.Ax.init(inst, def);
    _schemas_js__rspack_import_2.ZodStringFormat.init(inst, def);
});
function time(params) {
    return _core_index_js__rspack_import_3/* ._isoTime */.Kn(ZodISOTime, params);
}
const ZodISODuration = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodISODuration", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodISODuration.init */.$N.init(inst, def);
    _schemas_js__rspack_import_2.ZodStringFormat.init(inst, def);
});
function duration(params) {
    return _core_index_js__rspack_import_3/* ._isoDuration */.f2(ZodISODuration, params);
}


},
5852(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  D4: () => (decode),
  EJ: () => (parseAsync),
  EM: () => (safeEncodeAsync),
  Re: () => (decodeAsync),
  X$: () => (encodeAsync),
  bp: () => (safeParseAsync),
  ex: () => (safeDecode),
  lF: () => (encode),
  qg: () => (parse),
  wy: () => (safeEncode),
  xL: () => (safeParse),
  yR: () => (safeDecodeAsync)
});
/* import */ var _core_index_js__rspack_import_0 = __webpack_require__(2373);
/* import */ var _errors_js__rspack_import_1 = __webpack_require__(7356);


const parse = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._parse */.Tj(_errors_js__rspack_import_1/* .ZodRealError */.g);
const parseAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._parseAsync */.Rb(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeParse = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeParse */.Od(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeParseAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeParseAsync */.wG(_errors_js__rspack_import_1/* .ZodRealError */.g);
// Codec functions
const encode = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._encode */.Mv(_errors_js__rspack_import_1/* .ZodRealError */.g);
const decode = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._decode */.e2(_errors_js__rspack_import_1/* .ZodRealError */.g);
const encodeAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._encodeAsync */.GW(_errors_js__rspack_import_1/* .ZodRealError */.g);
const decodeAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._decodeAsync */.or(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeEncode = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeEncode */.rh(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeDecode = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeDecode */.VS(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeEncodeAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeEncodeAsync */.v_(_errors_js__rspack_import_1/* .ZodRealError */.g);
const safeDecodeAsync = /* @__PURE__ */ _core_index_js__rspack_import_0/* ._safeDecodeAsync */.R3(_errors_js__rspack_import_1/* .ZodRealError */.g);


},
6687(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ZodAny: () => (ZodAny),
  ZodArray: () => (ZodArray),
  ZodBase64: () => (ZodBase64),
  ZodBase64URL: () => (ZodBase64URL),
  ZodBigInt: () => (ZodBigInt),
  ZodBigIntFormat: () => (ZodBigIntFormat),
  ZodBoolean: () => (ZodBoolean),
  ZodCIDRv4: () => (ZodCIDRv4),
  ZodCIDRv6: () => (ZodCIDRv6),
  ZodCUID: () => (ZodCUID),
  ZodCUID2: () => (ZodCUID2),
  ZodCatch: () => (ZodCatch),
  ZodCodec: () => (ZodCodec),
  ZodCustom: () => (ZodCustom),
  ZodCustomStringFormat: () => (ZodCustomStringFormat),
  ZodDate: () => (ZodDate),
  ZodDefault: () => (ZodDefault),
  ZodDiscriminatedUnion: () => (ZodDiscriminatedUnion),
  ZodE164: () => (ZodE164),
  ZodEmail: () => (ZodEmail),
  ZodEmoji: () => (ZodEmoji),
  ZodEnum: () => (ZodEnum),
  ZodExactOptional: () => (ZodExactOptional),
  ZodFile: () => (ZodFile),
  ZodFunction: () => (ZodFunction),
  ZodGUID: () => (ZodGUID),
  ZodIPv4: () => (ZodIPv4),
  ZodIPv6: () => (ZodIPv6),
  ZodIntersection: () => (ZodIntersection),
  ZodJWT: () => (ZodJWT),
  ZodKSUID: () => (ZodKSUID),
  ZodLazy: () => (ZodLazy),
  ZodLiteral: () => (ZodLiteral),
  ZodMAC: () => (ZodMAC),
  ZodMap: () => (ZodMap),
  ZodNaN: () => (ZodNaN),
  ZodNanoID: () => (ZodNanoID),
  ZodNever: () => (ZodNever),
  ZodNonOptional: () => (ZodNonOptional),
  ZodNull: () => (ZodNull),
  ZodNullable: () => (ZodNullable),
  ZodNumber: () => (ZodNumber),
  ZodNumberFormat: () => (ZodNumberFormat),
  ZodObject: () => (ZodObject),
  ZodOptional: () => (ZodOptional),
  ZodPipe: () => (ZodPipe),
  ZodPrefault: () => (ZodPrefault),
  ZodPreprocess: () => (ZodPreprocess),
  ZodPromise: () => (ZodPromise),
  ZodReadonly: () => (ZodReadonly),
  ZodRecord: () => (ZodRecord),
  ZodSet: () => (ZodSet),
  ZodString: () => (ZodString),
  ZodStringFormat: () => (ZodStringFormat),
  ZodSuccess: () => (ZodSuccess),
  ZodSymbol: () => (ZodSymbol),
  ZodTemplateLiteral: () => (ZodTemplateLiteral),
  ZodTransform: () => (ZodTransform),
  ZodTuple: () => (ZodTuple),
  ZodType: () => (ZodType),
  ZodULID: () => (ZodULID),
  ZodURL: () => (ZodURL),
  ZodUUID: () => (ZodUUID),
  ZodUndefined: () => (ZodUndefined),
  ZodUnion: () => (ZodUnion),
  ZodUnknown: () => (ZodUnknown),
  ZodVoid: () => (ZodVoid),
  ZodXID: () => (ZodXID),
  ZodXor: () => (ZodXor),
  _ZodString: () => (_ZodString),
  _default: () => (_default),
  _function: () => (_function),
  any: () => (any),
  array: () => (array),
  base64: () => (base64),
  base64url: () => (base64url),
  bigint: () => (bigint),
  boolean: () => (boolean),
  "catch": () => (_catch),
  check: () => (check),
  cidrv4: () => (cidrv4),
  cidrv6: () => (cidrv6),
  codec: () => (codec),
  cuid: () => (cuid),
  cuid2: () => (cuid2),
  custom: () => (custom),
  date: () => (date),
  describe: () => (describe),
  discriminatedUnion: () => (discriminatedUnion),
  e164: () => (e164),
  email: () => (email),
  emoji: () => (emoji),
  "enum": () => (_enum),
  exactOptional: () => (exactOptional),
  file: () => (file),
  float32: () => (float32),
  float64: () => (float64),
  "function": () => (_function),
  guid: () => (guid),
  hash: () => (hash),
  hex: () => (hex),
  hostname: () => (hostname),
  httpUrl: () => (httpUrl),
  "instanceof": () => (_instanceof),
  int: () => (int),
  int32: () => (int32),
  int64: () => (int64),
  intersection: () => (intersection),
  invertCodec: () => (invertCodec),
  ipv4: () => (ipv4),
  ipv6: () => (ipv6),
  json: () => (json),
  jwt: () => (jwt),
  keyof: () => (keyof),
  ksuid: () => (ksuid),
  lazy: () => (lazy),
  literal: () => (literal),
  looseObject: () => (looseObject),
  looseRecord: () => (looseRecord),
  mac: () => (mac),
  map: () => (map),
  meta: () => (meta),
  nan: () => (nan),
  nanoid: () => (nanoid),
  nativeEnum: () => (nativeEnum),
  never: () => (never),
  nonoptional: () => (nonoptional),
  "null": () => (_null),
  nullable: () => (nullable),
  nullish: () => (nullish),
  number: () => (number),
  object: () => (object),
  optional: () => (optional),
  partialRecord: () => (partialRecord),
  pipe: () => (pipe),
  prefault: () => (prefault),
  preprocess: () => (preprocess),
  promise: () => (promise),
  readonly: () => (readonly),
  record: () => (record),
  refine: () => (refine),
  set: () => (set),
  strictObject: () => (strictObject),
  string: () => (string),
  stringFormat: () => (stringFormat),
  stringbool: () => (stringbool),
  success: () => (success),
  superRefine: () => (superRefine),
  symbol: () => (symbol),
  templateLiteral: () => (templateLiteral),
  transform: () => (transform),
  tuple: () => (tuple),
  uint32: () => (uint32),
  uint64: () => (uint64),
  ulid: () => (ulid),
  undefined: () => (_undefined),
  union: () => (union),
  unknown: () => (unknown),
  url: () => (url),
  uuid: () => (uuid),
  uuidv4: () => (uuidv4),
  uuidv6: () => (uuidv6),
  uuidv7: () => (uuidv7),
  "void": () => (_void),
  xid: () => (xid),
  xor: () => (xor)
});
/* import */ var _core_index_js__rspack_import_0 = __webpack_require__(5435);
/* import */ var _core_index_js__rspack_import_1 = __webpack_require__(666);
/* import */ var _core_index_js__rspack_import_4 = __webpack_require__(7048);
/* import */ var _core_index_js__rspack_import_6 = __webpack_require__(3795);
/* import */ var _checks_js__rspack_import_5 = __webpack_require__(638);
/* import */ var _core_index_js__rspack_import_9 = __webpack_require__(3705);
/* import */ var _core_index_js__rspack_import_10 = __webpack_require__(9737);
/* import */ var _core_json_schema_processors_js__rspack_import_7 = __webpack_require__(4836);
/* import */ var _core_to_json_schema_js__rspack_import_2 = __webpack_require__(9958);
/* import */ var _iso_js__rspack_import_8 = __webpack_require__(3174);
/* import */ var _parse_js__rspack_import_3 = __webpack_require__(5852);







// Lazy-bind builder methods.
//
// Builder methods (`.optional`, `.array`, `.refine`, ...) live as
// non-enumerable getters on each concrete schema constructor's
// prototype. On first access from an instance the getter allocates
// `fn.bind(this)` and caches it as an own property on that instance,
// so detached usage (`const m = schema.optional; m()`) still works
// and the per-instance allocation only happens for methods actually
// touched.
//
// One install per (prototype, group), memoized by `_installedGroups`.
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
    const proto = Object.getPrototypeOf(inst);
    let installed = _installedGroups.get(proto);
    if (!installed) {
        installed = new Set();
        _installedGroups.set(proto, installed);
    }
    if (installed.has(group))
        return;
    installed.add(group);
    for (const key in methods) {
        const fn = methods[key];
        Object.defineProperty(proto, key, {
            configurable: true,
            enumerable: false,
            get() {
                const bound = fn.bind(this);
                Object.defineProperty(this, key, {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: bound,
                });
                return bound;
            },
            set(v) {
                Object.defineProperty(this, key, {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: v,
                });
            },
        });
    }
}
const ZodType = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodType", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodType.init */.W4.init(inst, def);
    Object.assign(inst["~standard"], {
        jsonSchema: {
            input: (0,_core_to_json_schema_js__rspack_import_2/* .createStandardJSONSchemaMethod */.uE)(inst, "input"),
            output: (0,_core_to_json_schema_js__rspack_import_2/* .createStandardJSONSchemaMethod */.uE)(inst, "output"),
        },
    });
    inst.toJSONSchema = (0,_core_to_json_schema_js__rspack_import_2/* .createToJSONSchemaMethod */.OA)(inst, {});
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    // Parse-family is intentionally kept as per-instance closures: these are
    // the hot path AND the most-detached methods (`arr.map(schema.parse)`,
    // `const { parse } = schema`, etc.). Eager closures here mean callers pay
    // ~12 closure allocations per schema but get monomorphic call sites and
    // detached usage that "just works".
    inst.parse = (data, params) => _parse_js__rspack_import_3/* .parse */.qg(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => _parse_js__rspack_import_3/* .safeParse */.xL(inst, data, params);
    inst.parseAsync = async (data, params) => _parse_js__rspack_import_3/* .parseAsync */.EJ(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => _parse_js__rspack_import_3/* .safeParseAsync */.bp(inst, data, params);
    inst.spa = inst.safeParseAsync;
    inst.encode = (data, params) => _parse_js__rspack_import_3/* .encode */.lF(inst, data, params);
    inst.decode = (data, params) => _parse_js__rspack_import_3/* .decode */.D4(inst, data, params);
    inst.encodeAsync = async (data, params) => _parse_js__rspack_import_3/* .encodeAsync */.X$(inst, data, params);
    inst.decodeAsync = async (data, params) => _parse_js__rspack_import_3/* .decodeAsync */.Re(inst, data, params);
    inst.safeEncode = (data, params) => _parse_js__rspack_import_3/* .safeEncode */.wy(inst, data, params);
    inst.safeDecode = (data, params) => _parse_js__rspack_import_3/* .safeDecode */.ex(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => _parse_js__rspack_import_3/* .safeEncodeAsync */.EM(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => _parse_js__rspack_import_3/* .safeDecodeAsync */.yR(inst, data, params);
    // All builder methods are placed on the internal prototype as lazy-bind
    // getters. On first access per-instance, a bound thunk is allocated and
    // cached as an own property; subsequent accesses skip the getter. This
    // means: no per-instance allocation for unused methods, full
    // detachability preserved (`const m = schema.optional; m()` works), and
    // shared underlying function references across all instances.
    _installLazyMethods(inst, "ZodType", {
        check(...chks) {
            const def = this.def;
            return this.clone(_core_index_js__rspack_import_4.mergeDefs(def, {
                checks: [
                    ...(def.checks ?? []),
                    ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
                ],
            }), { parent: true });
        },
        with(...chks) {
            return this.check(...chks);
        },
        clone(def, params) {
            return _core_index_js__rspack_import_4.clone(this, def, params);
        },
        brand() {
            return this;
        },
        register(reg, meta) {
            reg.add(this, meta);
            return this;
        },
        refine(check, params) {
            return this.check(refine(check, params));
        },
        superRefine(refinement, params) {
            return this.check(superRefine(refinement, params));
        },
        overwrite(fn) {
            return this.check(_checks_js__rspack_import_5/* ._overwrite */.bS(fn));
        },
        optional() {
            return optional(this);
        },
        exactOptional() {
            return exactOptional(this);
        },
        nullable() {
            return nullable(this);
        },
        nullish() {
            return optional(nullable(this));
        },
        nonoptional(params) {
            return nonoptional(this, params);
        },
        array() {
            return array(this);
        },
        or(arg) {
            return union([this, arg]);
        },
        and(arg) {
            return intersection(this, arg);
        },
        transform(tx) {
            return pipe(this, transform(tx));
        },
        default(d) {
            return _default(this, d);
        },
        prefault(d) {
            return prefault(this, d);
        },
        catch(params) {
            return _catch(this, params);
        },
        pipe(target) {
            return pipe(this, target);
        },
        readonly() {
            return readonly(this);
        },
        describe(description) {
            const cl = this.clone();
            _core_index_js__rspack_import_6/* .globalRegistry.add */.fd.add(cl, { description });
            return cl;
        },
        meta(...args) {
            // overloaded: meta() returns the registered metadata, meta(data)
            // returns a clone with `data` registered. The mapped type picks
            // up the second overload, so we accept variadic any-args and
            // return `any` to satisfy both at runtime.
            if (args.length === 0)
                return _core_index_js__rspack_import_6/* .globalRegistry.get */.fd.get(this);
            const cl = this.clone();
            _core_index_js__rspack_import_6/* .globalRegistry.add */.fd.add(cl, args[0]);
            return cl;
        },
        isOptional() {
            return this.safeParse(undefined).success;
        },
        isNullable() {
            return this.safeParse(null).success;
        },
        apply(fn) {
            return fn(this);
        },
    });
    Object.defineProperty(inst, "description", {
        get() {
            return _core_index_js__rspack_import_6/* .globalRegistry */.fd.get(inst)?.description;
        },
        configurable: true,
    });
    return inst;
});
/** @internal */
const _ZodString = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("_ZodString", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodString.init */.$v.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .stringProcessor */.SW(inst, ctx, json, params);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    _installLazyMethods(inst, "_ZodString", {
        regex(...args) {
            return this.check(_checks_js__rspack_import_5/* ._regex */.Fk(...args));
        },
        includes(...args) {
            return this.check(_checks_js__rspack_import_5/* ._includes */.dR(...args));
        },
        startsWith(...args) {
            return this.check(_checks_js__rspack_import_5/* ._startsWith */.$S(...args));
        },
        endsWith(...args) {
            return this.check(_checks_js__rspack_import_5/* ._endsWith */.ER(...args));
        },
        min(...args) {
            return this.check(_checks_js__rspack_import_5/* ._minLength */.m9(...args));
        },
        max(...args) {
            return this.check(_checks_js__rspack_import_5/* ._maxLength */.Eb(...args));
        },
        length(...args) {
            return this.check(_checks_js__rspack_import_5/* ._length */.YA(...args));
        },
        nonempty(...args) {
            return this.check(_checks_js__rspack_import_5/* ._minLength */.m9(1, ...args));
        },
        lowercase(params) {
            return this.check(_checks_js__rspack_import_5/* ._lowercase */.hH(params));
        },
        uppercase(params) {
            return this.check(_checks_js__rspack_import_5/* ._uppercase */.qF(params));
        },
        trim() {
            return this.check(_checks_js__rspack_import_5/* ._trim */.WN());
        },
        normalize(...args) {
            return this.check(_checks_js__rspack_import_5/* ._normalize */.lo(...args));
        },
        toLowerCase() {
            return this.check(_checks_js__rspack_import_5/* ._toLowerCase */.Il());
        },
        toUpperCase() {
            return this.check(_checks_js__rspack_import_5/* ._toUpperCase */.xY());
        },
        slugify() {
            return this.check(_checks_js__rspack_import_5/* ._slugify */.TL());
        },
    });
});
const ZodString = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodString", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodString.init */.$v.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_checks_js__rspack_import_5/* ._email */.Mu(ZodEmail, params));
    inst.url = (params) => inst.check(_checks_js__rspack_import_5/* ._url */.Fn(ZodURL, params));
    inst.jwt = (params) => inst.check(_checks_js__rspack_import_5/* ._jwt */.rk(ZodJWT, params));
    inst.emoji = (params) => inst.check(_checks_js__rspack_import_5/* ._emoji */.aC(ZodEmoji, params));
    inst.guid = (params) => inst.check(_checks_js__rspack_import_5/* ._guid */.tB(ZodGUID, params));
    inst.uuid = (params) => inst.check(_checks_js__rspack_import_5/* ._uuid */.Be(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_checks_js__rspack_import_5/* ._uuidv4 */.nA(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_checks_js__rspack_import_5/* ._uuidv6 */.pY(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_checks_js__rspack_import_5/* ._uuidv7 */.wA(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_checks_js__rspack_import_5/* ._nanoid */.Dl(ZodNanoID, params));
    inst.guid = (params) => inst.check(_checks_js__rspack_import_5/* ._guid */.tB(ZodGUID, params));
    inst.cuid = (params) => inst.check(_checks_js__rspack_import_5/* ._cuid */.fs(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_checks_js__rspack_import_5/* ._cuid2 */.Bj(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_checks_js__rspack_import_5/* ._ulid */.Ct(ZodULID, params));
    inst.base64 = (params) => inst.check(_checks_js__rspack_import_5/* ._base64 */.rt(ZodBase64, params));
    inst.base64url = (params) => inst.check(_checks_js__rspack_import_5/* ._base64url */.cU(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_checks_js__rspack_import_5/* ._xid */.Pw(ZodXID, params));
    inst.ksuid = (params) => inst.check(_checks_js__rspack_import_5/* ._ksuid */._z(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_checks_js__rspack_import_5/* ._ipv4 */.Ny(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_checks_js__rspack_import_5/* ._ipv6 */.$O(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_checks_js__rspack_import_5/* ._cidrv4 */.Uy(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_checks_js__rspack_import_5/* ._cidrv6 */.gP(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_checks_js__rspack_import_5/* ._e164 */.KB(ZodE164, params));
    // iso
    inst.datetime = (params) => inst.check(_iso_js__rspack_import_8.datetime(params));
    inst.date = (params) => inst.check(_iso_js__rspack_import_8.date(params));
    inst.time = (params) => inst.check(_iso_js__rspack_import_8.time(params));
    inst.duration = (params) => inst.check(_iso_js__rspack_import_8.duration(params));
});
function string(params) {
    return _checks_js__rspack_import_5/* ._string */.Rl(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodStringFormat", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodStringFormat.init */.EY.init(inst, def);
    _ZodString.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodEmail", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodEmail.init */.qG.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function email(params) {
    return _checks_js__rspack_import_5/* ._email */.Mu(ZodEmail, params);
}
const ZodGUID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodGUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodGUID.init */.Zc.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function guid(params) {
    return _checks_js__rspack_import_5/* ._guid */.tB(ZodGUID, params);
}
const ZodUUID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodUUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodUUID.init */.Zn.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function uuid(params) {
    return _checks_js__rspack_import_5/* ._uuid */.Be(ZodUUID, params);
}
function uuidv4(params) {
    return _checks_js__rspack_import_5/* ._uuidv4 */.nA(ZodUUID, params);
}
// ZodUUIDv6
function uuidv6(params) {
    return _checks_js__rspack_import_5/* ._uuidv6 */.pY(ZodUUID, params);
}
// ZodUUIDv7
function uuidv7(params) {
    return _checks_js__rspack_import_5/* ._uuidv7 */.wA(ZodUUID, params);
}
const ZodURL = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodURL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodURL.init */.VY.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function url(params) {
    return _checks_js__rspack_import_5/* ._url */.Fn(ZodURL, params);
}
function httpUrl(params) {
    return _checks_js__rspack_import_5/* ._url */.Fn(ZodURL, {
        protocol: _core_index_js__rspack_import_9.httpProtocol,
        hostname: _core_index_js__rspack_import_9.domain,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodEmoji = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodEmoji", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodEmoji.init */.cG.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function emoji(params) {
    return _checks_js__rspack_import_5/* ._emoji */.aC(ZodEmoji, params);
}
const ZodNanoID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNanoID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodNanoID.init */.Py.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function nanoid(params) {
    return _checks_js__rspack_import_5/* ._nanoid */.Dl(ZodNanoID, params);
}
/**
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link ZodCUID2} instead.
 * See https://github.com/paralleldrive/cuid.
 */
const ZodCUID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodCUID.init */.bl.init(inst, def);
    ZodStringFormat.init(inst, def);
});
/**
 * Validates a CUID v1 string.
 *
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link cuid2 | `z.cuid2()`} instead.
 * See https://github.com/paralleldrive/cuid.
 */
function cuid(params) {
    return _checks_js__rspack_import_5/* ._cuid */.fs(ZodCUID, params);
}
const ZodCUID2 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCUID2", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodCUID2.init */.Zu.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cuid2(params) {
    return _checks_js__rspack_import_5/* ._cuid2 */.Bj(ZodCUID2, params);
}
const ZodULID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodULID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodULID.init */.g5.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ulid(params) {
    return _checks_js__rspack_import_5/* ._ulid */.Ct(ZodULID, params);
}
const ZodXID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodXID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodXID.init */.TF.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function xid(params) {
    return _checks_js__rspack_import_5/* ._xid */.Pw(ZodXID, params);
}
const ZodKSUID = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodKSUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodKSUID.init */.GY.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ksuid(params) {
    return _checks_js__rspack_import_5/* ._ksuid */._z(ZodKSUID, params);
}
const ZodIPv4 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodIPv4", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodIPv4.init */.Lc.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ipv4(params) {
    return _checks_js__rspack_import_5/* ._ipv4 */.Ny(ZodIPv4, params);
}
const ZodMAC = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodMAC", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodMAC.init */.rO.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function mac(params) {
    return _checks_js__rspack_import_5/* ._mac */.R8(ZodMAC, params);
}
const ZodIPv6 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodIPv6", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodIPv6.init */.Zy.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ipv6(params) {
    return _checks_js__rspack_import_5/* ._ipv6 */.$O(ZodIPv6, params);
}
const ZodCIDRv4 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCIDRv4", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodCIDRv4.init */.CI.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cidrv4(params) {
    return _checks_js__rspack_import_5/* ._cidrv4 */.Uy(ZodCIDRv4, params);
}
const ZodCIDRv6 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCIDRv6", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodCIDRv6.init */.Cn.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cidrv6(params) {
    return _checks_js__rspack_import_5/* ._cidrv6 */.gP(ZodCIDRv6, params);
}
const ZodBase64 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodBase64", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodBase64.init */.Dq.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function base64(params) {
    return _checks_js__rspack_import_5/* ._base64 */.rt(ZodBase64, params);
}
const ZodBase64URL = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodBase64URL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodBase64URL.init */.CQ.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function base64url(params) {
    return _checks_js__rspack_import_5/* ._base64url */.cU(ZodBase64URL, params);
}
const ZodE164 = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodE164", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodE164.init */.Oy.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function e164(params) {
    return _checks_js__rspack_import_5/* ._e164 */.KB(ZodE164, params);
}
const ZodJWT = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodJWT", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodJWT.init */.h8.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function jwt(params) {
    return _checks_js__rspack_import_5/* ._jwt */.rk(ZodJWT, params);
}
const ZodCustomStringFormat = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCustomStringFormat", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodCustomStringFormat.init */.ZQ.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function stringFormat(format, fnOrRegex, _params = {}) {
    return _checks_js__rspack_import_5/* ._stringFormat */.Af(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname(_params) {
    return _checks_js__rspack_import_5/* ._stringFormat */.Af(ZodCustomStringFormat, "hostname", _core_index_js__rspack_import_9.hostname, _params);
}
function hex(_params) {
    return _checks_js__rspack_import_5/* ._stringFormat */.Af(ZodCustomStringFormat, "hex", _core_index_js__rspack_import_9.hex, _params);
}
function hash(alg, params) {
    const enc = params?.enc ?? "hex";
    const format = `${alg}_${enc}`;
    const regex = _core_index_js__rspack_import_9[format];
    if (!regex)
        throw new Error(`Unrecognized hash format: ${format}`);
    return _checks_js__rspack_import_5/* ._stringFormat */.Af(ZodCustomStringFormat, format, regex, params);
}
const ZodNumber = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNumber", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNumber.init */.vz.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .numberProcessor */.Wg(inst, ctx, json, params);
    _installLazyMethods(inst, "ZodNumber", {
        gt(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._gt */.Tx(value, params));
        },
        gte(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
        },
        min(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
        },
        lt(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._lt */.Au(value, params));
        },
        lte(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._lte */.Zm(value, params));
        },
        max(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._lte */.Zm(value, params));
        },
        int(params) {
            return this.check(int(params));
        },
        safe(params) {
            return this.check(int(params));
        },
        positive(params) {
            return this.check(_checks_js__rspack_import_5/* ._gt */.Tx(0, params));
        },
        nonnegative(params) {
            return this.check(_checks_js__rspack_import_5/* ._gte */.qm(0, params));
        },
        negative(params) {
            return this.check(_checks_js__rspack_import_5/* ._lt */.Au(0, params));
        },
        nonpositive(params) {
            return this.check(_checks_js__rspack_import_5/* ._lte */.Zm(0, params));
        },
        multipleOf(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._multipleOf */.Hi(value, params));
        },
        step(value, params) {
            return this.check(_checks_js__rspack_import_5/* ._multipleOf */.Hi(value, params));
        },
        finite() {
            return this;
        },
    });
    const bag = inst._zod.bag;
    inst.minValue =
        Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue =
        Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
});
function number(params) {
    return _checks_js__rspack_import_5/* ._number */.F7(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNumberFormat", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNumberFormat.init */.I.init(inst, def);
    ZodNumber.init(inst, def);
});
function int(params) {
    return _checks_js__rspack_import_5/* ._int */.LK(ZodNumberFormat, params);
}
function float32(params) {
    return _checks_js__rspack_import_5/* ._float32 */.HL(ZodNumberFormat, params);
}
function float64(params) {
    return _checks_js__rspack_import_5/* ._float64 */.g6(ZodNumberFormat, params);
}
function int32(params) {
    return _checks_js__rspack_import_5/* ._int32 */.sw(ZodNumberFormat, params);
}
function uint32(params) {
    return _checks_js__rspack_import_5/* ._uint32 */.P(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodBoolean", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodBoolean.init */.sF.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .booleanProcessor */.dO(inst, ctx, json, params);
});
function boolean(params) {
    return _checks_js__rspack_import_5/* ._boolean */._L(ZodBoolean, params);
}
const ZodBigInt = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodBigInt", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodBigInt.init */.BN.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .bigintProcessor */.Y8(inst, ctx, json, params);
    inst.gte = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
    inst.min = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
    inst.gt = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gt */.Tx(value, params));
    inst.gte = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
    inst.min = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
    inst.lt = (value, params) => inst.check(_checks_js__rspack_import_5/* ._lt */.Au(value, params));
    inst.lte = (value, params) => inst.check(_checks_js__rspack_import_5/* ._lte */.Zm(value, params));
    inst.max = (value, params) => inst.check(_checks_js__rspack_import_5/* ._lte */.Zm(value, params));
    inst.positive = (params) => inst.check(_checks_js__rspack_import_5/* ._gt */.Tx(BigInt(0), params));
    inst.negative = (params) => inst.check(_checks_js__rspack_import_5/* ._lt */.Au(BigInt(0), params));
    inst.nonpositive = (params) => inst.check(_checks_js__rspack_import_5/* ._lte */.Zm(BigInt(0), params));
    inst.nonnegative = (params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(BigInt(0), params));
    inst.multipleOf = (value, params) => inst.check(_checks_js__rspack_import_5/* ._multipleOf */.Hi(value, params));
    const bag = inst._zod.bag;
    inst.minValue = bag.minimum ?? null;
    inst.maxValue = bag.maximum ?? null;
    inst.format = bag.format ?? null;
});
function bigint(params) {
    return _checks_js__rspack_import_5/* ._bigint */.z$(ZodBigInt, params);
}
const ZodBigIntFormat = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodBigIntFormat", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodBigIntFormat.init */.IT.init(inst, def);
    ZodBigInt.init(inst, def);
});
// int64
function int64(params) {
    return _checks_js__rspack_import_5/* ._int64 */.Jg(ZodBigIntFormat, params);
}
// uint64
function uint64(params) {
    return _checks_js__rspack_import_5/* ._uint64 */.ii(ZodBigIntFormat, params);
}
const ZodSymbol = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodSymbol", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodSymbol.init */.U5.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .symbolProcessor */.fg(inst, ctx, json, params);
});
function symbol(params) {
    return _checks_js__rspack_import_5/* ._symbol */.W7(ZodSymbol, params);
}
const ZodUndefined = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodUndefined", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodUndefined.init */.Mv.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .undefinedProcessor */.BU(inst, ctx, json, params);
});
function _undefined(params) {
    return _checks_js__rspack_import_5/* ._undefined */.E4(ZodUndefined, params);
}

const ZodNull = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNull", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNull.init */.x8.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .nullProcessor */.In(inst, ctx, json, params);
});
function _null(params) {
    return _checks_js__rspack_import_5/* ._null */.jw(ZodNull, params);
}

const ZodAny = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodAny", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodAny.init */.Gb.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .anyProcessor */.NX(inst, ctx, json, params);
});
function any() {
    return _checks_js__rspack_import_5/* ._any */.KA(ZodAny);
}
const ZodUnknown = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodUnknown", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodUnknown.init */.GP.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .unknownProcessor */.NV(inst, ctx, json, params);
});
function unknown() {
    return _checks_js__rspack_import_5/* ._unknown */.em(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNever", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNever.init */.Um.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .neverProcessor */.RH(inst, ctx, json, params);
});
function never(params) {
    return _checks_js__rspack_import_5/* ._never */.G8(ZodNever, params);
}
const ZodVoid = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodVoid", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodVoid.init */.WH.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .voidProcessor */.vn(inst, ctx, json, params);
});
function _void(params) {
    return _checks_js__rspack_import_5/* ._void */.OC(ZodVoid, params);
}

const ZodDate = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodDate", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodDate.init */.o5.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .dateProcessor */.Fl(inst, ctx, json, params);
    inst.min = (value, params) => inst.check(_checks_js__rspack_import_5/* ._gte */.qm(value, params));
    inst.max = (value, params) => inst.check(_checks_js__rspack_import_5/* ._lte */.Zm(value, params));
    const c = inst._zod.bag;
    inst.minDate = c.minimum ? new Date(c.minimum) : null;
    inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date(params) {
    return _checks_js__rspack_import_5/* ._date */.YY(ZodDate, params);
}
const ZodArray = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodArray", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodArray.init */.$p.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .arrayProcessor */.cY(inst, ctx, json, params);
    inst.element = def.element;
    _installLazyMethods(inst, "ZodArray", {
        min(n, params) {
            return this.check(_checks_js__rspack_import_5/* ._minLength */.m9(n, params));
        },
        nonempty(params) {
            return this.check(_checks_js__rspack_import_5/* ._minLength */.m9(1, params));
        },
        max(n, params) {
            return this.check(_checks_js__rspack_import_5/* ._maxLength */.Eb(n, params));
        },
        length(n, params) {
            return this.check(_checks_js__rspack_import_5/* ._length */.YA(n, params));
        },
        unwrap() {
            return this.element;
        },
    });
});
function array(element, params) {
    return _checks_js__rspack_import_5/* ._array */.dZ(ZodArray, element, params);
}
// .keyof
function keyof(schema) {
    const shape = schema._zod.def.shape;
    return _enum(Object.keys(shape));
}
const ZodObject = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodObject", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodObjectJIT.init */.w.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .objectProcessor */.Ec(inst, ctx, json, params);
    _core_index_js__rspack_import_4.defineLazy(inst, "shape", () => {
        return def.shape;
    });
    _installLazyMethods(inst, "ZodObject", {
        keyof() {
            return _enum(Object.keys(this._zod.def.shape));
        },
        catchall(catchall) {
            return this.clone({ ...this._zod.def, catchall: catchall });
        },
        passthrough() {
            return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        loose() {
            return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        strict() {
            return this.clone({ ...this._zod.def, catchall: never() });
        },
        strip() {
            return this.clone({ ...this._zod.def, catchall: undefined });
        },
        extend(incoming) {
            return _core_index_js__rspack_import_4.extend(this, incoming);
        },
        safeExtend(incoming) {
            return _core_index_js__rspack_import_4.safeExtend(this, incoming);
        },
        merge(other) {
            return _core_index_js__rspack_import_4.merge(this, other);
        },
        pick(mask) {
            return _core_index_js__rspack_import_4.pick(this, mask);
        },
        omit(mask) {
            return _core_index_js__rspack_import_4.omit(this, mask);
        },
        partial(...args) {
            return _core_index_js__rspack_import_4.partial(ZodOptional, this, args[0]);
        },
        required(...args) {
            return _core_index_js__rspack_import_4.required(ZodNonOptional, this, args[0]);
        },
    });
});
function object(shape, params) {
    const def = {
        type: "object",
        shape: shape ?? {},
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    };
    return new ZodObject(def);
}
// strictObject
function strictObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: never(),
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
// looseObject
function looseObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: unknown(),
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodUnion = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodUnion", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodUnion.init */.cu.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .unionProcessor */.iC(inst, ctx, json, params);
    inst.options = def.options;
});
function union(options, params) {
    return new ZodUnion({
        type: "union",
        options: options,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodXor = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodXor", (inst, def) => {
    ZodUnion.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodXor.init */.pm.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .unionProcessor */.iC(inst, ctx, json, params);
    inst.options = def.options;
});
/** Creates an exclusive union (XOR) where exactly one option must match.
 * Unlike regular unions that succeed when any option matches, xor fails if
 * zero or more than one option matches the input. */
function xor(options, params) {
    return new ZodXor({
        type: "union",
        options: options,
        inclusive: false,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodDiscriminatedUnion = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodDiscriminatedUnion.init */.P0.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
    // const [options, params] = args;
    return new ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodIntersection = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodIntersection", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodIntersection.init */.LJ.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .intersectionProcessor */.i_(inst, ctx, json, params);
});
function intersection(left, right) {
    return new ZodIntersection({
        type: "intersection",
        left: left,
        right: right,
    });
}
const ZodTuple = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodTuple", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodTuple.init */.G3.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .tupleProcessor */.CN(inst, ctx, json, params);
    inst.rest = (rest) => inst.clone({
        ...inst._zod.def,
        rest: rest,
    });
});
function tuple(items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof _core_index_js__rspack_import_1/* .$ZodType */.W4;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new ZodTuple({
        type: "tuple",
        items: items,
        rest,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodRecord = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodRecord", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodRecord.init */.h.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .recordProcessor */.GC(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
    // v3-compat: z.record(valueType, params?) — defaults keyType to z.string()
    if (!valueType || !valueType._zod) {
        return new ZodRecord({
            type: "record",
            keyType: string(),
            valueType: keyType,
            ..._core_index_js__rspack_import_4.normalizeParams(valueType),
        });
    }
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
// type alksjf = core.output<core.$ZodRecordKey>;
function partialRecord(keyType, valueType, params) {
    const k = _core_index_js__rspack_import_4.clone(keyType);
    k._zod.values = undefined;
    return new ZodRecord({
        type: "record",
        keyType: k,
        valueType: valueType,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
function looseRecord(keyType, valueType, params) {
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        mode: "loose",
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodMap = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodMap", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodMap.init */.eb.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .mapProcessor */.jq(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
    inst.min = (...args) => inst.check(_checks_js__rspack_import_5/* ._minSize */.Nd(...args));
    inst.nonempty = (params) => inst.check(_checks_js__rspack_import_5/* ._minSize */.Nd(1, params));
    inst.max = (...args) => inst.check(_checks_js__rspack_import_5/* ._maxSize */.vL(...args));
    inst.size = (...args) => inst.check(_checks_js__rspack_import_5/* ._size */.d$(...args));
});
function map(keyType, valueType, params) {
    return new ZodMap({
        type: "map",
        keyType: keyType,
        valueType: valueType,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodSet = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodSet", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodSet.init */.Oi.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .setProcessor */.zH(inst, ctx, json, params);
    inst.min = (...args) => inst.check(_checks_js__rspack_import_5/* ._minSize */.Nd(...args));
    inst.nonempty = (params) => inst.check(_checks_js__rspack_import_5/* ._minSize */.Nd(1, params));
    inst.max = (...args) => inst.check(_checks_js__rspack_import_5/* ._maxSize */.vL(...args));
    inst.size = (...args) => inst.check(_checks_js__rspack_import_5/* ._size */.d$(...args));
});
function set(valueType, params) {
    return new ZodSet({
        type: "set",
        valueType: valueType,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodEnum = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodEnum", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodEnum.init */.VO.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .enumProcessor */.C0(inst, ctx, json, params);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
            if (keys.has(value)) {
                newEntries[value] = def.entries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ..._core_index_js__rspack_import_4.normalizeParams(params),
            entries: newEntries,
        });
    };
    inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
            if (keys.has(value)) {
                delete newEntries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ..._core_index_js__rspack_import_4.normalizeParams(params),
            entries: newEntries,
        });
    };
});
function _enum(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new ZodEnum({
        type: "enum",
        entries,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}

/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function nativeEnum(entries, params) {
    return new ZodEnum({
        type: "enum",
        entries,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodLiteral = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodLiteral", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodLiteral.init */.nu.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .literalProcessor */.Yv(inst, ctx, json, params);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
        get() {
            if (def.values.length > 1) {
                throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
            }
            return def.values[0];
        },
    });
});
function literal(value, params) {
    return new ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodFile = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodFile", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodFile.init */.CT.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .fileProcessor */.H1(inst, ctx, json, params);
    inst.min = (size, params) => inst.check(_checks_js__rspack_import_5/* ._minSize */.Nd(size, params));
    inst.max = (size, params) => inst.check(_checks_js__rspack_import_5/* ._maxSize */.vL(size, params));
    inst.mime = (types, params) => inst.check(_checks_js__rspack_import_5/* ._mime */.GZ(Array.isArray(types) ? types : [types], params));
});
function file(params) {
    return _checks_js__rspack_import_5/* ._file */.K2(ZodFile, params);
}
const ZodTransform = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodTransform", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodTransform.init */.Wc.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .transformProcessor */.xi(inst, ctx, json, params);
    inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
            throw new _core_index_js__rspack_import_0/* .$ZodEncodeError */.cV(inst.constructor.name);
        }
        payload.addIssue = (issue) => {
            if (typeof issue === "string") {
                payload.issues.push(_core_index_js__rspack_import_4.issue(issue, payload.value, def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = inst);
                // _issue.continue ??= true;
                payload.issues.push(_core_index_js__rspack_import_4.issue(_issue));
            }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
            return output.then((output) => {
                payload.value = output;
                payload.fallback = true;
                return payload;
            });
        }
        payload.value = output;
        payload.fallback = true;
        return payload;
    };
});
function transform(fn) {
    return new ZodTransform({
        type: "transform",
        transform: fn,
    });
}
const ZodOptional = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodOptional", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodOptional.init */.ig.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .optionalProcessor */.$k(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
    return new ZodOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodExactOptional = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodExactOptional", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodExactOptional.init */.RL.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .optionalProcessor */.$k(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
    return new ZodExactOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodNullable = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNullable", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNullable.init */.qc.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .nullableProcessor */.yq(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
    return new ZodNullable({
        type: "nullable",
        innerType: innerType,
    });
}
// nullish
function nullish(innerType) {
    return optional(nullable(innerType));
}
const ZodDefault = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodDefault", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodDefault.init */.rv.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .defaultProcessor */.mh(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
    return new ZodDefault({
        type: "default",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : _core_index_js__rspack_import_4.shallowClone(defaultValue);
        },
    });
}
const ZodPrefault = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodPrefault", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodPrefault.init */.VF.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .prefaultProcessor */.A(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
    return new ZodPrefault({
        type: "prefault",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : _core_index_js__rspack_import_4.shallowClone(defaultValue);
        },
    });
}
const ZodNonOptional = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNonOptional", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNonOptional.init */.N$.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .nonoptionalProcessor */.cR(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
    return new ZodNonOptional({
        type: "nonoptional",
        innerType: innerType,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodSuccess = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodSuccess", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodSuccess.init */.Dw.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .successProcessor */.aw(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function success(innerType) {
    return new ZodSuccess({
        type: "success",
        innerType: innerType,
    });
}
const ZodCatch = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCatch", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodCatch.init */.t$.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .catchProcessor */.Q9(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
    return new ZodCatch({
        type: "catch",
        innerType: innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}

const ZodNaN = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodNaN", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodNaN.init */.zP.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .nanProcessor */.Kj(inst, ctx, json, params);
});
function nan(params) {
    return _checks_js__rspack_import_5/* ._nan */.L4(ZodNaN, params);
}
const ZodPipe = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodPipe", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodPipe.init */._m.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .pipeProcessor */.fs(inst, ctx, json, params);
    inst.in = def.in;
    inst.out = def.out;
});
function pipe(in_, out) {
    return new ZodPipe({
        type: "pipe",
        in: in_,
        out: out,
        // ...util.normalizeParams(params),
    });
}
const ZodCodec = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCodec", (inst, def) => {
    ZodPipe.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodCodec.init */.YY.init(inst, def);
});
function codec(in_, out, params) {
    return new ZodCodec({
        type: "pipe",
        in: in_,
        out: out,
        transform: params.decode,
        reverseTransform: params.encode,
    });
}
function invertCodec(codec) {
    const def = codec._zod.def;
    return new ZodCodec({
        type: "pipe",
        in: def.out,
        out: def.in,
        transform: def.reverseTransform,
        reverseTransform: def.transform,
    });
}
const ZodPreprocess = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodPreprocess", (inst, def) => {
    ZodPipe.init(inst, def);
    _core_index_js__rspack_import_1/* .$ZodPreprocess.init */.KX.init(inst, def);
});
const ZodReadonly = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodReadonly", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodReadonly.init */.Sb.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .readonlyProcessor */.$X(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
    return new ZodReadonly({
        type: "readonly",
        innerType: innerType,
    });
}
const ZodTemplateLiteral = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodTemplateLiteral", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodTemplateLiteral.init */.d.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .templateLiteralProcessor */.Cv(inst, ctx, json, params);
});
function templateLiteral(parts, params) {
    return new ZodTemplateLiteral({
        type: "template_literal",
        parts,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
}
const ZodLazy = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodLazy", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodLazy.init */.kU.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .lazyProcessor */.Tr(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
    return new ZodLazy({
        type: "lazy",
        getter: getter,
    });
}
const ZodPromise = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodPromise", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodPromise.init */.hA.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .promiseProcessor */.CX(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function promise(innerType) {
    return new ZodPromise({
        type: "promise",
        innerType: innerType,
    });
}
const ZodFunction = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodFunction", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodFunction.init */._A.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .functionProcessor */.bq(inst, ctx, json, params);
});
function _function(params) {
    return new ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? tuple(params?.input) : (params?.input ?? array(unknown())),
        output: params?.output ?? unknown(),
    });
}

const ZodCustom = /*@__PURE__*/ _core_index_js__rspack_import_0/* .$constructor */.xI("ZodCustom", (inst, def) => {
    _core_index_js__rspack_import_1/* .$ZodCustom.init */.b0.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => _core_json_schema_processors_js__rspack_import_7/* .customProcessor */.A6(inst, ctx, json, params);
});
// custom checks
function check(fn) {
    const ch = new _core_index_js__rspack_import_10/* .$ZodCheck */.QP({
        check: "custom",
        // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
function custom(fn, _params) {
    return _checks_js__rspack_import_5/* ._custom */.FO(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
    return _checks_js__rspack_import_5/* ._refine */.fU(ZodCustom, fn, _params);
}
// superRefine
function superRefine(fn, params) {
    return _checks_js__rspack_import_5/* ._superRefine */.MB(fn, params);
}
// Re-export describe and meta from core
const describe = _checks_js__rspack_import_5/* .describe */.q0;
const meta = _checks_js__rspack_import_5/* .meta */.mI;
function _instanceof(cls, params = {}) {
    const inst = new ZodCustom({
        type: "custom",
        check: "custom",
        fn: (data) => data instanceof cls,
        abort: true,
        ..._core_index_js__rspack_import_4.normalizeParams(params),
    });
    inst._zod.bag.Class = cls;
    // Override check to emit invalid_type instead of custom
    inst._zod.check = (payload) => {
        if (!(payload.value instanceof cls)) {
            payload.issues.push({
                code: "invalid_type",
                expected: cls.name,
                input: payload.value,
                inst,
                path: [...(inst._zod.def.path ?? [])],
            });
        }
    };
    return inst;
}

// stringbool
const stringbool = (...args) => _checks_js__rspack_import_5/* ._stringbool */.fI({
    Codec: ZodCodec,
    Boolean: ZodBoolean,
    String: ZodString,
}, ...args);
function json(params) {
    const jsonSchema = lazy(() => {
        return union([string(params), number(), boolean(), _null(), array(jsonSchema), record(string(), jsonSchema)]);
    });
    return jsonSchema;
}
// preprocess
function preprocess(fn, schema) {
    return new ZodPreprocess({
        type: "pipe",
        in: transform(fn),
        out: schema,
    });
}


},
4836(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  $X: () => (readonlyProcessor),
  $k: () => (optionalProcessor),
  A: () => (prefaultProcessor),
  A6: () => (customProcessor),
  BU: () => (undefinedProcessor),
  C0: () => (enumProcessor),
  CN: () => (tupleProcessor),
  CX: () => (promiseProcessor),
  Cv: () => (templateLiteralProcessor),
  Df: () => (allProcessors),
  Ec: () => (objectProcessor),
  Fl: () => (dateProcessor),
  GC: () => (recordProcessor),
  H1: () => (fileProcessor),
  In: () => (nullProcessor),
  Kj: () => (nanProcessor),
  NV: () => (unknownProcessor),
  NX: () => (anyProcessor),
  Q9: () => (catchProcessor),
  RH: () => (neverProcessor),
  SW: () => (stringProcessor),
  Tr: () => (lazyProcessor),
  Wg: () => (numberProcessor),
  Y8: () => (bigintProcessor),
  Yv: () => (literalProcessor),
  aw: () => (successProcessor),
  bl: () => (toJSONSchema),
  bq: () => (functionProcessor),
  cR: () => (nonoptionalProcessor),
  cY: () => (arrayProcessor),
  dO: () => (booleanProcessor),
  fg: () => (symbolProcessor),
  fs: () => (pipeProcessor),
  iC: () => (unionProcessor),
  i_: () => (intersectionProcessor),
  jq: () => (mapProcessor),
  mh: () => (defaultProcessor),
  vn: () => (voidProcessor),
  xi: () => (transformProcessor),
  yq: () => (nullableProcessor),
  zH: () => (setProcessor)
});
/* import */ var _to_json_schema_js__rspack_import_1 = __webpack_require__(9958);
/* import */ var _util_js__rspack_import_0 = __webpack_require__(7048);


const formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: "", // do not set
};
// ==================== SIMPLE TYPE PROCESSORS ====================
const stringProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    json.type = "string";
    const { minimum, maximum, format, patterns, contentEncoding } = schema._zod
        .bag;
    if (typeof minimum === "number")
        json.minLength = minimum;
    if (typeof maximum === "number")
        json.maxLength = maximum;
    // custom pattern overrides format
    if (format) {
        json.format = formatMap[format] ?? format;
        if (json.format === "")
            delete json.format; // empty format is not valid
        // JSON Schema format: "time" requires a full time with offset or Z
        // z.iso.time() does not include timezone information, so format: "time" should never be used
        if (format === "time") {
            delete json.format;
        }
    }
    if (contentEncoding)
        json.contentEncoding = contentEncoding;
    if (patterns && patterns.size > 0) {
        const regexes = [...patterns];
        if (regexes.length === 1)
            json.pattern = regexes[0].source;
        else if (regexes.length > 1) {
            json.allOf = [
                ...regexes.map((regex) => ({
                    ...(ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0"
                        ? { type: "string" }
                        : {}),
                    pattern: regex.source,
                })),
            ];
        }
    }
};
const numberProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
    if (typeof format === "string" && format.includes("int"))
        json.type = "integer";
    else
        json.type = "number";
    // when both minimum and exclusiveMinimum exist, pick the more restrictive one
    const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
    const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
    const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
    if (exMin) {
        if (legacy) {
            json.minimum = exclusiveMinimum;
            json.exclusiveMinimum = true;
        }
        else {
            json.exclusiveMinimum = exclusiveMinimum;
        }
    }
    else if (typeof minimum === "number") {
        json.minimum = minimum;
    }
    if (exMax) {
        if (legacy) {
            json.maximum = exclusiveMaximum;
            json.exclusiveMaximum = true;
        }
        else {
            json.exclusiveMaximum = exclusiveMaximum;
        }
    }
    else if (typeof maximum === "number") {
        json.maximum = maximum;
    }
    if (typeof multipleOf === "number")
        json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
    json.type = "boolean";
};
const bigintProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt cannot be represented in JSON Schema");
    }
};
const symbolProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Symbols cannot be represented in JSON Schema");
    }
};
const nullProcessor = (_schema, ctx, json, _params) => {
    if (ctx.target === "openapi-3.0") {
        json.type = "string";
        json.nullable = true;
        json.enum = [null];
    }
    else {
        json.type = "null";
    }
};
const undefinedProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Undefined cannot be represented in JSON Schema");
    }
};
const voidProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Void cannot be represented in JSON Schema");
    }
};
const neverProcessor = (_schema, _ctx, json, _params) => {
    json.not = {};
};
const anyProcessor = (_schema, _ctx, _json, _params) => {
    // empty schema accepts anything
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {
    // empty schema accepts anything
};
const dateProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Date cannot be represented in JSON Schema");
    }
};
const enumProcessor = (schema, _ctx, json, _params) => {
    const def = schema._zod.def;
    const values = (0,_util_js__rspack_import_0.getEnumValues)(def.entries);
    // Number enums can have both string and number values
    if (values.every((v) => typeof v === "number"))
        json.type = "number";
    if (values.every((v) => typeof v === "string"))
        json.type = "string";
    json.enum = values;
};
const literalProcessor = (schema, ctx, json, _params) => {
    const def = schema._zod.def;
    const vals = [];
    for (const val of def.values) {
        if (val === undefined) {
            if (ctx.unrepresentable === "throw") {
                throw new Error("Literal `undefined` cannot be represented in JSON Schema");
            }
            else {
                // do not add to vals
            }
        }
        else if (typeof val === "bigint") {
            if (ctx.unrepresentable === "throw") {
                throw new Error("BigInt literals cannot be represented in JSON Schema");
            }
            else {
                vals.push(Number(val));
            }
        }
        else {
            vals.push(val);
        }
    }
    if (vals.length === 0) {
        // do nothing (an undefined literal was stripped)
    }
    else if (vals.length === 1) {
        const val = vals[0];
        json.type = val === null ? "null" : typeof val;
        if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
            json.enum = [val];
        }
        else {
            json.const = val;
        }
    }
    else {
        if (vals.every((v) => typeof v === "number"))
            json.type = "number";
        if (vals.every((v) => typeof v === "string"))
            json.type = "string";
        if (vals.every((v) => typeof v === "boolean"))
            json.type = "boolean";
        if (vals.every((v) => v === null))
            json.type = "null";
        json.enum = vals;
    }
};
const nanProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("NaN cannot be represented in JSON Schema");
    }
};
const templateLiteralProcessor = (schema, _ctx, json, _params) => {
    const _json = json;
    const pattern = schema._zod.pattern;
    if (!pattern)
        throw new Error("Pattern not found in template literal");
    _json.type = "string";
    _json.pattern = pattern.source;
};
const fileProcessor = (schema, _ctx, json, _params) => {
    const _json = json;
    const file = {
        type: "string",
        format: "binary",
        contentEncoding: "binary",
    };
    const { minimum, maximum, mime } = schema._zod.bag;
    if (minimum !== undefined)
        file.minLength = minimum;
    if (maximum !== undefined)
        file.maxLength = maximum;
    if (mime) {
        if (mime.length === 1) {
            file.contentMediaType = mime[0];
            Object.assign(_json, file);
        }
        else {
            Object.assign(_json, file); // shared props at root
            _json.anyOf = mime.map((m) => ({ contentMediaType: m })); // only contentMediaType differs
        }
    }
    else {
        Object.assign(_json, file);
    }
};
const successProcessor = (_schema, _ctx, json, _params) => {
    json.type = "boolean";
};
const customProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Custom types cannot be represented in JSON Schema");
    }
};
const functionProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Function types cannot be represented in JSON Schema");
    }
};
const transformProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Transforms cannot be represented in JSON Schema");
    }
};
const mapProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Map cannot be represented in JSON Schema");
    }
};
const setProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Set cannot be represented in JSON Schema");
    }
};
// ==================== COMPOSITE TYPE PROCESSORS ====================
const arrayProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
        json.minItems = minimum;
    if (typeof maximum === "number")
        json.maxItems = maximum;
    json.type = "array";
    json.items = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.element, ctx, {
        ...params,
        path: [...params.path, "items"],
    });
};
const objectProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "object";
    json.properties = {};
    const shape = def.shape;
    for (const key in shape) {
        json.properties[key] = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(shape[key], ctx, {
            ...params,
            path: [...params.path, "properties", key],
        });
    }
    // required keys
    const allKeys = new Set(Object.keys(shape));
    const requiredKeys = new Set([...allKeys].filter((key) => {
        const v = def.shape[key]._zod;
        if (ctx.io === "input") {
            return v.optin === undefined;
        }
        else {
            return v.optout === undefined;
        }
    }));
    if (requiredKeys.size > 0) {
        json.required = Array.from(requiredKeys);
    }
    // catchall
    if (def.catchall?._zod.def.type === "never") {
        // strict
        json.additionalProperties = false;
    }
    else if (!def.catchall) {
        // regular
        if (ctx.io === "output")
            json.additionalProperties = false;
    }
    else if (def.catchall) {
        json.additionalProperties = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.catchall, ctx, {
            ...params,
            path: [...params.path, "additionalProperties"],
        });
    }
};
const unionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    // Exclusive unions (inclusive === false) use oneOf (exactly one match) instead of anyOf (one or more matches)
    // This includes both z.xor() and discriminated unions
    const isExclusive = def.inclusive === false;
    const options = def.options.map((x, i) => (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(x, ctx, {
        ...params,
        path: [...params.path, isExclusive ? "oneOf" : "anyOf", i],
    }));
    if (isExclusive) {
        json.oneOf = options;
    }
    else {
        json.anyOf = options;
    }
};
const intersectionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const a = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.left, ctx, {
        ...params,
        path: [...params.path, "allOf", 0],
    });
    const b = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.right, ctx, {
        ...params,
        path: [...params.path, "allOf", 1],
    });
    const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
    const allOf = [
        ...(isSimpleIntersection(a) ? a.allOf : [a]),
        ...(isSimpleIntersection(b) ? b.allOf : [b]),
    ];
    json.allOf = allOf;
};
const tupleProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "array";
    const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
    const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
    const prefixItems = def.items.map((x, i) => (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(x, ctx, {
        ...params,
        path: [...params.path, prefixPath, i],
    }));
    const rest = def.rest
        ? (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.rest, ctx, {
            ...params,
            path: [...params.path, restPath, ...(ctx.target === "openapi-3.0" ? [def.items.length] : [])],
        })
        : null;
    if (ctx.target === "draft-2020-12") {
        json.prefixItems = prefixItems;
        if (rest) {
            json.items = rest;
        }
    }
    else if (ctx.target === "openapi-3.0") {
        json.items = {
            anyOf: prefixItems,
        };
        if (rest) {
            json.items.anyOf.push(rest);
        }
        json.minItems = prefixItems.length;
        if (!rest) {
            json.maxItems = prefixItems.length;
        }
    }
    else {
        json.items = prefixItems;
        if (rest) {
            json.additionalItems = rest;
        }
    }
    // length
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
        json.minItems = minimum;
    if (typeof maximum === "number")
        json.maxItems = maximum;
};
const recordProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "object";
    // For looseRecord with regex patterns, use patternProperties
    // This correctly represents "only validate keys matching the pattern" semantics
    // and composes well with allOf (intersections)
    const keyType = def.keyType;
    const keyBag = keyType._zod.bag;
    const patterns = keyBag?.patterns;
    if (def.mode === "loose" && patterns && patterns.size > 0) {
        // Use patternProperties for looseRecord with regex patterns
        const valueSchema = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.valueType, ctx, {
            ...params,
            path: [...params.path, "patternProperties", "*"],
        });
        json.patternProperties = {};
        for (const pattern of patterns) {
            json.patternProperties[pattern.source] = valueSchema;
        }
    }
    else {
        // Default behavior: use propertyNames + additionalProperties
        if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
            json.propertyNames = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.keyType, ctx, {
                ...params,
                path: [...params.path, "propertyNames"],
            });
        }
        json.additionalProperties = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.valueType, ctx, {
            ...params,
            path: [...params.path, "additionalProperties"],
        });
    }
    // Add required for keys with discrete values (enum, literal, etc.)
    const keyValues = keyType._zod.values;
    if (keyValues) {
        const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
        if (validKeyValues.length > 0) {
            json.required = validKeyValues;
        }
    }
};
const nullableProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const inner = (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    if (ctx.target === "openapi-3.0") {
        seen.ref = def.innerType;
        json.nullable = true;
    }
    else {
        json.anyOf = [inner, { type: "null" }];
    }
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    if (ctx.io === "input")
        json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    let catchValue;
    try {
        catchValue = def.catchValue(undefined);
    }
    catch {
        throw new Error("Dynamic catch values are not supported in JSON Schema");
    }
    json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    const inIsTransform = def.in._zod.traits.has("$ZodTransform");
    const innerType = ctx.io === "input" ? (inIsTransform ? def.out : def.in) : def.out;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.readOnly = true;
};
const promiseProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const optionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const lazyProcessor = (schema, ctx, _json, params) => {
    const innerType = schema._zod.innerType;
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
};
// ==================== ALL PROCESSORS ====================
const allProcessors = {
    string: stringProcessor,
    number: numberProcessor,
    boolean: booleanProcessor,
    bigint: bigintProcessor,
    symbol: symbolProcessor,
    null: nullProcessor,
    undefined: undefinedProcessor,
    void: voidProcessor,
    never: neverProcessor,
    any: anyProcessor,
    unknown: unknownProcessor,
    date: dateProcessor,
    enum: enumProcessor,
    literal: literalProcessor,
    nan: nanProcessor,
    template_literal: templateLiteralProcessor,
    file: fileProcessor,
    success: successProcessor,
    custom: customProcessor,
    function: functionProcessor,
    transform: transformProcessor,
    map: mapProcessor,
    set: setProcessor,
    array: arrayProcessor,
    object: objectProcessor,
    union: unionProcessor,
    intersection: intersectionProcessor,
    tuple: tupleProcessor,
    record: recordProcessor,
    nullable: nullableProcessor,
    nonoptional: nonoptionalProcessor,
    default: defaultProcessor,
    prefault: prefaultProcessor,
    catch: catchProcessor,
    pipe: pipeProcessor,
    readonly: readonlyProcessor,
    promise: promiseProcessor,
    optional: optionalProcessor,
    lazy: lazyProcessor,
};
function toJSONSchema(input, params) {
    if ("_idmap" in input) {
        // Registry case
        const registry = input;
        const ctx = (0,_to_json_schema_js__rspack_import_1/* .initializeContext */.az)({ ...params, processors: allProcessors });
        const defs = {};
        // First pass: process all schemas to build the seen map
        for (const entry of registry._idmap.entries()) {
            const [_, schema] = entry;
            (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(schema, ctx);
        }
        const schemas = {};
        const external = {
            registry,
            uri: params?.uri,
            defs,
        };
        // Update the context with external configuration
        ctx.external = external;
        // Second pass: emit each schema
        for (const entry of registry._idmap.entries()) {
            const [key, schema] = entry;
            (0,_to_json_schema_js__rspack_import_1/* .extractDefs */.Wb)(ctx, schema);
            schemas[key] = (0,_to_json_schema_js__rspack_import_1/* .finalize */.jE)(ctx, schema);
        }
        if (Object.keys(defs).length > 0) {
            const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
            schemas.__shared = {
                [defsSegment]: defs,
            };
        }
        return { schemas };
    }
    // Single schema case
    const ctx = (0,_to_json_schema_js__rspack_import_1/* .initializeContext */.az)({ ...params, processors: allProcessors });
    (0,_to_json_schema_js__rspack_import_1/* .process */.eh)(input, ctx);
    (0,_to_json_schema_js__rspack_import_1/* .extractDefs */.Wb)(ctx, input);
    return (0,_to_json_schema_js__rspack_import_1/* .finalize */.jE)(ctx, input);
}


},
9958(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  OA: () => (createToJSONSchemaMethod),
  Wb: () => (extractDefs),
  az: () => (initializeContext),
  eh: () => (process),
  jE: () => (finalize),
  uE: () => (createStandardJSONSchemaMethod)
});
/* import */ var _registries_js__rspack_import_0 = __webpack_require__(3795);

// function initializeContext<T extends schemas.$ZodType>(inputs: JSONSchemaGeneratorParams<T>): ToJSONSchemaContext<T> {
//   return {
//     processor: inputs.processor,
//     metadataRegistry: inputs.metadata ?? globalRegistry,
//     target: inputs.target ?? "draft-2020-12",
//     unrepresentable: inputs.unrepresentable ?? "throw",
//   };
// }
function initializeContext(params) {
    // Normalize target: convert old non-hyphenated versions to hyphenated versions
    let target = params?.target ?? "draft-2020-12";
    if (target === "draft-4")
        target = "draft-04";
    if (target === "draft-7")
        target = "draft-07";
    return {
        processors: params.processors ?? {},
        metadataRegistry: params?.metadata ?? _registries_js__rspack_import_0/* .globalRegistry */.fd,
        target,
        unrepresentable: params?.unrepresentable ?? "throw",
        override: params?.override ?? (() => { }),
        io: params?.io ?? "output",
        counter: 0,
        seen: new Map(),
        cycles: params?.cycles ?? "ref",
        reused: params?.reused ?? "inline",
        external: params?.external ?? undefined,
    };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
    var _a;
    const def = schema._zod.def;
    // check for schema in seens
    const seen = ctx.seen.get(schema);
    if (seen) {
        seen.count++;
        // check if cycle
        const isCycle = _params.schemaPath.includes(schema);
        if (isCycle) {
            seen.cycle = _params.path;
        }
        return seen.schema;
    }
    // initialize
    const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
    ctx.seen.set(schema, result);
    // custom method overrides default behavior
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
        result.schema = overrideSchema;
    }
    else {
        const params = {
            ..._params,
            schemaPath: [..._params.schemaPath, schema],
            path: _params.path,
        };
        if (schema._zod.processJSONSchema) {
            schema._zod.processJSONSchema(ctx, result.schema, params);
        }
        else {
            const _json = result.schema;
            const processor = ctx.processors[def.type];
            if (!processor) {
                throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
            }
            processor(schema, ctx, _json, params);
        }
        const parent = schema._zod.parent;
        if (parent) {
            // Also set ref if processor didn't (for inheritance)
            if (!result.ref)
                result.ref = parent;
            process(parent, ctx, params);
            ctx.seen.get(parent).isParent = true;
        }
    }
    // metadata
    const meta = ctx.metadataRegistry.get(schema);
    if (meta)
        Object.assign(result.schema, meta);
    if (ctx.io === "input" && isTransforming(schema)) {
        // examples/defaults only apply to output type of pipe
        delete result.schema.examples;
        delete result.schema.default;
    }
    // set prefault as default
    if (ctx.io === "input" && "_prefault" in result.schema)
        (_a = result.schema).default ?? (_a.default = result.schema._prefault);
    delete result.schema._prefault;
    // pulling fresh from ctx.seen in case it was overwritten
    const _result = ctx.seen.get(schema);
    return _result.schema;
}
function extractDefs(ctx, schema
// params: EmitParams
) {
    // iterate over seen map;
    const root = ctx.seen.get(schema);
    if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
    // Track ids to detect duplicates across different schemas
    const idToSchema = new Map();
    for (const entry of ctx.seen.entries()) {
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
            const existing = idToSchema.get(id);
            if (existing && existing !== entry[0]) {
                throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
            }
            idToSchema.set(id, entry[0]);
        }
    }
    // returns a ref to the schema
    // defId will be empty if the ref points to an external schema (or #)
    const makeURI = (entry) => {
        // comparing the seen objects because sometimes
        // multiple schemas map to the same seen object.
        // e.g. lazy
        // external is configured
        const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
        if (ctx.external) {
            const externalId = ctx.external.registry.get(entry[0])?.id; // ?? "__shared";// `__schema${ctx.counter++}`;
            // check if schema is in the external registry
            const uriGenerator = ctx.external.uri ?? ((id) => id);
            if (externalId) {
                return { ref: uriGenerator(externalId) };
            }
            // otherwise, add to __shared
            const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
            entry[1].defId = id; // set defId so it will be reused if needed
            return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
        }
        if (entry[1] === root) {
            return { ref: "#" };
        }
        // self-contained schema
        const uriPrefix = `#`;
        const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
        const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
        return { defId, ref: defUriPrefix + defId };
    };
    // stored cached version in `def` property
    // remove all properties, set $ref
    const extractToDef = (entry) => {
        // if the schema is already a reference, do not extract it
        if (entry[1].schema.$ref) {
            return;
        }
        const seen = entry[1];
        const { ref, defId } = makeURI(entry);
        seen.def = { ...seen.schema };
        // defId won't be set if the schema is a reference to an external schema
        // or if the schema is the root schema
        if (defId)
            seen.defId = defId;
        // wipe away all properties except $ref
        const schema = seen.schema;
        for (const key in schema) {
            delete schema[key];
        }
        schema.$ref = ref;
    };
    // throw on cycles
    // break cycles
    if (ctx.cycles === "throw") {
        for (const entry of ctx.seen.entries()) {
            const seen = entry[1];
            if (seen.cycle) {
                throw new Error("Cycle detected: " +
                    `#/${seen.cycle?.join("/")}/<root>` +
                    '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
            }
        }
    }
    // extract schemas into $defs
    for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        // convert root schema to # $ref
        if (schema === entry[0]) {
            extractToDef(entry); // this has special handling for the root schema
            continue;
        }
        // extract schemas that are in the external registry
        if (ctx.external) {
            const ext = ctx.external.registry.get(entry[0])?.id;
            if (schema !== entry[0] && ext) {
                extractToDef(entry);
                continue;
            }
        }
        // extract schemas with `id` meta
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
            extractToDef(entry);
            continue;
        }
        // break cycles
        if (seen.cycle) {
            // any
            extractToDef(entry);
            continue;
        }
        // extract reused schemas
        if (seen.count > 1) {
            if (ctx.reused === "ref") {
                extractToDef(entry);
                // biome-ignore lint:
                continue;
            }
        }
    }
}
function finalize(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
    // flatten refs - inherit properties from parent schemas
    const flattenRef = (zodSchema) => {
        const seen = ctx.seen.get(zodSchema);
        // already processed
        if (seen.ref === null)
            return;
        const schema = seen.def ?? seen.schema;
        const _cached = { ...schema };
        const ref = seen.ref;
        seen.ref = null; // prevent infinite recursion
        if (ref) {
            flattenRef(ref);
            const refSeen = ctx.seen.get(ref);
            const refSchema = refSeen.schema;
            // merge referenced schema into current
            if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
                // older drafts can't combine $ref with other properties
                schema.allOf = schema.allOf ?? [];
                schema.allOf.push(refSchema);
            }
            else {
                Object.assign(schema, refSchema);
            }
            // restore child's own properties (child wins)
            Object.assign(schema, _cached);
            const isParentRef = zodSchema._zod.parent === ref;
            // For parent chain, child is a refinement - remove parent-only properties
            if (isParentRef) {
                for (const key in schema) {
                    if (key === "$ref" || key === "allOf")
                        continue;
                    if (!(key in _cached)) {
                        delete schema[key];
                    }
                }
            }
            // When ref was extracted to $defs, remove properties that match the definition
            if (refSchema.$ref && refSeen.def) {
                for (const key in schema) {
                    if (key === "$ref" || key === "allOf")
                        continue;
                    if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
                        delete schema[key];
                    }
                }
            }
        }
        // If parent was extracted (has $ref), propagate $ref to this schema
        // This handles cases like: readonly().meta({id}).describe()
        // where processor sets ref to innerType but parent should be referenced
        const parent = zodSchema._zod.parent;
        if (parent && parent !== ref) {
            // Ensure parent is processed first so its def has inherited properties
            flattenRef(parent);
            const parentSeen = ctx.seen.get(parent);
            if (parentSeen?.schema.$ref) {
                schema.$ref = parentSeen.schema.$ref;
                // De-duplicate with parent's definition
                if (parentSeen.def) {
                    for (const key in schema) {
                        if (key === "$ref" || key === "allOf")
                            continue;
                        if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
                            delete schema[key];
                        }
                    }
                }
            }
        }
        // execute overrides
        ctx.override({
            zodSchema: zodSchema,
            jsonSchema: schema,
            path: seen.path ?? [],
        });
    };
    for (const entry of [...ctx.seen.entries()].reverse()) {
        flattenRef(entry[0]);
    }
    const result = {};
    if (ctx.target === "draft-2020-12") {
        result.$schema = "https://json-schema.org/draft/2020-12/schema";
    }
    else if (ctx.target === "draft-07") {
        result.$schema = "http://json-schema.org/draft-07/schema#";
    }
    else if (ctx.target === "draft-04") {
        result.$schema = "http://json-schema.org/draft-04/schema#";
    }
    else if (ctx.target === "openapi-3.0") {
        // OpenAPI 3.0 schema objects should not include a $schema property
    }
    else {
        // Arbitrary string values are allowed but won't have a $schema property set
    }
    if (ctx.external?.uri) {
        const id = ctx.external.registry.get(schema)?.id;
        if (!id)
            throw new Error("Schema is missing an `id` property");
        result.$id = ctx.external.uri(id);
    }
    Object.assign(result, root.def ?? root.schema);
    // The `id` in `.meta()` is a Zod-specific registration tag used to extract
    // schemas into $defs — it is not user-facing JSON Schema metadata. Strip it
    // from the output body where it would otherwise leak. The id is preserved
    // implicitly via the $defs key (and via $ref paths).
    const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
    if (rootMetaId !== undefined && result.id === rootMetaId)
        delete result.id;
    // build defs object
    const defs = ctx.external?.defs ?? {};
    for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (seen.def && seen.defId) {
            if (seen.def.id === seen.defId)
                delete seen.def.id;
            defs[seen.defId] = seen.def;
        }
    }
    // set definitions in result
    if (ctx.external) {
    }
    else {
        if (Object.keys(defs).length > 0) {
            if (ctx.target === "draft-2020-12") {
                result.$defs = defs;
            }
            else {
                result.definitions = defs;
            }
        }
    }
    try {
        // this "finalizes" this schema and ensures all cycles are removed
        // each call to finalize() is functionally independent
        // though the seen map is shared
        const finalized = JSON.parse(JSON.stringify(result));
        Object.defineProperty(finalized, "~standard", {
            value: {
                ...schema["~standard"],
                jsonSchema: {
                    input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
                    output: createStandardJSONSchemaMethod(schema, "output", ctx.processors),
                },
            },
            enumerable: false,
            writable: false,
        });
        return finalized;
    }
    catch (_err) {
        throw new Error("Error converting schema to JSON.");
    }
}
function isTransforming(_schema, _ctx) {
    const ctx = _ctx ?? { seen: new Set() };
    if (ctx.seen.has(_schema))
        return false;
    ctx.seen.add(_schema);
    const def = _schema._zod.def;
    if (def.type === "transform")
        return true;
    if (def.type === "array")
        return isTransforming(def.element, ctx);
    if (def.type === "set")
        return isTransforming(def.valueType, ctx);
    if (def.type === "lazy")
        return isTransforming(def.getter(), ctx);
    if (def.type === "promise" ||
        def.type === "optional" ||
        def.type === "nonoptional" ||
        def.type === "nullable" ||
        def.type === "readonly" ||
        def.type === "default" ||
        def.type === "prefault") {
        return isTransforming(def.innerType, ctx);
    }
    if (def.type === "intersection") {
        return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    if (def.type === "record" || def.type === "map") {
        return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    if (def.type === "pipe") {
        if (_schema._zod.traits.has("$ZodCodec"))
            return true;
        return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    if (def.type === "object") {
        for (const key in def.shape) {
            if (isTransforming(def.shape[key], ctx))
                return true;
        }
        return false;
    }
    if (def.type === "union") {
        for (const option of def.options) {
            if (isTransforming(option, ctx))
                return true;
        }
        return false;
    }
    if (def.type === "tuple") {
        for (const item of def.items) {
            if (isTransforming(item, ctx))
                return true;
        }
        if (def.rest && isTransforming(def.rest, ctx))
            return true;
        return false;
    }
    return false;
}
/**
 * Creates a toJSONSchema method for a schema instance.
 * This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
 */
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
    const ctx = initializeContext({ ...params, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
    const { libraryOptions, target } = params ?? {};
    const ctx = initializeContext({ ...(libraryOptions ?? {}), target, io, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
};


},

}]);
//# sourceMappingURL=177.bundle.js.map