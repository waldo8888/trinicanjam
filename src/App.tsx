import { RouterProvider } from 'react-router-dom'
import { SkipLink } from '@/components/SkipLink/SkipLink'
import { router } from './router'

export default function App() {
  return (
    <>
      <SkipLink />
      <RouterProvider router={router} />
    </>
  )
}

