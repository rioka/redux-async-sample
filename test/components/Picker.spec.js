import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Picker from '../../src/components/Picker'

describe('Picker', () => {

  let props,  // properties passed to the component 
      output  // rendered output

  beforeEach(() => {
    const frontend = 'frontend'
    props = {
      value: frontend, 
      onChange: expect.createSpy(),
      options: [
        frontend,
        'reactjs'
      ] 
    }

    let renderer = TestUtils.createRenderer()
    renderer.render(<Picker {...props} />)
    output = renderer.getRenderOutput()
  })

  it('should render correctly', () => {

    // const { output, props } = setup()
    expect(output.type).toBe('span')

    // check the children
    const selectedValue = props.value
    let [ h1, select] = output.props.children;
    expect(h1.type).toBe('h1')
    expect(h1.props.children).toBe(selectedValue)
    expect(select.type).toBe('select')
    expect(select.props.value).toBe(selectedValue)

    const opts = props.options
    expect(select.props.children.length).toBe(opts.length)
    let { key, type } = select.props.children[0]
    expect(key).toBe(opts[0])
    expect(type).toBe('option')
  })

  it('should call onChange when the selection changes', () => {
    
    // const { output, props } = setup()
    let select = output.props.children[1];

    // when the selection changes, out callback is called
    expect(props.onChange.calls.length).toBe(0)
    select.props.onChange({ 
      target: { 
        value: props.options[1] 
      } 
    })
    expect(props.onChange.calls.length).toBe(1)
  })

})
