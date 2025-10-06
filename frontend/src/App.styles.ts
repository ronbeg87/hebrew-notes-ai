export const appBackground: React.CSSProperties = {
  minHeight: "100vh",
  width: "100vw",
  background: "linear-gradient(135deg, #23235b 0%, #3a3a7c 60%, #5f5fcf 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const card: React.CSSProperties = {
  maxWidth: 600,
  width: "100%",
  padding: "2.5rem 2rem",
  background: "rgba(40,40,70,0.98)",
  borderRadius: "18px",
  boxShadow: "0 4px 32px rgba(60,60,120,0.24)",
  display: "flex",
  flexDirection: "column" as React.CSSProperties["flexDirection"],
  alignItems: "center",
};

export const title: React.CSSProperties = {
  textAlign: "center" as React.CSSProperties["textAlign"],
  marginBottom: "2rem",
  fontWeight: 700,
  fontSize: "2.2rem",
  color: "#b3baff",
  letterSpacing: "0.02em",
  textShadow: "0 2px 12px #23235b",
};

export const status: React.CSSProperties = {
  marginBottom: 16,
  color: "#b3baff",
  fontWeight: 500,
};
