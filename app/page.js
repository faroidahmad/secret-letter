"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [showWrite, setShowWrite] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("3");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [letterCode, setLetterCode] = useState("");

  async function createLetter() {
    if (!recipient.trim() || !message.trim()) {
      setError("Please fill in the recipient and your message.");
      return;
    }

    setLoading(true);
    setError("");

    const newLetterCode = crypto
      .randomUUID()
      .replaceAll("-", "");

    let expiresAt = null;

    if (duration !== "forever") {
      const date = new Date();
      date.setDate(date.getDate() + Number(duration));
      expiresAt = date.toISOString();
    }

    const { error: insertError } = await supabase
      .from("letters")
      .insert({
        recipient_name: recipient.trim(),
        message: message.trim(),
        expires_at: expiresAt,
        is_premium: false,
        is_read: false,
        letter_code: newLetterCode,
      });

    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLetterCode(newLetterCode);
    setLoading(false);
    setSuccess(true);
  }

  function resetLetter() {
    setShowWrite(false);
    setSuccess(false);
    setRecipient("");
    setMessage("");
    setDuration("3");
    setLetterCode("");
    setError("");
  }

  const letterUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/letter/${letterCode}`
      : "";

  return (
    <main className="site">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Libre+Baskerville:wght@400;700&display=swap");

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f5eee4;
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(255,255,255,0.8),
              transparent 45%
            ),
            #f5eee4;
          color: #3d3028;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          font-family: "Libre Baskerville", serif;
        }

        .container {
          width: 100%;
          max-width: 620px;
          text-align: center;
        }

        .logo {
          font-family: "Cormorant Garamond", serif;
          font-size: 16px;
          letter-spacing: 6px;
          font-weight: 600;
          margin-bottom: 28px;
        }

        .envelope {
          font-size: 52px;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        h1 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(48px, 12vw, 78px);
          line-height: 0.9;
          font-weight: 500;
          letter-spacing: -2px;
          margin: 0 auto 18px;
          max-width: 560px;
        }

        .tagline {
          font-family: "Great Vibes", cursive;
          font-size: clamp(34px, 8vw, 52px);
          line-height: 1.15;
          margin: 0 auto 42px;
          color: #63483b;
        }

        .primaryButton {
          background: #3d3028;
          color: #fffaf3;
          border: none;
          padding: 16px 34px;
          border-radius: 3px;
          font-family: "Cormorant Garamond", serif;
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .primaryButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(61,48,40,0.18);
        }

        .secondaryArea {
          margin-top: 38px;
        }

        .secondaryText {
          font-family: "Cormorant Garamond", serif;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .secondaryButton {
          background: transparent;
          border: 1px solid #8f7a6c;
          color: #3d3028;
          padding: 10px 25px;
          border-radius: 3px;
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
          cursor: pointer;
        }

        .formCard,
        .qrCard {
          background: rgba(255,250,243,0.88);
          border: 1px solid #d8cbbd;
          padding: 38px 28px;
          box-shadow: 0 18px 45px rgba(72,54,42,0.09);
        }

        .formTitle {
          font-family: "Cormorant Garamond", serif;
          font-size: 38px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .formSubtitle {
          font-family: "Great Vibes", cursive;
          font-size: 30px;
          margin-bottom: 28px;
          color: #63483b;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #cdbfb1;
          background: #fffdf9;
          color: #3d3028;
          padding: 15px;
          margin-bottom: 14px;
          font-family: "Libre Baskerville", serif;
          font-size: 15px;
          border-radius: 2px;
          outline: none;
        }

        textarea {
          resize: vertical;
          line-height: 1.7;
        }

        input:focus,
        textarea:focus {
          border-color: #806656;
        }

        .duration {
          text-align: left;
          margin: 20px 0;
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
        }

        .durationTitle {
          font-weight: 600;
          margin-bottom: 10px;
        }

        .duration label {
          display: block;
          margin: 8px 0;
        }

        .duration input {
          width: auto;
          margin-right: 7px;
        }

        .error {
          color: #9a3434;
          font-size: 13px;
          line-height: 1.5;
          margin: 15px 0;
        }

        .backButton {
          margin-top: 18px;
          background: transparent;
          border: none;
          color: #63483b;
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
          cursor: pointer;
        }

        .successIcon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .successTitle {
          font-family: "Cormorant Garamond", serif;
          font-size: 42px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .successSubtitle {
          font-family: "Great Vibes", cursive;
          font-size: 30px;
          color: #63483b;
          margin-bottom: 25px;
        }

        .qrWrapper {
          display: inline-block;
          padding: 18px;
          background: white;
          border: 1px solid #d6c8ba;
          box-shadow: 0 10px 25px rgba(60,45,35,0.08);
        }

        .brand {
          font-family: "Cormorant Garamond", serif;
          font-size: 21px;
          letter-spacing: 4px;
          font-weight: 600;
          margin-top: 20px;
        }

        .brandTagline {
          font-family: "Great Vibes", cursive;
          font-size: 28px;
          margin-top: 5px;
          color: #63483b;
        }

        .code {
          margin-top: 18px;
          font-size: 10px;
          opacity: 0.45;
          word-break: break-all;
        }

        @media (max-width: 480px) {
          .formCard,
          .qrCard {
            padding: 30px 20px;
          }

          h1 {
            font-size: 52px;
          }

          .tagline {
            font-size: 38px;
          }
        }
      `}</style>

      {!showWrite ? (
        <div className="container">
          <div className="envelope">💌</div>

          <div className="logo">
            SECRET LETTER
          </div>

          <h1>Keep something worth saying.</h1>

          <div className="tagline">
            A message meant to find you.
          </div>

          <button
            className="primaryButton"
            onClick={() => setShowWrite(true)}
          >
            Write a Letter
          </button>

          <div className="secondaryArea">
            <div className="secondaryText">
              Already have a Secret Letter?
            </div>

            <button className="secondaryButton">
              Enter QR
            </button>
          </div>
        </div>
      ) : success ? (
        <div className="container">
          <div className="qrCard">
            <div className="successIcon">💌</div>

            <div className="successTitle">
              Your letter is ready.
            </div>

            <div className="successSubtitle">
              A message meant to find you.
            </div>

            <div className="qrWrapper">
              <div
  style={{
    position: "relative",
    display: "inline-block",
    background: "white",
    padding: "8px",
  }}
>
  <QRCodeSVG
    value={letterUrl}
    size={220}
    level="H"
  />

  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fffaf3",
      padding: "5px 7px",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: "10px",
      lineHeight: "0.9",
      letterSpacing: "1px",
      fontWeight: "700",
      textAlign: "center",
      color: "#3d3028",
      whiteSpace: "nowrap",
    }}
  >
    SECRET
    <br />
    LETTER
  </div>
</div>
            </div>

            <div className="brand">
              SECRET LETTER
            </div>

            <div className="brandTagline">
              A message meant to find you.
            </div>

            <div className="code">
              {letterCode}
            </div>

            <button
              className="backButton"
              onClick={resetLetter}
            >
              ← Back Home
            </button>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="formCard">
            <div className="logo">
              SECRET LETTER
            </div>

            <div className="formTitle">
              Write a Secret Letter
            </div>

            <div className="formSubtitle">
              Say what your heart remembers.
            </div>

            <input
              type="text"
              value={recipient}
              onChange={(e) =>
                setRecipient(e.target.value)
              }
              placeholder="Who is this letter for?"
            />

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your message..."
              rows="9"
            />

            <div className="duration">
              <div className="durationTitle">
                How long should this letter live?
              </div>

              <label>
                <input
                  type="radio"
                  name="duration"
                  value="3"
                  checked={duration === "3"}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />
                3 Days
              </label>

              <label>
                <input
                  type="radio"
                  name="duration"
                  value="7"
                  checked={duration === "7"}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />
                7 Days
              </label>

              <label>
                <input
                  type="radio"
                  name="duration"
                  value="30"
                  checked={duration === "30"}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />
                30 Days
              </label>

              <label>
                <input
                  type="radio"
                  name="duration"
                  value="forever"
                  checked={duration === "forever"}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />
                Forever
              </label>
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              className="primaryButton"
              onClick={createLetter}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Letter"}
            </button>

            <br />

            <button
              className="backButton"
              onClick={() => setShowWrite(false)}
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
