"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertTriangle, Download, RefreshCw } from "lucide-react"
import { generatePDF } from "@/lib/generate-pdf"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: {
    customerName: string
    formData: any
    prediction: number
    timestamp: string
  }
}

export function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const router = useRouter()

  const isChurning = result.prediction === 1
  const formattedDate = new Date(result.timestamp).toLocaleString()

  const handleDownloadReport = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF({
        customerName: result.customerName,
        formData: result.formData,
        prediction: result.prediction,
        timestamp: result.timestamp,
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePredictAnother = () => {
    onClose()
    router.refresh()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="border-zinc-800 bg-zinc-900 p-0 text-white sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`${isChurning ? "bg-gradient-to-r from-red-800 to-red-600" : "bg-gradient-to-r from-green-800 to-green-600"} p-6`}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center text-2xl font-bold text-white">
                    {isChurning ? (
                      <>
                        <AlertTriangle className="mr-2 h-6 w-6 text-yellow-300" />
                        Churn Risk Detected
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-6 w-6 text-green-300" />
                        Customer Likely to Stay
                      </>
                    )}
                  </DialogTitle>
                </DialogHeader>
              </div>

              <div className="p-6">
                <DialogDescription className="pt-4 text-base text-white">
                  <span className="block text-xl font-medium text-white">{result.customerName}</span>
                  {isChurning ? (
                    <div className="mt-4 rounded-lg bg-red-950/50 p-4 text-white">
                      <p className="flex items-center text-lg font-medium">
                        <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                        This customer is likely to churn
                      </p>
                      <p className="mt-2 text-zinc-200">
                        We recommend taking immediate action to retain this customer. Consider special offers or
                        personalized outreach.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg bg-green-950/50 p-4 text-white">
                      <p className="flex items-center text-lg font-medium">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        This customer is unlikely to churn
                      </p>
                      <p className="mt-2 text-zinc-200">
                        This customer shows strong loyalty indicators. Continue providing excellent service to maintain
                        satisfaction.
                      </p>
                    </div>
                  )}
                  <div className="mt-4 text-sm text-zinc-300">Prediction made on: {formattedDate}</div>
                </DialogDescription>

                <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={handleDownloadReport}
                    disabled={isGeneratingPDF}
                    className="w-full border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handlePredictAnother}
                    className={`w-full ${isChurning ? "bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500" : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"}`}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Predict Another
                  </Button>
                </DialogFooter>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
