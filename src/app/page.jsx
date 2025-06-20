"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function HelloRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/main");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return <h1>Hello</h1>;
}