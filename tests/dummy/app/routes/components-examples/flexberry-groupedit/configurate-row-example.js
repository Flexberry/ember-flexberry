import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'AggregatorE'
   */
  modelProjection: 'AggregatorE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'components-examples/flexberry-groupedit/shared/aggregator'
   */
  modelName: 'components-examples/flexberry-groupedit/shared/aggregator',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    var store = this.get('store');

    var arrRec=[];
    for (var i=1; i<20; i++){
        var newRecord = store.createRecord('components-examples/flexberry-groupedit/shared/detail',
            {
            text: i+'test',
            flag: i % 2
            });        
        arrRec.push(newRecord);
    }
    // Aggregator with details.      
    var aggregator = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator', {details:arrRec});
    return aggregator;
  }
});