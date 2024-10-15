import { useSupabase } from "../hooks/useSupabase";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Auth } from "@supabase/auth-ui-react";
import { type ViewType } from "@supabase/auth-ui-shared";
import useCartContext from "../hooks/useCartContext";

const AuthPage = ({ view }: { view?: ViewType }) => {
  const { session, supabase, loading, error } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();

  const { syncOnSignIn } = useCartContext();

  useEffect(() => {
    const syncCart = async () => await syncOnSignIn();
    if (session) navigate(location.state?.from ?? "/");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event) => {
      if (_event === "SIGNED_IN") {
        navigate(location.state?.from ?? "/");
        syncCart();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const theme = {
    default: {
      colors: {
        brand: "#ea580c",
        brandAccent: "#f97316",
        brandButtonText: "white",
        defaultButtonBackground: "white",
        defaultButtonBackgroundHover: "#eaeaea",
        defaultButtonBorder: "lightgray",
        defaultButtonText: "gray",
        dividerBackground: "#eaeaea",
        inputBackground: "transparent",
        inputBorder: "lightgray",
        inputBorderHover: "gray",
        inputBorderFocus: "gray",
        inputText: "black",
        inputLabelText: "gray",
        inputPlaceholder: "darkgray",
        messageText: "gray",
        messageTextDanger: "red",
        anchorTextColor: "gray",
        anchorTextHoverColor: "darkgray",
      },
      space: {
        spaceSmall: "4px",
        spaceMedium: "8px",
        spaceLarge: "16px",
        labelBottomMargin: "8px",
        anchorBottomMargin: "4px",
        emailInputSpacing: "4px",
        socialAuthSpacing: "4px",
        buttonPadding: "10px 15px",
        inputPadding: "10px 15px",
      },
      fontSizes: {
        baseBodySize: "13px",
        baseInputSize: "14px",
        baseLabelSize: "14px",
        baseButtonSize: "14px",
      },
      fonts: {
        bodyFontFamily: `ui-sans-serif, sans-serif`,
        buttonFontFamily: `ui-sans-serif, sans-serif`,
        inputFontFamily: `ui-sans-serif, sans-serif`,
        labelFontFamily: `ui-sans-serif, sans-serif`,
      },
      borderWidths: {
        buttonBorderWidth: "1px",
        inputBorderWidth: "1px",
      },
      radii: {
        borderRadiusButton: "4px",
        buttonBorderRadius: "4px",
        inputBorderRadius: "4px",
      },
      // transitions: {},
    },
  };

  return (
    <div className="w-full max-w-sm">
      {!loading && !error && (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme }}
          providers={["google", "facebook"]}
          view={view || "sign_in"}
          socialLayout="vertical"
          redirectTo=""
          theme="default"
        />
      )}
    </div>
  );
};

export default AuthPage;
