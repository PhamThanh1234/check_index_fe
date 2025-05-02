"use client";

export const AppTheme = {
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "80em",
    xl: "96em",
    xxl: "120em",
  },
  headings: {
    fontFamily: "Roboto, sans-serif",
  },
  fontFamily: "Roboto, sans-serif",
  globalStyles: (theme: any) => ({
    body: {
      cursor: "pointer", // Thay thế cursorType bằng CSS trực tiếp
      backgroundColor: theme.colorScheme === "dark" ? "#0a0a0a" : "#F5F9FF",
      color: theme.colorScheme === "dark" ? "#ededed" : "#171717",
      transition: "background-color 0.3s ease",
    },
  }),
  
};


