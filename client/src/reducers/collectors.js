import {v4 as uuid} from 'uuid';
import lodash from "lodash";
const initalState = {
  lists: [],
  selectedList: {}
};

const listReducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CREATE_NEW_SAVE_LIST':
      console.log("TYPE:", type, "PAYLOAD:", payload);
      return {...state, 
        lists: [...state.lists,
          {
            id: uuid(),
            name: payload?.listName ?? null,
            events: [],
          }
        ]
      };

    case 'SELECT_SAVE_LIST':
      console.log("TYPE:", type, "PAYLOAD:", payload);
      return {
        ...state,
        selectedList: payload?.list ?? state.selectedList,
      };

    case 'GIVE_UP_EVENT':
      console.log("TYPE:", type, "PAYLOAD:", payload);
      const { lists, selectedList } = state;
      const copyListList = lodash.cloneDeep(lists);
      const copySelectedList = lodash.cloneDeep(selectedList);
      const listIndex = copyListList.findIndex((x) => x.id === copySelectedList.id);

      const eventIndex = copySelectedList.events.findIndex((x) => x.id === payload.event.id);
      if (eventIndex > -1 && listIndex > -1) {
        copySelectedList.events.splice(eventIndex, 1);
        copyListList[listIndex] = copySelectedList;
      }

      return {
        ...state,
        selectedList: copySelectedList,
        lists: [...copyListList]
      };

    case 'CHOOSE_EVENT':
      console.log("TYPE:", type, "PAYLOAD:", payload);
      const { event } = payload;
      const { selectedList: sC, lists: c } = state;
      const cIndex = c.findIndex((x) => x.id === sC.id);
      const copySelected = lodash.cloneDeep(sC);
      const copyLists = lodash.cloneDeep(c);
      if (sC.events.length < 10 && !sC.events.some((elem) => elem.id === event.id) && cIndex > -1) {
        copySelected.events.push(event);
        copyLists[cIndex] = copySelected;
      }
      return { ...state, lists: [...copyLists], selectedList: copySelected };

    case 'DELETE_SAVE_LIST':
      console.log("TYPE:", type, "PAYLOAD:", payload);
      const { list } = payload;
      const { lists: cL, selectedList: stC } = state;
      const copyCL = lodash.cloneDeep(cL);
      const collIndex = copyCL.findIndex(x => x.id === list.id);
      if(list.id !== stC.id && collIndex > -1) {
        copyCL.splice(collIndex, 1);
      }
      return {
        ...state,
        lists: [...copyCL],
      };
    
    default:
      return state;
  }
};

export default listReducer;