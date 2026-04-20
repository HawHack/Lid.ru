import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

export const RouteErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Страница не найдена";
  let description = "Похоже, адрес изменился или страница пока недоступна.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Страница не найдена";
      description = "Проверь адрес или вернись в нужный раздел приложения.";
    } else if (error.status >= 500) {
      title = "Ошибка приложения";
      description = "Что-то пошло не так на стороне приложения. Попробуй обновить страницу.";
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172033] dark:bg-[#0b1220] dark:text-[#eef3fb]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <div className="w-full rounded-[28px] border border-[#d9e1ec] bg-[#fcfdff] p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-[#1c2840] dark:bg-[#111a2b]">
          <div className="mb-3 text-sm font-medium text-[#61708b] dark:text-[#aab7cb]">
            Лид.ру
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#61708b] dark:text-[#aab7cb]">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#dce4ee] bg-[#f5f8fc] px-5 text-sm font-medium text-[#26344e] transition hover:bg-[#edf3fa] dark:border-[#22314b] dark:bg-[#0d1524] dark:text-[#d8e1ee] dark:hover:bg-[#152238]"
            >
              Назад
            </button>

            <button
              onClick={() => navigate("/")}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#23314d] px-5 text-sm font-medium text-white transition hover:bg-[#2b3b5b] dark:bg-[#dbe4f0] dark:text-[#162238] dark:hover:bg-[#cfd9e8]"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};