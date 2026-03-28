"use client";

import { FormEvent, useState } from "react";

type RegisterLandingProps = {
  endpoint: string;
};

type RegisteredUser = {
  user_id: string;
  name: string;
  user_token: string;
};

const REGISTERED_USER_KEY = "registered_user";

const isRegisteredUser = (value: unknown): value is RegisteredUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeUser = value as Partial<RegisteredUser>;

  return (
    typeof maybeUser.user_id === "string" &&
    typeof maybeUser.name === "string" &&
    typeof maybeUser.user_token === "string"
  );
};

const getStoredUserToken = () => {
  const stored = localStorage.getItem(REGISTERED_USER_KEY);
  if (!stored) {
    return "";
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return isRegisteredUser(parsed) ? parsed.user_token : "";
  } catch {
    return "";
  }
};

export default function RegisterLanding({ endpoint }: RegisterLandingProps) {
  const [name, setName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatusMessage("Please enter a username.");
      return;
    }

    if (!endpoint) {
      setStatusMessage("Missing ENDPOINT in .env.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const existingToken = getStoredUserToken();
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(existingToken ? { x_user_token: existingToken } : {}),
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatusMessage(errorText || `Request failed (${response.status}).`);
        return;
      }

      const data: unknown = await response.json();
      if (!isRegisteredUser(data)) {
        setStatusMessage("Registration succeeded but response format was invalid.");
        return;
      }

      localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(data));
      setStatusMessage(`Welcome ${data.name}! User saved locally.`);
      setName("");
    } catch {
      setStatusMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-950">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Robot Frontend</h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Enter your username to register.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500"
            autoComplete="username"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black px-4 py-3 text-base font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isSubmitting ? "Sending..." : "Register"}
          </button>
        </form>

        {statusMessage ? (
          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-200">{statusMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
