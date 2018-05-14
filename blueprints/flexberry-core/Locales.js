/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stripBom = require("strip-bom");
var fs = require("fs");
var path = require('path');
var lodash = require('lodash');
var TAB = "  ";
var Locales = (function () {
    function Locales(entityName, currentLocale) {
        this.locales = ["ru", "en"];
        if (lodash.indexOf(this.locales, currentLocale) == -1) {
            throw new Error("Unknown locale: " + currentLocale + ".");
        }
        this.translations = {};
        for (var _i = 0, _a = this.locales; _i < _a.length; _i++) {
            var locale = _a[_i];
            this.translations[locale] = [];
        }
        this.currentLocale = currentLocale;
        this.entityName = entityName;
        lodash.remove(this.locales, function (n) { return n == currentLocale; });
    }
    Locales.prototype.setupForm = function (form) {
        if (!form.caption)
            form.caption = "";
        var value = this.escapeValue(form.caption);
        this.push("caption: '" + value + "'", "caption: '" + form.name + "'");
        form.caption = "t \"forms." + this.entityName + ".caption\"";
    };
    Locales.prototype.setupEditFormAttribute = function (projAttr) {
        if (!projAttr.caption)
            projAttr.caption = "";
        var value = this.escapeValue(projAttr.caption);
        this.push("'" + projAttr.name + "-caption': '" + value + "'", "'" + projAttr.name + "-caption': '" + projAttr.name + "'");
        projAttr.caption = "t \"forms." + this.entityName + "." + projAttr.name + "-caption\"";
    };
    Locales.prototype.push = function (currentLocaleStr, otherLocalesStr) {
        this.translations[this.currentLocale].push(currentLocaleStr);
        for (var _i = 0, _a = this.locales; _i < _a.length; _i++) {
            var locale = _a[_i];
            this.translations[locale].push(otherLocalesStr);
        }
    };
    Locales.prototype.escapeValue = function (value) {
        return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    };
    Locales.prototype.getLodashVariablesWithSuffix = function (suffix) {
        var lodashVariables = {};
        lodashVariables[("" + this.currentLocale + suffix)] = this.getProperties(this.currentLocale);
        for (var _i = 0, _a = this.locales; _i < _a.length; _i++) {
            var locale = _a[_i];
            lodashVariables[("" + locale + suffix)] = this.getProperties(locale);
        }
        return lodashVariables;
    };
    Locales.prototype.getLodashVariablesProperties = function () {
        return this.getLodashVariablesWithSuffix("Properties");
    };
    Locales.prototype.getProperties = function (locale) {
        return "  " + this.translations[locale].join(",\n  ");
    };
    return Locales;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Locales;
var ApplicationMenuLocales = (function (_super) {
    __extends(ApplicationMenuLocales, _super);
    function ApplicationMenuLocales(currentLocale) {
        _super.call(this, "", currentLocale);
    }
    ApplicationMenuLocales.prototype.getProperties = function (locale) {
        return "" + this.translations[locale].join(",\n");
    };
    return ApplicationMenuLocales;
}(Locales));
exports.ApplicationMenuLocales = ApplicationMenuLocales;
var ModelLocales = (function (_super) {
    __extends(ModelLocales, _super);
    function ModelLocales(model, modelsDir, currentLocale) {
        _super.call(this, "", currentLocale);
        var projName;
        for (var _i = 0, _a = model.projections; _i < _a.length; _i++) {
            var proj = _a[_i];
            var projAttrs = [];
            for (var _b = 0, _c = proj.attrs; _b < _c.length; _b++) {
                var attr = _c[_b];
                projAttrs.push(this.declareProjAttr(attr, 4));
            }
            for (var _d = 0, _e = proj.belongsTo; _d < _e.length; _d++) {
                var belongsTo = _e[_d];
                projAttrs.push(this.joinProjBelongsTo(belongsTo, 4));
            }
            for (var _f = 0, _g = proj.hasMany; _f < _g.length; _f++) {
                var hasMany = _g[_f];
                var hasManyAttrs = [];
                var modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
                var detailModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
                projName = hasMany.projectionName;
                var detailProj = lodash.find(detailModel.projections, function (pr) { return pr.name === projName; });
                if (detailProj) {
                    for (var _h = 0, _j = detailProj.attrs; _h < _j.length; _h++) {
                        var detailAttr = _j[_h];
                        hasManyAttrs.push(this.declareProjAttr(detailAttr, 5));
                    }
                    for (var _k = 0, _l = detailProj.belongsTo; _k < _l.length; _k++) {
                        var detailBelongsTo = _l[_k];
                        hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 5));
                    }
                    for (var _m = 0, _o = detailProj.hasMany; _m < _o.length; _m++) {
                        var detailHasMany = _o[_m];
                        hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 5));
                    }
                }
                hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
                hasManyAttrs.unshift(new SortedPair(-1, "        __caption__: '" + this.escapeValue(hasMany.caption) + "'", "        __caption__: '" + hasMany.name + "'"));
                var attrsStr_1 = lodash.map(hasManyAttrs, "str").join(",\n        ");
                var attrsStrOtherLocales_1 = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n        ");
                projAttrs.push(new SortedPair(Number.MAX_VALUE, hasMany.name + ": {\n" + attrsStr_1 + "\n      }", hasMany.name + ": {\n" + attrsStrOtherLocales_1 + "\n      }"));
            }
            projAttrs = lodash.sortBy(projAttrs, ["index"]);
            var attrsStr = lodash.map(projAttrs, "str").join(",\n      ");
            var attrsStrOtherLocales = lodash.map(projAttrs, "strOtherLocales").join(",\n      ");
            this.push(proj.name + ": {\n      " + attrsStr + "\n    }", proj.name + ": {\n      " + attrsStrOtherLocales + "\n    }");
        }
        this.validations = this.getValidationLocales(model);
    }
    ModelLocales.prototype.getProperties = function (locale) {
        var translation = this.translations[locale].join(",\n" + (TAB + TAB));
        if (translation !== '') {
            translation = "\n" + (TAB + TAB) + translation + ",\n" + TAB;
        }
        var validations = this.validations[locale].join(",\n" + (TAB + TAB));
        if (validations !== '') {
            validations = "\n" + (TAB + TAB) + validations + ",\n" + TAB;
        }
        return TAB + "projections: {" + translation + "},\n" + TAB + "validations: {" + validations + "},";
    };
    ModelLocales.prototype.joinProjHasMany = function (detailHasMany, modelsDir, level) {
        var hasManyAttrs = [];
        var modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
        var hasManyModel = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
        var hasManyProj = lodash.find(hasManyModel.projections, function (pr) { return pr.name === detailHasMany.projectionName; });
        if (hasManyProj) {
            for (var _i = 0, _a = hasManyProj.attrs; _i < _a.length; _i++) {
                var attr = _a[_i];
                hasManyAttrs.push(this.declareProjAttr(attr, level));
            }
            for (var _b = 0, _c = hasManyProj.belongsTo; _b < _c.length; _b++) {
                var belongsTo = _c[_b];
                hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
            }
            var indent = [];
            for (var i = 0; i < level; i++) {
                indent.push(TAB);
            }
            var indentStr = indent.join("");
            indent.pop();
            var indentStr2 = indent.join("");
            hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
            hasManyAttrs.unshift(new SortedPair(-1, "__caption__: '" + this.escapeValue(detailHasMany.caption) + "'", "__caption__: '" + detailHasMany.name + "'"));
            var attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
            var attrsStrOtherLocales = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n" + indentStr);
            return new SortedPair(Number.MAX_VALUE, detailHasMany.name + ": {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}", detailHasMany.name + ": {\n" + indentStr + attrsStrOtherLocales + "\n" + indentStr2 + "}");
        }
        return new SortedPair(Number.MAX_VALUE, "", "");
    };
    ModelLocales.prototype.joinProjBelongsTo = function (belongsTo, level) {
        var belongsToAttrs = [];
        var index = Number.MAX_VALUE;
        for (var _i = 0, _a = belongsTo.attrs; _i < _a.length; _i++) {
            var attr = _a[_i];
            belongsToAttrs.push(this.declareProjAttr(attr, level + 1));
        }
        for (var _b = 0, _c = belongsTo.belongsTo; _b < _c.length; _b++) {
            var belongsTo2 = _c[_b];
            belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
        }
        var indent = [];
        for (var i = 0; i < level; i++) {
            indent.push(TAB);
        }
        var indentStr = indent.join("");
        indent.pop();
        var indentStr2 = indent.join("");
        belongsToAttrs = lodash.sortBy(belongsToAttrs, ["index"]);
        if (belongsToAttrs.length === 0) {
            index = Number.MAX_VALUE;
        }
        else {
            index = belongsToAttrs[0].index;
        }
        belongsToAttrs.unshift(new SortedPair(-1, "__caption__: '" + this.escapeValue(belongsTo.caption) + "'", "__caption__: '" + belongsTo.name + "'"));
        var attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
        var attrsStrOtherLocales = lodash.map(belongsToAttrs, "strOtherLocales").join(",\n" + indentStr);
        return new SortedPair(index, belongsTo.name + ": {\n" + indentStr + attrsStr + "\n" + indentStr2 + "}", belongsTo.name + ": {\n" + indentStr + attrsStrOtherLocales + "\n" + indentStr2 + "}");
    };
    ModelLocales.prototype.declareProjAttr = function (attr, level) {
        var indent = [];
        for (var i = 0; i < level; i++) {
            indent.push(TAB);
        }
        var indentStr = indent.join("");
        indent.pop();
        var indentStr2 = indent.join("");
        return new SortedPair(attr.index, attr.name + ": {\n" + indentStr + "__caption__: '" + this.escapeValue(attr.caption) + "'\n" + indentStr2 + "}", attr.name + ": {\n" + indentStr + "__caption__: '" + attr.name + "'\n" + indentStr2 + "}");
    };
    ModelLocales.prototype.getValidationLocales = function (model) {
        var locales = {};
        locales[this.currentLocale] = [];
        for (var _i = 0, _a = this.locales; _i < _a.length; _i++) {
            var locale = _a[_i];
            locales[locale] = [];
        }
        for (var _b = 0, _c = model.attrs; _b < _c.length; _b++) {
            var attr = _c[_b];
            var caption = this.findCaption(model, attr.name);
            this.fillValidationTranslations(locales, attr.name, caption || attr.name);
        }
        for (var _d = 0, _e = model.belongsTo; _d < _e.length; _d++) {
            var belongsTo = _e[_d];
            var caption = this.findCaption(model, belongsTo.name);
            this.fillValidationTranslations(locales, belongsTo.name, caption || belongsTo.name);
        }
        for (var _f = 0, _g = model.hasMany; _f < _g.length; _f++) {
            var hasMany = _g[_f];
            var caption = this.findCaption(model, hasMany.name);
            this.fillValidationTranslations(locales, hasMany.name, caption || hasMany.name);
        }
        return locales;
    };
    ModelLocales.prototype.findCaption = function (model, propertyName) {
        var attrs = [];
        for (var _i = 0, _a = model.projections; _i < _a.length; _i++) {
            var projection = _a[_i];
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
        var translation = attrName + ": {\n" + (TAB + TAB + TAB) + "__caption__: '" + this.escapeValue(caption) + "',\n" + (TAB + TAB) + "}";
        var otherTranslation = attrName + ": {\n" + (TAB + TAB + TAB) + "__caption__: '" + this.escapeValue(attrName) + "',\n" + (TAB + TAB) + "}";
        locales[this.currentLocale].push(translation);
        for (var _i = 0, _a = this.locales; _i < _a.length; _i++) {
            var locale = _a[_i];
            locales[locale].push(otherTranslation);
        }
    };
    return ModelLocales;
}(Locales));
exports.ModelLocales = ModelLocales;
var SortedPair = (function () {
    function SortedPair(index, str, strOtherLocales) {
        this.index = index;
        this.str = str;
        this.strOtherLocales = strOtherLocales;
    }
    return SortedPair;
}());
//# sourceMappingURL=Locales.js.map
