import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="flex min-h-screen w-full max-w-5xl flex-col justify-between px-6 py-12 sm:px-12">
        <header className="mb-10 flex items-center justify-between gap-4" aria-label="Site header">
          <div className="flex items-center gap-3">
            <Image
              className="rounded-sm"
              src="/next.svg"
              alt="Next.js logotype with gradient accent"
              width={120}
              height={32}
              priority
              sizes="(max-width: 640px) 120px, 150px"
            />
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Accessible starter experience</p>
          </div>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-4 text-sm font-medium">
              <li>
                <a className="link" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="link" href="#resources">
                  Resources
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main
          id="main-content"
          className="flex flex-col gap-16 rounded-2xl bg-white p-10 shadow-sm outline outline-1 outline-zinc-100 dark:bg-zinc-900 dark:outline-zinc-800"
        >
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="hero-title">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Next.js + Tailwind
              </p>
              <h1
                id="hero-title"
                className="text-4xl font-bold leading-tight sm:text-5xl sm:leading-tight text-balance"
              >
                Build an inclusive, performant experience from the start.
              </h1>
              <p className="text-lg text-zinc-700 dark:text-zinc-200">
                This starter highlights semantic structure, visible focus states, and optimized media so you can ship a
                Lighthouse-friendly experience with confidence.
              </p>
              <div className="flex flex-wrap gap-4" aria-label="Calls to action">
                <a
                  className="button-primary"
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center gap-2">
                    <Image
                      className="dark:invert"
                      src="/vercel.svg"
                      alt="Vercel logomark"
                      width={20}
                      height={20}
                      sizes="(max-width: 640px) 20px, 20px"
                    />
                    Deploy now
                  </span>
                </a>
                <a
                  className="button-secondary"
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the docs
                </a>
              </div>
            </div>
            <figure className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 p-6 text-white shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_45%)]" aria-hidden />
              <div className="relative space-y-4">
                <Image
                  className="rounded-xl border border-white/20"
                  src="/window.svg"
                  alt="Stylized browser window showing a responsive grid layout"
                  width={800}
                  height={600}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 620px"
                />
                <figcaption className="text-sm text-blue-50">
                  Optimized imagery uses <code>next/image</code> sizing and priority hints for fast rendering.
                </figcaption>
              </div>
            </figure>
          </section>

          <section id="about" aria-labelledby="structure-heading" className="space-y-4">
            <h2 id="structure-heading" className="text-2xl font-semibold">
              Semantic structure that screen readers love
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-200">
              Headings, landmarks, and descriptive alternative text make it easier for assistive technology to convey how
              content is organized. Skip links let keyboard users jump straight to the main content.
            </p>
          </section>

          <section id="resources" aria-labelledby="resources-heading" className="space-y-4">
            <h2 id="resources-heading" className="text-2xl font-semibold">
              Helpful links
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2" aria-label="Resource links">
              <li>
                <a className="card" href="https://nextjs.org/learn" target="_blank" rel="noreferrer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Learn Next.js</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Hands-on tutorials to master the framework fundamentals.
                      </p>
                    </div>
                    <span aria-hidden>→</span>
                  </div>
                </a>
              </li>
              <li>
                <a className="card" href="https://tailwindcss.com/docs" target="_blank" rel="noreferrer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Tailwind CSS docs</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Utility-first styling with responsive design and theming built-in.
                      </p>
                    </div>
                    <span aria-hidden>→</span>
                  </div>
                </a>
              </li>
              <li>
                <a className="card" href="https://web.dev/measure" target="_blank" rel="noreferrer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Lighthouse guidance</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Validate performance, accessibility, best practices, and SEO in one report.
                      </p>
                    </div>
                    <span aria-hidden>→</span>
                  </div>
                </a>
              </li>
              <li>
                <a className="card" href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noreferrer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Contrast checker</h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Confirm text and interactive elements meet WCAG contrast guidelines.
                      </p>
                    </div>
                    <span aria-hidden>→</span>
                  </div>
                </a>
              </li>
            </ul>
          </section>
        </main>

        <footer className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300" aria-label="Site footer">
          Built with accessibility and performance in mind.
        </footer>
      </div>
    </div>
  );
}
