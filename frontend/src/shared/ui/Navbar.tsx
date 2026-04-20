import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { LanguageToggle } from "@/shared/ui/LanguageToggle";
import { motion } from "framer-motion";

const roleLabelMap = {
  candidate: "Кандидат",
  employer: "Работодатель",
  admin: "Администратор",
} as const;

export const Navbar = () => {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (role === "candidate") navigate("/candidate/profile");
    if (role === "employer") navigate("/employer/profile");
    if (role === "admin") navigate("/admin");
  };

  const navLinkClass =
    "inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#dbe4f2] transition hover:bg-white/10";

  const rightControlClass =
    "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-[#dbe4f2] transition hover:bg-white/10";

  const roleBadgeClass =
    "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-[#31405e] bg-[#182338] px-4 text-sm font-medium text-[#d6deeb]";

  return (
    <header className="sticky top-0 z-40 border-b border-[#1b2740] bg-[#0d1628]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="shrink-0 text-left transition hover:opacity-90"
        >
          <div className="text-2xl font-semibold tracking-tight text-[#f3f7fc]">
            Лид.ру
          </div>
          <div className="text-xs text-[#91a0bc]">
            Работа и подбор без лишнего шума
          </div>
        </button>

        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="hidden items-center gap-2 xl:flex"
        >
          {role === "candidate" && (
            <>
              <button onClick={() => navigate("/")} className={navLinkClass}>
                Вакансии
              </button>
              <button onClick={() => navigate("/candidate/saved")} className={navLinkClass}>
                Избранное
              </button>
              <button
                onClick={() => navigate("/candidate/applications")}
                className={navLinkClass}
              >
                Отклики
              </button>
              <button
                onClick={() => navigate("/candidate/growth")}
                className={navLinkClass}
              >
                Развитие
              </button>
            </>
          )}

          {role === "employer" && (
            <>
              <button onClick={() => navigate("/employer")} className={navLinkClass}>
                Рабочее место
              </button>
              <button onClick={() => navigate("/employer/profile")} className={navLinkClass}>
                Профиль компании
              </button>
            </>
          )}

          {role === "admin" && (
            <button onClick={() => navigate("/admin")} className={navLinkClass}>
              Админ-панель
            </button>
          )}
        </motion.nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {role && <span className={roleBadgeClass}>{roleLabelMap[role]}</span>}

          {role && (
            <button onClick={handleProfileClick} className={rightControlClass}>
              Профиль
            </button>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-[#d6deeb] bg-[#e8eef6] px-4 text-sm font-medium text-[#162135] transition hover:bg-[#dce5f0]"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;