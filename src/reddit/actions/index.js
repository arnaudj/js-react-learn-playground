import { createAction } from "redux-actions";

export const ActionTypes = {
  FETCH_POSTS_IF_NEEDED: "FETCH_POSTS_IF_NEEDED"
};

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
export const fetchPostsIfNeeded = createAction(
  ActionTypes.FETCH_POSTS_IF_NEEDED
);
