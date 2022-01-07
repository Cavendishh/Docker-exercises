import { render } from '@testing-library/react'

import Todo from './Todo'

describe('<Todo />', () => {
  test('render a todo with text', () => {
    const text = 'Test todo'
    const todo = {
      id: 1,
      text,
      done: false,
    }

    const { getByText } = render(<Todo todo={todo} onClickDelete={() => null} onClickComplete={() => null} />)

    expect(getByText(text)).toBeInTheDocument()
  })
})
