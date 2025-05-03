import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Heart, Activity, Award, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-darkblue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Heart Disease Prediction Using AI</h1>
              <p className="text-xl mb-6">
                Predict your risk of heart disease with our advanced machine learning model. Get accurate insights based
                on your health data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-darkblue hover:bg-opacity-10 hover:bg-white">
                  <Link href="/predict">Take the Test</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-darkblue border-white hover:bg-opacity-10 hover:bg-white"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Heart className="w-full h-full text-white/20" />
                <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Use Our Heart Disease Prediction Tool?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <Award className="h-8 w-8 text-darkblue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accurate Predictions</h3>
                  <p className="text-gray-600">
                    Our model is trained on extensive medical data to provide accurate risk assessments.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <Activity className="h-8 w-8 text-darkblue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Results</h3>
                  <p className="text-gray-600">Get immediate feedback on your heart health risk factors.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <Users className="h-8 w-8 text-darkblue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Expert Developed</h3>
                  <p className="text-gray-600">Created by healthcare professionals and data scientists.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to Check Your Heart Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Take our quick assessment to get insights about your heart disease risk factors.
          </p>
          <Button asChild size="lg" className="bg-darkblue hover:bg-opacity-90">
            <Link href="/predict" className="flex items-center gap-2">
              Take the Test Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
