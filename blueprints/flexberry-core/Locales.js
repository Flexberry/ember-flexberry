"use strict";
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
let __extends = (this && this.__extends) || (function () {
    let extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
let stripBom = require("strip-bom");
let fs = require("fs");
let path = require("path");
let lodash = require("lodash");
let TAB = "  ";
let Locales = /** @class */ (function () {
    function Locales(entityName, currentLocale, localePathTemplate) {
        this.locales = ["ru", "en"];
        this.localePathTemplate = localePathTemplate;
        if (lodash.indexOf(this.locales, currentLocale) == -1) {
            throw new Error("Unknown locale: " + currentLocale + ".");
        }
        this.translations = {};
        for (let _i = 0, _a = this.locales; _i < _a.length; _i++) {
            let locale = _a[_i];
            this.translations[locale] = [];
        }
        this.currentLocale = currentLocale;
        this.entityName = entityName;
        lodash.remove(this.locales, function (n) { return n == currentLocale; });
    }
    Locales.prototype.setupForm = function (form) {
        if (!form.caption)
            form.caption = "";
        let value = this.escapeValue(form.caption);
        this.push("caption: '" + value + "'", "caption: '" + form.name + "'");
        form.caption = "t \"forms." + this.entityName + ".caption\"";
    };
    Locales.prototype.setupEditFormAttribute = function (projAttr) {
        if (!projAttr.caption)
            projAttr.caption = "";
        let value = this.escapeValue(projAttr.caption);
        this.push("'" + projAttr.name + "-caption': '" + value + "'", "'" + projAttr.name + "-caption': '" + projAttr.name + "'");
        projAttr.caption = "t \"forms." + this.entityName + "." + projAttr.name + "-caption\"";
    };
    Locales.prototype.push = function (currentLocaleStr, otherLocalesStr) {
        this.translations[this.currentLocale].push(currentLocaleStr);
        for (let _i = 0, _a = this.locales; _i < _a.length; _i++) {
            let locale = _a[_i];
            this.translations[locale].push(otherLocalesStr);
        }
    };
    Locales.prototype.getLodashVariablesWithSuffix = function (suffix, level) {
        let lodashVariables = {};
        let availableLocales = [this.currentLocale].concat(this.locales);
        for (let _i = 0, availableLocales_1 = availableLocales; _i < availableLocales_1.length; _i++) {
            let locale = availableLocales_1[_i];
            let source = this.parseMergeSnippet("{" + this.getProperties(locale) + "}");
            let target = void 0;
            // validate target snippet content
            try {
                target = this.loadTargetSnippet(locale);
                if (target) {
                    this.generateProperties(target);
                }
            }
            catch (_a) {
                throw new Error("Invalid target snippet content to merge. File: " + this.localePathTemplate({ "locale": locale }) + " .");
            }
            source = this.merge(source, target);
            lodashVariables["" + locale + suffix] = this.generateProperties(source, level);
        }
        return lodashVariables;
    };
    Locales.prototype.getLodashVariablesProperties = function () {
        return this.getLodashVariablesWithSuffix("Properties", 1);
    };
    Locales.prototype.escapeValue = function (value) {
        return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    };
    Locales.prototype.quote = function (propName) {
        if (propName.indexOf("-") == -1)
            return propName;
        return "'" + propName + "'";
    };
    Locales.prototype.generateProperties = function (obj, level) {
        if (level === void 0) { level = 0; }
        let strings = [];
        let tab = (new Array(level + 1)).join(TAB);
        let self = this;
        lodash.forOwn(obj, function (value, key) {
            let str = "" + tab + self.quote(key) + ": ";
            let nextLevelExists = lodash.isPlainObject(value);
            str += nextLevelExists ? '{' : "'" + self.escapeValue(value) + "'";
            if (nextLevelExists) {
                strings.push(str);
                str = self.generateProperties(value, level + 1);
                if (str.length)
                    strings.push(str);
                str = tab + "}";
            }
            strings.push(str + ",");
        });
        if (strings.length) {
            let last = strings.length - 1;
            strings[last] = strings[last].slice(0, -1);
        }
        return strings.join('\n');
    };
    Locales.prototype.parseMergeSnippet = function (content) {
        let SNIPPET_REGEXP = /{[\s\S]*}/;
        let match = content.match(SNIPPET_REGEXP);
        if (match) {
            return eval("(" + match.toString() + ")");
        }
        return undefined;
    };
    Locales.prototype.parseTargetSnippet = function (content) {
        return this.parseMergeSnippet(content);
    };
    Locales.prototype.loadTargetSnippet = function (locale) {
        let localePath = this.localePathTemplate({ "locale": locale });
        if (!fs.existsSync(localePath)) {
            return undefined;
        }
        let content = stripBom(fs.readFileSync(localePath, "utf8"));
        return this.parseTargetSnippet(content);
    };
    Locales.prototype.merge = function (masterObj, overlapObj) {
        if (overlapObj && lodash.keys(overlapObj).length) {
            // prevent arguments modification
            let masterClone = lodash.cloneDeep(masterObj);
            let overlapClone = lodash.cloneDeep(overlapObj);
            this.mergeProperties(masterClone, overlapClone);
            return masterClone;
        }
        return masterObj;
    };
    Locales.prototype.getProperties = function (locale) {
        return "  " + this.translations[locale].join(",\n  ");
    };
    /*
     * Replaces the values of simple-typed master object properties with that of same-named overlap object properties
     * and adds missing ones from the overlap object.
     * WARNING! This method modifies arguments.
     */
    Locales.prototype.mergeProperties = function (masterObj, overlapObj) {
        let masterKeys = lodash.keys(masterObj);
        let overlapKeys = lodash.keys(overlapObj);
        // get missing master object properties names
        let missingKeys = lodash.difference(overlapKeys, masterKeys);
        let self = this;
        // add missing propertires from the overlap object
        if (missingKeys.length) {
            let missingObj = lodash.cloneDeep(lodash.pick(overlapObj, missingKeys));
            lodash.forOwn(missingObj, function (value, key) {
                masterObj[key] = value;
            });
        }
        // get same-named overlap object properties
        overlapObj = lodash.omit(overlapObj, missingKeys);
        // replace the values of simple-typed master object properties with that of same-named overlap object properties
        if (!lodash.keys(overlapObj).length) {
            return;
        }
        lodash.forOwn(overlapObj, function (overlapValue, key) {
            let masterValue = masterObj[key];
            let masterValueIsObject = lodash.isPlainObject(masterValue);
            let overlapValueIsObject = lodash.isPlainObject(overlapValue);
            if (masterValueIsObject != overlapValueIsObject) {
                return;
            }
            if (masterValueIsObject) {
                self.mergeProperties(masterValue, overlapValue);
                return;
            }
            masterObj[key] = overlapValue;
        });
    };
    return Locales;
}());
exports.default = Locales;
let ApplicationMenuLocales = /** @class */ (function (_super) {
    __extends(ApplicationMenuLocales, _super);
    function ApplicationMenuLocales(currentLocale, targetPathTemplate) {
        return _super.call(this, "", currentLocale, targetPathTemplate) || this;
    }
    ApplicationMenuLocales.prototype.getProperties = function (locale) {
        return "" + this.translations[locale].join(",\n");
    };
    ApplicationMenuLocales.prototype.parseTargetSnippet = function (content) {
        let SNIPPET_REGEXP = /[ ,\n]application[ \n]*:[ \n]*{[\s\S]*[ ,\n]'edit-form'[ \n]*:[ \n]*{/;
        let EXCLUDE_PROPERTIES = ["application-name", "application-version", "index"];
        let match = content.match(SNIPPET_REGEXP);
        if (match) {
            let obj = _super.prototype.parseMergeSnippet.call(this, match.toString());
            return lodash.omit(obj.sitemap, EXCLUDE_PROPERTIES);
        }
        return undefined;
    };
    return ApplicationMenuLocales;
}(Locales));
exports.ApplicationMenuLocales = ApplicationMenuLocales;
let ModelLocales = /** @class */ (function (_super) {
    __extends(ModelLocales, _super);
    function ModelLocales(model, modelsDir, currentLocale, targetPathTemplate) {
        let _this = _super.call(this, "", currentLocale, targetPathTemplate) || this;
        let projections = [];
        let projectionsOtherLocales = [];
        let projName;
        for (let _i = 0, _a = model.projections; _i < _a.length; _i++) {
            let proj = _a[_i];
            let projAttrs = [];
            for (let _b = 0, _c = proj.attrs; _b < _c.length; _b++) {
                let attr = _c[_b];
                projAttrs.push(_this.declareProjAttr(attr, 4));
            }
            for (let _d = 0, _e = proj.belongsTo; _d < _e.length; _d++) {
                let belongsTo = _e[_d];
                projAttrs.push(_this.joinProjBelongsTo(belongsTo, 4));
            }
            for (let _f = 0, _g = proj.hasMany; _f < _g.length; _f++) {
                let hasMany = _g[_f];
                let hasManyAttrs = [];
                let modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
                let detailModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
                projName = hasMany.projectionName;
                let detailProj = lodash.find(detailModel.projections, function (pr) { return pr.name === projName; });
                if (detailProj) {
                    for (let _h = 0, _j = detailProj.attrs; _h < _j.length; _h++) {
                        let detailAttr = _j[_h];
                        hasManyAttrs.push(_this.declareProjAttr(detailAttr, 5));
                    }
                    for (let _k = 0, _l = detailProj.belongsTo; _k < _l.length; _k++) {
                        let detailBelongsTo = _l[_k];
                        hasManyAttrs.push(_this.joinProjBelongsTo(detailBelongsTo, 5));
                    }
                    for (let _m = 0, _o = detailProj.hasMany; _m < _o.length; _m++) {
                        let detailHasMany = _o[_m];
                        hasManyAttrs.push(_this.joinProjHasMany(detailHasMany, modelsDir, 5));
                    }
                }
                hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
                hasManyAttrs.unshift(new SortedPair(-1, "        __caption__: '" + _this.escapeValue(hasMany.caption) + "'", "        __caption__: '" + hasMany.name + "'"));
                let attrsStr_1 = lodash.map(hasManyAttrs, "str").join(",\n        ");
                let attrsStrOtherLocales_1 = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n        ");
                projAttrs.push(new SortedPair(Number.MAX_VALUE, hasMany.name + ": {\n" + attrsStr_1 + "\n      }", hasMany.name + ": {\n" + attrsStrOtherLocales_1 + "\n      }"));
            }
            projAttrs = lodash.sortBy(projAttrs, ["index"]);
            let attrsStr = lodash.map(projAttrs, "str").join(",\n      ");
            let attrsStrOtherLocales = lodash.map(projAttrs, "strOtherLocales").join(",\n      ");
            _this.push(proj.name + ": {\n      " + attrsStr + "\n    }", proj.name + ": {\n      " + attrsStrOtherLocales + "\n    }");
        }
        this.validations = this.getValidationLocales(model);
        return _this;
    }
    ModelLocales.prototype.getProperties = function (locale) {
        let translation = this.translations[locale].join(",\n" + (TAB + TAB));
        if (translation !== '') {
            translation = "\n" + (TAB + TAB) + translation + ",\n" + TAB;
        }
        let validations = this.validations[locale].join(",\n" + (TAB + TAB));
        if (validations !== '') {
            validations = "\n" + (TAB + TAB) + validations + ",\n" + TAB;
        }
        return TAB + "projections: {" + translation + "},\n" + TAB + "validations: {" + validations + "},";
    };
    ModelLocales.prototype.joinProjHasMany = function (detailHasMany, modelsDir, level) {
        let hasManyAttrs = [];
        let modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
        let hasManyModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
        let hasManyProj = lodash.find(hasManyModel.projections, function (pr) { return pr.name === detailHasMany.projectionName; });
        if (hasManyProj) {
            for (let _i = 0, _a = hasManyProj.attrs; _i < _a.length; _i++) {
                let attr = _a[_i];
                hasManyAttrs.push(this.declareProjAttr(attr, level));
            }
            for (let _b = 0, _c = hasManyProj.belongsTo; _b < _c.length; _b++) {
                let belongsTo = _c[_b];
                hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
            }
            let indent = [];
            for (let i = 0; i < level; i++) {
                indent.push(TAB);
            }
            let indentStr = indent.join("");
            indent.pop();
            let indentStr2 = indent.join("");
            hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
            hasManyAttrs.unshift(new SortedPair(-1, "__caption__: '" + this.escapeValue(detailHasMany.caption) + "'", "__caption__: '" + detailHasMany.name + "'"));
            let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
            let attrsStrOtherLocales = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n" + indentStr);
            return new SortedPair(Number.MAX_VALUE, detailHasMany.name + ": {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}", detailHasMany.name + ": {\n" + indentStr + attrsStrOtherLocales + "\n" + indentStr2 + "}");
        }
        return new SortedPair(Number.MAX_VALUE, "", "");
    };
    ModelLocales.prototype.joinProjBelongsTo = function (belongsTo, level) {
        let belongsToAttrs = [];
        let index = Number.MAX_VALUE;
        for (let _i = 0, _a = belongsTo.attrs; _i < _a.length; _i++) {
            let attr = _a[_i];
            belongsToAttrs.push(this.declareProjAttr(attr, level + 1));
        }
        for (let _b = 0, _c = belongsTo.belongsTo; _b < _c.length; _b++) {
            let belongsTo2 = _c[_b];
            belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
        }
        let indent = [];
        for (let i = 0; i < level; i++) {
            indent.push(TAB);
        }
        let indentStr = indent.join("");
        indent.pop();
        let indentStr2 = indent.join("");
        belongsToAttrs = lodash.sortBy(belongsToAttrs, ["index"]);
        if (belongsToAttrs.length === 0) {
            index = Number.MAX_VALUE;
        }
        else {
            index = belongsToAttrs[0].index;
        }
        belongsToAttrs.unshift(new SortedPair(-1, "__caption__: '" + this.escapeValue(belongsTo.caption) + "'", "__caption__: '" + belongsTo.name + "'"));
        let attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
        let attrsStrOtherLocales = lodash.map(belongsToAttrs, "strOtherLocales").join(",\n" + indentStr);
        return new SortedPair(index, belongsTo.name + ": {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}", belongsTo.name + ": {\n" + indentStr + attrsStrOtherLocales + "\n" + indentStr2 + "}");
    };
    ModelLocales.prototype.declareProjAttr = function (attr, level) {
        let indent = [];
        for (let i = 0; i < level; i++) {
            indent.push(TAB);
        }
        let indentStr = indent.join("");
        indent.pop();
        let indentStr2 = indent.join("");
        return new SortedPair(attr.index, attr.name + ": {\n" + indentStr + "__caption__: '" + this.escapeValue(attr.caption) + "'\n" + indentStr2 + "}", attr.name + ": {\n" + indentStr + "__caption__: '" + attr.name + "'\n" + indentStr2 + "}");
    };
    ModelLocales.prototype.getValidationLocales = function (model) {
        let locales = {};
        locales[this.currentLocale] = [];
        for (let _i = 0, _a = this.locales; _i < _a.length; _i++) {
            let locale = _a[_i];
            locales[locale] = [];
        }
        for (let _b = 0, _c = model.attrs; _b < _c.length; _b++) {
            let attr = _c[_b];
            let caption = this.findCaption(model, attr.name);
            this.fillValidationTranslations(locales, attr.name, caption || attr.name);
        }
        for (let _d = 0, _e = model.belongsTo; _d < _e.length; _d++) {
            let belongsTo = _e[_d];
            let caption = this.findCaption(model, belongsTo.name);
            this.fillValidationTranslations(locales, belongsTo.name, caption || belongsTo.name);
        }
        for (let _f = 0, _g = model.hasMany; _f < _g.length; _f++) {
            let hasMany = _g[_f];
            let caption = this.findCaption(model, hasMany.name);
            this.fillValidationTranslations(locales, hasMany.name, caption || hasMany.name);
        }
        return locales;
    };
    ModelLocales.prototype.findCaption = function (model, propertyName) {
        let attrs = [];
        for (let _i = 0, _a = model.projections; _i < _a.length; _i++) {
            let projection = _a[_i];
            attrs = projection.attrs.filter(function (a) { return a.name === propertyName; });
            if (attrs.length === 0) {
                attrs = projection.belongsTo.filter(function (b) { return b.name === propertyName; });
            }
            if (attrs.length === 0) {
                attrs = projection.hasMany.filter(function (b) { return b.name === propertyName; });
            }
            if (attrs.length !== 0) {
                break;
            }
        }
        return attrs.length === 1 ? attrs[0].caption : null;
    };
    ModelLocales.prototype.fillValidationTranslations = function (locales, attrName, caption) {
        let translation = attrName + ": {\n" + (TAB + TAB + TAB) + "__caption__: '" + this.escapeValue(caption) + "',\n" + (TAB + TAB) + "}";
        let otherTranslation = attrName + ": {\n" + (TAB + TAB + TAB) + "__caption__: '" + this.escapeValue(attrName) + "',\n" + (TAB + TAB) + "}";
        locales[this.currentLocale].push(translation);
        for (let _i = 0, _a = this.locales; _i < _a.length; _i++) {
            let locale = _a[_i];
            locales[locale].push(otherTranslation);
        }
    };
    return ModelLocales;
}(Locales));
exports.ModelLocales = ModelLocales;
let SortedPair = /** @class */ (function () {
    function SortedPair(index, str, strOtherLocales) {
        this.index = index;
        this.str = str;
        this.strOtherLocales = strOtherLocales;
    }
    return SortedPair;
}());
//# sourceMappingURL=Locales.js.map
