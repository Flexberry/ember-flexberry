// Добавление пары ключ-значение для свойства updateLookupValue
function updateLookupValueProperty(node, builders) {
  const updateLookupValuePair = builders.pair(
    'updateLookupValue',
    builders.sexpr(builders.path('action'), [builders.string('updateLookupValue')])
  );

  if (node.hash) {
    const hashPairs = node.hash.pairs;
    const hasUpdateLookupValue = hashPairs.some((pair) => pair.key === 'updateLookupValue');

    if (!hasUpdateLookupValue) {
      hashPairs.push(updateLookupValuePair);
    }
  } else {
    node.hash = builders.hash([updateLookupValuePair]);
  }
}

// Если встречается элемент с фигурными скобками, в пути которого встречается 'flexberry-lookup',
// то для такого элемента добавляется свойство updateLookupValue
module.exports = function ({ source }, { parse, visit }) {
  const ast = parse(source);
  debugger;
  return visit(ast, (env) => {
    const { builders } = env.syntax;

    return {
      MustacheStatement(node) {
        if (node.path.original === 'flexberry-lookup') {
          updateLookupValueProperty(node, builders);
        }
        return node;
      },
    };
  });
};

module.exports.type = 'hbs';
