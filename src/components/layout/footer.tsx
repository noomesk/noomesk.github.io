import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="w-full bg-card mt-16 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Noomesk. Todos los derechos reservados.
        </p>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/noomesk" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.linkedin.com/in/angie-paola-plazas-a008202a0/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
