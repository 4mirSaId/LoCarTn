const About = () => (
  <section className="relative z-20 bg-white/90 py-16 px-4 flex flex-col items-center justify-center">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-700">About LocarTn</h2>
      <p className="text-gray-700 text-lg mb-6 whitespace-pre-line">
        LocarTn is a modern car rental platform built to connect drivers with trusted rental agencies across Tunisia. Our mission is to simplify the car rental experience by offering a fast, secure, and transparent online solution tailored to both travelers and local residents.\n\nWhether you are planning a road trip, need a temporary replacement car, or simply want a reliable ride, LocarTn makes the process seamless—from browsing to booking. We work closely with verified rental agencies to ensure quality vehicles, fair prices, and clear communication.\n\nAt LocarTn, we believe in:
      </p>
      <ul className="text-left text-gray-800 text-lg mb-6 space-y-2 mx-auto max-w-lg">
        <li>🚗 <b>Convenience:</b> Book your vehicle in minutes from your phone or computer.</li>
        <li>🔐 <b>Security:</b> Your data and transactions are protected with modern technologies.</li>
        <li>🇹🇳 <b>Local Focus:</b> We support Tunisian agencies and help them reach a wider audience.</li>
        <li>🤝 <b>Transparency:</b> No hidden fees. What you see is what you get.</li>
      </ul>
      <p className="text-gray-700 text-lg mb-0">Join LocarTn and take control of your journey—wherever the road takes you.</p>
    </div>
  </section>
);

export default About;
