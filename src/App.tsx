import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import LogoMarquee from '@/components/LogoMarquee';
import HowItWorks from '@/components/HowItWorks';
import DashboardDemo from '@/components/DashboardDemo';
import Customers from '@/components/Customers';
import Integrations from '@/components/Integrations';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import DepartmentPage from '@/components/DepartmentPage';

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  const match = hash.match(/^\/department\/(.+)$/);
  return match ? { name: 'department', slug: match[1] } : { name: 'home', slug: '' };
}

function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => {
      const next = getRoute();
      setRoute((prev) => {
        if (next.name === 'department' || prev.name === 'department') {
          window.scrollTo(0, 0);
        }
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goHome = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {route.name === 'department' ? (
          <DepartmentPage slug={route.slug} onBack={goHome} />
        ) : (
          <>
            <Hero />
            <Showcase />
            <LogoMarquee />
            <HowItWorks />
            <DashboardDemo />
            <Customers />
            <Integrations />
            <FAQ />
            <CTA />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
