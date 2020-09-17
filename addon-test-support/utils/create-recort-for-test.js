// Create record.
let createRecord = function(store, model, prop, id, data) {
  let record = store.createRecord(model, {
    id: id
  });

  record.set(`${prop}`, `${data} ${id}`);

  return record.save();
};

export {
  createRecord
};
