import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Index } from './pages/index/Index'
import { ErrorPage } from './pages/error_page/ErroePage'
import { UserManage } from './pages/user_manage/UserManage'
import { Login } from './pages/login/Login'
import { Menu } from './pages/menu/Menu'
import { ModifyMenu } from './pages/modify_menu/ModifyMenu'
import { InfoModify } from './pages/modify_menu/InfoModify'
import { PasswordModify } from './pages/modify_menu/PasswordModify'
import { BookingManage } from './pages/booking_manage/BookingManage'
import { MeetingRoomManage } from './pages/meeting_room_manage/MeetingRoomManage'
import { Statistics } from './pages/statistics/Statistics'

const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Menu></Menu>,
        children: [
          {
            path: '/',
            element: <MeetingRoomManage />,
          },
          {
            path: 'user_manage',
            element: <UserManage />,
          },
          {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage />,
          },
          {
            path: 'booking_manage',
            element: <BookingManage />,
          },
          {
            path: 'statistics',
            element: <Statistics />,
          },
        ],
      },
      {
        path: '/user',
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify />,
          },
          {
            path: 'password_modify',
            element: <PasswordModify />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
]

export const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<RouterProvider router={router} />)
