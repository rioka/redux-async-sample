import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Posts from '../../src/components/Posts'

let posts = [{
  title: 'title 1'
}, {
  title: 'title 2'
}]

describe('Posts', () => {

  let props,  // properties passed to the component 
      output  // rendered output

  // setup
  beforeEach(() => {
    props = {
      posts
    }

    let renderer = TestUtils.createRenderer()
    renderer.render(<Posts {...props} />)
    output = renderer.getRenderOutput()
  })

  it('should render correctly', () => {

    expect(output.type).toBe('ul')
    let children = output.props.children 
    
    // check the # of 'li' within 'ul' 
    expect(children.length).toBe(posts.length)
    children.forEach((child, i) => {
      // the node should be a 'li'
      expect(child.type).toBe('li')
      // ...and its content should be the title of the i-th post
      expect(child.props.children).toBe(posts[i].title)
    })
  })

})
