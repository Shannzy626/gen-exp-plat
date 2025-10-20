type Snippet = {
  id: string;
  title: string;
  description: string;
  html: string;
};

export const SNIPPETS: Snippet[] = [
  {
    id: "header-simple",
    title: "Header",
    description: "Simple navbar with logo and CTA",
    html: `
<header class="w-full border-b border-gray-200 bg-white">
  <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded bg-indigo-600"></div>
      <span class="font-semibold">Untitled</span>
    </div>
    <nav class="hidden md:flex items-center gap-6 text-sm text-gray-700">
      <a href="#" class="hover:text-gray-900">Features</a>
      <a href="#" class="hover:text-gray-900">Pricing</a>
      <a href="#" class="hover:text-gray-900">About</a>
    </nav>
    <a href="#" class="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">Get started</a>
  </div>
 </header>
    `.trim(),
  },
  {
    id: "hero-centered",
    title: "Hero",
    description: "Centered hero with heading, body, buttons",
    html: `
<section class="w-full bg-white">
  <div class="mx-auto max-w-3xl px-4 py-20 text-center">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Build beautiful UIs faster</h1>
    <p class="mt-4 text-gray-600">A lightweight, component-based approach to compose your interface in real-time.</p>
    <div class="mt-6 flex items-center justify-center gap-3">
      <a href="#" class="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Start building</a>
      <a href="#" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">Learn more</a>
    </div>
  </div>
 </section>
    `.trim(),
  },
  {
    id: "features-3col",
    title: "Features",
    description: "3-column features grid",
    html: `
<section class="w-full">
  <div class="mx-auto max-w-6xl px-4 py-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div class="rounded-lg border border-gray-200 p-6">
        <div class="h-10 w-10 rounded bg-indigo-600"></div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Fast</h3>
        <p class="mt-1 text-sm text-gray-600">Compose UIs rapidly with reusable components.</p>
      </div>
      <div class="rounded-lg border border-gray-200 p-6">
        <div class="h-10 w-10 rounded bg-indigo-600"></div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Flexible</h3>
        <p class="mt-1 text-sm text-gray-600">Arrange sections and blocks to match your needs.</p>
      </div>
      <div class="rounded-lg border border-gray-200 p-6">
        <div class="h-10 w-10 rounded bg-indigo-600"></div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Accessible</h3>
        <p class="mt-1 text-sm text-gray-600">Built with semantic HTML and responsive defaults.</p>
      </div>
    </div>
  </div>
 </section>
    `.trim(),
  },
  {
    id: "testimonial-simple",
    title: "Testimonial",
    description: "Single testimonial card",
    html: `
<section class="w-full">
  <div class="mx-auto max-w-3xl px-4 py-16">
    <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <p class="text-lg text-gray-900">“This builder made prototyping our marketing site a breeze.”</p>
      <div class="mt-4 flex items-center gap-3">
        <div class="h-8 w-8 rounded-full bg-indigo-600"></div>
        <div>
          <div class="text-sm font-medium text-gray-900">Jamie Lee</div>
          <div class="text-xs text-gray-600">Product Designer</div>
        </div>
      </div>
    </div>
  </div>
 </section>
    `.trim(),
  },
  {
    id: "pricing-3tiers",
    title: "Pricing",
    description: "Three tier pricing table",
    html: `
<section class="w-full bg-gray-50">
  <div class="mx-auto max-w-6xl px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${["Starter","Pro","Business"].map((tier, i) => `
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h3 class="text-lg font-semibold text-gray-900">${tier}</h3>
        <div class="mt-2 text-3xl font-bold text-gray-900">$${(i+1)*9}<span class="text-base font-normal text-gray-600">/mo</span></div>
        <ul class="mt-4 space-y-2 text-sm text-gray-700">
          <li>Feature A</li>
          <li>Feature B</li>
          <li>Feature C</li>
        </ul>
        <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Choose plan</a>
      </div>`).join("")}
    </div>
  </div>
 </section>
    `.trim(),
  },
  {
    id: "footer-simple",
    title: "Footer",
    description: "Simple footer with links",
    html: `
<footer class="w-full border-t border-gray-200 bg-white">
  <div class="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded bg-indigo-600"></div>
      <span class="font-semibold">Untitled</span>
    </div>
    <nav class="text-sm text-gray-700 flex items-center gap-4">
      <a class="hover:text-gray-900" href="#">Privacy</a>
      <a class="hover:text-gray-900" href="#">Terms</a>
      <a class="hover:text-gray-900" href="#">Contact</a>
    </nav>
  </div>
 </footer>
    `.trim(),
  },
];


