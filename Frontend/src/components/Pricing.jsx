import { motion } from "framer-motion";
import Section from "./Section";
import Heading from "./Heading";
import PricingList from "./PricingList";

const Pricing = () => {
  return (
    <Section className="overflow-hidden py-20 bg-white relative z-10" id="pricing">
      <div className="container relative z-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-[50rem] mx-auto mb-12 lg:mb-20 text-center">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-primary/10 rounded-full text-sm font-semibold text-primary-700">
                Get started with MindSpace
              </span>
            </div>
            <h2 className="h2 text-gray-900">Simple, Transparent Pricing</h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <PricingList />
        </motion.div>
      </div>
    </Section>
  );
};

export default Pricing;
