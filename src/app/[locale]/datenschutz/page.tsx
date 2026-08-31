import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold text-[#1a1516]">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#5a5050]">
        {children}
      </div>
    </section>
  );
}

function DatenschutzHR() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-[#1a1516]">Zaštita podataka</h1>
      <p className="mb-8 text-sm text-[#8a7e7e]">
        Informacije sukladno čl. 13. i 14. GDPR-a
      </p>

      <Section title="Voditelj obrade podataka">
        <p>
          <strong className="font-semibold text-[#1a1516]">DMT active solutions d.o.o.</strong>
          <br />
          Slunjska 9, 10020 Zagreb, Hrvatska
          <br />
          E-mail:{" "}
          <a href="mailto:hello@skintastic.hr" className="text-[#88c9cd] hover:underline">
            hello@skintastic.hr
          </a>
          <br />
          Tel:{" "}
          <a href="tel:+385957575344" className="text-[#88c9cd] hover:underline">
            +385 95 757 5344
          </a>
        </p>
      </Section>

      <Section title="Svrhe obrade podataka">
        <h3 className="font-semibold text-[#1a1516]">Kontaktni obrazac</h3>
        <p>
          Ako nas kontaktirate putem obrasca na web stranici ili e-mailom, vaši podaci pohranjuju
          se kod nas šest mjeseci radi obrade upita i eventualnih naknadnih pitanja. Te podatke ne
          prosljeđujemo bez vašeg pristanka.
        </p>

        <h3 className="font-semibold text-[#1a1516]">Analitičke svrhe</h3>
        <p>
          Podaci se prikupljaju i koriste u analitičke svrhe. Ova obrada podataka provodi se
          bezlično (vidi informacije o kolačićima u nastavku).
        </p>

        <h3 className="font-semibold text-[#1a1516]">IT sigurnost</h3>
        <p>
          Prilikom posjeta ovoj web stranici pohranjuju se log datoteke koje sadrže IP adresu i
          ostale podatke o pristupu (npr. datum, vrijeme, user agent, referer). Obrada podataka je
          vremenski ograničena (najviše 30 dana) i isključivo u svrhu zaštite od DDoS napada i
          sličnih prijetnji.
        </p>
      </Section>

      <Section title="Kolačići">
        <p>
          Ova web stranica koristi tzv. kolačiće. Radi se o malim tekstualnim datotekama koje se
          uz pomoć preglednika pohranjuju na vašem uređaju. Ne nanose štetu.
        </p>
        <p>
          Na ovoj stranici koriste se kolačići sesije koji se generiraju pri posjetu i
          automatski brišu. Niti u jednom slučaju ne pohranjuju se niti obrađuju osobni podaci.
        </p>
        <p>
          Kolačići imaju svrhu učiniti ponudu web stranice korisnički prihvatljivijom. Neki
          kolačići ostaju pohranjeni na vašem uređaju dok ih ne izbrišete. Ako to ne želite, možete
          postaviti preglednik da vas obavještava o postavljanju kolačića i da to dopuštate samo u
          pojedinim slučajevima.
        </p>
      </Section>

      <Section title="Društveni mediji">
        <p>
          Poveznice na Facebook, Instagram i WhatsApp na ovoj web stranici su isključivo navigacijske
          veze — klikom napuštate ovu stranicu i prelazite na platformu trećih. Nikakvi podaci se
          ne prenose na te platforme samim učitavanjem ove stranice.
        </p>
      </Section>

      <Section title="Pravna osnova">
        <p>
          Na web stranici se podaci obrađuju isključivo na temelju zakonskih propisa (GDPR, ZEK).
          Obrada podataka (rezervacijsko sredstvo) provodi se na temelju čl. 6. st. 1. lit. b)
          GDPR-a (ispunjenje ugovora). U slučaju korištenja analitičkih alata, obrada se temelji
          na čl. 6. st. 1. lit. f) GDPR-a (legitimni interes). IT sigurnosne mjere temelje se
          također na čl. 6. st. 1. lit. f) GDPR-a.
        </p>
      </Section>

      <Section title="Vaša prava">
        <p>
          U načelu imate pravo na pristup, ispravak, brisanje, ograničenje obrade, prenosivost
          podataka, opoziv i prigovor. Ako smatrate da obrada vaših podataka krši propise o zaštiti
          podataka, možete podnijeti pritužbu nadzornom tijelu. U Republici Hrvatskoj to je{" "}
          <strong className="font-semibold text-[#1a1516]">
            Agencija za zaštitu osobnih podataka (AZOP)
          </strong>
          ,{" "}
          <a
            href="https://azop.hr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#88c9cd] hover:underline"
          >
            azop.hr
          </a>
          .
        </p>
      </Section>
    </>
  );
}

function DatenschutzDE() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-[#1a1516]">Datenschutzerklärung</h1>
      <p className="mb-8 text-sm text-[#8a7e7e]">
        Informationen gemäß Art. 13 und 14 DSGVO
      </p>

      <Section title="Kontaktdaten / Verantwortlicher">
        <p>
          <strong className="font-semibold text-[#1a1516]">skintastic GmbH</strong>
          <br />
          Triester Straße 369
          <br />
          8055 Graz, Österreich
          <br />
          UID-Nummer: ATU80371027
          <br />
          E-Mail:{" "}
          <a href="mailto:hello@skintastic.hr" className="text-[#88c9cd] hover:underline">
            hello@skintastic.hr
          </a>
          <br />
          Tel:{" "}
          <a href="tel:+436764200447" className="text-[#88c9cd] hover:underline">
            +43 676 4200 447
          </a>
        </p>
      </Section>

      <Section title="Datenverarbeitungszwecke">
        <h3 className="font-semibold text-[#1a1516]">Kontaktformular</h3>
        <p>
          Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden
          Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von
          Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre
          Einwilligung weiter.
        </p>

        <h3 className="font-semibold text-[#1a1516]">Analysezwecke</h3>
        <p>
          Daten werden zu Analysezwecken erhoben und verwendet. Diese Datenverarbeitung erfolgt
          nicht personenbezogen (siehe hierzu nachstehend Informationen zu Cookies).
        </p>

        <h3 className="font-semibold text-[#1a1516]">IT-Sicherheit</h3>
        <p>
          Beim Besuch dieser Website werden Logfiles gespeichert, welche die IP-Adresse und
          sonstige Daten zum Zugriff auf die Website enthalten (z. B. Datum, Uhrzeit, User Agent,
          Referer). Die Datenverarbeitung erfolgt befristet (maximal 30 Tage) und nur zur
          Absicherung vor DDoS-Attacken oder sonstigen Eingriffen in die Funktionalität der
          Website.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Diese Website verwendet sogenannte Cookies. Dabei handelt es sich um kleine
          Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten
          keinen Schaden an.
        </p>
        <p>
          Auf dieser Seite werden sogenannte Session-Cookies verwendet. Diese werden beim Aufruf
          der Website generiert und automatisch wieder gelöscht. Es werden dabei keinerlei
          personenbezogene Daten gespeichert oder verarbeitet.
        </p>
        <p>
          Wenn Sie dies nicht wünschen, können Sie Ihren Browser so einrichten, dass er Sie über
          das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben. Bei der
          Deaktivierung von Cookies kann die Funktionalität der Website jedoch eingeschränkt sein.
        </p>
      </Section>

      <Section title="Social Media">
        <p>
          Die Links zu Facebook, Instagram und WhatsApp auf dieser Website sind reine
          Navigationsverweise — durch einen Klick verlassen Sie diese Seite und werden zur
          jeweiligen Plattform weitergeleitet. Allein durch das Laden dieser Website werden keine
          Daten an diese Plattformen übertragen.
        </p>
      </Section>

      <Section title="Rechtliche Grundlage">
        <p>
          Auf der Website werden Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen
          (DSGVO, TKG 2003) verarbeitet. Die Datenverarbeitung (Buchungstool) erfolgt auf
          Grundlage des Art. 6 Abs. 1 lit. b) DSGVO (Vertragserfüllungszwecke). Im Falle des
          Einsatzes von Analysetools erfolgt die Datenverwendung auf Grundlage des Art. 6 Abs. 1
          lit. f) DSGVO (berechtigtes Interesse). Der Einsatz von IT-Datensicherheitsmaßnahmen
          erfolgt ebenfalls auf Grundlage des Art. 6 Abs. 1 lit. f) DSGVO.
        </p>
      </Section>

      <Section title="Ihre Rechte">
        <p>
          Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerruf und Widerspruch zu.
          Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt,
          können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die{" "}
          <strong className="font-semibold text-[#1a1516]">Datenschutzbehörde</strong>,{" "}
          <a
            href="https://www.dsb.gv.at"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#88c9cd] hover:underline"
          >
            dsb.gv.at
          </a>
          .
        </p>
      </Section>
    </>
  );
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="bg-white pt-[110px] pb-24">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {locale === "de" ? <DatenschutzDE /> : <DatenschutzHR />}

          <div className="mt-12 border-t border-[#e8e4de] pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-[#88c9cd] hover:underline"
            >
              ← {locale === "de" ? "Zurück zur Startseite" : "Povratak na početnu stranicu"}
            </Link>
            <Link
              href={`/${locale}/impressum`}
              className="text-sm font-medium text-[#88c9cd] hover:underline"
            >
              {locale === "de" ? "Impressum" : "Impressum"} →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
