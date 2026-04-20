import { FormEvent, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/app/store/useAuthStore";
import { apiClient } from "@/shared/api/client";
import { getRoleFromAccessToken, type AuthRole } from "@/shared/lib/auth";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { LanguageToggle } from "@/shared/ui/LanguageToggle";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type ApiErrorResponse = {
  error?: string;
};

const DEMO_CREDENTIALS: Record<AuthRole, { email: string; password: string }> = {
  candidate: {
    email: "candidate@test.com",
    password: "password123",
  },
  employer: {
    email: "employer@test.com",
    password: "password123",
  },
  admin: {
    email: "admin@lid.ru",
    password: "password123",
  },
};

const LoginPage = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const initialCredentials = useMemo(() => DEMO_CREDENTIALS.candidate, []);
  const [email, setEmail] = useState(initialCredentials.email);
  const [password, setPassword] = useState(initialCredentials.password);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigateToRole = (role: AuthRole) => {
    if (role === "candidate") navigate("/");
    if (role === "employer") navigate("/employer");
    if (role === "admin") navigate("/admin");
  };

  const fillDemo = (role: AuthRole) => {
    setError("");
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const role = getRoleFromAccessToken(data.access_token);
      if (!role) {
        throw new Error("Role was not found in access token");
      }

      login(role, data.access_token, data.refresh_token);
      navigateToRole(role);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data as ApiErrorResponse | undefined;

        if (err.response?.status === 401 || apiError?.error === "invalid credentials") {
          setError("Неверный логин или пароль.");
        } else {
          setError("Backend API недоступен или вернул ошибку.");
        }
      } else {
        setError("Не удалось выполнить вход.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#172033] dark:text-[#eef3fb]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-2">
          <section className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-[#d9e1ec] bg-[#fcfdff] p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-[#1c2840] dark:bg-[#111a2b]">
            <div className="mb-8">
              <div className="mb-5 inline-flex rounded-full border border-[#d9e1ec] bg-[#f6f9fc] px-3 py-1 text-sm font-medium text-[#53627d] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#b9c5d8]">
                Лид.ру
              </div>

              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight">
                Понятный сервис для откликов, вакансий и подбора.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#5c6b86] dark:text-[#b9c5d8]">
                В интерфейсе меньше лишнего шума: вакансии, отклики, профиль кандидата и
                рабочее место работодателя.
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <div className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-4 text-sm leading-6 text-[#53627d] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#b9c5d8]">
                Для кандидатов — вакансии, отклики, избранное и профиль.
              </div>
              <div className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-4 text-sm leading-6 text-[#53627d] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#b9c5d8]">
                Для работодателей — публикация вакансий и работа с кандидатами.
              </div>
              <div className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-4 text-sm leading-6 text-[#53627d] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#b9c5d8]">
                Для администраторов — модерация и контроль качества публикаций.
              </div>
            </div>
          </section>

          <section className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-[#d9e1ec] bg-[#fcfdff] p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-[#1c2840] dark:bg-[#111a2b]">
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex h-10 items-center">
                <LanguageToggle />
              </div>
              <ThemeToggle />
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm text-[#61708b] dark:text-[#aab7cb]">Вход в Лид.ру</p>
              <h2 className="text-3xl font-semibold tracking-tight">Личный кабинет</h2>
              <p className="mt-3 text-sm leading-6 text-[#61708b] dark:text-[#aab7cb]">
                Вход работает через backend API. Для теста можно подставить готовый
                аккаунт кнопками ниже.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => fillDemo("candidate")}
                className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-3 text-sm font-medium text-[#26344e] transition hover:bg-[#edf3fa] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#d8e1ee] dark:hover:bg-[#152238]"
              >
                Кандидат
              </button>
              <button
                type="button"
                onClick={() => fillDemo("employer")}
                className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-3 text-sm font-medium text-[#26344e] transition hover:bg-[#edf3fa] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#d8e1ee] dark:hover:bg-[#152238]"
              >
                Работодатель
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-4 py-3 text-sm font-medium text-[#26344e] transition hover:bg-[#edf3fa] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#d8e1ee] dark:hover:bg-[#152238]"
              >
                Администратор
              </button>
            </div>

            <form onSubmit={handleLogin} className="flex flex-1 flex-col">
              <div className="space-y-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="username"
                    className="h-12 rounded-2xl border border-[#d9e1ec] bg-white px-4 text-sm text-[#172033] outline-none transition focus:border-[#8ea3c2] focus:ring-4 focus:ring-[#dce7f5] dark:border-[#22314b] dark:bg-[#0b1220] dark:text-[#eef3fb] dark:focus:border-[#5f7698] dark:focus:ring-[#162338]"
                    placeholder="user@example.com"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Пароль</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    className="h-12 rounded-2xl border border-[#d9e1ec] bg-white px-4 text-sm text-[#172033] outline-none transition focus:border-[#8ea3c2] focus:ring-4 focus:ring-[#dce7f5] dark:border-[#22314b] dark:bg-[#0b1220] dark:text-[#eef3fb] dark:focus:border-[#5f7698] dark:focus:ring-[#162338]"
                    placeholder="password"
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#23314d] text-sm font-medium text-white transition hover:bg-[#2b3b5b] disabled:opacity-60 dark:bg-[#dbe4f0] dark:text-[#162238] dark:hover:bg-[#cfd9e8]"
                >
                  {isSubmitting ? "Входим..." : "Войти"}
                </button>
              </div>

              <div className="mt-auto pt-5">
                <div className="rounded-2xl border border-[#dce4ee] bg-[#f6f9fc] p-4 text-xs leading-6 text-[#61708b] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#aab7cb]">
                  <div className="mb-2 font-medium text-[#2a3650] dark:text-[#dbe4f2]">
                    Тестовые аккаунты
                  </div>
                  <div>admin@lid.ru / password123</div>
                  <div>candidate@test.com / password123</div>
                  <div>candidate2@test.com / password123</div>
                  <div>candidate3@test.com / password123</div>
                  <div>candidate4@test.com / password123</div>
                  <div>employer@test.com / password123</div>
                  <div>employer2@test.com / password123</div>
                  <div>employer3@test.com / password123</div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;