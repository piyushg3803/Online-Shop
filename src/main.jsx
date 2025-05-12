import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './components/Home.jsx'
import Cart from './components/Cart.jsx'
import Profile from './components/Profile.jsx'
import ProductPage from './components/ProductPage.jsx'
import Wishlist from './components/Wishlist.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import Dashboard from './components/Admin/Dashboard.jsx'
import AddProduct from './components/Admin/AddProduct.jsx'
import UserList from './components/Admin/UserList.jsx'
import RecentOrders from './components/Admin/RecentOrders.jsx'
import ProductList from './components/Admin/ProductList.jsx'
import SingleUser from './components/Admin/SingleUser.jsx'
import SingleProduct from './components/Admin/SingleProduct.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import SingleOrder from './components/Admin/SingleOrder.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Terms from './components/Terms.jsx'
import Policies from './components/Policies.jsx'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/terms' element={<Terms />} />
      <Route path='/policies' element={<Policies />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/wishlist' element={<Wishlist />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/password-reset/:token' element={<ResetPassword />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/admin' element={<Dashboard />} />
      <Route path='/admin/addProduct' element={<AddProduct />} />
      <Route path='/admin/userList' element={<UserList />} />
      <Route path='/admin/orderList' element={<RecentOrders />} />
      <Route path='/admin/orderdetails/:id' element={<SingleOrder />} />
      <Route path='/admin/productList' element={<ProductList />} />
      <Route path='/admin/singleUser/:id' element={<SingleUser />} />
      <Route path='/admin/singleProduct/:id' element={<SingleProduct />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={route}>
      <App />
    </RouterProvider>
  </AuthProvider>
)
