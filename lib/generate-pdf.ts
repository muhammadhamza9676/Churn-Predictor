import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface PDFData {
  customerName: string
  formData: any
  prediction: number
  timestamp: string
}

export async function generatePDF(data: PDFData) {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add title with red color
  doc.setFontSize(22)
  doc.setTextColor(220, 38, 38) // Darker red for better visibility when printed
  doc.text("CUSTOMER CHURN PREDICTION", 105, 20, { align: "center" })

  // Add subtitle
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("CONFIDENTIAL REPORT", 105, 30, { align: "center" })

  // Add customer name
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text(`Customer: ${data.customerName}`, 20, 45)

  // Add prediction result with colored box
  if (data.prediction === 1) {
    // Red box for churn risk
    doc.setFillColor(254, 202, 202) // Slightly darker red background for better contrast
    doc.rect(20, 50, 170, 25, "F")
    doc.setTextColor(220, 38, 38) // Red text
    doc.setFontSize(14)
    doc.text("HIGH RISK: Customer is likely to churn", 105, 65, { align: "center" })
  } else {
    // Green box for retention
    doc.setFillColor(187, 247, 208) // Slightly darker green background for better contrast
    doc.rect(20, 50, 170, 25, "F")
    doc.setTextColor(22, 163, 74) // Green text
    doc.setFontSize(14)
    doc.text("LOW RISK: Customer is unlikely to churn", 105, 65, { align: "center" })
  }

  // Format timestamp
  const formattedDate = new Date(data.timestamp).toLocaleString()
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Report generated: ${formattedDate}`, 20, 85)

  // Prepare customer data for table
  const tableData = [
    ["Credit Score", data.formData.CreditScore.toString()],
    ["Gender", data.formData.Gender === 0 ? "Female" : "Male"],
    ["Age", data.formData.Age.toString()],
    ["Tenure", data.formData.Tenure.toString()],
    ["Balance", data.formData.Balance.toFixed(2)],
    ["Number of Products", data.formData.NumOfProducts.toString()],
    ["Has Credit Card", data.formData.HasCrCard === 0 ? "No" : "Yes"],
    ["Is Active Member", data.formData.IsActiveMember === 0 ? "No" : "Yes"],
    ["Estimated Salary", data.formData.EstimatedSalary.toFixed(2)],
    [
      "Geography",
      data.formData.Geography_France === 1 ? "France" : data.formData.Geography_Germany === 1 ? "Germany" : "Spain",
    ],
  ]

  // Add customer data table
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Customer Details", 20, 95)

  autoTable(doc, {
    startY: 100,
    head: [["Attribute", "Value"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [220, 38, 38], // Darker red for better visibility
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    styles: {
      fontSize: 10,
    },
  })

  // Add recommendations section
  const yPosition = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Recommendations", 20, yPosition)

  if (data.prediction === 1) {
    autoTable(doc, {
      startY: yPosition + 5,
      body: [
        ["1", "Offer a personalized retention discount or promotion"],
        ["2", "Schedule a customer service follow-up call"],
        ["3", "Consider product upgrades or cross-selling opportunities"],
        ["4", "Review pricing structure for this customer segment"],
      ],
      theme: "plain",
      styles: {
        fontSize: 10,
      },
    })
  } else {
    autoTable(doc, {
      startY: yPosition + 5,
      body: [
        ["1", "Continue providing excellent service"],
        ["2", "Consider loyalty rewards to maintain satisfaction"],
        ["3", "Explore opportunities for product expansion"],
        ["4", "Use as reference for successful customer relationships"],
      ],
      theme: "plain",
      styles: {
        fontSize: 10,
      },
    })
  }

  // Add footer with logo-like text
  doc.setFontSize(10)
  doc.setTextColor(239, 68, 68) // Red color
  doc.text("CHURN PREDICTOR", 100, doc.internal.pageSize.height - 5,{ align: "center" },)

  doc.setTextColor(100, 100, 100)
  doc.text(
    "This prediction is based on statistical models and should be used as a guide only.",
    100,
    doc.internal.pageSize.height - 20,
    { align: "center" },
  )

  // Save the PDF
  doc.save(`${data.customerName.replace(/\s+/g, "_")}_Churn_Report.pdf`)
}
