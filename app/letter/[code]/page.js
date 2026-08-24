"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function LetterPage({ params }) {
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
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
        setError(
          "This secret letter could not be found."
        );
        setLoading(false);
        return;
      }

      if (
        data.expires_at &&
        new Date(data.expires_at) < new Date()
      ) {
        setError(
          "This secret letter has expired."
        );
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

  if (loading) {
    return (
      <main className="page">
        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3d3028;
            text-align: center;
            font-family: "Cormorant Garamond", serif;
          }

          .box {
            animation: fade 2s ease-in-out infinite alternate;
          }

          .bird {
            font-size: 55px;
            margin-bottom: 15px;
          }

          h1 {
            font-size: 35px;
            font-weight: 500;
          }

          p {
            font-family: "Great Vibes", cursive;
            font-size: 28px;
          }

          @keyframes fade {
            from {
              opacity: 0.45;
              transform: translateY(5px);
            }
            to {
              opacity: 1;
              transform: translateY(-5px);
            }
          }
        `}</style>

        <div className="box">
          <div className="bird">🕊️</div>
          <h1>Finding your letter...</h1>
          <p>A little message is making its way to you.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px;
            color: #3d3028;
            font-family: "Cormorant Garamond", serif;
          }

          .errorBox {
            max-width: 480px;
          }

          .icon {
            font-size: 55px;
          }

          h1 {
            font-size: 42px;
            font-weight: 500;
          }

          p {
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
      <main className="page">
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Libre+Baskerville:wght@400;700&display=swap");

          .page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at center,
                rgba(255,255,255,0.75),
                transparent 55%
              ),
              #f5eee4;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            text-align: center;
            color: #3d3028;
          }

          .box {
            max-width: 560px;
          }

          .bird {
            font-size: 50px;
            animation: float 3s ease-in-out infinite;
          }

          .brand {
            margin-top: 12px;
            font-family: "Cormorant Garamond", serif;
            font-size: 15px;
            letter-spacing: 5px;
          }

          h1 {
            font-family: "Cormorant Garamond", serif;
            font-size: clamp(48px, 12vw, 75px);
            font-weight: 500;
            line-height: 0.95;
            margin: 25px 0 10px;
          }

          .subtitle {
            font-family: "Great Vibes", cursive;
            font-size: clamp(34px, 8vw, 50px);
            color: #63483b;
            line-height: 1.2;
            margin-bottom: 35px;
          }

          button {
            background: #3d3028;
            color: #fffaf3;
            border: none;
            padding: 15px 35px;
            font-family: "Cormorant Garamond", serif;
            font-size: 21px;
            cursor: pointer;
            border-radius: 3px;
          }

          .warning {
            margin-top: 55px;
            font-family: "Libre Baskerville", serif;
            font-size: 9px;
            line-height: 1.6;
            opacity: 0.42;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>

        <div className="box">
          <div className="bird">🕊️</div>

          <div className="brand">
            SECRET LETTER
          </div>

          <h1>
            A letter has
            <br />
            found its way to you.
          </h1>

          <div className="subtitle">
            A message meant to find you.
          </div>

          <button onClick={() => setOpened(true)}>
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
              rgba(255,255,255,0.7),
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
          background:
            linear-gradient(
              rgba(255,255,255,0.35),
              rgba(255,255,255,0.35)
            ),
            #fffaf0;
          padding: 55px clamp(28px, 8vw, 70px);
          box-shadow:
            0 20px 60px rgba(60,45,35,0.16);
          position: relative;
          animation: appear 1.2s ease-out;
        }

        .letter::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(120,90,65,0.18);
          pointer-events: none;
        }

        .top {
          text-align: center;
          position: relative;
        }

        .brand {
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
  margin: 0 0 30px;
  color: #503b30;
}

        .line {
          width: 80px;
          height: 1px;
          background: #9b8675;
          margin: 0 auto 35px;
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

        .closing {
          position: relative;
          text-align: center;
          margin-top: 50px;
          font-family: "Great Vibes", cursive;
          font-size: 35px;
          color: #63483b;
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

        @media (max-width: 480px) {
          .letter {
            padding: 45px 25px;
          }

          .message {
            font-size: 28px;
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


        <div className="security">
          Secret Letter will never ask for your
          password, OTP, PIN, or banking information.
        </div>
      </article>
    </main>
  );
    }
