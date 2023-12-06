const chooseEvent = (event) => ({
  type: 'CHOOSE_EVENT',
  payload: {
    event,
  }
});

const giveUpEvent = (event) => ({
  type: 'GIVE_UP_EVENT',
  payload: {
    event,
  }
});

const createNewList = (listName) => ({
  type: 'CREATE_NEW_SAVE_LIST',
  payload: {
    listName
  }
});

const selectList = (list) => ({
  type: 'SELECT_SAVE_LIST',
  payload: {
    list
  }
});

const deleteList = (list) => ({
  type: 'DELETE_SAVE_LIST',
  payload: {
    list
  }
});

const actions = {
  chooseEvent,
  giveUpEvent,
  createNewList,
  selectList,
  deleteList,
};

export default actions;