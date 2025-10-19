import { MainLayout } from "@/components/layouts/MainLayout";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Pricing",
  description: "Choose the perfect plan for your needs.",
});

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Placeholder for pricing content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-6 rounded-lg border bg-card space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Free</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">$0</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Basic features</li>
                <li>✓ Community support</li>
                <li>✓ 1 project</li>
              </ul>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-lg border-2 border-primary bg-card space-y-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-foreground">Pro</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">$29</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ All Free features</li>
                <li>✓ Priority support</li>
                <li>✓ Unlimited projects</li>
                <li>✓ Advanced analytics</li>
              </ul>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 rounded-lg border bg-card space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">Custom</p>
                <p className="text-sm text-muted-foreground">contact us</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ All Pro features</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
