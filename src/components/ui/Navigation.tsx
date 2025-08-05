"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "@/lib/stores/app";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { viewMode, currentOrganisation, setCurrentOrganisation } =
    useAppStore();

  const navItems = [
    { name: "Timer", href: "/timer", icon: "⏱" },
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Projects", href: "/projects", icon: "📁" },
    { name: "Reports", href: "/reports", icon: "📈" },
    { name: "Settings", href: "/settings", icon: "⚙" },
  ];

  if (viewMode === "organisation") {
    navItems.splice(2, 0, {
      name: "Organisation",
      href: "/organisation",
      icon: "🏢",
    });
  }

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <button type="button" className="btn btn-ghost lg:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Menu"
            >
              <title>Menu</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          Amser
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        {session?.user?.organisations &&
          session.user.organisations.length > 0 && (
            <div className="dropdown dropdown-end mr-4">
              <button type="button" className="btn btn-outline btn-sm">
                {viewMode === "organisation" && currentOrganisation
                  ? currentOrganisation.name
                  : "Personal"}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Dropdown arrow"
                >
                  <title>Dropdown arrow</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[1]">
                <li>
                  <button
                    type="button"
                    onClick={() => setCurrentOrganisation(null)}
                    className={viewMode === "personal" ? "active" : ""}
                  >
                    Personal
                  </button>
                </li>
                {session.user.organisations.map((org) => (
                  <li key={org._id}>
                    <button
                      type="button"
                      onClick={() => setCurrentOrganisation(org)}
                      className={
                        currentOrganisation?._id === org._id ? "active" : ""
                      }
                    >
                      {org.name}
                      <span className="badge badge-xs ml-auto">{org.role}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {session?.user ? (
          <div className="dropdown dropdown-end">
            <button type="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                    {session.user.name?.charAt(0) ||
                      session.user.email?.charAt(0)}
                  </div>
                )}
              </div>
            </button>
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href="/settings" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => signOut()}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/api/auth/signin" className="btn btn-primary">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
