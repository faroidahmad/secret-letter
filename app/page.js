"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [showWrite, setShowWrite] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("3");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function createLetter() {
    if (!recipient.trim() || !message.trim()) {
      setError("Please fill in the recipient and your message.");
      return;
    }

    setLoading(true);
    setError("");

    let expiresAt = null;

    if (duration !== "forever") {
      const date = new Date();
      date.setDate(date.getDate() + Number(duration));
      expiresAt = date.toISOString();
    }

    const letterCode =
  crypto.randomUUID().replaceAll("-", "");

const { error: insertError } = await supabase
  .from("letters")
  .insert({
    recipient_name: recipient.trim(),
    message: message.trim(),
    expires_at: expiresAt,
    is_premium: false,
    is_read: false,
    letter_code: letterCode,
  });

    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            ✉️
          </div>

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
      ) : success ? (
        <div style={{ maxWidth: "500px" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>
            🕊️
          </div>

          <h1 style={{ fontSize: "34px" }}>
            Your letter is ready.
          </h1>

          <p
            style={{
              fontSize: "17px",
              fontStyle: "italic",
              lineHeight: "1.7",
            }}
          >
            Your message has been safely placed in the world,
            waiting to find its recipient.
          </p>

          <button
            onClick={() => {
              setSuccess(false);
              setShowWrite(false);
              setRecipient("");
              setMessage("");
              setDuration("3");
            }}
            style={{
              marginTop: "25px",
              background: "#3b3028",
              color: "#fffaf3",
              border: "none",
              padding: "14px 28px",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            ← Back Home
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div style={{ fontSize: "42px", marginBottom: "12px" }}>
            💌
          </div>

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
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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
              background: "#fffaf3",
            }}
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
              background: "#fffaf3",
            }}
          />

          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <p style={{ fontWeight: "bold" }}>
              How long should this letter live?
            </p>

            <label>
              <input
                type="radio"
                name="duration"
                value="3"
                checked={duration === "3"}
                onChange={(e) => setDuration(e.target.value)}
              />{" "}
              3 Days
            </label>

            <br />

            <label>
              <input
                type="radio"
                name="duration"
                value="7"
                checked={duration === "7"}
                onChange={(e) => setDuration(e.target.value)}
              />{" "}
              7 Days
            </label>

            <br />

            <label>
              <input
                type="radio"
                name="duration"
                value="30"
                checked={duration === "30"}
                onChange={(e) => setDuration(e.target.value)}
              />{" "}
              30 Days
            </label>

            <br />

            <label>
              <input
                type="radio"
                name="duration"
                value="forever"
                checked={duration === "forever"}
                onChange={(e) => setDuration(e.target.value)}
              />{" "}
              Forever
            </label>
          </div>

          {error && (
            <p style={{ color: "#9b2c2c", marginTop: "20px" }}>
              {error}
            </p>
          )}

          <button
            onClick={createLetter}
            disabled={loading}
            style={{
              marginTop: "30px",
              background: "#3b3028",
              color: "#fffaf3",
              border: "none",
              padding: "16px 32px",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: loading ? "wait" : "pointer",
              fontFamily: "Georgia, serif",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Letter"}
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
