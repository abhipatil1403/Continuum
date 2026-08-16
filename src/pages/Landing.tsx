import PageWrapper from '../components/layout/PageWrapper';
import Hero from '../components/sections/Hero';
import FeaturedWork from '../components/sections/FeaturedWork';
import QuickAccess from '../components/sections/QuickAccess';

export default function Landing() {
  return (
    <PageWrapper>
      <Hero />
      <FeaturedWork />
      <QuickAccess />
    </PageWrapper>
  );
}
