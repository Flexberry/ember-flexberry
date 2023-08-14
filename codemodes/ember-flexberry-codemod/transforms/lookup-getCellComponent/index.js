const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  debugger;

  let root = j(file.source);

  // Ищем if (attr.kind === 'belongsTo').
  let attKindISbelongsTo = root.find(
    j.IfStatement, {
      test: {
        left: {
          object: {
            type: "Identifier",
            name: "attr",
          },
          property: {
            type: "Identifier",
            name: "kind"
          },
          type: "MemberExpression"
        },
        operator: "===",
        right: {
          type: "StringLiteral",
          value: "belongsTo"
        }
      }
    }
  );

  // Применяем необходимые изменения к каждому файлу.
  attKindISbelongsTo.forEach((path) => {
    const ifStatementNode = path.node;

    // Проверяем, содержит ли уже тело блока if переменную updateLookupValue.
    const ifBody = ifStatementNode.consequent.body;
    const existingUpdateLookupValueIndex = ifBody.findIndex((stmt) =>
      stmt.type === 'VariableDeclaration' &&
      stmt.declarations.some((decl) =>
        decl.id.name === 'updateLookupValue'
      )
    );

    // Если переменная updateLookupValue не существует, добавляем ее в начало.
    if (existingUpdateLookupValueIndex === -1) {
      const updateLookupValueNode = j.variableDeclaration('let', [
        j.variableDeclarator(
          j.identifier('updateLookupValue'),
          j.callExpression(
            j.memberExpression(
              j.callExpression(
                j.memberExpression(
                  j.identifier('this'),
                  j.identifier('get')
                ),
                [
                  j.stringLiteral('actions.updateLookupValue')
                ]
              ),
              j.identifier('bind')
            ),
            [
              j.thisExpression()
            ]
          )
        )
      ]);

      ifBody.unshift(updateLookupValueNode);
    }
  });

  // Ищем cellComponent.componentProperties = { };
  let cellComponentComponentProperties = attKindISbelongsTo.find(
    j.ExpressionStatement, {
      expression: {
        left: {
          object: {
            name: "cellComponent",
            type: "Identifier"
          },
          property: {
            name: "componentProperties",
            type: "Identifier"
          },
          type: "MemberExpression"
        },
        operator: "=",
        right: {
          type: "ObjectExpression"
        }
      }
    }
  );

  // Добавили строчку с получением updateLookupValue.
  cellComponentComponentProperties.forEach((property) => {
    let objectProperties = j(property).find(j.ObjectProperty);

    const updateLookupValueProperties = objectProperties.paths().find((prop) => prop.value.key.name === 'updateLookupValue');

    if (updateLookupValueProperties === undefined || updateLookupValueProperties === null) {
      objectProperties.at(objectProperties.length - 1).get().insertAfter("updateLookupValue: updateLookupValue");
    }
  });

  return root.toSource();
};

module.exports.type = 'js';
