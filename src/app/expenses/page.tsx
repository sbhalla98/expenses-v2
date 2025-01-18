"use client";

import { put } from "@vercel/blob";
import { useEffect } from "react";

export default function Expenses() {
  const postData = async () => {
    try {
      const res = await put("articles/blob.txt", "Hello World!", {
        access: "public",
      });
      console.log("res", res);
    } catch (e) {
      console.log("ERROR", e);
    }
  };
  useEffect(() => {
    postData;
  }, []);
  return <div className="">Hey vishal</div>;
}
