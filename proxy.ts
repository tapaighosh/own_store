import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    // Protect all /admin routes except login and register
    "/admin/((?!login|register).*)"
  ],
};
