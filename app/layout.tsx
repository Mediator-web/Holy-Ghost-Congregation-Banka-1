import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Presbyterian Church of Ghana | That They All May Be One',
  description: 'Official web portal of the Presbyterian Church of Ghana. Real-time sermons, church events, news, ministries, presbyteries, and community worship.',
  openGraph: {
    title: 'Presbyterian Church of Ghana (PCG)',
    description: 'Official web portal of the Presbyterian Church of Ghana (PCG). Serving Christ and community since 1828.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presbyterian Church of Ghana (PCG)',
    description: 'Official web portal of the Presbyterian Church of Ghana (PCG). Serving Christ and community since 1828.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
