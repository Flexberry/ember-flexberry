export default class UserSetting {}

UserSetting.DEFAULT = {
    colsOrder: [
      {
        propName: "name",
        name: "Name"
      },
      {
        propName: "activated",
        name: "Activated"
      },
      {
        propName: "gender",
        name: "Gender"
      }
    ],
    sorting: [
      {
        propName: "gender",
        direction: "asc" 
      },
      {
        propName: "name",
        direction: "desc" 
      }
    ]
  };
