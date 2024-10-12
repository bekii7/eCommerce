import { MdEmail, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="mt-20 text-white bg-gray-900">
      <div className="container grid grid-cols-1 gap-10 px-12 py-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
        {/* Column 1: About */}
        <div>
          <h3 className="mb-4 font-bold">About Us</h3>
          <p className="text-sm text-gray-400">
            We are a leading online store offering a wide variety of products.
            Our mission is to provide quality products and excellent customer
            service.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="mb-4 font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-orange-500">
                About
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:text-orange-500">
                Shop
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-orange-500">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div>
          <h3 className="mb-4 font-bold">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/shipping" className="hover:text-orange-500">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-orange-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-orange-500">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div>
          <h3 className="mb-4 font-bold">Contact Us</h3>
          <p className="mb-2 text-sm font-semibold text-gray-400">
            Have questions or need help? Reach out to us!
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdPhone size={18} />
              <span className="text-gray-400">Phone: (123) 456-7890</span>
            </li>
            <li className="flex items-center gap-2">
              <MdEmail size={18} />
              <span className="text-gray-400">Email: support@onlinesh.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="py-4 text-sm font-light text-center text-gray-500 border-t border-gray-700">
        <p>
          &copy; {new Date().getFullYear()} Online Shopping. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
