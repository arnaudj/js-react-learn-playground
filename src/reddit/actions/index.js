import fetch from "cross-fetch";

import { createAction } from "redux-actions";

export const selectSubreddit = createAction("SELECT_SUBREDDIT");
export const requestPosts = createAction("REQUEST_POSTS");
export const receivePosts = createAction(
  "RECEIVE_POSTS",
  (subreddit, json) => ({
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  })
);
export const invalidateSubreddit = createAction("INVALIDATE_SUBREDDIT");

function fetchPosts(subreddit) {
  return dispatch => {
    const action = requestPosts(subreddit);
    dispatch(action);
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => {
        const newLocal = receivePosts(subreddit, json);
        dispatch(newLocal);
      });
  };
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit));
    }
  };
}
