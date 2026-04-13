import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import NavBar from './components/Navbar'
import Products from './components/Products'
import Categories from './components/Categories'

function App() {
  const [count, setCount] = useState(0)

  return (

    <Router>
      <NavBar />
      <Routes>
        <Route exact path='/products' element={<Products />} />
        <Route exact path='/categories' element={<Categories />} />
        <Route exact path='/' element={<Products />} />

      </Routes>
    </Router>

  )
}

export default App
