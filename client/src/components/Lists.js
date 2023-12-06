import React, { useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Tooltip,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";
import "../App.css";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Lists = (props) => {
  const [newListName, setNewListName] = useState(undefined);

  let card = null;

  const listsState = useSelector((state) => state?.lists ?? {});
  const lists = listsState?.lists ?? [];
  const selectedList = listsState?.selectedList ?? {};

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setNewListName(e.target.value);
  };

  const createNewList = () => {
    if (newListName && newListName.trim().length > 0) {
      dispatch(actions.createNewList(newListName));
    } else {
      console.log("New list name invalid");
    }
  };

  const handleRemoveCharacter = (event) => {
    if (selectedList?.events?.length > 0 && selectedList?.events?.findIndex(x => x.id = event.id) > -1) {
      dispatch(actions.giveUpCharacter(event));
    } else {
      console.log("Selected list does not have that event to give up");
    }
  }; 

  const selectList = (list) => {
    if (list) {
      dispatch(actions.selectList(list));
    }
  };

  const deleteList = (list) => {
    if (list) {
      dispatch(actions.deleteList(list));
    }
  };

  const eventList = (list) => {
    if (list.id === selectedList.id) {
      return list.events.map((event) => {
        return <div>{event.name}&nbsp;&nbsp;<Tooltip title="Give up" onClick={()=>handleRemoveCharacter(event)}><PersonRemoveIcon /></Tooltip></div>
      })
    } else {
      return list.events.map((event) => {
        return <div>{event.name}</div>
      })
    }
  };

  const buildCard = (list) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={list.id}>
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

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: "1px solid #1e8678",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {list.name}
                  <dl>
              {list.id !== selectedList.id ? (
                <div>
                  <Button onClick={() => selectList(list)} className="marvel-alt">Select</Button>
                  <Button onClick={() => deleteList(list)} className="marvel-alt">Delete</Button>
                </div>
              ) : (
                <></>
              )}
            </dl>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {eventList(list)}
                </Typography>
              </CardContent>
            {/* </Link> */}
          </CardActionArea>
        </Card>
      </Grid>
    );
  };


    card =
      lists &&
      lists.map((list) => {
        return buildCard(list);
      });

    return (
      <div>
        <br />
     
        <br />
        <form
          method='POST'
          onSubmit={(e) => {
            e.preventDefault();
          }}
          name='formName'
          className='center'
        >
          <label>
            <span>New List Name: </span>
            <input
              autoComplete='off'
              type='text'
              name='newListName'
              onChange={handleChange}
            />
          </label>
          <button className="marvel-alt" onClick={createNewList}>Create</button>
        </form>        
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
};

export default Lists;
