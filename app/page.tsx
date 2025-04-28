import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, LineChart, Users } from "lucide-react"
import Image from "next/image";
const img = "/images/customer.png";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-black to-red-950"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-500">
                Predictive Analytics
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                <span className="text-red-500">Predict</span> Customer Churn{" "}
                <span className="text-yellow-500">Before</span> It Happens
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Our advanced AI model helps you identify customers at risk of leaving, so you can take action before
                it&apos;s too late.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/predict">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Start Prediction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-red-800 bg-red-950 hover:text-black">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-md rounded-full bg-gradient-to-tr from-red-500/20 via-yellow-500/10 to-transparent p-4">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
                <Image
                  src={img}
                  width={500}
                  height={500}
                  alt="Churn Prediction"
                  className="h-full w-full object-fill opacity-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="text-yellow-500">Powerful</span> Features
            </h2>
            <p className="mt-4 text-gray-200">Everything you need to predict and prevent customer churn</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-red-900 hover:shadow-lg hover:shadow-red-900/10">
              <div className="mb-4 inline-flex rounded-lg bg-red-500/10 p-3 text-red-500">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Accurate Predictions</h3>
              <p className="text-gray-200">
                Our model uses advanced machine learning algorithms to predict customer churn with high accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-yellow-900 hover:shadow-lg hover:shadow-yellow-900/10">
              <div className="mb-4 inline-flex rounded-lg bg-yellow-500/10 p-3 text-yellow-500">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Detailed Reports</h3>
              <p className="text-gray-200">
                Get comprehensive PDF reports with all the details you need to take action and retain customers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-red-900 hover:shadow-lg hover:shadow-red-900/10">
              <div className="mb-4 inline-flex rounded-lg bg-red-500/10 p-3 text-red-500">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Customer Insights</h3>
              <p className="text-gray-200">
                Understand the key factors that contribute to customer churn and take targeted action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="mt-4 text-gray-200">Simple process, powerful results</p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Line connecting steps */}
            <div className="absolute left-16 top-0 hidden h-full w-0.5 bg-gradient-to-b from-red-600 via-yellow-600 to-red-600 md:block"></div>

            {/* Step 1 */}
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-bold">
                1
              </div>
              <div className="ml-0 md:ml-12">
                <h3 className="text-xl font-bold">Enter Customer Data</h3>
                <p className="mt-2 text-gray-200">
                  Input customer details including demographics, account information, and behavior patterns.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-black">
                2
              </div>
              <div className="ml-0 md:ml-12">
                <h3 className="text-xl font-bold">Get Instant Prediction</h3>
                <p className="mt-2 text-gray-200">
                  Our AI model analyzes the data and provides an immediate prediction on churn probability.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-bold">
                3
              </div>
              <div className="ml-0 md:ml-12">
                <h3 className="text-xl font-bold">Take Action</h3>
                <p className="mt-2 text-gray-200">
                  Download detailed reports and implement targeted retention strategies for at-risk customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-red-900 via-black to-black py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to <span className="text-yellow-500">Reduce</span> Customer Churn?
            </h2>
            <p className="mt-4 text-gray-200">
              Start predicting customer behavior today and take proactive steps to improve retention.
            </p>
            <div className="mt-8">
              <Link href="/predict">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Start Your First Prediction
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
