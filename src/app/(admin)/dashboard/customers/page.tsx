"use client";
import { useEffect } from "react";

const CustomerPage = () => {
  useEffect(() => {
    document.title = "Cenvito - Customers";
  }, []);
  return (
    <div>
      <h1>Customers</h1>
    </div>
  );
};

export default CustomerPage;
