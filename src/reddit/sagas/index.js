// https://redux-saga.js.org/docs/api/
import { put, takeEvery, select, call } from "redux-saga/effects";
import { ActionTypes, requestPosts, receivePosts } from "../actions";

function apiFetchPosts(subreddit) {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(data => data);
}

function shouldFetchPostsForSubreddit(posts) {
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function* fetchPostsIfNeeded(action) {
  const { payload: subreddit } = action;
  const posts = yield select(state => state.postsBySubreddit[subreddit]);
  if (!shouldFetchPostsForSubreddit(posts)) {
    return;
  }

  yield put(requestPosts(subreddit));
  let json;
  try {
    json = yield call(apiFetchPosts, subreddit);
  } catch (e) {
    console.error(e);
  }
  if (json) {
    yield put(receivePosts(subreddit, json));
  }
}

export default function* rootSaga() {
  yield takeEvery(ActionTypes.FETCH_POSTS_IF_NEEDED, fetchPostsIfNeeded);
}
