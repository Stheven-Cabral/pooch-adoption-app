"use client";

import styles from "./page.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className={`${styles.welcomeScreen} bg-white d-flex flex-column justify-content-center align-items-center`}
    >
      <motion.img
        src="/doodle.png"
        alt="Pawfect Pals Logo"
        aria-label="Cute Pooch Pal"
        className={styles.welcomeImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5 }}
      />
      <h1 className="mx-4 mt-3 text-center">Welcome to Pooch Pals!</h1>
      <p className="mb-4 mt-3">Find your new best friend today.</p>
      <Link href="/login" className="buttonLink" tabIndex={0} role="button">
        Find a Pooch
      </Link>
    </div>
  );
}
