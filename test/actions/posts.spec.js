import expect from 'expect'
// import all exports from files within ../../src/actions folder
// each item will be prefixed by "actions"   
import * as actions from '../../src/actions'
// mock http calls
import nock from 'nock'
// mock redux store
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

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

let posts = frontEndJson.data.children.map(child => child.data)

describe('Post actions', () => {

  const subreddit = 'frontend'

  it('invalidateSubreddit should create INVALIDATE_SUBREDDIT action', () => {

    let action = actions.invalidateSubreddit(subreddit)
    
    expect(action).toEqual({
      type: actions.INVALIDATE_SUBREDDIT,
      subreddit
    })
  })

  it('selectSubreddit should create SELECT_SUBREDDIT action', () => {

    let action = actions.selectSubreddit(subreddit)
    
    expect(action).toEqual({
      type: actions.SELECT_SUBREDDIT,
      subreddit
    })
  })

  it('requestPosts should create REQUEST_POSTS action', () => {
    
    let action = actions.requestPosts(subreddit)
    
    expect(action).toEqual({
      type: actions.REQUEST_POSTS,
      subreddit
    })
  })

  // When receivePosts is called, it should return an action
  // with type RECEIVE_POSTS and the details of the posts
  it('receivePosts should create RECEIVE_POSTS action', () => {
    
    const now = Date.now()
    let action = actions.receivePosts(subreddit, frontEndJson)
    
    expect(action.type).toEqual(actions.RECEIVE_POSTS)
    expect(action.subreddit).toEqual(subreddit)
    expect(action.posts).toEqual(posts)
    expect(action.receivedAt).toBeGreaterThanOrEqualTo(now)
  })
  
})

describe('Async actions', () => {


  describe('fetchPostsIfNeeded', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('should create RECEIVE_POSTS when fetching posts has completed', () => {

      // setup store
      let subreddit = 'frontend';
      const store = mockStore({ 
        selectedSubreddit: subreddit,
        postsBySubreddit: {} 
      })

      // setup request 
      nock('http://www.reddit.com/')
        .get(`/r/${subreddit}.json`)
        .reply(200, frontEndJson)
      const now = Date.now()

      // dispach action
      return store.dispatch(actions.fetchPostsIfNeeded(subreddit))
        .then(() => {
          let _actions = store.getActions()
          
          // the first action is REQUEST_POSTS
          let action = _actions[0]
          expect(action).toEqual({
            type: actions.REQUEST_POSTS,
            subreddit
          })

          // the second action is RECEIVE_POSTS
          action = _actions[1]
          expect(action.type).toEqual(actions.RECEIVE_POSTS)
          expect(action.subreddit).toEqual(subreddit)
          expect(action.posts).toEqual(posts)
          expect(action.receivedAt).toBeGreaterThanOrEqualTo(now)
        })
    })

    it('should create REQUEST_POSTS when current data has been invalidated', () => {

      // setup store
      let subreddit = 'frontend';
      const store = mockStore({ 
        selectedSubreddit: subreddit,
        postsBySubreddit: {
          [subreddit]: {
            posts: posts.map(p => Object.assign({}, p, {title: p.title + '1'})),
            // posts: posts.map(p => { ...p, title: p.title + '1'}),
            didInvalidate: true
          }
        } 
      })

      // setup request 
      nock('http://www.reddit.com/')
        .get(`/r/${subreddit}.json`)
        .reply(200, frontEndJson)

      // dispach action
      return store.dispatch(actions.fetchPostsIfNeeded(subreddit))
        .then(() => {
          expect(store.getActions()[0]).toEqual({
            type: actions.REQUEST_POSTS,
            subreddit
          })
        })
    })

    it('should do nothing if app is already loading data', () => {

      // setup store
      let subreddit = 'frontend';
      const store = mockStore({ 
        selectedSubreddit: subreddit,
        postsBySubreddit: {
          [subreddit]: {
            isFetching: true
          }
        } 
      })

      // dispach action
      return store.dispatch(actions.fetchPostsIfNeeded(subreddit))
        .then(() => {
          expect(store.getActions().length).toBe(0)  
        })
    })

    it('should do nothing if current data is valid', () => {

      // setup store
      let subreddit = 'frontend';
      const store = mockStore({ 
        selectedSubreddit: subreddit,
        postsBySubreddit: {
          [subreddit]: {
            posts: posts
          }
        } 
      })

      // dispach action
      return store.dispatch(actions.fetchPostsIfNeeded(subreddit))
        .then(() => {
          expect(store.getActions().length).toBe(0)  
        })
    })
  })
})
