import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export function NotFoundPage() {
  return (
    <PageShell kicker="404" title="Page not found">
      <p>That address is not a page on this site.</p>
      <p>
        Go back to the <Link to="/">home page</Link>, <Link to="/contact">contact ICGTMP</Link>, or
        see the <Link to="/sitemap">site map</Link>.
      </p>
    </PageShell>
  );
}
