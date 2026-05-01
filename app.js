function buscar() {
    let texto = document.getElementById("pesquisa").value.toLowerCase();

    if (texto.trim() === "") {
        alert("Digite algo!");
        return;
    }

    // =========================
    // 🧠 ANÁLISE BASE
    // =========================
    let temNumero = /\d/.test(texto);
    let temOperador = /[\+\-\*\/]/.test(texto);
    let temInterrogacao = texto.includes("?");

    let palavrasExagero = ["absurdo", "impossível", "nunca visto", "incrível", "milagre", "bizarro", "chocante"];
    let temExagero = palavrasExagero.some(p => texto.includes(p));

    // =========================
    // 🌱 RAÍZES (INTENÇÃO)
    // =========================
    let raizMatematica = ["calcular", "resolver", "quanto é", "equação", "raiz", "porcentagem", "qual a área", "some", "divida"];
    let raizNoticia = ["aconteceu", "urgente", "caso", "morreu", "descoberto", "acidente", "preso", "flagrante"];
    let raizDuvida = ["é verdade", "isso é real", "fake", "verdadeiro", "mito ou verdade", "será"];
    let raizCuriosidade = ["recorde", "maior do mundo", "mais rápido", "mais forte", "bater o recorde"];

    let temRaizMat = raizMatematica.some(p => texto.includes(p));
    let temRaizNoticia = raizNoticia.some(p => texto.includes(p));
    let temRaizDuvida = raizDuvida.some(p => texto.includes(p));
    let temRaizCuriosidade = raizCuriosidade.some(p => texto.includes(p));

    // =========================
    // 👤 AÇÕES & CONTEXTO FÍSICO
    // =========================
    let acoesHumanas = ["corre", "correu", "voa", "anda", "pulou", "caiu", "viveu", "sobreviveu", "levantou", "comeu"];
    let temAcaoHumana = acoesHumanas.some(p => texto.includes(p));

    let unidades = ["km", "metros", "m/s", "km/h", "segundo", "minutos", "kg", "toneladas"];
    let temUnidade = unidades.some(p => texto.includes(p));

    let sujeitos = ["homem", "mulher", "pessoa", "criança", "animal", "cachorro", "carro"];
    let temSujeitoFisico = sujeitos.some(p => texto.includes(p));

    // =========================
    // 📚 PALAVRAS POR ÁREA
    // =========================
    let palavras = {
        noticias: ["presidente", "governo", "guerra", "crime", "brasil", "mundo", "eleição", "polícia", "trânsito"],
        religiao: ["deus", "jesus", "bíblia", "igreja", "fé", "papa", "santo"],
        historia: ["revolução", "império", "colônia", "história", "guerra mundial", "século", "descobrimento"],
        matematica: ["equação", "função", "álgebra", "geometria", "fração", "hipotenusa", "matemática"],
        ciencia: ["átomo", "energia", "gravidade", "física", "química", "velocidade", "espaço", "universo"],
        saude: ["doença", "vírus", "febre", "cura", "hospital", "remédio", "médico", "saúde"],
        tecnologia: ["computador", "ia", "software", "internet", "robô", "smartphone", "aplicativo"],
        geografia: ["continente", "país", "clima", "mapa", "oceano", "montanha", "fronteira", "relevo"],
        portugues: ["verbo", "substantivo", "gramática", "ortografia", "redação", "crase"],
        esportes: ["futebol", "gol", "copa", "time", "basquete", "olimpíadas", "atleta", "medalha"],
        curiosidades: ["guinness", "recorde", "incrível", "bizarro", "inédito"]
    };

    // =========================
    // 📊 SCORE COM SISTEMA DE PENALIDADES
    // =========================
    let score = {
        matematica: 0, noticias: 0, historia: 0, religiao: 0,
        ciencia: 0, saude: 0, tecnologia: 0, geografia: 0,
        portugues: 0, esportes: 0, curiosidades: 0
    };

    Object.keys(palavras).forEach(cat => {
        if (palavras[cat].some(p => texto.includes(p))) {
            score[cat] += 2;
        }
    });

    if (temRaizMat) {
        score.matematica += 5;
    } else if (temNumero && temUnidade) {
        if (temAcaoHumana || temSujeitoFisico) {
            score.noticias += 4;
            score.curiosidades += 3;
            score.esportes += 2;
            score.matematica -= 5;
        } else {
            score.matematica += 2;
            score.ciencia += 2;
        }
    }

    if (temOperador && !temAcaoHumana) {
        score.matematica += 2;
    }

    if (temRaizNoticia) score.noticias += 4;
    if (temRaizCuriosidade) score.curiosidades += 4;

    // =========================
    // ⚠️ DETECÇÃO DE FAKE & EXAGERO
    // =========================
    let nivelSuspeita = 0;
    let motivos = [];

    if (temNumero && temAcaoHumana && temUnidade) {
        if ((texto.includes("km/h") || texto.includes("km por hora")) && texto.match(/\b([5-9]\d|\d{3,})\b/)) {
            nivelSuspeita += 2;
            motivos.push("velocidade incompatível com humanos");
        }
        if (texto.includes("km/s") || texto.includes("km por segundo")) {
            nivelSuspeita += 3;
            motivos.push("unidade de medida extrema (escala espacial/balística)");
        }
    }

    if (texto.includes("mais rápido que a luz") || texto.includes("imortal") || texto.includes("reviveu")) {
        nivelSuspeita += 3;
        motivos.push("fisicamente ou biologicamente impossível");
    }

    if (temExagero) {
        nivelSuspeita += 1;
        motivos.push("linguagem sensacionalista");
    }

    if (temRaizDuvida) {
        nivelSuspeita += 1;
        motivos.push("usuário questionando veracidade");
    }

    // =========================
    // 🏆 ESCOLHA FINAL
    // =========================
    let categoriaFinal = "geral";
    let maior = 0;

    for (let cat in score) {
        if (score[cat] > maior) {
            maior = score[cat];
            categoriaFinal = cat;
        }
    }

    // =========================
    // 🌐 FONTES + YOUTUBE
    // =========================
    let fontesMap = {
        matematica: [
            { nome: "📺 Professor Ferretto", site: "www.youtube.com/results?search_query=Ferretto+Matematica+" },
            { nome: "📺 Marcos Aba Matemática", site: "www.youtube.com/results?search_query=Marcos+Aba+Matematica+" },
            { nome: "🌐 Brasil Escola", site: "brasilescola.uol.com.br/matematica" }
        ],
        geografia: [
            { nome: "📺 Geografia Irada", site: "www.youtube.com/results?search_query=Geografia+Irada+" },
            { nome: "🌐 IBGE Educa", site: "educa.ibge.gov.br" },
            { nome: "🌐 Toda Matéria", site: "todamateria.com.br/geografia" }
        ],
        historia: [
            { nome: "📺 Nerdologia (História)", site: "www.youtube.com/results?search_query=Nerdologia+Historia+" },
            { nome: "📺 Canal Nostalgia", site: "www.youtube.com/results?search_query=Canal+Nostalgia+Historia+" },
            { nome: "🌐 Só História", site: "sohistoria.com.br" }
        ],
        ciencia: [
            { nome: "📺 Manual do Mundo", site: "www.youtube.com/results?search_query=Manual+do+Mundo+" },
            { nome: "📺 Ciência Todo Dia", site: "www.youtube.com/results?search_query=Ciencia+Todo+Dia+" },
            { nome: "📺 Space Today", site: "www.youtube.com/results?search_query=Space+Today+" }
        ],
        portugues: [
            { nome: "📺 Professor Noslen", site: "www.youtube.com/results?search_query=Professor+Noslen+" },
            { nome: "📺 Redação e Gramática Zica", site: "www.youtube.com/results?search_query=Redacao+e+Gramatica+Zica+" },
            { nome: "🌐 Dicio (Dicionário)", site: "dicio.com.br" }
        ],
        tecnologia: [
            { nome: "📺 Código Fonte TV", site: "www.youtube.com/results?search_query=Codigo+Fonte+TV+" },
            { nome: "📺 Filipe Deschamps", site: "www.youtube.com/results?search_query=Filipe+Deschamps+" },
            { nome: "🌐 Canaltech", site: "canaltech.com.br" }
        ],
        saude: [
            { nome: "📺 Drauzio Varella", site: "www.youtube.com/results?search_query=Drauzio+Varella+" },
            { nome: "🌐 Tua Saúde", site: "tuasaude.com" },
            { nome: "🌐 Ministério da Saúde", site: "gov.br/saude" }
        ],
        esportes: [
            { nome: "📺 TNT Sports BR", site: "www.youtube.com/results?search_query=TNT+Sports+Brasil+" },
            { nome: "🌐 Globo Esporte (GE)", site: "ge.globo.com" },
            { nome: "🌐 ESPN Brasil", site: "espn.com.br" }
        ],
        noticias: [
            { nome: "🌐 G1", site: "g1.globo.com" },
            { nome: "🌐 BBC News Brasil", site: "bbc.com/portuguese" },
            { nome: "🔍 Agência Lupa (Fatos)", site: "lupa.uol.com.br" }
        ],
        curiosidades: [
            { nome: "📺 Você Sabia?", site: "www.youtube.com/results?search_query=Voce+Sabia+" },
            { nome: "📺 Fatos Desconhecidos", site: "www.youtube.com/results?search_query=Fatos+Desconhecidos+" },
            { nome: "🌐 Guinness World Records", site: "guinnessworldrecords.com" }
        ],
        religiao: [
            { nome: "🌐 Vatican News", site: "vaticannews.va" },
            { nome: "🌐 Gospel Prime", site: "gospelprime.com.br" }
        ],
        geral: [
            { nome: "📚 Enciclopédia Britannica", site: "escola.britannica.com.br" },
            { nome: "📺 Canal Futura", site: "www.youtube.com/results?search_query=Canal+Futura+" },
            { nome: "🏛️ Portal Gov.br (Oficial)", site: "gov.br" }
        ]
    };

    let nomes = {
        matematica: "📚 Matemática",
        noticias: "📰 Notícias & Fatos",
        curiosidades: "😲 Curiosidades",
        historia: "🏛️ História",
        religiao: "✝️ Religião",
        ciencia: "🔬 Ciência",
        saude: "🩺 Saúde",
        tecnologia: "💻 Tecnologia",
        geografia: "🌍 Geografia",
        portugues: "✍️ Português",
        esportes: "⚽ Esportes",
        geral: "🌐 Assuntos Gerais"
    };

    let fontes = fontesMap[categoriaFinal] || fontesMap.geral;

    // =========================
    // 🛡️ ALERTA FINAL
    // =========================
    let alerta = "✅ Parece uma busca comum";

    if (nivelSuspeita >= 3) alerta = "🚨 ALTA CHANCE DE FAKE NEWS";
    else if (nivelSuspeita == 2) alerta = "⚠️ Suspeito / Exagerado";
    else if (nivelSuspeita == 1) alerta = "🔍 Bom verificar as fontes";

    // =========================
    // 🎨 HTML
    // =========================
    let html = `
        <h2>${nomes[categoriaFinal] || nomes.geral}</h2>
        <p><strong>Status:</strong> ${alerta}</p>
        <p><strong>Detalhes:</strong> ${motivos.length > 0 ? motivos.join(" | ") : "Nenhum problema detectado."}</p>
        <hr style="margin: 15px 0; border: 1px solid #ddd;">
        <p>🔎 <strong>Busque direto nos especialistas:</strong></p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    fontes.forEach(fonte => {
        let url;

        if (fonte.site.includes("youtube.com/results")) {
            url = `https://${fonte.site}${encodeURIComponent(texto)}`;
        } else {
            url = `https://www.google.com/search?q=site:${fonte.site}+${encodeURIComponent(texto)}`;
        }

        html += `
            <div class="card">
                <h3>${fonte.nome}</h3>
                <a href="${url}" target="_blank">
                    Abrir Resultado 🚀
                </a>
            </div>
        `;
    });

    html += `</div>`;

    document.getElementById("resultado").innerHTML = html;
}