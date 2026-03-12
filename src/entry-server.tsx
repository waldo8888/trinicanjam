import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { SkipLink } from '@/components/SkipLink/SkipLink'
import { TonalZoneProvider } from '@/context/TonalZoneContext'
import { AboutPage } from '@/pages/AboutPage'
import { HomePage, MenuPage, NotFoundPage, VisitPage } from '@/routePages'

export function renderRoute(routePath: string): string {
  const PageComponent = {
    '/': HomePage,
    '/menu': MenuPage,
    '/visit': VisitPage,
    '/about': AboutPage,
  }[routePath] ?? NotFoundPage

  return renderToString(
    <StaticRouter location={routePath}>
      <TonalZoneProvider>
        <>
          <SkipLink />
          <PageComponent />
        </>
      </TonalZoneProvider>
    </StaticRouter>
  )
}