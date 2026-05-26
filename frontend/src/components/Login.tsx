import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';

import type { User } from '../types';

import '../styles/Auth.css';

export default function Login() {

  const navigate = useNavigate();

  const [tab, setTab] =
    useState<'login' | 'register'>(
      'login'
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  /* =========================
     LOGIN
  ========================= */

  const loginUser = (data: User) => {

    const users: User[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const validUser = users.find(
      (u) =>
        u.email === data.email &&
        u.password === data.password
    );

    if (validUser) {

      localStorage.setItem(
        'loggedInUser',
        JSON.stringify(validUser)
      );

      navigate('/dashboard');

    } else {

      alert('Invalid Credentials');
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const registerUser = (data: User) => {

    const users: User[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const exists = users.some(
      (u) => u.email === data.email
    );

    if (exists) {
      alert('User already exists');
      return;
    }

    users.push(data);

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    );

    alert('Registration Successful');

    reset();

    setTab('login');
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        {/* TABS */}

        <div className="auth-tabs">

          <button
            type="button"
            className={
              tab === 'login'
                ? 'active-tab'
                : ''
            }
            onClick={() =>
              setTab('login')
            }
          >
            Login
          </button>

          <button
            type="button"
            className={
              tab === 'register'
                ? 'active-tab'
                : ''
            }
            onClick={() =>
              setTab('register')
            }
          >
            Register
          </button>

        </div>

        {/* TITLE */}

        <h1 className="auth-title">

          {tab === 'login'
            ? 'Welcome !!'
            : 'Create Account'}

        </h1>

        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit(
            tab === 'login'
              ? loginUser
              : registerUser
          )}
        >

          {/* NAME */}

          {tab === 'register' && (

            <>
              <input
                type="text"
                placeholder="Full Name"
                {...register(
                  'name',
                  {
                    required:
                      'Name required',
                  }
                )}
              />

              <p>
                {errors.name?.message}
              </p>
            </>

          )}

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email Address"
            {...register(
              'email',
              {
                required:
                  'Email required',
              }
            )}
          />

          <p>
            {errors.email?.message}
          </p>

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            {...register(
              'password',
              {
                required:
                  'Password required',
              }
            )}
          />

          <p>
            {errors.password?.message}
          </p>

          {/* BUTTON */}

          <button
            className="auth-btn"
            type="submit"
          >

            {tab === 'login'
              ? 'Login'
              : 'Register'}

          </button>

        </form>

      </div>

    </div>
  );
}