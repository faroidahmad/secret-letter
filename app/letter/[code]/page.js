"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function LetterPage({ params }) {
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f7f1e8",
          color: "#3b3028",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "55px" }}>🕊️</div>
          <h1>Finding your letter...</h1>
          <p>
            Something special is making its way to you.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f7f1e8",
          color: "#3b3028",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "500px" }}>
          <div style={{ fontSize: "55px" }}>🕊️</div>

          <h1>Oh no...</h1>

          <p
            style={{
              fontSize: "17px",
              fontStyle: "italic",
              lineHeight: "1.7",
            }}
          >
            {error}
          </p>
        </div>
      </main>
    );
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
        padding: "30px 20px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          width: "100%",
          background: "#fffaf3",
          padding: "40px 30px",
          borderRadius: "10px",
          boxShadow: "0 10px 40px rgba(59, 48, 40, 0.12)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "50px",
            marginBottom: "20px",
          }}
        >
          💌
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          A Secret Letter
        </p>

        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "30px",
          }}
        >
          For {letter.recipient_name}
        </h1>

        <div
          style={{
            borderTop: "1px solid #d8cec2",
            borderBottom: "1px solid #d8cec2",
            padding: "30px 10px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
            fontSize: "18px",
          }}
        >
          {letter.message}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "14px",
            fontStyle: "italic",
            opacity: 0.7,
          }}
        >
          This message was meant to find you.
        </p>
      </div>
    </main>
  );
          }
