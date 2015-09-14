export default {
  // Supports OData v4 only.
  get: function(projection, store) {
    var tree = getODataQueryTree(projection, store);
    var query = getODataQuery(tree);
    return query;
  }
};

function getODataQueryTree(projection, store) {
  let serializer = store.serializerFor(projection.modelName);
  let tree = {
    select: [serializer.primaryKey],
    expand: {}
  };

  let attributes = projection.attributes;
  for (let attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      let attr = attributes[attrName];
      let normalizedAttrName = serializer.keyForAttribute(attrName);
      switch (attr.kind) {
        case 'attr':
          tree.select.push(normalizedAttrName);
          break;

        case 'hasMany':
        case 'belongsTo':
          tree.select.push(normalizedAttrName);
          tree.expand[normalizedAttrName] = getODataQueryTree(attr, store);
          break;

        default:
          throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }
  }

  return tree;
}

function getODataQuery(queryTree) {
  var query = {};

  var select = getODataSelectQuery(queryTree);
  if (select) {
    query.$select = select;
  }

  var expand = getODataExpandQuery(queryTree);
  if (expand) {
    query.$expand = expand;
  }

  return query;
}

function getODataExpandQuery(queryTree) {
  var expandProperties = Object.keys(queryTree.expand);
  if (!expandProperties.length) {
    return null;
  }

  var query = [];
  expandProperties.forEach(function(propertyName) {
    var subTree = queryTree.expand[propertyName];
    var expr = propertyName;
    var select = getODataSelectQuery(subTree);
    var expand = getODataExpandQuery(subTree);

    if (select || expand) {
      expr += '(';
      if (select) {
        expr += '$select=' + select;
      }

      if (expand) {
        expr += ';' + '$expand=' + expand;
      }

      expr += ')';
    }

    query.push(expr);
  });

  return query.join(',');
}

function getODataSelectQuery(queryTree) {
  if (queryTree.select.length) {
    return queryTree.select.join(',');
  } else {
    return null;
  }
}
