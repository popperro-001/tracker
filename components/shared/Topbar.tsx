"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

import Logo from "@/public/assets/images/logo.svg";

const Topbar = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    (async () => {
      const response = await getProviders();

      setProviders(response);
    })();
  }, []);

  return (
    <nav className="flex-between w-full mb-4 pt-3 sm:px-16 px-6 sticky top-0 backdrop-blur-lg z-50">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src={Logo}
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="max-sm:hidden font-semibold text-lg tracking-wide text-black">
          PlanItTrack
        </p>
      </Link>

      {/* Mobile Navigation */}
      <div className="flex">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => signOut()}
              className="border rounded-3xl py-1 px-4 text-base border-black hover:bg-black hover:text-white"
            >
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src={session?.user?.image || ""}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="border rounded-3xl py-2 px-5 text-lg text-white bg-black border-black hover:bg-white hover:text-black"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Topbar;
