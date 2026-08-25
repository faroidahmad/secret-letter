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

function downloadQR() {
  const svg = document.getElementById("secret-letter-qr");

  if (!svg) {
    return;
  }

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const svgBlob = new Blob(
    [svgString],
    {
      type: "image/svg+xml;charset=utf-8",
    }
  );

  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");

    canvas.width = 900;
    canvas.height = 1100;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }

    // Background
    ctx.fillStyle = "#fffaf3";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Border
    ctx.strokeStyle = "#d8cbbd";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      30,
      30,
      canvas.width - 60,
      canvas.height - 60
    );

    // SECRET LETTER
    ctx.fillStyle = "#3d3028";
    ctx.textAlign = "center";
    ctx.font =
      "600 42px Georgia, serif";

    ctx.fillText(
      "SECRET LETTER",
      canvas.width / 2,
      105
    );

    // Tagline
    ctx.fillStyle = "#63483b";
    ctx.font =
      "italic 32px Georgia, serif";

    ctx.fillText(
      "A message meant to find you.",
      canvas.width / 2,
      160
    );

    // QR
    const qrSize = 650;
    const qrX =
      (canvas.width - qrSize) / 2;
    const qrY = 210;

    ctx.drawImage(
      image,
      qrX,
      qrY,
      qrSize,
      qrSize
    );

    // =================================
    // SECRET LETTER DI DALAM QR
    // =================================

    const labelWidth = 150;
    const labelHeight = 70;

    const labelX =
      canvas.width / 2 - labelWidth / 2;

    const labelY =
      qrY + qrSize / 2 - labelHeight / 2;

    // Background label
    ctx.fillStyle = "#fffaf3";

    ctx.fillRect(
      labelX,
      labelY,
      labelWidth,
      labelHeight
    );

    // Border kecil
    ctx.strokeStyle = "#d8cbbd";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      labelX,
      labelY,
      labelWidth,
      labelHeight
    );

    // SECRET
    ctx.fillStyle = "#3d3028";
    ctx.font =
      "700 22px Georgia, serif";

    ctx.fillText(
      "SECRET",
      canvas.width / 2,
      labelY + 28
    );

    // LETTER
    ctx.fillText(
      "LETTER",
      canvas.width / 2,
      labelY + 52
    );

    // Scan to open
    ctx.fillStyle = "#3d3028";
    ctx.font =
      "500 28px Georgia, serif";

    ctx.fillText(
      "Scan to open",
      canvas.width / 2,
      925
    );

    // Safety message
    ctx.fillStyle = "#6f6258";
    ctx.font =
      "18px Arial, sans-serif";

    ctx.fillText(
      "Keep this QR safe.",
      canvas.width / 2,
      970
    );

    ctx.fillText(
      "Anyone with this QR can open the letter.",
      canvas.width / 2,
      1000
    );

    // Download PNG
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          URL.revokeObjectURL(url);
          return;
        }

        const downloadUrl =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = downloadUrl;
        link.download =
          `secret-letter-${letterCode}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);
        URL.revokeObjectURL(url);
      },
      "image/png"
    );
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
  };

  image.src = url;
}
  
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
              rgba(255, 255, 255, 0.8),
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
          0%,
          100% {
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
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .primaryButton:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px
              rgba(61, 48, 40, 0.18);
        }

        .primaryButton:disabled {
          opacity: 0.65;
          cursor: wait;
          transform: none;
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
          background:
            rgba(255, 250, 243, 0.92);
          border: 1px solid #d8cbbd;
          padding: 38px 28px;
          box-shadow:
            0 18px 45px
              rgba(72, 54, 42, 0.09);
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
          font-family:
            "Libre Baskerville",
            serif;
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
          font-family:
            "Cormorant Garamond",
            serif;
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
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 18px;
          cursor: pointer;
        }

        .successIcon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .successTitle {
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 42px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .successSubtitle {
          font-family:
            "Great Vibes",
            cursive;
          font-size: 30px;
          color: #63483b;
          margin-bottom: 28px;
        }

        .qrWrapper {
          display: inline-block;
          padding: 18px;
          background: white;
          border: 1px solid #d6c8ba;
          box-shadow:
            0 10px 25px
              rgba(60, 45, 35, 0.08);
        }

        .qrInner {
          position: relative;
          display: inline-block;
          background: white;
          padding: 8px;
        }

        .qrLabel {
          position: absolute;
          left: 50%;
          top: 50%;
          transform:
            translate(-50%, -50%);
          background: #fffaf3;
          padding: 5px 7px;
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 10px;
          line-height: 0.9;
          letter-spacing: 1px;
          font-weight: 700;
          text-align: center;
          color: #3d3028;
          white-space: nowrap;
        }

        .brand {
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 21px;
          letter-spacing: 4px;
          font-weight: 600;
          margin-top: 20px;
        }

        .brandTagline {
          font-family:
            "Great Vibes",
            cursive;
          font-size: 28px;
          margin-top: 5px;
          color: #63483b;
        }

        .code {
          margin-top: 15px;
          font-size: 9px;
          opacity: 0.3;
          word-break: break-all;
        }

        .downloadButton {
          display: block;
          margin: 28px auto 0;
          background: #5a4034;
          color: #fff8ef;
          border: 1px solid #765849;
          padding: 12px 28px;
          border-radius: 5px;
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 17px;
          font-weight: 500;
          cursor: pointer;
          box-shadow:
            0 6px 14px
              rgba(60, 45, 35, 0.14);
          transition:
            transform 0.2s,
            background 0.2s,
            box-shadow 0.2s;
        }

        .downloadButton:hover {
          background: #6b4b3c;
          transform: translateY(-2px);
          box-shadow:
            0 9px 18px
              rgba(60, 45, 35, 0.2);
        }

        .downloadButton:active {
          transform: translateY(0);
        }

        .downloadHint {
          margin: 14px auto 0;
          max-width: 360px;
          font-family:
            "Libre Baskerville",
            serif;
          font-size: 10px;
          line-height: 1.7;
          opacity: 0.5;
        }

        .anotherButton {
          margin-top: 20px;
          background: transparent;
          border: 1px solid #8f7a6c;
          color: #3d3028;
          padding: 10px 23px;
          border-radius: 3px;
          font-family:
            "Cormorant Garamond",
            serif;
          font-size: 17px;
          cursor: pointer;
          transition:
            background 0.2s,
            transform 0.2s;
        }

        .anotherButton:hover {
          background: #f1e8dd;
          transform: translateY(-1px);
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

          .successTitle {
            font-size: 37px;
          }

          .successSubtitle {
            font-size: 27px;
          }

          .qrWrapper {
            padding: 12px;
          }
        }
      `}</style>

      {!showWrite ? (
        <div className="container">
          <div className="envelope">💌</div>

          <div className="logo">
            SECRET LETTER
          </div>

          <h1>
            Keep something worth saying.
          </h1>

          <div className="tagline">
            A message meant to find you.
          </div>

          <button
            className="primaryButton"
            onClick={() =>
              setShowWrite(true)
            }
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
            <div className="successIcon">
              💌
            </div>

            <div className="successTitle">
              Your letter is ready.
            </div>

            <div className="successSubtitle">
              A message meant to find you.
            </div>

            <div className="qrWrapper">
              <div className="qrInner">
                <QRCodeSVG
                  id="secret-letter-qr"
                  value={letterUrl}
                  size={220}
                  level="H"
                />

                <div className="qrLabel">
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
              className="downloadButton"
              onClick={downloadQR}
            >
              ↓ Download QR
            </button>

            <div className="downloadHint">
              Save this QR and send it to the person
              this letter was meant to find.
            </div>

            <button
              className="anotherButton"
              onClick={resetLetter}
            >
              Create Another Letter
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
                  checked={
                    duration === "forever"
                  }
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
              onClick={() =>
                setShowWrite(false)
              }
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
