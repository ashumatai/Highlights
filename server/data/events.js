const {
  checkString,
  badRequestError,
  notFoundError,
  checkID,
  internalServerError,
  getFormattedEvent,
  checkPageNum,
  unauthorizedError,
} = require("../helpers");
const { event } = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const getAllEvents = async (page = 1) => {
  // Validations
  try {
    if (page && typeof page == "string") {
      checkString(page);
      page = parseInt(page?.trim());
    } else if (page && typeof page == "number") {
      checkPageNum(page);
    } else page = 1;
  } catch (err) {
    throw badRequestError(err);
  }

  if (typeof page == "string") page = parseInt(page.trim());

  // DB
  try {
    const eventCollection = await event();
    const eventsFound = await eventCollection
      .find({})
      .skip((page - 1) * 50)
      .limit(50)
      .toArray();
    if (!eventsFound || eventsFound.length <= 0)
      throw notFoundError(`there are no more events on page ${page}`);
    // eventsFound.forEach((event) => {
    //   event = getFormattedEvent(event);
    // });
    return eventsFound;
  } catch (err) {
    throw err;
  }
};

const getEventByID = async (id) => {
  // Validations
  try {
    checkID(id);
  } catch (err) {
    throw badRequestError(err);
  }

  id = id.trim();
  // DB
  try {
    const eventCollection = await event();
    const eventFound = await eventCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!eventFound) throw notFoundError(`Event with given ID not found`);
    // return getFormattedEvent(eventFound);
    return eventFound;
  } catch (err) {
    throw err;
  }
};

const createEvent = async (
  name,
  image = "https://media.bizj.us/view/img/12225690/2810006-enhanced*1200xx8000-4500-0-750.jpg",
  description,
  date,
  location,
  userThatPosted
) => {
  // Validations
  try {
    checkString(name);
    checkString(description);
    checkDate(date);
    checkString(location);
  } catch (err) {
    throw badRequestError(err);
  }

  name = name.trim();
  location = location.trim().toUpperCase();

  // DB
  try {
    const eventCollection = await event();

    const titleAlreadyTaken = await eventCollection.findOne({ name: name });
    if (titleAlreadyTaken) {
      throw badRequestError(`Event with name ${name} already exists!`);
    }
    userThatPosted._id = new ObjectId(userThatPosted._id);
    let newEvent = {
      name,
      image,
      description,
      location,
      date,
      userThatPosted,
      comments: [],
      likes: [],
    };
    const insertedEvent = await eventCollection.insertOne(newEvent);
    if (!insertedEvent.insertedId) {
      throw internalServerError(`Event could not be created`);
    } else {
      let fetchedEvent = await getEventByID(
        insertedEvent.insertedId.toString()
      );
      return getFormattedEvent(fetchedEvent);
    }
  } catch (err) {
    throw err;
  }
};

const createComment = async (id, comment, userDetails) => {
  // Validations
  try {
    checkID(id);
    checkString(comment);
  } catch (err) {
    throw badRequestError(err);
  }

  // DB
  try {
    const eventCollection = await event();
    const newComment = {
      _id: new ObjectId(),
      comment,
      userThatPostedComment: userDetails,
    };
    const foundEvent = await eventCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundEvent) throw notFoundError("Event with given ID not found");
    const updatedEvent = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: newComment } }
    );
    if (updatedEvent?.acknowledged && updatedEvent?.modifiedCount === 1) {
      const fetchedEvent = await getEventByID(id);
      if (!fetchedEvent) throw notFoundError("Could not find event");
      return fetchedEvent;
    } else {
      throw internalServerError("Failed to add comment to event");
    }
  } catch (err) {
    throw err;
  }
};

const updateEventById = async (id, updateObj, userId) => {
  try {
    checkID(id);
    if (updateObj.name) checkString(updateObj.name);
    if (updateObj.description) checkString(updateObj.description);
    if (updateObj.location)
      checkString(updateObj.location);
    if (updateObj.image) checkString(updateObj.image);
    if (updateObj.date) checkDate(updateObj.date);
  } catch (err) {
    throw badRequestError(err);
  }

  id = id.trim();
  userId = userId.toString().trim();
  if (updateObj.name) updateObj.name = updateObj.name.trim();
  if (updateObj.location)
    updateObj.location = updateObj.location
      .trim()
      .toUpperCase();

  try {
    const eventCollection = await event();
    const existingEvent = await getEventByID(id);
    if (existingEvent.userThatPosted._id.toString() !== userId) {
      throw unauthorizedError("Only the user that created the event can update it!");
    }
    const updateInfo = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj }
    );
    if (updateInfo?.acknowledged && updateInfo?.modifiedCount === 1) {
      const fetchedEvent = await getEventByID(id);
      if (!fetchedEvent) throw notFoundError("Could not find event");
      return fetchedEvent;
    } else if (updateInfo?.acknowledged) {
      throw badRequestError("No fields were changed, please check input");
    } else {
      throw internalServerError("Event update failed");
    }
  } catch (err) {
    throw err;
  }
};

const updateLikes = async (id, loggedInUserID) => {
  try {
    checkID(id);
  } catch (err) {
    throw badRequestError(err);
  }

  try {
    const eventCollection = await event();
    const fetchedEvent = await getEventByID(id);

    if (!fetchedEvent)
      throw notFoundError("Could not find event with that ID");
    let likes = fetchedEvent.likes.map((like) => {
      return (like = like.toString());
    });

    let updateInfo;
    if (likes.includes(loggedInUserID)) {
      updateInfo = await eventCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $pull: { likes: new ObjectId(loggedInUserID) },
        }
      );

      if (updateInfo?.acknowledged && updateInfo?.modifiedCount === 1) {
        return await getEventByID(id.toString());
      } else {
        throw internalServerError("Could not dislike event");
      }
    } else {
      updateInfo = await eventCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $push: { likes: new ObjectId(loggedInUserID) },
        }
      );
      if (updateInfo?.acknowledged && updateInfo?.modifiedCount === 1) {
        return await getEventByID(id.toString());
      } else {
        throw internalServerError("Could not like event");
      }
    }
  } catch (err) {
    throw err;
  }
};

const deleteCommentById = async (eventId, commentId, userId) => {
  try {
    checkID(eventId);
    checkID(commentId);
  } catch (err) {
    throw badRequestError(err);
  }

  eventId = eventId.toString().trim();
  commentId = commentId.toString().trim();
  userId = userId.toString().trim();

  try {
    const eventCollection = await event();
    const fetchedEvent = await getEventByID(eventId);
    fetchedEvent.comments.forEach((comment) => {
      if (comment._id.toString() === commentId && comment.userThatPostedComment._id.toString() !== userId) {
        throw unauthorizedError("Only the user that posted the comment can delete it");
      }
    });

    const updatedEvent = await eventCollection.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $pull: {
          comments: {
            _id: new ObjectId(commentId),
          },
        },
      }
    );
    if (updatedEvent?.acknowledged && updatedEvent?.modifiedCount === 1) {
      return await getEventByID(eventId);
    } else if (updatedEvent?.acknowledged) {
      throw notFoundError("Comment not found");
    } else {
      throw internalServerError("Could not delete comment");
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllEvents,
  getEventByID,
  createEvent,
  updateEventById,
  updateLikes,
  deleteCommentById,
  createComment,
};
