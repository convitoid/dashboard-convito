"use client";
import React from "react";

type CardProps = {
  cardWrapper?: string;
  children?: React.ReactNode;
};

export const Card = ({ cardWrapper, children }: CardProps) => {
  return (
    <div className={`card ${cardWrapper ?? "bg-base-300 w-96 shadow-xl"}`}>
      <div className="card-body">{children}</div>
    </div>
  );
};
