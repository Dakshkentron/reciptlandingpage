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
import IntegrationsPage from '@/components/IntegrationsPage';
import IntegrationDetailPage from '@/components/IntegrationDetailPage';
import PricingPage from '@/components/PricingPage';
import SecurityPage from '@/components/SecurityPage';
import UseCasesPage from '@/components/UseCasesPage';
import UseCaseDetailPage from '@/components/UseCaseDetailPage';
import ResourcePage from '@/components/ResourcePage';
import UseCasesTeaser from '@/components/UseCasesTeaser';
import { resourcePages, type ResourceKind } from '@/data/resources';

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '');

  // `#/department/*` predates the use-case pages — keep the old links working.
  const legacyDepartment = hash.match(/^\/department\/(.+)$/);
  if (legacyDepartment) return { name: 'use-case', slug: legacyDepartment[1] };

  const useCase = hash.match(/^\/use-cases\/(.+)$/);
  if (useCase) return { name: 'use-case', slug: useCase[1] };
  if (hash === '/use-cases') return { name: 'use-cases', slug: '' };

  const integration = hash.match(/^\/integrations\/(.+)$/);
  if (integration) return { name: 'integration', slug: integration[1] };
  if (hash === '/integrations') return { name: 'integrations', slug: '' };

  const resource = hash.replace(/^\//, '');
  if (resource in resourcePages) return { name: 'resource', slug: resource };

  if (hash === '/pricing') return { name: 'pricing', slug: '' };
  if (hash === '/security') return { name: 'security', slug: '' };
  return { name: 'home', slug: '' };
}

function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => {
      const next = getRoute();
      setRoute((prev) => {
        if (next.name !== prev.name || next.slug !== prev.slug) {
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
        {route.name === 'use-cases' ? (
          <UseCasesPage />
        ) : route.name === 'use-case' ? (
          <UseCaseDetailPage slug={route.slug} />
        ) : route.name === 'resource' ? (
          <ResourcePage kind={route.slug as ResourceKind} />
        ) : route.name === 'integration' ? (
          <IntegrationDetailPage slug={route.slug} />
        ) : route.name === 'integrations' ? (
          <IntegrationsPage onBack={goHome} />
        ) : route.name === 'pricing' ? (
          <PricingPage />
        ) : route.name === 'security' ? (
          <SecurityPage />
        ) : (
          <>
            <Hero />
            <Showcase />
            <LogoMarquee />
            <HowItWorks />
            <UseCasesTeaser />
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
