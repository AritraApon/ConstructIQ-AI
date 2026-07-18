import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL || "https://construct-iq-ai.vercel.app"
,
})

export const { signIn, signUp, useSession } = authClient