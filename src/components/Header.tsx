"use client";

export default function Header() {
  function handleLoginClick() {
    // TODO: 실제 로그인 로직 연결
    console.log("login clicked");
  }

  function handleSignupClick() {
    // TODO: 실제 회원가입 로직 연결
    console.log("signup clicked");
  }

  return (
    <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 py-4">
      <span className="text-xl font-bold text-[var(--foreground)]">EasyDeeper</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLoginClick}
          className="rounded-full border border-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--foreground)] transition active:scale-[0.98]"
        >
          로그인
        </button>
        <button
          onClick={handleSignupClick}
          className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white shadow-md transition active:scale-[0.98]"
        >
          회원가입
        </button>
      </div>
    </header>
  );
}
