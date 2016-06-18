// not all browser do not yet support the new "fetch" api,
// we use this package
import fetch from 'isomorphic-fetch'

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

// Action governed by the user
export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

// Action governed by the user
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

// Action governed by network requests
export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

// Action governed by network requests
export function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

// This action actually uses redux-thunk
// This way we can set up a function which dispatches 
// action asynchronously
// UPD no longer exported, called by the exported generic function
// fetchPostsIfNeeded below
/* export */function fetchPosts(subreddit) {

  // We're actually returning a function!
  // Thanks to the thunk middleware from redux-thunk,
  // the app knows how to handle functions  
  return function (dispatch) {

    // Dispatch the action to request posts, so that the state is 
    // updated accordingly (ie show spinner)
    dispatch(requestPosts(subreddit));

    // Return a promise
    // Please note: string interpolation, so we use backticks
    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())

      // Now we get the json, dispatch action to update the state
      // with the result of the api call
      .then(json => dispatch(receivePosts(subreddit, json)))
  }

  // No error handling...
}

// Check if we are to fetch posts
function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

// Fetch posts if needs to
export function fetchPostsIfNeeded(subreddit) {

  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    // pass the current state to shouldFetchPosts 
    if (shouldFetchPosts(getState(), subreddit)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchPosts(subreddit));
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  }
}