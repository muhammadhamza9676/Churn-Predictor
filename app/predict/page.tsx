"use client"

import { useState } from "react"
import { PredictionForm } from "@/components/prediction-form"
import { ResultModal } from "@/components/result-modal"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PredictPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [result, setResult] = useState<{
    customerName: string
    formData: unknown
    prediction: number
    timestamp: string
  } | null>(null)

  const handleResult = (data: {
    customerName: string
    formData: unknown
    prediction: number
    timestamp: string
  }) => {
    setResult(data)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 pb-20 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="mb-8 inline-flex items-center text-gray-400 hover:text-red-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            <span className="text-red-500">Predict</span> Customer <span className="text-yellow-500">Churn</span>
          </h1>
          <p className="mt-4 text-gray-200">Enter customer details to get an instant prediction</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <PredictionForm onResult={handleResult} />
          {result && <ResultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} result={result} />}
        </div>
      </div>
    </div>
  )
}
