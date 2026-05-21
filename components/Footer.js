export default function Footer() {
  return (
    <footer className="bg-[#61063B] py-8 border-t">
        <div className="container mx-auto px-4 text-center text-white">
          <p>© {new Date().getFullYear()} MSU-TCTO Voting System. All rights reserved.</p>
          <p className="mt-2 text-sm">Mindanao State University - Tawi-Tawi College of Technology and Oceanography</p>
        </div>
    </footer>
  )
}
