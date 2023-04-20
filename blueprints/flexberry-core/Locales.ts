/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />
/// <reference path='../typings/MetadataClasses.d.ts' />

const stripBom = require("strip-bom");
import fs = require("fs");
import path = require('path');
import lodash = require('lodash');
import metadata = require('MetadataClasses');
const TAB = "  ";

export default class Locales {
  protected locales = ["ru", "en"];
  protected currentLocale: string;
  protected entityName: string;
  protected translations: Map<string[]> ;
  protected localePathTemplate: lodash.TemplateExecutor;

  constructor(entityName: string, currentLocale: string, localePathTemplate: lodash.TemplateExecutor) {
    this.localePathTemplate = localePathTemplate;
    if (lodash.indexOf(this.locales, currentLocale) == -1) {
      throw new Error(`Unknown locale: ${currentLocale}.`);
    }
    this.translations = {};
    for (let locale of this.locales) {
      this.translations[locale] = [];
    }
    this.currentLocale = currentLocale;
    this.entityName = entityName;
    lodash.remove(this.locales, (n: string) => { return n == currentLocale });
  }

  setupForm(form: metadata.Form) {
    if (!form.caption)
      form.caption = "";
    let value = this.escapeValue(form.caption);
    this.push(
      `caption: '${value}'`,
      `caption: '${form.name}'`
    );
    form.caption = `t "forms.${this.entityName}.caption"`;
  }

  setupEditFormAttribute(projAttr: metadata.ProjAttr) {
    if (!projAttr.caption)
      projAttr.caption = "";
    let value = this.escapeValue(projAttr.caption);
    this.push(
      `'${projAttr.name}-caption': '${value}'`,
      `'${projAttr.name}-caption': '${projAttr.name}'`
    );
    projAttr.caption = `t "forms.${this.entityName}.${projAttr.name}-caption"`;
  }

  push(currentLocaleStr: string, otherLocalesStr: string) {
    this.translations[this.currentLocale].push(currentLocaleStr);
    for (let locale of this.locales) {
      this.translations[locale].push(otherLocalesStr);
    }
  }

  getLodashVariablesWithSuffix(suffix: string, level: number) {
    let lodashVariables = {};
    let availableLocales = [ this.currentLocale ].concat(this.locales);
    for (let locale of availableLocales) {
      let source = this.parseMergeSnippet(`{${this.getProperties(locale)}}`);
      let target;

      // validate target snippet content
      try {
        target = this.loadTargetSnippet(locale);
        if (target) {
          this.generateProperties(target);
        }
      } catch {
        throw new Error(`Invalid target snippet content to merge. File: ${this.localePathTemplate({ "locale": locale })} .`);
      }

      source = this.merge(source, target);
      lodashVariables[`${locale}${suffix}`] = this.generateProperties(source, level);
    }
    return lodashVariables;
  }

  getLodashVariablesProperties() {
    return this.getLodashVariablesWithSuffix("Properties", 1);
  }

  protected escapeValue(value: string) {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  protected quote(propName: string) {
    if (propName.indexOf("-") == -1)
      return propName;
    return `'${propName}'`;
  }

  protected generateProperties(obj, level: number = 0) {
    let strings = [];
    let tab = (new Array(level + 1)).join(TAB);

    let self = this;
    lodash.forOwn(obj, function(value, key) {
      let str = `${tab}${self.quote(key)}: `;
      let nextLevelExists = lodash.isPlainObject(value);

      str += nextLevelExists ? '{' : `'${self.escapeValue(value)}'`;
      if (nextLevelExists) {
        strings.push(str);
        str = self.generateProperties(value, level + 1);
        if (str.length)
          strings.push(str);
        str = `${tab}}`;
      }
      strings.push(`${str},`);
    })
    return strings.join('\n');
  }

  protected parseMergeSnippet(content: string) {
    const SNIPPET_REGEXP = /{[\s\S]*}/;
    let match = content.match(SNIPPET_REGEXP);
    if (match) {
      return eval(`(${match.toString()})`);
    }
    return undefined;
  }

  protected parseTargetSnippet(content: string) {
    return this.parseMergeSnippet(content);
  }

  protected loadTargetSnippet(locale: string) {
    let localePath = this.localePathTemplate({ "locale": locale });
    if (!fs.existsSync(localePath)) {
      return undefined;
    }
    let content = stripBom(fs.readFileSync(localePath, "utf8"));
    return this.parseTargetSnippet(content);
  }

  protected merge(masterObj, overlapObj) {
    if (overlapObj && lodash.keys(overlapObj).length) {

      // prevent arguments modification
      let masterClone = lodash.cloneDeep(masterObj);
      let overlapClone = lodash.cloneDeep(overlapObj);

      this.mergeProperties(masterClone, overlapClone);
      return masterClone;
    }
    return masterObj;
  }

  protected getProperties(locale: string) {
    return `  ${this.translations[locale].join(",\n  ")}`;
  }

  /*
   * Replaces the values of simple-typed master object properties with that of same-named overlap object properties
   * and adds missing ones from the overlap object.
   * WARNING! This method modifies arguments.
   */
  private mergeProperties(masterObj, overlapObj) {
    let masterKeys = lodash.keys(masterObj);
    let overlapKeys = lodash.keys(overlapObj);

    // get missing master object properties names
    let missingKeys = lodash.difference(overlapKeys, masterKeys);

    let self = this;

    // add missing propertires from the overlap object
    if (missingKeys.length) {
      let missingObj = lodash.cloneDeep(lodash.pick(overlapObj, missingKeys));
      lodash.forOwn(missingObj, function(value, key) {
        masterObj[key] = value;
      });
    }

    // get same-named overlap object properties
    overlapObj = lodash.omit(overlapObj, missingKeys);

    // replace the values of simple-typed master object properties with that of same-named overlap object properties
    if (!lodash.keys(overlapObj).length) {
      return;
    }
    lodash.forOwn(overlapObj, function(overlapValue, key) {
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
  }
}

export class ApplicationMenuLocales extends Locales {

  constructor(currentLocale: string, targetPathTemplate: lodash.TemplateExecutor) {
    super("", currentLocale, targetPathTemplate);
  }

  protected getProperties(locale: string) {
    return `${this.translations[locale].join(",\n")}`;
  }

  protected parseTargetSnippet(content: string) {
    const SNIPPET_REGEXP = /[ ,\n]application[ \n]*:[ \n]*{[\s\S]*[ ,\n]'edit-form'[ \n]*:[ \n]*{/;
    const EXCLUDE_PROPERTIES = ["application-name", "application-version", "index"];

    let match = content.match(SNIPPET_REGEXP);
    if (match) {
      let obj = super.parseMergeSnippet(match.toString());
      return lodash.omit(obj.sitemap, EXCLUDE_PROPERTIES);
    }
    return undefined;
  }
}

export class ModelLocales extends Locales {
  protected validations: Map<string[]>;

  protected getProperties(locale: string) {
    let translation = this.translations[locale].join(`,\n${TAB + TAB}`);
    if (translation !== '') {
      translation = `\n${TAB + TAB}${translation},\n${TAB}`;
    }

    let validations = this.validations[locale].join(`,\n${TAB + TAB}`);
    if (validations !== '') {
      validations = `\n${TAB + TAB}${validations},\n${TAB}`;
    }

    return `${TAB}projections: {${translation}},\n${TAB}validations: {${validations}},`;
  }

  constructor(model: metadata.Model, modelsDir: string, currentLocale: string, targetPathTemplate: lodash.TemplateExecutor) {
    super("", currentLocale, targetPathTemplate);
    let projections: string[] = [];
    let projectionsOtherLocales: string[] = [];
    let projName: string;

    for (let proj of model.projections) {
      let projAttrs: SortedPair[] = [];
      for (let attr of proj.attrs) {
        projAttrs.push(this.declareProjAttr(attr, 4));
      }
      for (let belongsTo of proj.belongsTo) {
        projAttrs.push(this.joinProjBelongsTo(belongsTo, 4));
      }
      for (let hasMany of proj.hasMany) {
        let hasManyAttrs: SortedPair[] = [];
        let modelFile = path.join(modelsDir, hasMany.relatedTo + ".json");
        let detailModel: metadata.Model = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
        projName = hasMany.projectionName;
        let detailProj = lodash.find(detailModel.projections, function (pr: metadata.ProjectionForModel) { return pr.name === projName; });
        if (detailProj) {
          for (let detailAttr of detailProj.attrs) {
            hasManyAttrs.push(this.declareProjAttr(detailAttr, 5));
          }
          for (let detailBelongsTo of detailProj.belongsTo) {
            hasManyAttrs.push(this.joinProjBelongsTo(detailBelongsTo, 5));
          }

          for (let detailHasMany of detailProj.hasMany) {
            hasManyAttrs.push(this.joinProjHasMany(detailHasMany, modelsDir, 5));
          }
        }
        hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
        hasManyAttrs.unshift(new SortedPair(-1, `        __caption__: '${this.escapeValue(hasMany.caption)}'`, `        __caption__: '${hasMany.name}'`));
        let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n        ");
        let attrsStrOtherLocales = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n        ");
        projAttrs.push(new SortedPair(Number.MAX_VALUE,
          `${hasMany.name}: {\n${attrsStr}\n      }`,
          `${hasMany.name}: {\n${attrsStrOtherLocales}\n      }`
        ));
      }
      projAttrs = lodash.sortBy(projAttrs, ["index"]);
      let attrsStr = lodash.map(projAttrs, "str").join(",\n      ");
      let attrsStrOtherLocales = lodash.map(projAttrs, "strOtherLocales").join(",\n      ");
      this.push(
        `${proj.name}: {\n      ${attrsStr}\n    }`,
        `${proj.name}: {\n      ${attrsStrOtherLocales}\n    }`
      );
    }

    this.validations = this.getValidationLocales(model);
  }

  joinProjHasMany(detailHasMany: metadata.ProjHasMany, modelsDir: string, level: number): SortedPair {
    let hasManyAttrs: SortedPair[] = [];
    let modelFile = path.join(modelsDir, detailHasMany.relatedTo + ".json");
    let hasManyModel: metadata.Model = JSON.parse(stripBom(fs.readFileSync(modelFile, "utf8")));
    let hasManyProj = lodash.find(hasManyModel.projections, function (pr: metadata.ProjectionForModel) { return pr.name === detailHasMany.projectionName; });
    if (hasManyProj) {
      for (let attr of hasManyProj.attrs) {
        hasManyAttrs.push(this.declareProjAttr(attr, level));
      }
      for (let belongsTo of hasManyProj.belongsTo) {
        hasManyAttrs.push(this.joinProjBelongsTo(belongsTo, level + 1));
      }
      let indent: string[] = [];
      for (let i = 0; i < level; i++) {
        indent.push(TAB);
      }
      let indentStr = indent.join("");
      indent.pop();
      let indentStr2 = indent.join("");
      hasManyAttrs = lodash.sortBy(hasManyAttrs, ["index"]);
      hasManyAttrs.unshift(new SortedPair(-1, `__caption__: '${this.escapeValue(detailHasMany.caption)}'`, `__caption__: '${detailHasMany.name}'`));
      let attrsStr = lodash.map(hasManyAttrs, "str").join(",\n" + indentStr);
      let attrsStrOtherLocales = lodash.map(hasManyAttrs, "strOtherLocales").join(",\n" + indentStr);

      return new SortedPair(Number.MAX_VALUE,
        `${detailHasMany.name}: {\n${indentStr}${attrsStr}\n${indentStr2}}`,
        `${detailHasMany.name}: {\n${indentStr}${attrsStrOtherLocales}\n${indentStr2}}`
      );
    }
    return new SortedPair(Number.MAX_VALUE, "", "");
  }

  joinProjBelongsTo(belongsTo: metadata.ProjBelongsTo, level: number): SortedPair {
    let belongsToAttrs: SortedPair[] = [];
    let index = Number.MAX_VALUE;
    for (let attr of belongsTo.attrs) {
      belongsToAttrs.push(this.declareProjAttr(attr, level + 1));
    }
    for (let belongsTo2 of belongsTo.belongsTo) {
      belongsToAttrs.push(this.joinProjBelongsTo(belongsTo2, level + 1));
    }
    let indent: string[] = [];
    for (let i = 0; i < level; i++) {
      indent.push(TAB);
    }
    let indentStr = indent.join("");
    indent.pop();
    let indentStr2 = indent.join("");
    belongsToAttrs = lodash.sortBy(belongsToAttrs, ["index"]);
    if (belongsToAttrs.length === 0) {
      index = Number.MAX_VALUE;
    } else {
      index = belongsToAttrs[0].index;
    }
    belongsToAttrs.unshift(new SortedPair(-1, `__caption__: '${this.escapeValue(belongsTo.caption)}'`, `__caption__: '${belongsTo.name}'`));
    let attrsStr = lodash.map(belongsToAttrs, "str").join(",\n" + indentStr);
    let attrsStrOtherLocales = lodash.map(belongsToAttrs, "strOtherLocales").join(",\n" + indentStr);

    return new SortedPair(index,
      `${belongsTo.name}: {\n${indentStr}${attrsStr}\n${indentStr2}}`,
      `${belongsTo.name}: {\n${indentStr}${attrsStrOtherLocales}\n${indentStr2}}`
    );
  }

  declareProjAttr(attr: metadata.ProjAttr, level: number): SortedPair {
    let indent: string[] = [];
    for (let i = 0; i < level; i++) {
      indent.push(TAB);
    }
    let indentStr = indent.join("");
    indent.pop();
    let indentStr2 = indent.join("");
    return new SortedPair(attr.index,
      `${attr.name}: {\n${indentStr}__caption__: '${this.escapeValue(attr.caption)}'\n${indentStr2}}`,
      `${attr.name}: {\n${indentStr}__caption__: '${attr.name}'\n${indentStr2}}`
    );
  }

  getValidationLocales(model: metadata.Model): Map<string[]> {
    let locales: Map<string[]> = {};
    locales[this.currentLocale] = [];
    for (let locale of this.locales) {
      locales[locale] = [];
    }

    for (let attr of model.attrs) {
      let caption = this.findCaption(model, attr.name);
      this.fillValidationTranslations(locales, attr.name, caption || attr.name);
    }

    for (let belongsTo of model.belongsTo) {
      let caption = this.findCaption(model, belongsTo.name);
      this.fillValidationTranslations(locales, belongsTo.name, caption || belongsTo.name);
    }

    for (let hasMany of model.hasMany) {
      let caption = this.findCaption(model, hasMany.name);
      this.fillValidationTranslations(locales, hasMany.name, caption || hasMany.name);
    }

    return locales;
  }

  findCaption(model: metadata.Model, propertyName: string): string {
    let attrs = [];
    for (let projection of model.projections) {
      attrs = projection.attrs.filter(a => a.name === propertyName);
      if (attrs.length === 0) {
        attrs = projection.belongsTo.filter(b => b.name === propertyName);
      }

      if (attrs.length === 0) {
        attrs = projection.hasMany.filter(b => b.name === propertyName);
      }

      if (attrs.length !== 0) {
        break;
      }
    }

    return attrs.length === 1 ? attrs[0].caption : null;
  }

  fillValidationTranslations(locales: Map<string[]>, attrName: string, caption: string) {
    let translation = `${attrName}: {\n${TAB + TAB + TAB}__caption__: '${this.escapeValue(caption)}',\n${TAB + TAB}}`;
    let otherTranslation = `${attrName}: {\n${TAB + TAB + TAB}__caption__: '${this.escapeValue(attrName)}',\n${TAB + TAB}}`;

    locales[this.currentLocale].push(translation);
    for (let locale of this.locales) {
      locales[locale].push(otherTranslation);
    }
  }

}

class SortedPair {
  index: number;
  str: string;
  strOtherLocales: string;

  constructor(index: number, str: string, strOtherLocales: string) {
    this.index = index;
    this.str = str;
    this.strOtherLocales = strOtherLocales;
  }
}

interface Map<T> {
  [K: string]: T;
}
