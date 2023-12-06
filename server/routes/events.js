const express = require("express");
const {
  getEventByID,
  createEvent,
  updateEventById,
  updateLikes,
  deleteCommentById,
  getAllEvents,
  createComment,
} = require("../data/events");
const {
  checkID,
  checkString,
  checkDate,
  notFoundError,
  unauthorizedError,
  badRequestError,
  internalServerError,
} = require("../helpers");
const router = express.Router();

const { ObjectId } = require("mongodb");


router
  .route("/")
  .get(async (req, res) => {
    try {
      let page = req?.query?.page ?? null;
      if (!page) page = 1;
      
      let fetchedEvents = await getAllEvents(page);
      if (!fetchedEvents) throw notFoundError("there are no more events");
      return res.status(200).json(fetchedEvents);
    } catch (err) {
      return res
        .status(err?.status ?? 500)
        .json({ error: err?.message ?? err ?? "Internal Server error" });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, location, description, date, image } = req.body;
      checkString(name);
      checkString(location);
      checkString(description);
      checkDate(date);
      checkString(image);
    } catch (err) {
      return res.status(err?.status ?? 400).json({
        error: err?.message ?? err ?? "Bad Request: Please check the inputs",
      });
    }

    try {
      const { name, location, description, date, image } = req.body;
      const userThatPosted = req.session.user;
      delete userThatPosted.name;
      const newlyCreatedEvent = await createEvent(
        name,
        image,
        location,
        date,
        description,
        userThatPosted
      );

      if (!newlyCreatedEvent) throw `Could not create event`;
      
      return res.status(200).json(newlyCreatedEvent);
    } catch (err) {
      return res
        .status(err?.status ?? 500)
        .json({ error: err?.message ?? err ?? "Internal Server error" });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      checkID(id);
    } catch (err) {
      return res.status(err?.status ?? 400).json({
        error: err?.message ?? err ?? "Bad Request: Please check the ID",
      });
    }

    try {
      const id = req.params.id;

      const event = await getEventByID(id);
      if (!event)
        return res
          .status(404)
          .json({ error: "Could not find event with given id" });
      return res.status(200).json(event);
    } catch (err) {
      return res
        .status(err?.status ?? 500)
        .json({ error: err?.message ?? err ?? "Internal Server error" });
    }
  })
  .patch(async (req, res) => {
    try {
      const id = req.params.id;
      checkID(id);

      if (req.body.name) checkString(req.body.name);
      if (req.body.location) checkString(req.body.location);
      if (req.body.description)
        checkString(req.body.description);
      if (req.body.date) checkDate(req.body.date);
      if (Object.keys(req.body).length === 0)
        throw badRequestError(
          "Patch request requires atleast 1 field in request body"
        );
      if (req.body.comments || req.body.likes || req.body.userThatPosted)
        throw badRequestError(
          "Cannot change comments, likes or userThatPosted with this call"
        );
    } catch (err) {
      return res.status(err?.status ?? 400).json({
        error: err?.message ?? err ?? "Bad Request: Please check the ID",
      });
    }

    try {
      const id = req.params.id;
      const event = await getEventByID(id);
      if (!event) throw notFoundError("Event not found");
      if (
        event.userThatPosted._id.toString() !== req.session.user._id.toString()
      )
        throw unauthorizedError(
          "Only the user that created the event can make changes!"
        );

      const updateObj = {};
      if (req.body.name) updateObj.name = req.body.name.trim();
      if (req.body.image) updateObj.image = req.body.image.trim();
      if (req.body.location) updateObj.location = req.body.location.trim();
      if (req.body.description)
        updateObj.description = req.body.description.trim();
      if (req.body.date) updateObj.date = req.body.date.trim();

      const updatedEvent = await updateEventById(id, updateObj, req.session.user._id.toString());
      if (!updatedEvent) throw notFoundError("Could not update event");

      return res.status(200).json(updatedEvent);
    } catch (err) {
      return res
        .status(err?.status ?? 500)
        .json({ error: err?.message ?? err ?? "Internal Server error" });
    }
  });

router.route("/:id/likes").post(async (req, res) => {
  try {
    const id = req.params.id;
    checkID(id);
  } catch (err) {
    return res.status(err?.status ?? 400).json({
      error: err?.message ?? err ?? "Bad Request: Please check the ID",
    });
  }

  try {
    const id = req.params.id;
    const loggedInUserID = req.session.user._id.toString();
    const fetchedEvent = await getEventByID(id);
    if (!req?.session?.user)
      throw unauthorizedError("Unauthenticated: You must be logged in!");

    // if (!fetchedEvent)
    //   throw notFoundError("Could not find event with that ID");
    // let likes = fetchedEvent.likes;
    // if (likes.includes(loggedInUserID)) {
    //   likes.splice(likes.indexOf(loggedInUserID), 1);
    // } else {
    //   likes.push(loggedInUserID);
    // }
    const updatedLikesOnEvent = await updateLikes(id, loggedInUserID);
    if (!updatedLikesOnEvent)
      throw internalServerError("Could not update likes on the event");

    return res.status(200).json(updatedLikesOnEvent);
  } catch (err) {
    return res
      .status(err?.status ?? 500)
      .json({ error: err?.message ?? err ?? "Internal Server Error" });
  }
});

router.route("/:id/comments").post(async (req, res) => {
   try {
     const id = req.params.id;
    checkID(id);
  } catch (err) {
    return res
      .status(err?.status ?? 404)
      .json({
        error: err?.message ?? err ?? "Bad Request: Please check the IDs",
      });
  }

  try {
    const id = req.params.id;
    const { _id, username } = req.session.user;
    const comment = req.body.comment;
    const userDetails = { _id: new ObjectId(_id), username };
    const commentUpdate = await createComment(id, comment, userDetails);
    if (!commentUpdate) throw internalServerError("Could not add comment to the event");

    return res.status(200).json(commentUpdate);
  } catch (err) {
    return res.status(err?.status ?? 500).json({ error: err?.message ?? err ?? "Internal Server Error" });
  }
});

router.route("/:eventId/:commentId").delete(async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const commentId = req.params.commentId;
    checkID(eventId);
    checkID(commentId);
  } catch (err) {
    return res
      .status(err?.status ?? 404)
      .json({
        error: err?.message ?? err ?? "Bad Request: Please check the IDs",
      });
  }

  try {
    const eventId = req.params.eventId;
    const commentId = req.params.commentId;
    const userId = req.session?.user?._id?.toString();

    const deleteComment = await deleteCommentById(eventId, commentId, userId);
    if (!deleteComment) throw notFoundError("Comment not found!");

    return res.status(200).json(deleteComment);
  } catch (err) {
    return res
      .status(err?.status ?? 500)
      .json({ error: err?.message ?? err ?? "Internal Server Error" });
  }
});

module.exports = router;
