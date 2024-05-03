import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import app from "../../firebase";

const LoginPage = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");

  const {
    register,
    // watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 중복 호출 제어
      setLoading(true);
      // 로그인
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.log(error);
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This email field is required</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password must have at least 6 characters</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" disabled={loading} />
        <Link
          to={"/register"}
          style={{ color: "gray", textDecoration: "none" }}
        >
          아직 회원이 아니신가요?
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
