function Footer() {
  return (
    <footer className="mt-auto py-4 text-center text-xs text-gray-400">
  <div className="mb-1">
    © 2025 Badr M. All rights reserved.
  </div>
  <div className="flex justify-center gap-4 mb-2">
    <a href="https://github.com/badr540" className="hover:text-gray-600">GitHub</a>
    <a href="https://linkedin.com/in/badr-althubaiti-60a079ba" className="hover:text-blue-500">LinkedIn</a>
    <a href="mailto:badrbm540@gmail.com" className="hover:text-red-500">Email</a>
  </div>
  <div>Built with React & Tailwind CSS</div>
</footer>
  );
}

export default Footer