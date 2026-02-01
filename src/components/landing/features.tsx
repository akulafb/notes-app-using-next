export function Features() {
  const features = [
    {
      title: "Semantic Search",
      description:
        "Find notes by meaning, not just keywords. Powered by vector embeddings.",
      icon: "🔍",
    },
    {
      title: "AI Chat",
      description:
        "Ask questions and get answers based on your notes using RAG technology.",
      icon: "💬",
    },
    {
      title: "Secure & Private",
      description:
        "Your data stays local. Built with Next.js, Prisma, and ChromaDB.",
      icon: "🔒",
    },
    {
      title: "Beautiful UI",
      description:
        "Glassmorphism design that adapts to your system theme preferences.",
      icon: "✨",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Everything you need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Powerful features to help you capture and retrieve knowledge
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl dark:border-white/10 dark:bg-white/10"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
