import { PageShell } from '../components/PageShell';

export function NotFoundPage() {
  return (
    <PageShell kicker="404" title="Page not found">
      <p>That address is not a page on this site.</p>
      <p>
        Go back to the <a href="#home">home page</a>, or see the <a href="#sitemap">site map</a>.
      </p>
    </PageShell>
  );
}
