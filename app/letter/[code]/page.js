            "use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function LetterPage({ params }) {
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [found, setFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLetter() {
      const code = params.code;

      const { data, error: fetchError } = await supabase
        .from("letters")
        .select(
          "id, recipient_name, message, expires_at, is_premium, is_read"
        )
        .eq("letter_code", code)
        .single();

      if (fetchError) {
        console.error(fetchError);
        setError("This secret letter could not be found.");
        setLoading(false);
        return;
      }

      if (
        data.expires_at &&
        new Date(data.expires_at) < new Date()
      ) {
        setError("This secret letter has expired.");
        setLoading(false);
        return;
      }

      setLetter(data);

      await supabase
        .from("letters")
        .update({ is_read: true })
        .eq("id", data.id);

      setLoading(false);
    }

    loadLetter();
  }, [params.code]);

  function openLetter() {
    setOpening(true);

    setTimeout(() => {
      setOpened(true);
    }, 2300);
  }

  async function markFound() {
    setFound(true);

    await supabase
      .from("letters")
      .update({ is_read: true })
      .eq("id", letter.id);
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&display=swap");

          .loadingPage {
            min-height: 100vh;
            background: #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #3d3028;
          }

          .loadingBox {
            animation: breathe 2s ease-in-out infinite;
          }

          .bird {
            font-size: 48px;
          }

          h1 {
            font-family: "Cormorant Garamond", serif;
            font-size: 34px;
            font-weight: 500;
          }

          p {
            font-family: "Great Vibes", cursive;
            font-size: 27px;
          }

          @keyframes breathe {
            0%,
            100% {
              opacity: 0.5;
            }

            50% {
              opacity: 1;
            }
          }
        `}</style>

        <div className="loadingBox">
          <div className="bird">🕊️</div>
          <h1>Finding your letter...</h1>
          <p>A little message is making its way to you.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="errorPage">
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap");

          .errorPage {
            min-height: 100vh;
            background: #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px;
            color: #3d3028;
          }

          .errorBox {
            max-width: 500px;
          }

          .icon {
            font-size: 50px;
          }

          h1 {
            font-family: "Cormorant Garamond", serif;
            font-size: 44px;
            font-weight: 500;
          }

          p {
            font-family: "Cormorant Garamond", serif;
            font-size: 20px;
          }
        `}</style>

        <div className="errorBox">
          <div className="icon">🕊️</div>
          <h1>Oh no...</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!opened) {
    return (
      <main
        className={`openingPage ${opening ? "opening" : ""}`}
      >
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&display=swap");

          .openingPage {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at center,
                rgba(255, 255, 255, 0.75),
                transparent 55%
              ),
              #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            text-align: center;
            color: #3d3028;
            overflow: hidden;
          }

          .openingBox {
            width: 100%;
            max-width: 600px;
          }

          .brand {
            font-family: "Cormorant Garamond", serif;
            font-size: 14px;
            letter-spacing: 5px;
            margin-bottom: 15px;
          }

          .headline {
            font-family: "Cormorant Garamond", serif;
            font-size: clamp(43px, 10vw, 70px);
            font-weight: 500;
            line-height: 0.95;
            margin: 0 0 10px;
          }

          .tagline {
            font-family: "Great Vibes", cursive;
            font-size: clamp(32px, 8vw, 48px);
            color: #63483b;
            margin-bottom: 40px;
          }

          .envelopeScene {
            position: relative;
            width: 270px;
            height: 190px;
            margin: 0 auto 38px;
            perspective: 900px;
          }

          .envelope {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 270px;
            height: 170px;
            background: #d9c2a8;
            box-shadow: 0 18px 35px rgba(60, 45, 35, 0.18);
            border-radius: 3px;
            overflow: hidden;
            z-index: 4;
          }

          .envelope::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 0;
            border-left: 135px solid transparent;
            border-right: 135px solid transparent;
            border-top: 90px solid #c9ad91;
            z-index: 3;
            transform-origin: top center;
            transition: transform 1s ease;
          }

          .envelope::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-left: 135px solid transparent;
            border-right: 135px solid transparent;
            border-bottom: 95px solid #d0b69a;
            z-index: 5;
          }

          .seal {
            position: absolute;
            z-index: 6;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #765849;
            color: #fff8ef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Cormorant Garamond", serif;
            font-size: 13px;
            letter-spacing: 1px;
            box-shadow: 0 5px 12px rgba(50, 35, 25, 0.2);
            transition:
              opacity 0.5s ease,
              transform 0.5s ease;
          }

          .paper {
            position: absolute;
            z-index: 2;
            left: 20px;
            bottom: 15px;
            width: 230px;
            height: 145px;
            background: #fffaf0;
            box-shadow: 0 5px 15px rgba(50, 35, 25, 0.1);
            transition: transform 1.8s ease;
          }

          .paper::before {
            content: "SECRET LETTER";
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-family: "Cormorant Garamond", serif;
            font-size: 10px;
            letter-spacing: 3px;
            opacity: 0.5;
          }

          .paper::after {
            content: "A message meant to find you.";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 28px;
            text-align: center;
            font-family: "Great Vibes", cursive;
            font-size: 18px;
            color: #63483b;
          }

          .openingPage.opening .paper {
            transform: translateY(-125px);
          }

          .openingPage.opening .envelope::before {
            transform: rotateX(180deg);
          }

          .openingPage.opening .seal {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6);
          }

          .openingPage.opening .envelope {
            animation: envelopeMove 2.3s ease forwards;
          }

          @keyframes envelopeMove {
            0% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(5px);
            }

            100% {
              transform: translateY(0);
            }
          }

          button {
            background: #3d3028;
            color: #fffaf3;
            border: none;
            padding: 15px 36px;
            border-radius: 3px;
            font-family: "Cormorant Garamond", serif;
            font-size: 21px;
            cursor: pointer;
            transition:
              transform 0.2s,
              opacity 0.4s;
          }

          button:hover {
            transform: translateY(-2px);
          }

          button:disabled {
            opacity: 0;
            pointer-events: none;
          }

          .warning {
            margin: 45px auto 0;
            max-width: 430px;
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.7;
            opacity: 0.48;
          }

          @media (max-width: 480px) {
            .envelopeScene {
              transform: scale(0.9);
              margin-top: -5px;
              margin-bottom: 25px;
            }
          }
        `}</style>

        <div className="openingBox">
          <div className="brand">
            SECRET LETTER
          </div>

          <div className="headline">
            A letter has
            <br />
            found its way to you.
          </div>

          <div className="tagline">
            A message meant to find you.
          </div>

          <div className="envelopeScene">
            <div className="paper"></div>

            <div className="envelope">
              <div className="seal">SL</div>
            </div>
          </div>

          <button
            onClick={openLetter}
            disabled={opening}
          >
            Open Letter
          </button>

          <div className="warning">
            Secret Letter will never ask for your
            password, OTP, PIN, or banking information.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="letterPage">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Libre+Baskerville:wght@400;700&display=swap");

        .letterPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(255, 255, 255, 0.7),
              transparent 50%
            ),
            #e8dccb;
          display: flex;
          justify-content: center;
          padding: 55px 20px;
          color: #3d3028;
        }

        .letter {
          width: 100%;
          max-width: 680px;
          min-height: 650px;
          background: #fffaf0;
          padding: 55px clamp(28px, 8vw, 70px);
          box-shadow: 0 20px 60px rgba(60, 45, 35, 0.16);
          position: relative;
          animation: appear 1.2s ease-out;
        }

        .letter::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(120, 90, 65, 0.18);
          pointer-events: none;
        }

        .top {
          position: relative;
        }

        .brand {
          text-align: center;
          font-family: "Cormorant Garamond", serif;
          letter-spacing: 5px;
          font-size: 13px;
          opacity: 0.6;
        }

        .recipient {
          font-family: "Cormorant Garamond", serif;
          font-size: 19px;
          font-weight: 500;
          text-align: left;
          margin: 25px 0 30px;
          color: #503b30;
        }

        .line {
          width: 80px;
          height: 1px;
          background: #9b8675;
          margin-bottom: 35px;
          opacity: 0.5;
        }

        .message {
          position: relative;
          font-family: "Great Vibes", cursive;
          font-size: clamp(28px, 6vw, 39px);
          line-height: 1.7;
          text-align: left;
          white-space: pre-wrap;
          color: #46342b;
          animation: messageAppear 1.5s ease-out;
        }

        .responseArea {
          position: relative;
          text-align: center;
          margin-top: 65px;
          padding-top: 30px;
          border-top: 1px solid rgba(120, 90, 65, 0.15);
        }

        .responseQuestion {
          font-family: "Cormorant Garamond", serif;
          font-size: 19px;
          margin-bottom: 16px;
          color: #503b30;
        }

        .foundButton {
          background: #5a4034;
          color: #fff8ef;
          border: 1px solid #765849;
          padding: 10px 24px;
          font-family: "Cormorant Garamond", serif;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.3px;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 6px 14px rgba(60, 45, 35, 0.16);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .foundButton:hover {
          background: #6b4b3c;
          transform: translateY(-2px);
          box-shadow: 0 9px 18px rgba(60, 45, 35, 0.2);
        }

        .foundButton:active {
          transform: translateY(0);
          box-shadow: 0 3px 8px rgba(60, 45, 35, 0.16);
        }

        .foundMessage {
          font-family: "Great Vibes", cursive;
          font-size: 28px;
          color: #63483b;
          animation: foundAppear 0.8s ease-out;
        }

        .heart {
          display: inline-block;
          margin-right: 6px;
          animation: heartBeat 1.2s ease-in-out infinite;
        }

        .security {
          position: relative;
          text-align: center;
          margin-top: 55px;
          font-family: "Libre Baskerville", serif;
          font-size: 10px;
          line-height: 1.7;
          opacity: 0.55;
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(25px) rotate(-1deg);
          }

          to {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }

        @keyframes messageAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes foundAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.18);
          }
        }

        @media (max-width: 480px) {
          .letter {
            padding: 45px 25px;
          }

          .message {
            font-size: 28px;
          }

          .responseQuestion {
            font-size: 18px;
          }

          .foundButton {
            font-size: 15px;
            padding: 9px 21px;
          }
        }
      `}</style>

      <article className="letter">
        <div className="top">
          <div className="brand">
            SECRET LETTER
          </div>

          <div className="recipient">
            For: {letter.recipient_name}
          </div>

          <div className="line" />
        </div>

        <div className="message">
          {letter.message}
        </div>

        <div className="responseArea">
          {!found ? (
            <>
              <div className="responseQuestion">
                Did this letter find you?
              </div>

              <button
                className="foundButton"
                onClick={markFound}
              >
                ♡ It found me
              </button>
            </>
          ) : (
            <div className="foundMessage">
              <span className="heart">♡</span>
              This letter found you.
            </div>
          )}
        </div>

        <div className="security">
          Secret Letter will never ask for your
          password, OTP, PIN, or banking information.
        </div>
      </article>
    </main>
  );
}                     
