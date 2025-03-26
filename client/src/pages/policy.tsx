import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function PolicyPage() {
  return (
    <MainLayout>
      <motion.div
        className="container px-4 py-16 mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeIn("up", "tween", 0, 1)}
      >
        <h1 className="text-4xl font-bold mb-8 text-primary">Company Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Privacy Policy</h2>
            <p>
              At TechBrain, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
            </p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Information Collection</h3>
            <p>
              We may collect the following information:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Name and contact information</li>
              <li>Demographic information</li>
              <li>Technical information about your device and browsing</li>
              <li>Other information relevant to customer surveys and offers</li>
            </ul>
            <h3 className="text-xl font-semibold mt-4 mb-2">Use of Information</h3>
            <p>
              We use this information to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Improve our products and services</li>
              <li>Personalize your experience</li>
              <li>Process transactions</li>
              <li>Send periodic emails</li>
              <li>Respond to inquiries and service requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights and are required to keep the information confidential.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cookie Policy</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.
            </p>
            <p className="mt-2">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Understand and save user preferences</li>
              <li>Compile aggregate data about site traffic and interactions</li>
              <li>Enhance user experience</li>
              <li>Assist in our marketing efforts</li>
            </ul>
            <p className="mt-2">
              You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Environmental Policy</h2>
            <p>
              TechBrain is committed to reducing its environmental impact and continually improving its environmental performance as an integral part of its business strategy. We will:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Reduce waste and optimize resource efficiency</li>
              <li>Minimize energy and water consumption</li>
              <li>Comply with all relevant environmental legislation</li>
              <li>Promote environmental awareness among our employees</li>
              <li>Work with suppliers who share our environmental values</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Equal Opportunity Policy</h2>
            <p>
              TechBrain is an equal opportunity employer. We prohibit discrimination and harassment of any kind based on race, color, sex, religion, age, national origin, disability, genetic information, or any other protected characteristic.
            </p>
            <p className="mt-2">
              This policy applies to all employment practices within our organization, including hiring, recruiting, promotion, termination, layoff, compensation, training, and benefits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Customer Service Policy</h2>
            <p>
              TechBrain is dedicated to providing exceptional customer service. We aim to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Respond to all inquiries within 24 hours</li>
              <li>Resolve issues in a timely and effective manner</li>
              <li>Provide clear and helpful information</li>
              <li>Continuously improve our service based on customer feedback</li>
              <li>Treat all customers with respect and courtesy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Quality Assurance Policy</h2>
            <p>
              TechBrain is committed to delivering high-quality products and services that meet or exceed customer expectations. Our quality assurance policy includes:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Regular review and improvement of processes</li>
              <li>Thorough testing and inspection procedures</li>
              <li>Continuous staff training and development</li>
              <li>Adherence to industry standards and best practices</li>
              <li>Collection and implementation of customer feedback</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Health and Safety Policy</h2>
            <p>
              TechBrain is committed to providing a safe and healthy workplace for all employees. We will:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Comply with all relevant health and safety regulations</li>
              <li>Provide appropriate training and supervision</li>
              <li>Maintain safe equipment and systems of work</li>
              <li>Regularly assess and mitigate risks</li>
              <li>Consult with employees on health and safety matters</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Corporate Social Responsibility Policy</h2>
            <p>
              TechBrain acknowledges its responsibility to the communities in which it operates. We are committed to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Supporting local community initiatives</li>
              <li>Encouraging employee volunteerism</li>
              <li>Minimizing our environmental footprint</li>
              <li>Practicing ethical business behavior</li>
              <li>Supporting education and skills development in technology</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Policy Changes</h2>
            <p>
              TechBrain reserves the right to modify these policies at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes indicates your acceptance of the modified policies.
            </p>
          </section>

          <p className="mt-8 text-gray-600">
            Last updated: March 26, 2025
          </p>
        </div>
      </motion.div>
    </MainLayout>
  );
}