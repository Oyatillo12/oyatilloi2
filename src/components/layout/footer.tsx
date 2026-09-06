import { site } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8">
      <Container className="text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </Container>
    </footer>
  );
}
