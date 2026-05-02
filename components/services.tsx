const services = [
  {
    title: "Review Management",
    description:
      "We get your customers to leave reviews. Your rating goes up. Your phone rings more.",
  },
  {
    title: "AI Receptionist",
    description:
      "When you can't get to the phone, it gets answered. In English or Spanish. Caller books an appointment. You see it on your phone.",
  },
  {
    title: "AI Sales Rep",
    description:
      "We find owners in your zip code who need what you sell, write them, and book the ones who reply. You see names on your calendar.",
  },
  {
    title: "AI Marketing Agent",
    description:
      "Your social media, blog, and email — produced and posted. You get a daily summary of what went out.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Four ways we run AI for you
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick one. Add more later. We handle them all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
