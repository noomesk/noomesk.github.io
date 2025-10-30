import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero';
import { SkillsSection } from '@/components/sections/skills';
import { ProjectsSection } from '@/components/sections/projects';
import { AiAdvisorSection } from '@/components/sections/ai-advisor';
import { ContactSection } from '@/components/sections/contact';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <SkillsSection />
        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectsSection />
        </Suspense>
        <AiAdvisorSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
