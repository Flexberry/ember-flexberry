export default {
  projections: {
    CommentE: {
      text: {
        __caption__: 'Текст комментария'
      },
      userVotes: {
        voteType: {
          __caption__: 'Тип голосования'
        },
        applicationUser: {
          __caption__: 'Пользователь',
          name: {
            __caption__: 'Наименование'
          }
        }
      },
    }
  }
};
