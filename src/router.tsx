import { createBrowserRouter } from 'react-router-dom'
import { AboutPage } from '@/pages/AboutPage'
import { HomePage, MenuPage, NotFoundPage, VisitPage } from '@/routePages'

// Exported for use in tests via createMemoryRouter
export const routes = [
	{ path: '/', element: <HomePage /> },
	{ path: '/menu', element: <MenuPage /> },
	{ path: '/visit', element: <VisitPage /> },
	{ path: '/about', element: <AboutPage /> },
	{ path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
