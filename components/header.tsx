"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitIc, Moustache } from "./ui/icons";

const links = [
  {
    title: "Pricing",
    path: "/pricing",
    name: "pricing",
  },
  {
    title: "Updates",
    path: "/updates",
    name: "updates",
  }
];

const listVariant = {
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const itemVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export function Header() {
  const [isOpen, setOpen] = useState(false);

  const handleToggleMenu = () => {
    setOpen((prev) => {
      document.body.style.overflow = prev ? "" : "hidden";
      return !prev;
    });
  };

  return (
    <header className="h-12 sticky mt-4 top-4 z-50 px-2 md:px-4 md:flex justify-center">
      <nav className="border border-[#63e] p-3 rounded-2xl flex items-center backdrop-filter backdrop-blur-xl bg-[#121212] bg-opacity-70">
        <Link href="/">
          <span className="sr-only">
            Gentleman Transcript Logo
          </span>
          <Moustache className="size-10 text-white" />
        </Link>

        <ul className="space-x-2 font-medium text-sm hidden md:flex mx-3">
          {links.map(({ path, title }) => (
            <li key={path}>
              <Link
                href={path}
                className="h-8 items-center !text-white justify-center rounded-md text-sm font-medium transition-colors px-3 py-2 inline-flex text-secondary-foreground hover:bg-[#63e] hover:text-white"
              >
                {title}
              </Link>
            </li>
          ))}
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/felipetodev/gentleman-transcript"
              className="h-8 items-center !text-white justify-center rounded-md text-sm font-medium transition-colors px-3 py-2 inline-flex text-secondary-foreground hover:bg-[#63e] hover:text-white"
            >
              GitHub
            </a>
          </li>
        </ul>

        <Link
          href="/app"
          className="hidden md:inline-flex h-8 items-center justify-center rounded-md text-sm font-medium transition-colors px-3 py-2 text-primary-foreground bg-[#63e] hover:bg-[#63e]/90"
        >
          Sign in
        </Link>
        <button
          type="button"
          className="ml-auto md:hidden p-2 text-secondary"
          onClick={() => handleToggleMenu()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={13}
            fill="none"
          >
            <path
              fill="currentColor"
              d="M0 12.195v-2.007h18v2.007H0Zm0-5.017V5.172h18v2.006H0Zm0-5.016V.155h18v2.007H0Z"
            />
          </svg>
        </button>
      </nav>
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 left-0 bottom-0 h-screen z-10 px-1 m-[1px] [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mt-4 flex justify-between p-3 px-4 relative">
            <button type="button" onClick={handleToggleMenu}>
              <span className="sr-only">Gentleman Transcript Logo</span>
              <Moustache className="size-10 text-white" />
            </button>

            <button
              type="button"
              className="ml-auto md:hidden p-2 absolute right-[10px] top-2"
              onClick={handleToggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                className="fill-white"
              >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          </div>

          <div className="h-full overflow-auto">
            <motion.ul
              initial="hidden"
              animate="show"
              className="px-3 pt-8 text-xl text-white space-y-8 mb-8"
              variants={listVariant}
            >
              {links.map(({ path, title }) => {
                return (
                  <motion.li variants={itemVariant} key={path}>
                    <Link
                      href={path}
                      onClick={handleToggleMenu}
                    >
                      {title}
                    </Link>
                  </motion.li>
                );
              })}

              <motion.li
                variants={itemVariant}
                className="flex items-center space-x-2"
              >
                <GitIc className="size-6" />
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/felipetodev/gentleman-transcript"
                >
                  Open Source
                </Link>
              </motion.li>

              <motion.li
                className="mt-auto border-t-[1px] pt-8"
                variants={itemVariant}
              >
                <Link
                  href="/app"
                  className="inline-flex h-8 items-center justify-center rounded-md font-medium transition-colors px-4 py-5 text-primary-foreground bg-[#63e] hover:bg-[#63e]/90"
                >
                  Sign in
                </Link>
              </motion.li>
            </motion.ul>
          </div>
        </motion.div>
      )}
    </header>
  );
}
