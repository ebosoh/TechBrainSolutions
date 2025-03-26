import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function TermsPage() {
  return (
    <MainLayout>
      <motion.div
        className="container px-4 py-16 mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeIn("up", "tween", 0, 1)}
      >
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Use</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TechBrain's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please refrain from using our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            <p>
              TechBrain provides a variety of IT and technology-related services. By using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide accurate and complete information when required</li>
              <li>Use our services for lawful purposes only</li>
              <li>Not interfere with the proper functioning of our website and services</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not use our services for any illegal or harmful activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p>
              All content on the TechBrain website, including text, graphics, logos, images, software, and other materials, is the property of TechBrain or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p>
              When creating an account with TechBrain, you are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mt-2">
              TechBrain reserves the right to terminate accounts that violate these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Privacy</h2>
            <p>
              Your privacy is important to us. Our use of your information is governed by our Privacy Policy, which is incorporated into these Terms of Use. By using our services, you consent to the collection and use of your information as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              TechBrain and its employees, agents, and representatives shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our services or website. This includes damages for loss of profits, data, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless TechBrain, its officers, directors, employees, agents, and third parties from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these Terms of Use or any activity related to your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. TechBrain is not responsible for the content or practices of these websites. These links are provided for convenience only, and the inclusion of any link does not imply endorsement by TechBrain.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
            <p>
              TechBrain reserves the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes indicates your acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions. Any legal action arising out of or relating to these terms shall be filed in the courts of Nairobi, Kenya.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms of Use, please contact us at:
            </p>
            <address className="mt-2 not-italic">
              TechBrain<br />
              University Way, Nairobi, Kenya<br />
              Email: info@techbrain.co.ke<br />
              Phone: +254 (78) 0010010
            </address>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Severability</h2>
            <p>
              If any provision of these Terms of Use is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining provisions shall remain in full force and effect.
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