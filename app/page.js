export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#f7f1e8",
      color: "#3b3028",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
      fontFamily: "Georgia, serif"
    }}>
      <div style={{ maxWidth: "600px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>

        <h1 style={{
          fontSize: "42px",
          letterSpacing: "3px",
          marginBottom: "10px"
        }}>
          SECRET LETTER
        </h1>

        <p style={{
          fontSize: "18px",
          fontStyle: "italic",
          marginBottom: "45px"
        }}>
          A message meant to find you.
        </p>

        <button style={{
          background: "#3b3028",
          color: "#fffaf3",
          border: "none",
          padding: "16px 32px",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          fontFamily: "Georgia, serif"
        }}>
          💌 Write a Letter
        </button>

        <p style={{
          marginTop: "35px",
          fontSize: "14px"
        }}>
          Already have a Secret Letter?
        </p>

        <button style={{
          background: "transparent",
          color: "#3b3028",
          border: "1px solid #3b3028",
          padding: "12px 28px",
          borderRadius: "4px",
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "Georgia, serif"
        }}>
          Enter QR
        </button>
      </div>
    </main>
  );
            }
