import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    sort: { refreshModel: true }
  },

  /**
   * Десериализовать строку с параметрами сортировки. Ожидается строка следующего вида: '+Имя1-Имя2{...}',
   * где '+' и '-' - направления сортировки, 'ИмяX' - имя свойства для сортировки.
   *
   * @param {String} paramString Сериализованные параметры сортировки.
   * @returns {Array} Массив объектов вида { propName: 'ИмяN', direction: 'asc/desc' }, задающий свойства и
   * направления для сортировки.
   */
  deserializeSortingParam: function(paramString) {
    var result = [];
    while (paramString) {
      var direction = paramString.charAt(0) === '+' ? 'asc' : 'desc';
      paramString = paramString.substring(1, paramString.length);
      var nextIndices = this.getNextIndeces(paramString);
      var nextPosition = Math.min.apply(null, nextIndices);
      var propName = paramString.substring(0, nextPosition);
      paramString = paramString.substring(nextPosition);

      result.push({
        propName: propName,
        direction: direction
      });
    }

    return result;
  },

  getNextIndeces: function(paramString) {
    var nextIndices = ['+', '-'].map(function(element) {
      var pos = paramString.indexOf(element);
      return pos === -1 ? paramString.length : pos;
    });

    return nextIndices;
  },

  includeSorting: function(model, sorting, userSettings) {
    model.set('userSettings', userSettings);
    model.set('sorting', sorting);
    return model;
  }
});
