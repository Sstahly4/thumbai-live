"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, ImageIcon, Sparkles, Upload, Zap, User, Users, BarChart2, Info, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/app/components/landing/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/landing/ui/card"
import HeroAnimation from "@/app/components/landing/hero-animation"
import FeatureCard from "@/app/components/landing/feature-card"
import ExampleGallery from "@/app/components/landing/example-gallery"
import TestimonialSlider from "@/app/components/landing/testimonial-slider"
import TrendingStyles from "@/app/components/landing/trending-styles"
import StatsCounter from "@/app/components/landing/stats-counter"
import ParallaxSection from "@/app/components/landing/parallax-section"
import ScrollToSection from "@/app/components/landing/scroll-to-section"
import { FloatingThemeToggle } from "@/app/components/landing/floating-theme-toggle"

interface FeatureGroup {
  title: string
  icon: React.ReactNode
  features: string[]
}

interface PricingCardProps {
  index: number
  title: string
  price: string
  yearlyPrice: string
  isYearly: boolean
  description: string
  sessions: string
  thumbnails: string
  overage: string
  featureGroups: FeatureGroup[]
  buttonText: string
  buttonVariant: "default" | "outline"
  popular?: boolean
}

const PricingCard: React.FC<PricingCardProps> = ({
  index,
  title,
  price,
  yearlyPrice,
  isYearly,
  description,
  sessions,
  thumbnails,
  overage,
  featureGroups,
  buttonText,
  buttonVariant,
  popular = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      viewport={{ once: true }}
      className="relative rounded-2xl border bg-white dark:bg-gray-800 shadow-sm"
    >
      {popular && (
        <div className="absolute top-4 left-4 rounded-full bg-amber-500 px-3 py-1.5 text-sm font-medium text-white">
          Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <div className="mt-4">
          <div className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{isYearly ? yearlyPrice : price}</div>
            <div className="absolute top-0.5 right-0 text-sm text-gray-500 dark:text-gray-400">
              {isYearly ? "/ year" : "/ month"}
            </div>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          <li>
            <div className="text-sm text-gray-500 dark:text-gray-400">{sessions}</div>
          </li>
          <li>
            <div className="text-sm text-gray-500 dark:text-gray-400">{thumbnails}</div>
          </li>
          <li>
            <div className="text-sm text-gray-500 dark:text-gray-400">{overage}</div>
          </li>
        </ul>
        {featureGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mt-6">
            <div className="flex items-center space-x-2">
              {group.icon}
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">{group.title}</h4>
            </div>
            <ul className="mt-3 space-y-2">
              {group.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="text-sm text-gray-500 dark:text-gray-400">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-8">
          <button
            className={`w-full rounded-md py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${buttonVariant === "default" ? "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600" : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface PricingToggleProps {
  isYearly: boolean
  onPeriodChange: (yearly: boolean) => void
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isYearly, onPeriodChange }) => {
  return (
    <div className="flex items-center justify-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Monthly</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={isYearly}
          onChange={() => onPeriodChange(!isYearly)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
      </label>
      <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">Yearly</span>
    </div>
  )
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
          hasScrolled ? "bg-white/90 backdrop-blur-md dark:bg-gray-900/90" : "bg-white/80 dark:bg-gray-900/80"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              <span className="text-lg md:text-xl font-bold">ThumbAI</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
            <ScrollToSection targetId="features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </ScrollToSection>
            <ScrollToSection targetId="examples" className="text-sm font-medium hover:underline underline-offset-4">
              Examples
            </ScrollToSection>
            <ScrollToSection targetId="pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </ScrollToSection>
            <ScrollToSection targetId="faq" className="text-sm font-medium hover:underline underline-offset-4">
              FAQ
            </ScrollToSection>
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <User className="h-4 w-4" />
                <span className="sr-only">Log in</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 dark:text-white"
              >
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile auth button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <User className="h-4 w-4" />
                <span className="sr-only">Log in</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 dark:text-white"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b">
            <nav className="flex flex-col py-4 px-6 space-y-4">
              <ScrollToSection
                targetId="features"
                className="text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </ScrollToSection>
              <ScrollToSection
                targetId="examples"
                className="text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Examples
              </ScrollToSection>
              <ScrollToSection
                targetId="pricing"
                className="text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </ScrollToSection>
              <ScrollToSection
                targetId="faq"
                className="text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </ScrollToSection>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Create Stunning YouTube Thumbnails with AI
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Transform your video thumbnails into attention-grabbing masterpieces using the power of artificial intelligence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button className="w-full min-[400px]:w-auto">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#examples">
                  <Button variant="outline" className="w-full min-[400px]:w-auto">
                    View Examples
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to create eye-catching thumbnails that drive more views and engagement.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="AI-Powered Design"
              description="Our advanced AI analyzes successful thumbnails and generates designs that are proven to attract viewers."
              icon={<Sparkles className="h-6 w-6" />}
            />
            <FeatureCard
              title="Custom Templates"
              description="Choose from a variety of professionally designed templates or create your own custom designs."
              icon={<ImageIcon className="h-6 w-6" />}
            />
            <FeatureCard
              title="Batch Processing"
              description="Generate multiple thumbnails at once to save time and maintain consistency across your channel."
              icon={<Upload className="h-6 w-6" />}
            />
            <FeatureCard
              title="Smart Analytics"
              description="Get insights into which thumbnails perform best and optimize your designs accordingly."
              icon={<BarChart2 className="h-6 w-6" />}
            />
            <FeatureCard
              title="Collaboration"
              description="Work together with your team to create and approve thumbnails in real-time."
              icon={<Users className="h-6 w-6" />}
            />
            <FeatureCard
              title="24/7 Support"
              description="Our team is always available to help you get the most out of ThumbAI."
              icon={<Info className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Examples</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                See how ThumbAI has helped creators increase their views and engagement.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <ExampleGallery />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join thousands of creators who have transformed their channel with ThumbAI.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <TestimonialSlider />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pricing</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the perfect plan for your channel's needs.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <div className="flex justify-center mb-8">
              <PricingToggle isYearly={isYearly} onPeriodChange={setIsYearly} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PricingCard
                index={0}
                title="Starter"
                price="$9"
                yearlyPrice="$90"
                isYearly={isYearly}
                description="Perfect for creators just starting out."
                sessions="5 sessions/month"
                thumbnails="50 thumbnails/month"
                overage="$0.50 per thumbnail"
                featureGroups={[
                  {
                    title: "Features",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                    features: ["Basic templates", "Standard support", "720p quality"],
                  },
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />
              <PricingCard
                index={1}
                title="Pro"
                price="$29"
                yearlyPrice="$290"
                isYearly={isYearly}
                description="For growing channels that need more power."
                sessions="20 sessions/month"
                thumbnails="200 thumbnails/month"
                overage="$0.25 per thumbnail"
                featureGroups={[
                  {
                    title: "Features",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                    features: [
                      "All Starter features",
                      "Custom templates",
                      "Priority support",
                      "1080p quality",
                      "Analytics",
                    ],
                  },
                ]}
                buttonText="Get Started"
                buttonVariant="default"
                popular
              />
              <PricingCard
                index={2}
                title="Enterprise"
                price="$99"
                yearlyPrice="$990"
                isYearly={isYearly}
                description="For professional creators and teams."
                sessions="Unlimited sessions"
                thumbnails="1000 thumbnails/month"
                overage="$0.10 per thumbnail"
                featureGroups={[
                  {
                    title: "Features",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                    features: [
                      "All Pro features",
                      "Team collaboration",
                      "API access",
                      "4K quality",
                      "Dedicated support",
                      "Custom integrations",
                    ],
                  },
                ]}
                buttonText="Contact Sales"
                buttonVariant="outline"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Find answers to common questions about ThumbAI.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold">How does ThumbAI work?</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  ThumbAI uses advanced machine learning algorithms to analyze successful thumbnails and generate designs that are proven to attract viewers. Simply upload your video details, and our AI will create multiple thumbnail options for you to choose from.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold">Can I customize the generated thumbnails?</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Yes! While our AI generates the initial designs, you have full control over customization. You can adjust colors, text, images, and more to match your brand and style.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold">What if I need more thumbnails than my plan allows?</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  No problem! You can purchase additional thumbnails at a discounted rate based on your plan. The overage charges are clearly displayed in the pricing section.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold">Do you offer a free trial?</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Yes! We offer a 7-day free trial with access to all features. No credit card required to start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-bold">ThumbAI</span>
            </Link>
            <p className="text-center text-sm leading-loose text-gray-500 md:text-left dark:text-gray-400">
              © 2024 ThumbAI. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>

      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
    </div>
  )
} 