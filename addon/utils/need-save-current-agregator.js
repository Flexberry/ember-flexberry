import { getOwner } from '@ember/application';

export default function needSaveCurrentAgregator(agragatorModel) {
  let store = getOwner(this).lookup('service:store');
  let agregatorIsOfflineModel = agragatorModel && store.get('offlineModels') && store.get(`offlineModels.${agragatorModel.constructor.modelName}`);

  return (!this.get('offlineGlobals.isOnline') && agragatorModel) || (this.get('offlineGlobals.isOnline') && agregatorIsOfflineModel);
}
