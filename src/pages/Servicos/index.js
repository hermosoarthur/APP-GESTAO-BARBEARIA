import Card from '../../components/Card'
import styles from './Servicos.module.css'

const funcionalidades = [
  {
    titulo: "Agendamentos em Tempo Real",
    descricao: "Marque, edite e cancele horários com sincronização instantânea via Firebase.",
    imagem: "/imagens/agendamento-detalhe.jpg",
  },
  {
    titulo: "Controle de Clientes",
    descricao: "Cadastro completo com histórico de serviços, preferências e anotações.",
    imagem: "/imagens/cliente-detalhe.jpg",
  },
  {
    titulo: "Gestão de Serviços e Preços",
    descricao: "Crie, edite e organize sua tabela de preços com valores personalizados.",
    imagem: "/imagens/servicos-gestao.jpg",
  },
  {
    titulo: "Relatórios Inteligentes",
    descricao: "Faturamento mensal, serviços mais vendidos e desempenho por período.",
    imagem: "/imagens/relatorio-detalhe.jpg",
  },
  {
    titulo: "Notificações Automáticas",
    descricao: "Lembretes por email e SMS para você e seus clientes (via EmailJS e Expo).",
    imagem: "/imagens/notificacao-detalhe.jpg",
  },
  {
    titulo: "Multiplataforma e Offline",
    descricao: "Funciona no celular, tablet e web. Dados salvos mesmo sem internet.",
    imagem: "/imagens/offline.jpg",
  },
]

export default function Servicos() {
  return (
    <section className={styles.servicos}>
      <div className={styles.container}>
        <h1>Funcionalidades do Studio</h1>
        <p className={styles.intro}>
          Tudo o que você precisa para gerenciar seu negócio com <strong>profissionalismo e praticidade</strong>.
        </p>

        <div className={styles.grid}>
          {funcionalidades.map((f, i) => (
            <Card
              key={i}
              titulo={f.titulo}
              preco={f.descricao}
              imagem={f.imagem}
            />
          ))}
        </div>

        <div className={styles.cta}>
          <a href="/app-gestao-barbearia.apk" download className={styles.botao}>
            Baixar App Agora
          </a>
        </div>
      </div>
    </section>
  )
}