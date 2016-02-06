/*jshint node:true*/
var fs = require("fs");
var stripBom = require("strip-bom");
var format = require("string-format");

module.exports = {
    locals: function (options) {
        var content = stripBom(fs.readFileSync(options.entity.options.file, "utf8"));
        var model = JSON.parse(content);
        var attrs = [], validations = [], projections = [];
        var idx, idx2, idx4, attr;
        for (idx in model.attrs) {
            attr = model.attrs[idx];
            attrs.push(format("{0.name}: DS.attr('{0.type}')", attr));
            if (attr.notNull) {
                if (attr.type === "date") {
                    validations.push(format("{0.name}: {{ datetime: true }}", attr));
                } else {
                    validations.push(format("{0.name}: {{ presence: true }}", attr));
                }
            }
        }
        for (idx in model.belongsTo) {
            attrs.push(format("{0.name}: DS.belongsTo('{0.relatedTo}', {{ inverse: null, async: false }})", model.belongsTo[idx]));
        }
        for (idx in model.hasMany) {
            attrs.push(format("{0.name}: DS.hasMany('{0.relatedTo}', {{ inverse: null, async: false }})", model.hasMany[idx]));
        }
        validations = validations.join(",\n ");
        attrs.push(format("validations: {{ \n {0} \n }}", validations));

        attrs = attrs.join(",\n ");

        for (idx in model.projections) {
            var proj = model.projections[idx];
            var projAttrs = [];
            for (idx2 in proj.attrs) {
                projAttrs.push(declareProjAttr(proj.attrs[idx2]));
            }
            for (idx2 in proj.belongsTo) {
                projAttrs.push(joinProjBelongsTo(proj.belongsTo[idx2]));
            }
            for (idx2 in proj.hasMany) {
                var hasMany = proj.hasMany[idx2];
                var hasManyAttrs = [];
                for (idx4 in hasMany.attrs) {
                    hasManyAttrs.push(declareProjAttr(hasMany.attrs[idx4]));
                }
                hasManyAttrs = hasManyAttrs.join(",\n ");
                projAttrs.push(format("{0.name}: Proj.hasMany('{0.relatedTo}', '{0.caption}', {{ \n{1} \n}})", hasMany, hasManyAttrs));
            }
            projAttrs = projAttrs.join(",\n ");
            projections.push(format("Model.defineProjection('{0.name}', '{0.modelName}', {{ \n{1}\n}});", proj, projAttrs));
        }
        
        projections = projections.join("\n ");

        content = "var Model = BaseModel.extend({\n" + attrs +"\n});"+ projections+"\nexport default Model;";

        return {
            content: content
        };
  }
};

function declareProjAttr(attr) {
    var hidden = "";
    if (attr.hidden) {
        hidden = ", { hidden: true }";
    }
    return format("{0.name}: Proj.attr('{0.caption}'{1})", attr, hidden);
}


function joinProjBelongsTo(belongsTo) {
    var belongsToAttrs = [];
    var idx3;
    var hidden = "";
    for (idx3 in belongsTo.attrs) {
        belongsToAttrs.push(declareProjAttr(belongsTo.attrs[idx3]));
    }
    for (idx3 in belongsTo.belongsTo) {
        belongsToAttrs.push(joinProjBelongsTo(belongsTo.belongsTo[idx3]));
    }
    hidden = "";
    if (belongsTo.hidden) {
        hidden=", { hidden: true }";
    }
    belongsToAttrs = belongsToAttrs.join(",\n ");
    var ret = format("{0.name}: Proj.belongsTo('{0.relatedTo}', '{0.caption}', {{ \n{1} \n}}{2})", belongsTo, belongsToAttrs, hidden);
    return ret;
}

