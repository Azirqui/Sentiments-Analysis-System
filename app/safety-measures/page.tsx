import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Apple, Cigarette, Wine, Moon, SpaceIcon, Stethoscope, ArrowRight, CheckCircle2, Activity } from "lucide-react"

export default function SafetyMeasuresPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Heart Health Safety Measures</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Evidence-based recommendations to maintain heart health and reduce the risk of cardiovascular disease.
          </p>
        </div>

        <Tabs defaultValue="diet" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="diet" className="flex items-center gap-1">
              <Apple className="h-4 w-4" />
              <span className="hidden md:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="tobacco" className="flex items-center gap-1">
              <Cigarette className="h-4 w-4" />
              <span className="hidden md:inline">Tobacco</span>
            </TabsTrigger>
            <TabsTrigger value="alcohol" className="flex items-center gap-1">
              <Wine className="h-4 w-4" />
              <span className="hidden md:inline">Alcohol</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-1">
              <Moon className="h-4 w-4" />
              <span className="hidden md:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger value="stress" className="flex items-center gap-1">
              <SpaceIcon className="h-4 w-4" />
              <span className="hidden md:inline">Stress</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-1">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden md:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>

          <Card>
            <TabsContent value="diet" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-darkblue" />
                  <span>1. Adopt a Heart-Healthy Diet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Emphasize a diet rich in:</h3>
                  <ul className="space-y-3">
                    {[
                      "Fruits and vegetables",
                      "Whole grains",
                      "Lean proteins (e.g., fish, legumes, nuts)",
                      "Low-fat dairy products",
                      "Healthy fats (e.g., olive oil)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Limit intake of:</h3>
                  <ul className="space-y-3">
                    {["Saturated and trans fats", "Added sugars", "Excess sodium", "Ultra-processed foods"].map(
                      (item, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="italic">
                    "The WHO emphasizes reducing salt and increasing fruit and vegetable consumption to lower
                    cardiovascular disease risk."
                  </p>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p className="font-medium mb-1">Sources:</p>
                  <ul className="space-y-1">
                    <li>World Heart Federation</li>
                    <li>American Heart Association (www.heart.org)</li>
                    <li>EatingWell</li>
                    <li>UCSF Health</li>
                    <li>CDC</li>
                    <li>World Health Organization (WHO)</li>
                    <li>Business Insider</li>
                  </ul>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-darkblue" />
                  <span>2. Engage in Regular Physical Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Aim for at least 150 minutes of moderate-intensity exercise per week, such as brisk walking or
                  cycling. Regular activity helps manage weight, blood pressure, cholesterol, and blood sugar levels.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Benefits of Regular Exercise:</h3>
                  <ul className="space-y-3">
                    {[
                      "Strengthens heart muscle",
                      "Lowers blood pressure",
                      "Improves cholesterol levels",
                      "Helps maintain healthy weight",
                      "Reduces stress and anxiety",
                      "Improves sleep quality",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2">Recommended Activities:</h3>
                  <ul className="space-y-2">
                    <li>• Brisk walking</li>
                    <li>• Swimming</li>
                    <li>• Cycling</li>
                    <li>• Dancing</li>
                    <li>• Gardening</li>
                    <li>• Stair climbing</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p className="font-medium mb-1">Sources:</p>
                  <ul className="space-y-1">
                    <li>The Guardian</li>
                    <li>CDC</li>
                    <li>World Heart Federation</li>
                  </ul>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="tobacco" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Cigarette className="h-5 w-5 text-darkblue" />
                  <span>3. Avoid Tobacco Use</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Smoking significantly increases heart disease risk. Quitting smoking can rapidly reduce this risk,
                  with benefits starting within a year of cessation.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Benefits of Quitting Tobacco:</h3>
                  <ul className="space-y-3">
                    {[
                      "20 minutes after: Heart rate drops",
                      "12 hours after: Carbon monoxide levels normalize",
                      "2-12 weeks after: Circulation improves and lung function increases",
                      "1-9 months after: Coughing and shortness of breath decrease",
                      "1 year after: Risk of coronary heart disease is half that of a smoker",
                      "5-15 years after: Stroke risk is reduced to that of a non-smoker",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="italic">
                    "Tobacco use is a major cause of cardiovascular disease, responsible for approximately one in four
                    deaths from heart disease."
                  </p>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p className="font-medium mb-1">Sources:</p>
                  <ul className="space-y-1">
                    <li>CDC</li>
                    <li>World Heart Federation</li>
                  </ul>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="alcohol" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Wine className="h-5 w-5 text-darkblue" />
                  <span>4. Limit Alcohol Consumption</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Excessive alcohol intake can raise blood pressure and contribute to heart disease. If you choose to
                  drink, do so in moderation.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Recommended Limits:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Men: Up to 2 drinks per day</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Women: Up to 1 drink per day</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consider alcohol-free days each week</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">How Alcohol Affects Heart Health:</h3>
                  <ul className="space-y-3">
                    {[
                      "Raises blood pressure",
                      "Increases triglycerides in the blood",
                      "Can lead to irregular heartbeat (arrhythmias)",
                      "Contributes to obesity, which is a risk factor for heart disease",
                      "May interact with medications",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="italic">
                    "If you don't drink alcohol, don't start because of potential health benefits. If you choose to
                    drink, do so only in moderation."
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="sleep" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-darkblue" />
                  <span>5. Prioritize Quality Sleep</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Poor sleep can lead to hormonal imbalances affecting cholesterol and blood pressure. Aim for 7–9 hours
                  of quality sleep per night to support heart health.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Sleep Hygiene Tips:</h3>
                  <ul className="space-y-3">
                    {[
                      "Maintain a consistent sleep schedule",
                      "Create a restful environment (dark, quiet, comfortable)",
                      "Limit screen time before bed",
                      "Avoid caffeine and large meals before sleeping",
                      "Exercise regularly, but not close to bedtime",
                      "Manage stress through relaxation techniques",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">How Poor Sleep Affects Heart Health:</h3>
                  <ul className="space-y-3">
                    {[
                      "Increases stress hormones",
                      "Raises blood pressure",
                      "Contributes to inflammation",
                      "Affects glucose metabolism",
                      "May lead to weight gain",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="italic">
                    "Sleep is not a luxury but a necessity for heart health. Quality sleep is as important as diet and
                    exercise in preventing heart disease."
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="stress" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <SpaceIcon className="h-5 w-5 text-darkblue" />
                  <span>6. Manage Stress Effectively</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Chronic stress may contribute to heart disease. Incorporate stress-reducing practices such as
                  mindfulness, meditation, or yoga into your routine.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Stress Management Techniques:</h3>
                  <ul className="space-y-3">
                    {[
                      "Deep breathing exercises",
                      "Regular physical activity",
                      "Mindfulness meditation",
                      "Yoga or tai chi",
                      "Adequate rest and relaxation",
                      "Social connection and support",
                      "Time in nature",
                      "Hobbies and activities you enjoy",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">How Stress Affects Heart Health:</h3>
                  <ul className="space-y-3">
                    {[
                      "Increases heart rate and blood pressure",
                      "Triggers inflammation",
                      "May lead to unhealthy coping behaviors (overeating, smoking, drinking)",
                      "Disrupts sleep patterns",
                      "Contributes to anxiety and depression",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="italic">
                    "Finding healthy ways to manage stress is essential for heart health and overall wellbeing."
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="metrics" className="mt-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-darkblue" />
                  <span>7. Monitor and Manage Health Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6">
                  Regularly check and manage key health indicators to prevent heart disease. Controlling these factors
                  is crucial in preventing heart disease.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Key Metrics to Monitor:</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        metric: "Blood pressure",
                        target: "Target: Below 120/80 mmHg",
                        info: "High blood pressure is a major risk factor for heart disease and stroke.",
                      },
                      {
                        metric: "Cholesterol levels",
                        target: "Target: Total cholesterol below 200 mg/dL",
                        info: "LDL (bad) cholesterol should be below 100 mg/dL, HDL (good) cholesterol should be 60 mg/dL or higher.",
                      },
                      {
                        metric: "Blood sugar levels",
                        target: "Target: Fasting blood sugar below 100 mg/dL",
                        info: "High blood sugar can damage blood vessels and the nerves that control your heart.",
                      },
                      {
                        metric: "Body weight",
                        target: "Target: BMI between 18.5-24.9",
                        info: "Excess weight, especially around the waist, increases the risk of heart disease.",
                      },
                    ].map((item, i) => (
                      <li key={i} className="mb-2">
                        <div className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-darkblue mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{item.metric}</span>
                            <div className="text-sm text-gray-600 mt-1">{item.target}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.info}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2">Recommended Check-up Schedule:</h3>
                  <ul className="space-y-2">
                    <li>• Blood pressure: At least once a year</li>
                    <li>• Cholesterol: Every 4-6 years for average-risk adults</li>
                    <li>• Blood sugar: Every 3 years after age 45</li>
                    <li>• Weight: At every regular healthcare visit</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p className="font-medium mb-1">Sources:</p>
                  <ul className="space-y-1">
                    <li>EatingWell</li>
                    <li>World Heart Federation</li>
                    <li>UC Davis Health</li>
                  </ul>
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            These recommendations are based on guidelines from leading health organizations. Always consult with your
            healthcare provider for personalized advice.
          </p>
        </div>
      </div>
    </div>
  )
}