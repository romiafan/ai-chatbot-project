import { MainLayout } from "@/components/layouts/MainLayout";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Home",
  description:
    "Production-ready Next.js template with Clerk authentication and Convex real-time backend. Build AI chatbots, ecommerce sites, and landing pages.",
});

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Build Modern Web Apps
            <span className="block text-primary">Lightning Fast</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready Next.js template with authentication, real-time
            backend, and beautiful UI components. Start building today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with modern technologies and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Built on Next.js 15 with Turbopack for blazing-fast development
                and production builds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Secure by Default
              </h3>
              <p className="text-muted-foreground">
                Authentication powered by Clerk with support for email, social
                logins, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Real-time Ready
              </h3>
              <p className="text-muted-foreground">
                Powered by Convex for real-time data sync, type-safe APIs, and
                serverless backend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground">
            Deploy your first project in minutes. No credit card required.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-lg"
          >
            Start Building
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
