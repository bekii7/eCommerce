import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="py-6">
      <div className="container px-4 mx-auto">
        {/* Section Title */}
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
          About Us
        </h1>
        
        {/* Content Container */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg md:flex-row">
          {/* Image Section */}
          <div className="flex justify-center md:w-1/2">
            <img
              src="/preview.webp"
              alt="About Us"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Info Section */}
          <div className="mt-8 md:mt-0 md:w-1/2 md:ml-12">
            <h2 className="mb-4 text-3xl font-semibold text-gray-800">
              Welcome to BER
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              At BER, we are dedicated to bringing you the finest
              products at affordable prices. Our mission is to provide an
              exceptional shopping experience that combines quality, value, and
              a commitment to customer satisfaction. Whether you're looking for
              the latest trends, unique items, or everyday essentials, we've got
              you covered!
            </p>
            
            {/* Contact Info */}
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              Get in Touch
            </h3>
            <div className="flex flex-col space-y-4">
              {/* Phone Numbers */}
              <div className="flex items-center">
                <div className="p-3 mr-4 text-white bg-black rounded-full">
                  <FaPhone />
                </div>
                <p className="text-lg text-gray-700">+251-910-460-568</p>
              </div>
              <div className="flex items-center">
                <div className="p-3 mr-4 text-white bg-black rounded-full">
                  <FaPhone />
                </div>
                <p className="text-lg text-gray-700">+251-954-988-402</p>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <div className="p-3 mr-4 text-white bg-black rounded-full">
                  <FaEnvelope />
                </div>
                <p className="text-lg text-gray-700">support@ourwebsite.com</p>
              </div>

              {/* Location */}
              <div className="flex items-center">
                <div className="p-3 mr-4 text-white bg-black rounded-full">
                  <FaMapMarkerAlt />
                </div>
                <p className="text-lg text-gray-700">CMC, Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
