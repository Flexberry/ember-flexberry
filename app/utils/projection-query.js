export default {
  // Supports OData v4 only.
  get: function(projection, serializer) {
    var tree = getODataQueryTree(projection, serializer);
    var query = getODataQuery(tree);
    return query;
  }
};

function getODataQueryTree(projection, serializer) {
  var tree = {
    select: [serializer.primaryKey],
    expand: {}
  };
  var expanders = [projection.masters, projection.details];

  if (projection.properties) {
    projection.properties.forEach(function(prop) {
      tree.select.push(serializer.keyForAttribute(prop));
    });
  }

  expanders.forEach(function(expander) {
    if (!expander) {
      return;
    }

    for (var propertyName in expander) {
      if (expander.hasOwnProperty(propertyName)) {
        var normalizedPropName = serializer.keyForAttribute(propertyName);
        var expanderProjection = expander[propertyName];
        tree.expand[normalizedPropName] = getODataQueryTree(expanderProjection, serializer);
      }
    }
  });

  return tree;
}

function getODataQuery(queryTree) {
  var query = {};

  var select = getODataSelectQuery(queryTree);
  if (select) {
    query.$select = select;
  }

  // TODO: detect by embedded\async relationships mode for model attr (serializer attrs?).
  // FIXME: commented out for async relationships working.
  /*var expand = getODataExpandQuery(queryTree);
  if (expand) {
    query.$expand = expand;
  }*/

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
