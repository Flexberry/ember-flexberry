import Ember from 'ember';

export default function getCurrentAgregator() {
  let detailInteractionService = Ember.getOwner(this).lookup('service:detail-interaction');
  let agragatorModel = detailInteractionService.getLastValue('modelCurrentAgregators');
  return agragatorModel;
}
