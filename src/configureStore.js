import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { selectSubreddit, fetchPostsIfNeeded } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  return createStore(
    // our reducer...
    rootReducer,
    // include the Redux Thunk middleware in the dispatch mechanism
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    )
  )
}
