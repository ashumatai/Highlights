import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import axios from "axios";
import apiRoutes from "../apiRoutes";
import { Link, useParams } from "react-router-dom";
import Search from "./Search";
import noImage from "../img/download.jpeg";
import {
  Alert,
  AlertTitle,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Tooltip,
  Typography
} from "@mui/material";

import "../App.css";
import Pagination from "./Pagination";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";

const Events = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const [pageNum, setPageNum] = useState(!isNaN(params?.pagenum) ? Number(params.pagenum) : 1);
  const [data, setData] = useState({});
  // const {loading, error, data, refetch} = useQuery(queries.GET_CHARACTERS_LIST, {
  //   fetchPolicy: "no-cache", variables : { pageNum: pageNum, searchTerm: searchTerm }
  // });
  const listState = useSelector((state) => state?.lists ?? {});
  const selectedList = listState?.selectedList ?? {};
  const eventList = data?.eventList ?? [];
  const dispatch = useDispatch();
  console.log("DATA:", data);

  let card = null;

  const handleAddEvent = (event) => {
    if (!selectedList) {
      setShowAlert("No list selected - select one from the lists page");
      setTimeout(() => {setShowAlert(false)}, 5000);
    }
    if (selectedList?.events?.length < 10) {
      dispatch(actions.chooseEvent(event));
    } else {
      console.log("Selected list already has 10 events");
      setShowAlert("Selected list already has 10 events");
      setTimeout(() => {setShowAlert(false)}, 5000);
    }
  };

  const handleRemoveEvent = (event) => {
    if (selectedList?.events?.length > 0) {
      dispatch(actions.giveUpEvent(event));
    } else {
      console.log("Selected list does not have that event to give up");
      setShowAlert("Selected list does not have that event to give up");
      setTimeout(() => {setShowAlert(false)}, 5000);
    }
  }; 

  const handleRefetch = async () => {
    await refetch({
      pageNum: pageNum,
      searchTerm: ""
    });
  };

  const refetcher = () => {
    handleRefetch();
  };

  useEffect(()=> {
    const fetchEvents = async () => {
      const eventsData = await axios.get(apiRoutes.getAllEvents);
      return eventsData;
    }
    setData(fetchEvents());
  }, [])


  useEffect(() => {
    console.log(pageNum);
  }, [pageNum])

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        await refetch({
          searchTerm: searchTerm
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm && searchTerm !== "") {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm, refetch]);

  useEffect(() => {
    console.log("pagination useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch pageNum: ${pageNum}`);
        await refetch({
          pageNum: pageNum
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (pageNum && Number.isInteger(Number(pageNum))) {
      console.log("searchTerm is set");
      fetchData();
    } else if (!Number.isInteger(Number(pageNum))) {
      setShowAlert("Page number should be an interger");
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [pageNum, refetch]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (event) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={event.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea>
            <Typography
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
              gutterBottom
              variant="h6"
              component="h3"
              className="event-title"
            >
              {event.name}
              {selectedList &&
                selectedList?.events?.findIndex(
                  (x) => x.id === event.id
                ) > -1 ? (
                  <Tooltip title="Give up from collection" onClick={() => handleRemoveEvent(event)}>
                    <PersonRemoveIcon />
                  </Tooltip>
                ) : selectedList?.events?.length < 10 ? (
                  <Tooltip title="Add to collection" onClick={() => handleAddEvent(event)}>
                    <PersonAddIcon />
                  </Tooltip>
                ) : <></>}
            </Typography>
            <Link to={`/marvel-events/${event.id}`}>
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={
                  event?.image && event.image !== "image_not_available"
                    ? event.image
                    : noImage
                }
                title="event image"
              />

              <CardContent>

                <Typography variant="body2" color="textSecondary" component="p">
                  {event?.description
                    ? event.description
                    : "No description Available"}
                  <span className="more-info">More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  // if (searchTerm) {
  //   card =
  //     searchData &&
  //     searchData.map((events) => {
  //       return buildCard(events);
  //     });
  // } else {
    card =
    eventList &&
    eventList.map((events) => {
        return buildCard(events);
      });
  // }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (<div>
      <h2>Error: {error?.message ?? error}</h2>
    </div>);
  } else {
    return (
      <div>
        <Search searchValue={searchValue} searchType="Events" refetcher={refetcher} />
        <br />
        <>{searchTerm ? <></> : <Pagination pageNum={pageNum} path="/marvel-events/page/" setPage={setPageNum}/>}</>
        <>
          {error ? (
            <h1 className="wrapped-header">Something Went Wrong - Please use the above button(s) to go to a different page</h1>
          ) : (
            <></>
          )}
        </>
        <br />
        {showAlert ? <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {showAlert}
        </Alert> : <></>}
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
};

export default Events;
