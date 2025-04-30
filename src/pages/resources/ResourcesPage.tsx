// src/pages/ResourcesPage.tsx
type Resource = {
  title: string;
  url: string;
  description: string;
};

export default function ResourcesPage() {
  const resources: Resource[] = [
    {
      title: "GMAT™ Official Starter Kit + Practice Exams",
      url: "https://www.mba.com/exam-prep/gmat-official-starter-kit",
      description:
        "70+ real GMAT Focus Edition questions and two full-length official practice exams from GMAC.",
    },
    {
      title: "GMAT™ Focus Edition Official Practice Exams",
      url: "https://www.mba.com/exam-prep/gmat-focus-official-practice-exams",
      description:
        "Official GMAC page with Focus Edition practice exams and study resources.",
    },
    {
      title: "Manhattan Prep GMAT YouTube Channel",
      url: "https://www.youtube.com/user/ManhattanGMAT",
      description:
        "Free video lessons and live sessions covering all GMAT Focus Edition sections.",
    },
    {
      title: "Magoosh GMAT Flashcards",
      url: "https://gmat.magoosh.com/flashcards",
      description:
        "Comprehensive GMAT flashcards for Verbal and Quant, including idioms and math concepts.",
    },
    {
      title: "GMAT Club Forum",
      url: "https://gmatclub.com/",
      description:
        "Community-driven Q&A, strategy discussions, and GMAT Focus Edition practice threads.",
    },
    {
      title: "GMAT Math Cheat Sheet",
      url: "https://blog.targettestprep.com/gmat-equation-guide/",
      description:
        "Downloadable PDF with essential GMAT math formulas and shortcuts, curated by Target Test Prep experts.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6 text-gray-800">
      <div className="space-y-4">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-4">
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {res.title}
            </a>
            <p className="mt-1 text-gray-700">{res.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
