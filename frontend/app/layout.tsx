// Assuming this is the root layout where we might manage global transitions or context.
import { motion } from 'framer-motion';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap content with motion.div for potential root transitions */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }} // Base transition example
        >
          {children}
        </motion.div>
      </body>
    </html>
  );
}