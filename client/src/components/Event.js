import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Link, useParams } from "react-router-dom";
import noImage from "../img/download.jpeg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import actions from "../actions";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Tooltip,
} from "@mui/material";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";

const Event = (props) => {
  let { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_CHARACTER, {
    fetchPolicy: "no-cache",
    variables: { getEventId: id },
  });
  const eventData = data?.getEvent ?? {};
  const listState = useSelector((state) => state.lists ?? {});
  const selectedList = listState?.selectedList ?? {};
  const dispatch = useDispatch();

  const handleAddEvent = (event) => {
    if (selectedList?.events?.length < 10) {
      dispatch(actions.chooseEvent(event));
    } else {
      console.log("Selected list already has 10 events");
    }
  };

  const handleRemoveEvent = (event) => {
    if (selectedList?.events?.length > 0) {
      dispatch(actions.giveUpEvent(event));
    } else {
      console.log("Selected list does not have that event to give up");
    }
  }; 

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>Error: {error?.message ?? error}</h2>
      </div>
    );
  } else {
    return (
      <Card
        variant="outlined"
        sx={{
          maxWidth: 550,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #1e8678",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        }}
        key={eventData.id}
      >
        <CardHeader
          title={eventData.name}
          sx={{
            borderBottom: "1px solid #1e8678",
            fontWeight: "bold",
          }}
        />
        <CardMedia
          component="img"
          image={
            eventData?.image &&
            eventData.image !== "image_not_available"
              ? eventData.image
              : noImage
          }
          title="event image"
        />

        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="span"
            sx={{
              borderBottom: "1px solid #1e8678",
              fontWeight: "bold",
            }}
          >
            <dl>
              {eventData?.description ? (
                <p>
                  <dt className="title">Description:</dt>
                  <dd>{eventData.description}</dd>
                </p>
              ) : (
                <></>
              )}
            </dl>
            <dl>
              {selectedList &&
              selectedList?.events?.findIndex(
                (x) => x.id === eventData.id
              ) > -1 ? (
                <Tooltip title="Give up from collection" onClick={() => handleRemoveEvent(eventData)} className="event-title">
                  <span>Give up event<PersonRemoveIcon /></span>
                </Tooltip>
              ) : selectedList?.events?.length < 10 ? (
                <Tooltip title="Add to collection" onClick={() => handleAddEvent(eventData)} className="event-title">
                  <span>Add event<PersonAddIcon /></span>
                </Tooltip>
              ) : <></>}
            </dl>
            <Link to="/marvel-events/page/1">
              Back to all events...
            </Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Event;
