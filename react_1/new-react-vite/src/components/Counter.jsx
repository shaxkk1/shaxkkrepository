import { useState } from 'react'
import PropTypes from 'prop-types'
import './Counter.css'

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount)

  return (
    <div className="counter">
      <h2>Counter Component</h2>
      <p>Count: {count}</p>
      <div className="button-group">
        <button onClick={() => setCount(count - 1)}>Decrease</button>
        <button onClick={() => setCount(count + 1)}>Increase</button>
      </div>
    </div>
  )
}

Counter.propTypes = {
  initialCount: PropTypes.number
}

export default Counter