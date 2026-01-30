export default function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=0.5, maximum-scale=3.0"
      />
      <title>Logga in – Source</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="stylesheet" href="CSS/login.css" />
      {/* Urbanist font läses in via CSS @import */}

      {/* Early impersonation handler - must load before other scripts */}
      <script src="js/early-impersonation.js"></script>
    </>
  );
}
