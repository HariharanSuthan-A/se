const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const REDIRECT_URI = "http://localhost:5173/callback.html";  // change based on your port

// LOGIN
function login() {
  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    "&response_type=token" +
    "&scope=" +
    encodeURIComponent("https://www.googleapis.com/auth/gmail.send") +
    "&prompt=consent";

  window.location.href = authUrl;
}

// LOGOUT
function logout() {
  localStorage.removeItem("gmail_access_token");
  alert("Logged out!");
}

// SEND EMAIL
async function sendEmail() {
  const accessToken = localStorage.getItem("gmail_access_token");

  if (!accessToken) {
    alert("Please login first");
    return;
  }

  const to = document.getElementById("to").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const rawEmail =
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    "Content-Type: text/html; charset=UTF-8\r\n\r\n" +
    `${message}`;

  const encodedEmail = btoa(rawEmail)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    }
  );

  const data = await res.json();
  console.log(data);

  if (data.id) alert("Email Sent!");
  else alert("Failed to send email.");
}
