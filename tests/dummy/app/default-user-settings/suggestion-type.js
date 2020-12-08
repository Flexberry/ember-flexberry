export default class UserSetting {}

UserSetting.DEFAULT = {
    colsOrder: [
      {
        propName: "name",
        name: "Name"
      },
      {
        propName: "moderated",
        name: "Moderated"
      },
      {
        propName: "parent.name",
        hide: true,
        name: "Parent"
      }
    ]
  };
