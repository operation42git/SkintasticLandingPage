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

function ImpressumHR() {
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-[#1a1516]">Impressum</h1>

      <section className="mb-10">
        <p className="text-[15px] leading-relaxed text-[#5a5050]">
          <strong className="font-bold text-[#1a1516]">DMT active solutions d.o.o.</strong>
          <br />
          Slunjska 9<br />
          10020 Zagreb, Hrvatska
          <br />
          <br />
          Direktor: Toni Baričević
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
      </section>

      <Section title="Zasluge za fotografije">
        <p>Adobe Stock, istockphoto.com</p>
      </Section>

      <Section title="Odricanje">
        <h3 className="font-semibold text-[#1a1516]">Sadržaj online ponude</h3>
        <p>
          Autor ne preuzima nikakvu odgovornost za aktualnost, točnost, potpunost ili kvalitetu
          pruženih informacija. Zahtjevi za odgovornost prema autoru koji se odnose na materijalnu
          ili nematerijalnu štetu uzrokovanu korištenjem ili nekorištenjem pruženih informacija ili
          korištenjem netočnih ili nepotpunih informacija u načelu su isključeni, osim ako se može
          dokazati da je autor djelovao s namjerom ili grubom nepažnjom. Sve ponude su
          neobvezujuće i podložne su promjenama. Autor izričito zadržava pravo izmjene, dopune ili
          brisanja dijelova stranica ili cijele ponude ili privremenog ili trajnog prestanka
          objavljivanja istih bez prethodne najave.
        </p>
      </Section>

      <Section title="Reference i poveznice">
        <p>
          U slučaju izravnih ili neizravnih referenci na vanjske web stranice (linkove) koji se
          nalaze izvan područja odgovornosti autora, odgovornost bi nastala samo ako je autor bio
          upoznat sa sadržajem i ako bi mu bilo tehnički moguće i razumno spriječiti korištenje u
          slučaju ilegalnog sadržaja. Autor ovime izričito izjavljuje da u trenutku stvaranja
          linkova nije bilo vidljivog ilegalnog sadržaja na povezanim stranicama. Autor nema
          nikakvog utjecaja na trenutni i budući dizajn, sadržaj ili autorstvo povezanih stranica.
          Stoga se autor ovime izričito distancira od svih sadržaja svih povezanih stranica koje su
          promijenjene nakon stvaranja linkova.
        </p>
      </Section>

      <Section title="Zakon o autorskim pravima i zaštitnim znakovima">
        <p>
          Autor se trudi poštivati autorska prava grafika, audio dokumenata, video sekvenci i
          tekstova korištenih u svim publikacijama. Svi brendovi i zaštitni znakovi navedeni na
          web stranici podliježu odredbama važećeg zakona o zaštitnim znakovima i pravima
          vlasništva odgovarajućih registriranih vlasnika. Autorska prava za objavljene objekte
          koje je kreirao autor ostaju isključivo kod autora stranica. Reprodukcija ili korištenje
          takvih materijala u drugim elektroničkim ili tiskanim publikacijama nije dopušteno bez
          izričitog pristanka autora.
        </p>
      </Section>

      <Section title="Online rješavanje sporova">
        <p>
          Europska komisija pruža platformu za online rješavanje sporova (ODR) koju možete
          pronaći na:{" "}
          <a
            href="http://ec.europa.eu/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#88c9cd] hover:underline"
          >
            http://ec.europa.eu/odr/
          </a>
          .
        </p>
      </Section>
    </>
  );
}

function ImpressumDE() {
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-[#1a1516]">Impressum</h1>

      <section className="mb-10">
        <p className="text-[15px] leading-relaxed text-[#5a5050]">
          <strong className="font-bold text-[#1a1516]">skintastic GmbH</strong>
          <br />
          Triester Straße 369
          <br />
          8055 Graz, Österreich
          <br />
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
      </section>

      <Section title="Bildnachweise">
        <p>Adobe Stock, istockphoto.com</p>
      </Section>

      <Section title="Haftungsausschluss">
        <h3 className="font-semibold text-[#1a1516]">Inhalt des Onlineangebotes</h3>
        <p>
          Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit
          oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor,
          welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung
          oder Nichtnutzung der dargebotenen Informationen verursacht wurden, sind grundsätzlich
          ausgeschlossen, sofern kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden
          des Autors vorliegt. Alle Angebote sind freibleibend und unverbindlich.
        </p>
      </Section>

      <Section title="Verweise und Links">
        <p>
          Bei direkten oder indirekten Verweisen auf fremde Webseiten, die außerhalb des
          Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung
          ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis
          hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger
          Inhalte zu verhindern. Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der
          Linksetzung keine illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren.
        </p>
      </Section>

      <Section title="Urheber- und Kennzeichenrecht">
        <p>
          Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Grafiken,
          Tondokumente, Videosequenzen und Texte zu beachten. Alle innerhalb des Internetangebotes
          genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen
          uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts. Das Copyright
          für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor.
        </p>
      </Section>

      <Section title="Online-Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit:{" "}
          <a
            href="http://ec.europa.eu/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#88c9cd] hover:underline"
          >
            http://ec.europa.eu/odr/
          </a>
          .
        </p>
      </Section>
    </>
  );
}

export default async function ImpressumPage({
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
          {locale === "de" ? <ImpressumDE /> : <ImpressumHR />}

          <div className="mt-12 border-t border-[#e8e4de] pt-8">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-[#88c9cd] hover:underline"
            >
              ← {locale === "de" ? "Zurück zur Startseite" : "Povratak na početnu stranicu"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
