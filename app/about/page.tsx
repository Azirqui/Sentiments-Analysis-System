import { Card, CardContent } from "@/components/ui/card"
import { Heart, Activity, Brain, Stethoscope } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-darkblue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About HeartPredict</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're dedicated to providing accurate heart disease risk assessment using advanced machine learning
            technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At HeartPredict, our mission is to make heart disease prediction accessible to everyone. We believe that
                early detection and awareness can save lives.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our team of healthcare professionals and data scientists has developed a sophisticated machine learning
                model that analyzes various health parameters to predict the risk of heart disease.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to continuous improvement of our prediction model and providing valuable insights that
                can help people make informed decisions about their heart health.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Heart className="w-full h-full text-gray-100" />
                <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-darkblue" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our Prediction Model Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-darkblue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Machine Learning Algorithm</h3>
                    <p className="text-gray-600">
                      Our model uses a Random Forest Classifier, a powerful machine learning algorithm that analyzes
                      multiple health parameters to predict heart disease risk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Stethoscope className="h-6 w-6 text-darkblue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Medical Data Analysis</h3>
                    <p className="text-gray-600">
                      We analyze 13 key health parameters including age, blood pressure, cholesterol levels, and other
                      important indicators to provide an accurate risk assessment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Khan",
                role: "Cardiologist",
                bio: "With over 15 years of experience in cardiology, Dr. Sarah leads our medical team.",
                image: "/images/womenDr1.jpeg",
              },
              {
                name: "Dr. Muhammad Ali",
                role: "Data Scientist",
                bio: "Dr. Ali specializes in machine learning applications in healthcare.",
                image: "/images/d2.jpeg",
              },
              {
                name: "Dr. Muhammad Awais",
                role: "Healthcare Researcher",
                bio: "Dr. Awais focuses on translating complex medical data into actionable insights.",
                image: "/images/d6.jpeg",
              },
            ].map((member, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-darkblue font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
