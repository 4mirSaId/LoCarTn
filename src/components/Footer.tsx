const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 px-6 mt-8 rounded-lg shadow-md">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} LoCarTn. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;