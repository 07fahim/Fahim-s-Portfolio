import NotFound from 'next/dist/client/components/builtin/not-found';
import RootLayout from './(site)/layout';
export { metadata, viewport } from './(site)/layout';

// The site and the admin are two root layouts, so unknown URLs land here: Next's default 404 inside the site layout (lang, CSS, Umami), as before the admin.
// ponytail: imports Next's builtin 404 from a private next/dist path; if an upgrade moves it, the build fails loudly.
export default function GlobalNotFound() { return <RootLayout><NotFound /></RootLayout>; }
