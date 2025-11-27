import Banner from '../../components/Banner'
import Card from '../../components/Card'
import BotaoDownload from '../../components/BotaoDownload'
import styles from './Inicio.module.css'

// === FUNCIONALIDADES DO STUDIO (APP DE GESTÃO) ===
const funcionalidades = [
  {
    titulo: "Agendamentos Inteligentes",
    descricao: "Controle total de horários com lembretes automáticos.",
    imagem: "/imagens/agendamento.jpg",
  },
  {
    titulo: "Gestão de Clientes",
    descricao: "Histórico completo, preferências e dados organizados.",
    imagem: "/imagens/clientes.jpg",
  },
  {
    titulo: "Tabela de Preços",
    descricao: "Personalize serviços e valores com facilidade.",
    imagem: "/imagens/precos.jpg",
  },
  {
    titulo: "Relatórios de Desempenho",
    descricao: "Faturamento, atendimentos e análise mensal.",
    imagem: "/imagens/relatorios.jpg",
  },
  {
    titulo: "Notificações Automáticas",
    descricao: "SMS e email para confirmar e lembrar agendamentos.",
    imagem: "/imagens/notificacoes.jpg",
  },
  {
    titulo: "Acesso Multiplataforma",
    descricao: "Funciona no celular, tablet e computador.",
    imagem: "/imagens/multiplataforma.jpg",
  },
]

export default function Inicio() {
  return (
    <>
      <Banner />
      
      <section className={styles.sobre}>
        <h2>Sobre o Studio</h2>
        <p>
          <strong>Studio</strong> é o aplicativo completo para gestão de profissionais da beleza. 
          Desenvolvido com React Native, Expo e Firebase, permite organizar agendamentos, clientes, serviços e horários em tempo real.
        </p>
        <p>
          Ideal para barbeiros, cabeleireiros, manicures, esteticistas e massagistas que querem mais controle, menos confusão e mais tempo para o que importa: atender com excelência.
        </p>
      </section>

      <section className={styles.destaques}>
        <h2>O que o Studio oferece</h2>
        <div className={styles.cards}>
          {funcionalidades.map((f, i) => (
            <Card
              key={i}
              titulo={f.titulo}
              preco={f.descricao}
              imagem={f.imagem}
            />
          ))}
        </div>
      </section>

      <BotaoDownload />
    </>
  )
}