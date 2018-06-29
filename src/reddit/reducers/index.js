import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import {
  selectSubreddit,
  requestPosts,
  receivePosts,
  invalidateSubreddit
} from "../actions";

const selectedSubreddit = handleActions(
  {
    [selectSubreddit]: (state, { payload }) => payload
  },
  "reactjs"
);

const defaultSubredditState = {
  isFetching: false,
  didInvalidate: false,
  items: []
};

const postsBySubreddit = handleActions(
  {
    [requestPosts]: (state, { payload }) => ({
      ...state,
      [payload]: {
        ...defaultSubredditState,
        isFetching: true
      }
    }),
    [invalidateSubreddit]: (state, { payload }) => ({
      ...state,
      [payload]: {
        ...defaultSubredditState,
        didInvalidate: true
      }
    }),
    [receivePosts]: (state, { payload: { subreddit, posts, receivedAt } }) => ({
      ...state,
      [subreddit]: {
        ...defaultSubredditState,
        items: posts,
        lastUpdated: receivedAt
      }
    })
  },
  []
);

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
});

export default rootReducer;
