"use client";
import React, { FunctionComponent, useEffect, useState } from "react";

const ComingSoonSimple = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();

  useEffect(() => {
    document.title = 'Terms and Conditions - Dashboard'; // Set the document title
  }, []);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/components/ComingSoonSimple")).default;
        setClient(() => newClient);
      }
    })();
  }, []);

  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default ComingSoonSimple;
