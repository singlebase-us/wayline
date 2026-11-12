import { LocaleLink } from "@/components/i18n";
import { T } from "@/components/i18n";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <h1><T>{"This path"}</T><br /><T>{"ends here."}</T></h1>
      <LocaleLink className="text-link" href="/"><T>{"BACK TO THE WORKFLOWS"}</T><span aria-hidden="true">↗</span>
      </LocaleLink>
    </main>
  );
}
