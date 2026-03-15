import React from "react";
import { Atom } from "react-loading-indicators";

export default function LoadingComponent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Atom color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
    </div>
  );
}
