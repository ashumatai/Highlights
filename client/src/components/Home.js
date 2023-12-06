import React from 'react';
import '../App.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Home = () => {
  return (
    <div>
      <p className='margin-10'>
        With the popularity of the Marvel Cinematic Universe, and the games associated therewith,
        wouldn't you like to collect Events? Well, the wait ends here.
        Presenting Marvel's List Web App, powered by the Marvel API.
        This web app is built using React-Redux, GraphQL and Redis.
      </p>

      <p className='hometext'>
        The application displays Marvel's events and allows you to create Lists and Collect events.
        The following rules apply:{' '}
        <ol className='list-elem'>
          <li>
            <span>A list can have at most 10 events in their collection</span>         
          </li>

          <li>
            <span>To add a event, you must first select a list from the list page</span>
          </li>

          <li>
            <p>
              If you have already selected a event for your currently selected list,
              you may give up the event
            </p>          
          </li>

          <li>
            <span>Lists can only be deleted if they aren't currently selected</span>
          </li>

          <li>
            <span>You may also search for events from the events page</span>         
          </li>

          <li>
            <p>
              You may choose a event by clicking on the <PersonAddIcon /> icon
              and give up a event by clicking on the <PersonRemoveIcon /> icon
            </p>
          </li>
        </ol>
      </p>
      <p>
        That's it! Try out the app for yourself and have fun!
      </p>
    </div>
  );
};

export default Home;
