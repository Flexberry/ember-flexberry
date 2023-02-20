// Create record.
const createRecord = function(store, model, prop, id, data) {
  const record = store.createRecord(model, {
    id: id
  });

  record.set(`${prop}`, `${data} ${id}`);

  return record.save();
};

export {
  createRecord
};
