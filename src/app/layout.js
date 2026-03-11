import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/features/core_dash_board_design/core.css" />
        <link rel="stylesheet" href="/css/features/budgets/budgets.css" />
        <link rel="stylesheet" href="/css/features/savings/savings.css" />
        <link rel="stylesheet" href="/css/features/debts/debts.css" />
        <link rel="stylesheet" href="/css/features/goals/goals.css" />
        <link rel="stylesheet" href="/css/mobile.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}