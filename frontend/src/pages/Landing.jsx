import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A]">
      <Navbar />

      <main>
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8C9B3] bg-white px-4 py-2 text-sm font-bold text-[#295142] mb-7 card-shadow">
              <Sparkles size={16} />
              Built for simple, focused task management
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight">
              Manage work without making it feel like work.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6F675D]">
              TaskPilot helps you plan, track, and finish tasks with a clean
              workflow board, useful task health signals, and a calm interface
              that feels easy from the first click.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F1D1A] px-7 py-4 text-white font-bold hover:bg-[#295142] transition"
              >
                Create your workspace
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-[#D8C9B3] bg-white px-7 py-4 font-bold text-[#1F1D1A] hover:bg-[#F1E7D8] transition"
              >
                Login to dashboard
              </Link>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="rounded-2xl border border-[#DDD0BD] bg-white p-4 card-shadow">
                <p className="text-3xl font-extrabold">3</p>
                <p className="text-sm text-[#6F675D] font-semibold">
                  Work stages
                </p>
              </div>

              <div className="rounded-2xl border border-[#DDD0BD] bg-white p-4 card-shadow">
                <p className="text-3xl font-extrabold">JWT</p>
                <p className="text-sm text-[#6F675D] font-semibold">
                  Secure login
                </p>
              </div>

              <div className="rounded-2xl border border-[#DDD0BD] bg-white p-4 card-shadow">
                <p className="text-3xl font-extrabold">Live</p>
                <p className="text-sm text-[#6F675D] font-semibold">
                  Deploy ready
                </p>
              </div>
            </div>
          </div>

          <div id="preview" className="relative">
            <div className="absolute -top-8 -right-4 h-32 w-32 rounded-full bg-[#C6844F]/20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-[#295142]/20 blur-3xl"></div>

            <div className="relative rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-5 soft-shadow">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-5">
                <div>
                  <p className="text-sm font-bold text-[#295142]">
                    Today&apos;s workspace
                  </p>
                  <h2 className="text-2xl font-extrabold mt-1">
                    Product launch tasks
                  </h2>
                </div>

                <div className="rounded-full bg-[#295142] text-white px-4 py-2 text-sm font-bold">
                  68% done
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                <BoardColumn
                  title="Todo"
                  count="03"
                  items={[
                    {
                      title: "Prepare user flow",
                      tag: "Needs attention",
                      tone: "amber"
                    },
                    {
                      title: "Write README notes",
                      tag: "Healthy",
                      tone: "green"
                    }
                  ]}
                />

                <BoardColumn
                  title="In Progress"
                  count="02"
                  items={[
                    {
                      title: "Build dashboard UI",
                      tag: "High priority",
                      tone: "red"
                    }
                  ]}
                />

                <BoardColumn
                  title="Done"
                  count="05"
                  items={[
                    {
                      title: "Setup authentication",
                      tag: "Completed",
                      tone: "green"
                    },
                    {
                      title: "Connect database",
                      tag: "Completed",
                      tone: "green"
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#DED2C0] bg-[#EFE7D8]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
            <div className="max-w-2xl mb-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142]">
                Why it stands out
              </p>
              <h2 className="font-display text-4xl mt-3">
                A task manager that feels practical, not overloaded.
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-5">
              <FeatureCard
                icon={<ClipboardList size={22} />}
                title="Clear workflow"
                text="Tasks move naturally through Todo, In Progress, and Done."
              />

              <FeatureCard
                icon={<BarChart3 size={22} />}
                title="Useful summary"
                text="See progress, pending work, and risk without searching."
              />

              <FeatureCard
                icon={<CalendarClock size={22} />}
                title="Due date awareness"
                text="Priorities and deadlines help identify what needs focus."
              />

              <FeatureCard
                icon={<TimerReset size={22} />}
                title="Focus friendly"
                text="The interface stays calm so users can understand it quickly."
              />
            </div>
          </div>
        </section>

        <section id="workflow" className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142]">
                Simple flow
              </p>
              <h2 className="font-display text-4xl mt-3">
                From login to completed task in a few clean steps.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <Step number="01" title="Create account" />
              <Step number="02" title="Add and organize tasks" />
              <Step number="03" title="Track progress clearly" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const BoardColumn = ({ title, count, items }) => {
  return (
    <div className="rounded-3xl border border-[#E5D9C7] bg-[#F8F3EA] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold">{title}</h3>
        <span className="text-xs font-extrabold bg-white border border-[#E5D9C7] rounded-full px-3 py-1">
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white border border-[#E5D9C7] p-4 card-shadow"
          >
            <p className="font-bold text-sm leading-5">{item.title}</p>

            <span
              className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-extrabold ${
                item.tone === "green"
                  ? "bg-[#DDEBDF] text-[#295142]"
                  : item.tone === "red"
                  ? "bg-[#F2D9D3] text-[#8B2E20]"
                  : "bg-[#F4E3C6] text-[#8A5B24]"
              }`}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => {
  return (
    <div className="rounded-3xl bg-[#FFFDF8] border border-[#D8C9B3] p-6 card-shadow">
      <div className="h-11 w-11 rounded-full bg-[#295142] text-white flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-lg font-extrabold mb-2">{title}</h3>
      <p className="text-sm leading-6 text-[#6F675D]">{text}</p>
    </div>
  );
};

const Step = ({ number, title }) => {
  return (
    <div className="rounded-3xl border border-[#D8C9B3] bg-white p-6 card-shadow">
      <p className="text-sm font-extrabold text-[#C6844F] mb-8">{number}</p>
      <h3 className="text-xl font-extrabold">{title}</h3>
      <div className="mt-5 flex items-center gap-2 text-[#295142] font-bold text-sm">
        <CheckCircle2 size={17} />
        Ready for users
      </div>
    </div>
  );
};

export default Landing;