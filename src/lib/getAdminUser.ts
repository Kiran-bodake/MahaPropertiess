import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

type AdminUserPayload = {
  user: {
    _id: string;
    email: string;
    role?: string;
  };
};

function isJwtPayload(data: string | JwtPayload): data is JwtPayload {
  return typeof data !== "string";
}

export async function getAdminUser(): Promise<AdminUserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("propvista-access-token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as string | JwtPayload;

    if (!isJwtPayload(decoded)) return null;

    if (!decoded.user) return null;

    return {
      user: decoded.user as {
        _id: string;
        email: string;
        role?: string;
      },
    };
  } catch (err) {
    return null;
  }
}