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
    imagem: "/imagens/gestao.png",
  },
  {
    titulo: "Tabela de Preços",
    descricao: "Personalize serviços e valores com facilidade.",
    imagem: "/imagens/preco.png",
  },
  {
    titulo: "Relatórios de Desempenho",
    descricao: "Faturamento, atendimentos e análise mensal.",
    imagem: "/imagens/desempenho.png",
  },
  {
    titulo: "Notificações Automáticas",
    descricao: "SMS e email para confirmar e lembrar agendamentos.",
    imagem: "/imagens/notificacao.png",
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
        <h2>Sobre Nosso Serviço</h2>
        <p>
          <strong>Tecnologia Que Eleva Seu Atendimento ao Próximo Nível</strong> <br />Nosso aplicativo foi desenvolvido para transformar a rotina de profissionais da beleza.
Com uma plataforma completa e intuitiva, criada utilizando React Native, Expo e Firebase, oferecemos uma experiência moderna e eficiente para quem deseja organizar sua agenda de forma prática e profissional.
Aqui, você pode gerenciar agendamentos, clientes, serviços e horários em tempo real, tudo dentro de um ambiente simples, bonito e totalmente pensado para facilitar o seu dia a dia.
O objetivo é claro:
dar mais controle, praticidade e agilidade ao profissional, permitindo que ele foque no que realmente importa, entregar um atendimento impecável para cada cliente.
Nosso sistema foi criado com carinho, tecnologia atual e foco total na experiência do usuário.
Simples, poderoso e pensado para quem ama o que faz
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