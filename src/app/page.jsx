"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function HelloRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/main");
  }, [router]);

  return;
}