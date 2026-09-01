import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './page/login/Login'
import { Register } from './page/register/Register'
import { UpdatePasswordF } from './page/update_password/UpdatePassword'
import { ErrorPage } from './page/error/ErrorPage'
import { Index } from './page/index/index'
import { UpdateInfo } from './page/update_info/UpdateInfo'
import { Menu } from './page/menu/Menu'
import { BookingHistory } from './page/booking_history/BookingHistory'
import { MeetingRoomList } from './page/meeting_room_list/MeetingRoomList'

const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />,
      },
      {
        path: '/',
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <MeetingRoomList />,
          },
          {
            path: 'meeting_room_list',
            element: <MeetingRoomList />,
          },
          {
            path: 'booking_history',
            element: <BookingHistory />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'update_password',
    element: <UpdatePasswordF />,
  },
]
export const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<RouterProvider router={router} />)

/* const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
