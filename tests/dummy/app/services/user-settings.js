import UserSettingsService from 'ember-flexberry/services/user-settings';

export default UserSettingsService.extend({
  /**
    @property userName
    @type String
    @default 'admin'
    @for _userSettingsService
  **/
  userName: 'admin',

  /**
    Returns current user name.
    Method must be overridden if application uses some authentication.

    @method getCurrentUser
    @return {String} Current user name.
  */
  getCurrentUser() {
    let user = this.get('userName');
    return user;
  }
});
