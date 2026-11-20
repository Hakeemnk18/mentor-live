import type { Response } from 'express';

const isProd = process.env.NODE_ENV === "production"

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,                 
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
};

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

