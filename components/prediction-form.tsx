"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, CreditCard, Calendar, Briefcase, DollarSign, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name is required" }),
  creditScore: z.coerce
    .number()
    .min(300, { message: "Score must be at least 300" })
    .max(900, { message: "Score must be at most 900" }),
  gender: z.string({ required_error: "Please select a gender" }),
  age: z.coerce
    .number()
    .min(18, { message: "Age must be at least 18" })
    .max(100, { message: "Age must be at most 100" }),
  tenure: z.coerce.number().min(0, { message: "Tenure cannot be negative" }),
  balance: z.coerce.number(),
  numOfProducts: z.coerce.number().min(1, { message: "Must have at least 1 product" }),
  hasCrCard: z.string({ required_error: "Please select an option" }),
  isActiveMember: z.string({ required_error: "Please select an option" }),
  estimatedSalary: z.coerce.number().min(0, { message: "Salary cannot be negative" }),
  geography: z.string({ required_error: "Please select a country" }),
})

type FormValues = z.infer<typeof formSchema>

interface PredictionFormProps {
  onResult: (data: {
    customerName: string
    formData: any
    prediction: number
    timestamp: string
  }) => void
}

export function PredictionForm({ onResult }: PredictionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      creditScore: 650,
      gender: "0",
      age: 35,
      tenure: 5,
      balance: 0,
      numOfProducts: 1,
      hasCrCard: "0",
      isActiveMember: "1",
      estimatedSalary: 50000,
      geography: "France",
    },
    mode: "onChange",
  })

  const { formState } = form
  const { isValid } = formState

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Map geography to one-hot encoding
      const geographyMapping = {
        France: { Geography_France: 1, Geography_Germany: 0, Geography_Spain: 0 },
        Germany: { Geography_France: 0, Geography_Germany: 1, Geography_Spain: 0 },
        Spain: { Geography_France: 0, Geography_Germany: 0, Geography_Spain: 1 },
      }

      const selectedGeography = geographyMapping[values.geography as keyof typeof geographyMapping]

      // Prepare data for API
      const apiData = {
        CreditScore: values.creditScore,
        Gender: Number.parseInt(values.gender),
        Age: values.age,
        Tenure: values.tenure,
        Balance: values.balance,
        NumOfProducts: values.numOfProducts,
        HasCrCard: Number.parseInt(values.hasCrCard),
        IsActiveMember: Number.parseInt(values.isActiveMember),
        EstimatedSalary: values.estimatedSalary,
        ...selectedGeography,
      }

      // Call the API
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction. Please try again.")
      }

      const result = await response.json()

      // Pass result to parent component
      onResult({
        customerName: values.customerName,
        formData: apiData,
        prediction: result.data,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-950 text-white">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Customer Info Card */}
            <Card className="overflow-hidden border-zinc-800 bg-zinc-900 shadow-lg shadow-red-900/5">
              <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-1">
                <div className="flex items-center gap-2 bg-zinc-900 p-4">
                  <User className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg text-white font-bold">Customer Information</h2>
                </div>
              </div>
              <CardContent className="grid gap-6 p-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Customer Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter customer name"
                            {...field}
                            className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-red-500 focus:ring-red-500"
                          />
                          <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white hover:border-red-500">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                            <SelectItem value="0">Female</SelectItem>
                            <SelectItem value="1">Male</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Age</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-red-500 focus:ring-red-500"
                            />
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="geography"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-white font-medium">Geography</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-0 space-y-0">
                            <FormControl>
                              <div className="relative">
                                <RadioGroupItem value="France" id="geography-france" className="peer sr-only" />
                                <label
                                  htmlFor="geography-france"
                                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white hover:border-red-500 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-950"
                                >
                                  <MapPin className="h-4 w-4 text-zinc-400 peer-data-[state=checked]:text-red-500" />
                                  France
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex items-center space-x-0 space-y-0">
                            <FormControl>
                              <div className="relative">
                                <RadioGroupItem value="Germany" id="geography-germany" className="peer sr-only" />
                                <label
                                  htmlFor="geography-germany"
                                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white hover:border-red-500 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-950"
                                >
                                  <MapPin className="h-4 w-4 text-zinc-400 peer-data-[state=checked]:text-red-500" />
                                  Germany
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex items-center space-x-0 space-y-0">
                            <FormControl>
                              <div className="relative">
                                <RadioGroupItem value="Spain" id="geography-spain" className="peer sr-only" />
                                <label
                                  htmlFor="geography-spain"
                                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white hover:border-red-500 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-950"
                                >
                                  <MapPin className="h-4 w-4 text-zinc-400 peer-data-[state=checked]:text-red-500" />
                                  Spain
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Financial Info Card */}
            <Card className="overflow-hidden border-zinc-800 bg-zinc-900 shadow-lg shadow-red-900/5">
              <div className="bg-gradient-to-r from-yellow-900 to-red-900 p-1">
                <div className="flex items-center gap-2 bg-zinc-900 p-4">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-lg text-white  font-bold">Financial Information</h2>
                </div>
              </div>
              <CardContent className="grid gap-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="creditScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Credit Score</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-zinc-300">Score between 300-900</FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Estimated Salary</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Balance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasCrCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Has Credit Card</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white hover:border-red-500">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                            <SelectItem value="0">No</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Account Info Card */}
            <Card className="overflow-hidden border-zinc-800 bg-zinc-900 shadow-lg shadow-red-900/5">
              <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-1">
                <div className="flex items-center gap-2 bg-zinc-900 p-4">
                  <Briefcase className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg text-white  font-bold">Account Information</h2>
                </div>
              </div>
              <CardContent className="grid gap-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Tenure (years)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-red-500 focus:ring-red-500"
                            />
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numOfProducts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Number of Products</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-300 focus:border-red-500 focus:ring-red-500"
                            />
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActiveMember"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Is Active Member</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white hover:border-red-500">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              type="submit"
              disabled={isLoading || !formState.isValid}
              className={`group relative w-full max-w-md overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-yellow-600 p-0.5 text-lg font-bold transition-all hover:from-red-500 hover:to-yellow-500 ${!formState.isValid ? "opacity-80" : ""}`}
            >
              <span className="relative flex w-full items-center justify-center gap-2 rounded-md bg-black px-8 py-3.5 transition-all group-hover:bg-transparent group-hover:text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {formState.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    {formState.isValid ? "Get Prediction" : "Complete All Fields"}
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  )
}
