export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} MSU-TCTO Voting System. All rights reserved.</p>
          <p className="mt-2 text-sm">Mindanao State University - Tawi-Tawi College of Technology and Oceanography</p>
        </div>
    </footer>
  )
}
