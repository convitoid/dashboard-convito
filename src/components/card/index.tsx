"use client";
import React from "react";

type CardProps = {
  title: string;
  cardWrapper?: string;
  cardTitleStyle?: string;
  children?: React.ReactNode;
};

export const Card = ({
  title,
  cardWrapper,
  cardTitleStyle,
  children,
}: CardProps) => {
  return (
    <div className={`card ${cardWrapper ?? "bg-base-300 w-96 shadow-xl"}`}>
      <div className="card-body">
        <h2 className={`card-title ${cardTitleStyle}`}>{title}</h2>
        {children}
      </div>
    </div>
  );
};
