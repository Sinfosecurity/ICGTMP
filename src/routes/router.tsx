import { createBrowserRouter } from 'react-router-dom';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { LeadershipPage } from '../pages/LeadershipPage';
import { LegalPage } from '../pages/LegalPage';
import { NewsArticlePage } from '../pages/NewsArticlePage';
import { NewsPage } from '../pages/NewsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProgramPage } from '../pages/ProgramPage';
import { ProgramsPage } from '../pages/ProgramsPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { StructurePage } from '../pages/StructurePage';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'leadership', element: <LeadershipPage /> },
      { path: 'structure', element: <StructurePage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:sector', element: <ProgramPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsArticlePage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <LegalPage slug="privacy" /> },
      { path: 'terms', element: <LegalPage slug="terms" /> },
      { path: 'sitemap', element: <LegalPage slug="sitemap" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
