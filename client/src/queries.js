import { gql } from "@apollo/client";

const GET_EVENTS_LIST = gql`
  query EventList($pageNum: Int, $searchTerm: String) {
    EventList(pageNum: $pageNum, searchTerm: $searchTerm) {
      id
      image
      name
      description
      location
      date
    }
  }
`;

const GET_EVENT = gql`
  query GetEvent($getEventId: ID!) {
    getEvent(id: $getEventId) {
      description
      id
      image
      name
      location
      date
    }
  }
`;

let exported = {
  GET_EVENTS_LIST,
  GET_EVENT,
};

export default exported;
