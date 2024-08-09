// src/utils/getTokenDetails.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
}

export function getTokenRole(token: string): string | null {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.role;
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
}
