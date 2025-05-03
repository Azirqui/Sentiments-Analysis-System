import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-darkblue text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">HeartPredict</h3>
            <p className="text-gray-300">
              Advanced heart disease prediction using machine learning to help you understand your risk factors.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/predict" className="text-gray-300 hover:text-white">
                  Prediction Test
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p>Email: info@heartpredict.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Address: 123 Health Street, Medical City</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} HeartPredict. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
