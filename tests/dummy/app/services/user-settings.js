import UserSettingsService from 'ember-flexberry/services/user-settings';

export default UserSettingsService.extend({

  /**
    @property currentUser
    @type String
    @default 'admin'
    @for EditFormRoute
  **/
  userName: 'admin',
  /**

    Returns current user name.
    Method must be overridden if application uses some authentication.

    @method getCurrentUser
    @return {String} Current user name.
  */
  getCurrentUser() {
    // TODO: add mechanism to return current user.
    let user = this.get('userName');
    return user;
  }

});


