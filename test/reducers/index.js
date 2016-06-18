import expect from 'expect'
// import all reducers from files within ../../src/reducers folder
// each item will be prefixed by "reducers"   
import rootReducer from '../../src/reducers'
import * as actions from '../../src/actions'

describe('Reducer', () => {

  const subreddit = 'frontend'

  it('should handle SELECT_SUBREDDIT', () => {
    
    let newState = rootReducer({}, actions.selectSubreddit(subreddit));
    
    expect(newState.selectedSubreddit).toEqual(subreddit)
  })

  it('should handle INVALIDATE_SUBREDDIT', () => {

    const currentState = {
      postsBySubreddit: {
        [subreddit]: {
          isFetching: false,
        }
      }
    }
    let newState = rootReducer(currentState, actions.invalidateSubreddit(subreddit));

    expect(newState.postsBySubreddit[subreddit]).toEqual({
      isFetching: false,
      didInvalidate: true,
    })
  })

  it('should handle REQUEST_POSTS', () => {

    const currentState = {
      postsBySubreddit: {
        [subreddit]: {
          isFetching: false,
        }
      }
    }
    let newState = rootReducer(currentState, actions.requestPosts(subreddit));
    
    expect(newState.postsBySubreddit[subreddit]).toEqual({
      isFetching: true,
      didInvalidate: false,
    })
  })

  it('should handle RECEIVE_POSTS', () => {

    const currentState = {
      selectedSubreddit: subreddit,
      postsBySubreddit: {
        [subreddit]: {
        }
      }
    }
    const frontEndPosts = [{
      data: {
        title: 'Sample title'
      }
    }, {
      data: {
        title: 'Another title'
      }
    }]
    const frontEndJson = {
      data: {
        children: frontEndPosts 
      }
    }    
    const action = actions.receivePosts(subreddit, frontEndJson)
    let newState = rootReducer(currentState, action);

    expect(newState).toEqual({
      ...currentState,
      postsBySubreddit: {
        [subreddit]:{
          ...currentState.postsBySubreddit[subreddit],
          isFetching: false,
          didInvalidate: false,
          items: frontEndPosts.map(x => x.data),
          lastUpdated: action.receivedAt
        } 
      }
    })
  })

})