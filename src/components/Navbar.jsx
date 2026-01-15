"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Modal from "./Modal";
import { useAuth } from '@/context/authContext' 
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

function Spin({ open, setOpen, className }) {
  return (
    <button
      variant="ghost"
      onClick={() => setOpen(!open)}
      className={`md:hidden w-8.5 h-8 flex flex-col justify-center items-center gap-1.5 
          ml-9 mt-3 transform transition-transform duration-900 
          ${open ? "border-2 border-white" : ""} ${className}`}
    >
      <span
        className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
          open ? "rotate-45 translate-y-2 bg-white" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
          open ? "-rotate-45 -translate-y-2 bg-white" : ""
        }`}
      />
    </button>
  );
}

export default function Navbar({ first, second }) {
  const [open, setOpen] = useState(false);
  const [textColor, setTextColor] = useState(false);
  const [modal, setModal] = useState(false);
  const { logout } = useAuth();
  const { user } = useUser();

  const navLinks = [
    { id: 1, href: "/home", text: "Home" },
    { id: 2, href: "/create", text: "Create Jot" },
    { id: 3, href: "/settings", text: "Settings" },
  ];

  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    setModal(false)
    router.push('/auth/login')
  }

  useEffect(() => {
    if (open) {
      setTextColor("text-cyan-500 dark:text-cyan-800");
      const timer = setTimeout(() => setTextColor("text-white dark:text-black"), 1000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Mobile Navbar
  if (first === "icon") {
    return (
      <>
        <Spin setOpen={setOpen} open={open} className="z-3 relative transition-all duration-1000" />
        
        <div
          className={`fixed inset-0 bg-linear-to-b from-black/70 to-black/70 
            transition-opacity duration-300 md:hidden ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setOpen(false)}
        />

        {modal && (
          <Modal
            open={modal}
            message="Are you sure you want to logout?"
            onConfirm={handleLogout}
            onCancel={() => setModal(false)}
          />
        )}

        <div
          className={`fixed left-0 top-0 h-full w-64 bg-cyan-700 dark:bg-cyan-950 shadow-xl shadow-white/10 transform 
            transition-transform duration-800 pb-safe ${
              open ? "-translate-x-0" : "-translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="h-full flex flex-col">
            <ul className="slidein mt-20 flex flex-col px-5 space-y-5 pt-6 flex-grow">
              {navLinks.map((item) => (
                <li
                  key={item.id}
                  className="bg-black/70 dark:bg-white/70 rounded-md p-2 transition-all duration-300 hover:bg-black/50 dark:hover:bg-white/50 hover:pl-5"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-xl transform-all duration-1000 hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor} block`}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}

              <button
                onClick={() => setModal(true)}
                className={`text-left text-xl bg-black/70 dark:bg-white/70 rounded-md p-2 
                  transition-all duration-300 hover:bg-red-900 dark:hover:bg-red-950 hover:text-cyan-500 dark:hover:text-cyan-700 hover:pl-5 ${textColor}`}
              >
                Logout
              </button>
            </ul>
              
            {/* Profile Section at Bottom */}
            {user && (
              <div className="mt-auto mb-10 px-5 pb-4">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-white text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.email}</p>
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </>
    );
  }

  // Desktop Navbar
  if (second === "plain") {
    return (
      <>
        <nav>
          <ul className="flex space-x-4 py-0 items-center">
            {navLinks.map((item) => (
              <li key={item.id} className="tracking-tight text-white hover:font-semibold xl:text-lg">
                <Link href={item.href}>{item.text}</Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => setModal(true)}
                className="tracking-tight text-white hover:font-semibold xl:text-lg"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
        {modal && typeof document !== 'undefined' && createPortal(
          <Modal
            open={modal}
            message="Are you sure you want to logout?"
            onConfirm={handleLogout}
            onCancel={() => setModal(false)}
          />,
          document.body
        )}
      </>
    );
  }
}