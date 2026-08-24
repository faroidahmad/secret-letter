"use client";

import { useState } from "react";

export default function Home() {
  const [showWrite, setShowWrite] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        color: "#3b3028",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "Georgia, serif",
      }}
    >
      {!showWrite ? (
        <div style={{ maxWidth: "600px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>

          <h1
            style={{
              fontSize: "42px",
              letterSpacing: "3px",
              marginBottom: "10px",
            }}
          >
            SECRET LETTER
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontStyle: "italic",
              marginBottom: "45px",
            }}
          >
            A message meant to find you.
          </p>

          <button
            onClick={() => setShowWrite(true)}
            style={{
              background: "#3b3028",
              color: "#fffaf3",
              border: "none",
              padding: "16px 32px",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            💌 Write a Letter
          </button>

          <p style={{ marginTop: "35px", fontSize: "14px" }}>
            Already have a Secret Letter?
          </p>

          <button
            style={{
              background: "transparent",
              color: "#3b3028",
              border: "1px solid #3b3028",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Enter QR
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div style={{ fontSize: "42px", marginBottom: "12px" }}>💌</div>

          <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
            Write a Secret Letter
          </h1>

          <p
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              marginBottom: "30px",
            }}
          >
            Write something meant to find someone.
          </p>

          <input
            type="text"
            placeholder="Who is this letter for?"
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #c9bfb3",
              borderRadius: "6px",
              fontSize: "16px",
              boxSizing: "border-box",
              fontFamily: "Georgia, serif",
            }}
          />

          <textarea
            placeholder="Write your message..."
            rows="8"
            style={{
              width: "100%",
              padding: "15px",
              border: "1px solid #c9bfb3",
              borderRadius: "6px",
              fontSize: "16px",
              boxSizing: "border-box",
              resize: "vertical",
              fontFamily: "Georgia, serif",
            }}
          />

          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <p style={{ fontWeight: "bold" }}>
              How long should this letter live?
            </p>

            <label>
              <input type="radio" name="duration" defaultChecked /> 3 Days
            </label>
            <br />

            <label>
              <input type="radio" name="duration" /> 7 Days
            </label>
            <br />

            <label>
              <input type="radio" name="duration" /> 30 Days
            </label>
            <br />

            <label>
              <input type="radio" name="duration" /> Forever
            </label>
          </div>

          <button
            style={{
              marginTop: "30px",
              background: "#3b3028",
              color: "#fffaf3",
              border: "none",
              padding: "16px 32px",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Create Letter
          </button>

          <br />

          <button
            onClick={() => setShowWrite(false)}
            style={{
              marginTop: "20px",
              background: "transparent",
              border: "none",
              color: "#3b3028",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            ← Back
          </button>
        </div>
      )}
    </main>
  );
}
