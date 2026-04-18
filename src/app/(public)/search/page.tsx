
"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";

const ASPECTS = [
  { id: "qualidade", label: "Qualidade do serviço" },
  { id: "espera", label: "Tempo de espera" },
  { id: "suporte", label: "Suporte pós atendimento" },
  { id: "atendimento", label: "Atendimento ao paciente" },
  { id: "experiencia", label: "Experiência durante a consulta" },
];

export default function NPSPage() {
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    produto: "",
    gostou: "",
    melhorar: "",
  });
  const [notaNPS, setNotaNPS] = useState<number | null>(null);
  const [starRatings, setStarRatings] = useState<Record<string, number>>(
    ASPECTS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {})
  );
  const [voltaria, setVoltaria] = useState<string>("");
  const [conheceu, setConheceu] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleStarClick = (aspectId: string, value: number) => {
    setStarRatings({ ...starRatings, [aspectId]: value });
  };

  const handleCheckConheceu = (val: string) => {
    setConheceu((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  
  const progress = useMemo(() => {
    const fields = [formData.produto !== "", notaNPS !== null, voltaria !== ""];
    const filled = fields.filter(Boolean).length;
    return (filled / fields.length) * 100;
  }, [formData.produto, notaNPS, voltaria]);

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notaNPS === null) return alert("Por favor, selecione uma nota de 0 a 10!");
    if (!voltaria) return alert("Por favor, responda se voltaria a ser paciente!");

    const payload = {
      ...formData,
      notaNPS,
      starRatings,
      voltaria,
      conheceu: conheceu.join(", ") || "Não informado",
    };

    console.log("Dados prontos para o Supabase:", payload);
    
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.header}>
          <div>
            <div className={styles.logo}>FAVA<span>RATO</span></div>
            <div className={styles.headerSub}>Pesquisa de Satisfação do Paciente — NPS</div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.card} ${styles.successScreen}`}>
            <div className={styles.icon}>🎉</div>
            <h2>Muito obrigado pela sua avaliação!</h2>
            <p>Sua opinião foi registrada com sucesso.<br />A <strong>Favarato</strong> agradece e vai continuar trabalhando para superar suas expectativas!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.logo}>FAVA<span>RATO</span></div>
          <div className={styles.headerSub}>Pesquisa de Satisfação do Paciente — NPS</div>
        </div>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          
          <div className={styles.card}>
            <div className={styles.sectionTitle}>📋 Seus Dados</div>
            <div className={styles.field}><label>Nome completo</label><input type="text" id="nome" placeholder="Seu nome" required value={formData.nome} onChange={handleInputChange} /></div>
            <div className={styles.field}><label>E-mail</label><input type="email" id="email" placeholder="seu@email.com" required value={formData.email} onChange={handleInputChange} /></div>
            <div className={styles.field}><label>Telefone / WhatsApp</label><input type="tel" id="telefone" placeholder="(27) 99999-9999" required value={formData.telefone} onChange={handleInputChange} /></div>
            <div className={styles.field}><label>Serviço adquirido <span className={styles.req}>*</span></label><input type="text" id="produto" placeholder="Ex.: Consulta, Procedimento, Exame..." required value={formData.produto} onChange={handleInputChange} /></div>
          </div>

          
          <div className={styles.card}>
            <div className={styles.sectionTitle}>⭐ Pergunta Principal NPS</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#333", marginBottom: "12px" }}>Em uma escala de <strong>0 a 10</strong>, qual a probabilidade de você <strong>recomendar a Favarato</strong> a um amigo ou familiar?</p>
            <div className={styles.npsScale}>
              {[...Array(11).keys()].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.npsBtn} ${notaNPS === i ? styles.selected : ""}`}
                  data-val={i}
                  onClick={() => setNotaNPS(i)}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className={styles.npsLabels}><span>😞 Muito improvável</span><span>😊 Muito provável</span></div>
          </div>

          
          <div className={styles.card}>
            <div className={styles.sectionTitle}>📊 Avaliação dos Aspectos</div>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "18px" }}>Clique nas estrelas para avaliar cada item (1 = péssimo, 5 = excelente)</p>
            {ASPECTS.map((aspect) => (
              <div key={aspect.id} className={styles.starRow}>
                <div className={styles.starLabel}>{aspect.label}</div>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <span
                      key={val}
                      className={`${styles.star} ${starRatings[aspect.id] >= val ? styles.active : ""}`}
                      onClick={() => handleStarClick(aspect.id, val)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

         
          <div className={styles.card}>
            <div className={styles.sectionTitle}>💬 Sua Opinião</div>
            <div className={styles.field}><label>O que você mais gostou na Favarato?</label><textarea id="gostou" placeholder="Ex.: Atendimento rápido..." value={formData.gostou} onChange={handleInputChange}></textarea></div>
            <div className={styles.field}><label>O que poderíamos melhorar?</label><textarea id="melhorar" placeholder="Sua sugestão é muito importante para nós!" value={formData.melhorar} onChange={handleInputChange}></textarea></div>
            
            <div className={styles.field}>
              <label>Você voltaria a ser paciente da Favarato? <span className={styles.req}>*</span></label>
              <div className={styles.radioGroup}>
                {["Com certeza sim!", "Talvez", "Não"].map((opt) => (
                  <div key={opt} className={`${styles.radioOpt} ${voltaria === opt ? styles.selected : ""}`} onClick={() => setVoltaria(opt)}>
                    {opt === "Com certeza sim!" ? "✅ " : opt === "Talvez" ? "🤔 " : "❌ "}{opt}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label>Como nos conheceu?</label>
              <div className={styles.checkGroup}>
                {[
                  { label: "👥 Indicação", val: "Indicação" },
                  { label: "📱 Redes Sociais", val: "Redes Sociais" },
                  { label: "🔍 Google", val: "Google" },
                  { label: "💡 Outros", val: "Outros" }
                ].map((opt) => (
                  <div key={opt.val} className={`${styles.checkOpt} ${conheceu.includes(opt.val) ? styles.selected : ""}`} onClick={() => handleCheckConheceu(opt.val)}>
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className={styles.btnSubmit}>Enviar Pesquisa 🚀</button>
        </form>
      </div>
    </div>
  );
}