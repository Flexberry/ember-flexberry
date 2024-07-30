import { getOwner } from '@ember/application';

export default function getCurrentAgregator() {
  let detailInteractionService = getOwner(this).lookup('service:detail-interaction');
  let agragatorModel = detailInteractionService.getLastValue('modelCurrentAgregators');
  return agragatorModel;
}
