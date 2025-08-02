import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import Users from "../models/Users"

// Function to generate a random password
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: String(process.env.TWITTER_CLIENT_ID),
      clientSecret: String(process.env.TWITTER_CLIENT_SECRET),
      version: "2.0",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (!user?.error) {
          return user;
        }
        return null;
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await Users.findOne({ email: user.email });

          if (!existingUser) {
            // Generate a random password and hash it
            const randomPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create new user document
            const newUser = {
              fullName: user.name,
              email: user.email,
              username: user.name.toLowerCase().replace(/\s+/g, "_"), // Convert name to username
              password: hashedPassword,
              image: user.image || profile.picture || "",
              phone: "", // Default empty phone
              address: { line2: "", country: "", state: "", postal_code: "", city: "", line1: "" }, // Default address structure
              verified: true, // Google users can be considered verified
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await Users.create(newUser);
          } else {
            // Update existing user if needed (e.g., image or name)
            await Users.updateOne(
              { email: user.email },
              {
                $set: {
                  // image: user.image || profile.picture || existingUser.image,
                  username: user.name.toLowerCase().replace(/\s+/g, "_") || existingUser.username,
                  updatedAt: new Date(),
                },
              }
            );
          }

          return true; // Allow sign-in
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Deny sign-in on error
        }
      }
      return true; // Allow sign-in for other providers
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider; // Add provider info to the token
      }
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.username = user.name ? user.name.toLowerCase().replace(/\s+/g, "_") : user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.provider = token.provider;
      if (token.provider === "credentials" || token.provider === "google") {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },
  },
};