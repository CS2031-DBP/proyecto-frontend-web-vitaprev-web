import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import constants from "../common/constants";

export interface IAuthContext {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  token: string;
  expiresOn: number;
  register: Function;
  login: Function;
  logout: Function;
}

export const AuthContext = createContext<IAuthContext>({
  userId: "",
  name: "",
  lastName: "",
  email: "",
  token: "",
  expiresOn: -1,
  register: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useLocalStorage("session", "");
  const [token, setToken] = useLocalStorage("token", "");
  const [expiresOn, setExpiresOn] = useLocalStorage("expiresOn", "");

  // NOTE: FOR THESE CASES, WE CANNOT USE useAxiosForApi BECAUSE THE AUTH CONTEXT IS EMPTY
  const register = async (
  name: string,
  lastName: string,
  email: string,
  phone: string,
  genre: string,
  weight: number,
  height: number,
  birthDate: Date,
  allergies: string,
  diabetic: boolean,
  hypertensive: boolean,
  glucoseLevel: string,
  bloodPressure: string,
  password: string
) => {
  console.debug("registering", email);

  const day = birthDate.getDate().toString().padStart(2, "0");       // "01"..."31"
  const month = (birthDate.getMonth() + 1).toString().padStart(2, "0"); // "01"..."12"
  const year = birthDate.getFullYear();

  const formattedBirthDate = `${day}-${month}-${year}`;     // dd-MM-yyyy

  const normalizedAllergies =
    allergies.trim() === "" ? null : allergies.trim();

  const normalizedGlucose =
    diabetic && glucoseLevel.trim() !== ""
      ? Number(glucoseLevel)
      : null;

  const normalizedBloodPressure =
    hypertensive && bloodPressure.trim() !== ""
      ? bloodPressure.trim()
      : null;

  const payload = {
    name,
    lastName,
    email,
    phone,
    genre,
    weight,
    height,
    birthDate: formattedBirthDate,
    allergies: normalizedAllergies,
    diabetic,
    hypertensive,
    glucoseLevel: normalizedGlucose,
    bloodPressure: normalizedBloodPressure,
    password,
  };

  console.log("signup payload:", payload);

  const { data } = await axios.post("/auth/signup", payload, {
    baseURL: constants.API_HOST,
  });

  console.debug("registered", data.token);
  setSession(JSON.stringify({ email }));
  setToken(data.token);
  setExpiresOn((new Date().getTime() + 15 * 60 * 1000).toString());
};



  const login = async (email: string, password: string) => {
    console.debug("authenticating", email);
    const { data } = await axios.post(
      "/auth/signin",
      { email, password },
      { baseURL: constants.API_HOST }
    );

    console.debug("authenticated, token:", data.token);

    setSession(JSON.stringify({ email }));
    setToken(data.token);
    setExpiresOn((new Date().getTime() + 15 * 60 * 1000).toString());
  };

  const logout = () => {
    setSession("");
    setToken("");
    setExpiresOn("");
  };

  const value = useMemo(() => {
      let sess: {
        email?: string;
        userId?: string;
        name?: string;
        lastName?: string;
      } = {};
      if (session) {
        try {
          sess = JSON.parse(session);
        } catch {
          sess = {};
        }
      }

      return {
        userId: sess.userId || "",
        name: sess.name || "",
        lastName: sess.lastName || "",
        email: sess.email || "",
        token: token || "",
        expiresOn: expiresOn ? parseInt(expiresOn, 10) : -1,
        register,
        login,
        logout,
      };
    },
    [session, token, expiresOn]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
