import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import {
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Take Control of Your{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Finances
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  FinTrack helps you track expenses, manage budgets, and achieve
                  your financial goals with ease.
                </p>
                <div className="flex gap-4">
                  <Link to="/register">
                    <Button size="lg">Get Started Free</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Balance
                    </span>
                    <span className="text-xl font-bold text-primary">
                      $12,450.00
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Income</p>
                      <p className="text-lg font-bold text-success">$8,500</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Expenses</p>
                      <p className="text-lg font-bold text-destructive">
                        $3,250
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-12">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<TrendingUp size={32} />}
                title="Track Transactions"
                description="Easily log income and expenses with detailed categories and descriptions."
              />
              <FeatureCard
                icon={<Target size={32} />}
                title="Set Budgets"
                description="Create category-based budgets and get alerts when you exceed limits."
              />
              <FeatureCard
                icon={<BarChart3 size={32} />}
                title="Visual Analytics"
                description="Beautiful charts and graphs to visualize your spending patterns."
              />
              <FeatureCard
                icon={<Zap size={32} />}
                title="Smart Goals"
                description="Set savings goals and track your progress toward financial milestones."
              />
              <FeatureCard
                icon={<Shield size={32} />}
                title="Secure & Private"
                description="Your financial data is encrypted and protected with JWT authentication."
              />
              <FeatureCard
                icon={<Smartphone size={32} />}
                title="Responsive Design"
                description="Access your finances anytime, anywhere on any device."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Managing Your Finances Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of users who are taking control of their financial
              health with FinTrack.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12 px-4">
          <div className="max-w-7xl mx-auto text-center text-muted-foreground">
            <p>&copy; 2024 FinTrack. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
