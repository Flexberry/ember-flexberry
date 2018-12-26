import EditFormRoute from '../routes/edit-form';
import LockRouteMixin from '../mixins/lock-route';

export function initialize(appInstance) {
  let config = appInstance.application;
  if (config.lock && config.lock.enabled) {
    LockRouteMixin.reopen({
      defaultBehaviorLock: {
        openReadOnly: !!config.lock.openReadOnly,
        unlockObject: !!config.lock.unlockObject,
        lockTime: config.lock.lockTime
      },
    });
    EditFormRoute.reopen(LockRouteMixin);
  }
}

export default {
  name: 'lock',
  initialize
};
