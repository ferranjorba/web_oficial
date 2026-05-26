import './AvisLegal.css'

export default function AvisLegal() {
  return (
    <main className="legal-page">
      <div className="container legal-page__content">
        <h1 className="section-title">Avís Legal</h1>
        <p className="legal-page__updated">Última actualització: {new Date().getFullYear()}</p>
        <section>
          <h2>1. Titular del lloc web</h2>
          <p>NomAgència, amb domicili a Carrer Exemple, 00, Barcelona. CIF: XXXXXXXXX. Email: hola@nomAgencia.com</p>
        </section>
        <section>
          <h2>2. Condicions d'ús</h2>
          <p>L'accés i ús d'aquest lloc web implica l'acceptació de les presents condicions. Contingut pendent de redactar amb l'assessoria jurídica.</p>
        </section>
        <section>
          <h2>3. Propietat intel·lectual</h2>
          <p>Tots els continguts d'aquest lloc web (textos, imatges, logotips, dissenys) són propietat de NomAgència o dels seus llicenciants.</p>
        </section>
        <section>
          <h2>4. Protecció de dades</h2>
          <p>En compliment del RGPD i la LOPD, l'informem que les dades recollides seran tractades conforme a la nostra política de privacitat.</p>
        </section>
        <section>
          <h2>5. Llicència turística</h2>
          <p>Número de llicència: GC 2061. Registre d'agències de viatge de Catalunya.</p>
        </section>
      </div>
    </main>
  )
}
