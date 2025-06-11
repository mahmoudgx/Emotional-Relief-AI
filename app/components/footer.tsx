export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 px-6 md:h-24 md:flex-row md:py-6 md:px-8">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Emotional Relief AI. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </a>
          <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
