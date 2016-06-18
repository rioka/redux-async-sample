import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, 
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, 
  RECEIVE_POSTS
} from '../actions'

// Reducers
function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

// Internal reducers to handle actions for posts
function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    // if the current content is to be marked as stale,
    // update the state to signal data should be reloaded
    case INVALIDATE_SUBREDDIT:
      // needs 
      // npm install --save-dev babel-plugin-transform-object-rest-spread
      return { ...state, didInvalidate: true }
    // if we want to get get posts from the service,
    // signal that we are fetching new data
    case REQUEST_POSTS:
      return { ...state, isFetching: true, didInvalidate: false }
    // we have received the response from the service
    // update the state with the received data
    case RECEIVE_POSTS:
      return { ...state, 
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

// Reducer for action related to posts:
// pass control to the internal reducer, returning a 
// new updated state
function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      // return a new state, merging the current one with
      // the updates
      return { ...state, 
        // Please note we're using ES6 computed property syntax,
        // will be computed as the property name  
        [action.subreddit]: posts(state[action.subreddit], action)
      }
    default:
      return state
  }
}

// Combine the reducers into the final one
const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

// ... and export it
export default rootReducer