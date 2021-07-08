import Controller from '@ember/controller';

export default Controller.extend({

  module: 'message',

  /**
    A message can be set to visible to force itself to be shown.

    @property visible
    @type Boolean
    @default true
  */
  visible: true,

  /**
    A message can float above content that it is related to content.

    @property floating
    @type Boolean
    @default false
  */
  floating: false,

  /**
    A message can only take up the width of its content.

    @property compact
    @type Boolean
    @default false
  */
  compact: false,

  /**
    A message can be formatted to attach itself to other content.

    @property attached
    @type Boolean
    @default false
  */
  attached: false,

  /**
    A message that the user can choose to hide.

    @property closeable
    @type Boolean
    @default false
  */
  closeable: false,

  /**
    Message type.

    @property type
    @type String
    @default null
  */
  type: null,

  /**
    A message can be formatted to be different colors.

    @property color
    @type String
    @default null
  */
  color: null,

  /**
    A message can have different sizes.


    @property size
    @type String
    @default null
  */
  size: null,

  /**
    A message can contain an icon.

    @property icon
    @type String
    @default null
  */
  icon: null,

  /**
    Message title.

    @property caption
    @type String
    @default null
  */
  caption: null,

  /**
    Message body.

    @property message
    @type String
    @default null
  */
  message: null,
});
