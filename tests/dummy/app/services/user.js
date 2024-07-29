import UserService from 'ember-flexberry-data/services/user';

export default UserService.extend({
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

    @method getCurrentUserName
    @return {String} Current user name.
  */
  getCurrentUserName() {
    let user = this.get('userName');
    return user;
  }
});
