import React, { useEffect } from "react";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import { s } from "../styles";

function displayName(user) {
  return (
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Account"
  );
}

/** Keeps marketplace checkout account in sync with the signed-in Clerk user. */
export function ClerkAccountSync({ onAccount }) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      onAccount?.({
        name: displayName(user),
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl || "",
        clerkUserId: user.id,
      });
    } else {
      onAccount?.(null);
    }
  }, [isLoaded, isSignedIn, user, onAccount]);

  return null;
}

/** Header auth controls: Google / email via Clerk Account Portal or modal. */
export function ClerkAccountControls() {
  return (
    <div style={s.authControls}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="aa-btn" style={s.navLink}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="aa-btn" style={s.signUpBtn}>
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div style={s.userButtonWrap}>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  width: 34,
                  height: 34,
                },
              },
            }}
          />
        </div>
      </Show>
    </div>
  );
}

/** Shown when Clerk is not configured yet (missing publishable key). */
export function ClerkMissingKeyControls({ onOpenHelp }) {
  return (
    <button type="button" className="aa-btn" style={s.navLink} onClick={onOpenHelp}>
      Sign in
    </button>
  );
}
