export default {
  create: function(modelName, attributes) {
    return {
      modelName: modelName,
      attributes: attributes || []
    };
  }
};
