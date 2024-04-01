import { Card, Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import Textbox from "./Textbox";
import Comment from "./Comment";
import { addComment } from "../../../../store/actions/tutorialPageActions";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
const useStyles = makeStyles(() => ({
  container: {
    margin: "10px 0",
    padding: "20px",
    overflow: "unset"
  },
  bold: {
    fontWeight: "600"
  },
  comments: {
    padding: "10px 15px"
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px"
  },
  small: {
    padding: "2px"
  }
}));

const CommentBox = ({ commentsArray, tutorialId }) => {
  const classes = useStyles();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [currCommentCount, setCurrCommentCount] = useState(3);
  const handleSubmit = async comment => {
    const commentData = {
      content: comment,
      replyTo: tutorialId,
      tutorial_id: tutorialId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: "codelabzuser"
    };
    let x = await addComment(commentData)(firebase, firestore, dispatch);
    console.log("new id ", x);
    // console.log(comments.length)
    setComments(prevComments => [...prevComments, x]);
  };

  useEffect(() => {
    setComments(commentsArray===undefined?[]:commentsArray?.slice(0, currCommentCount));
    console.log("commentsarray",commentsArray);
  }, [currCommentCount, commentsArray]);

  console.log(commentsArray, comments, currCommentCount);

  const increaseCommentCount = () => {
    setCurrCommentCount(state => state + 3);
  };

  return (
    <Card
      className={classes.container}
      id="comments"
      data-testId="tutorialpageComments"
    >
      <Typography variant="h5" sx={{ fontWeight: "600" }}>
        Comments({commentsArray?.length || 0})
      </Typography>
      <Textbox handleSubmit={handleSubmit} />
      <Grid container rowSpacing={2}>
        {comments?.map((id, index) => {
          return (
            <Grid item xs={12}>
              <Comment id={id} key={index} />
            </Grid>
          );
        })}
        <Grid item container justifyContent="center">
          {comments?.length != commentsArray?.length && (
            <Button
              sx={{ textTransform: "none", fontSize: "14px" }}
              onClick={increaseCommentCount}
            >
              + Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CommentBox;
