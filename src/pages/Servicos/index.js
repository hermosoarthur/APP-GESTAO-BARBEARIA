import Card from '../../components/Card'
import styles from './Servicos.module.css'

const funcionalidades = [
  {
    titulo: "Salão de Cabeleireiro Masculino",
    descricao: "Suporte completo para cortes masculinos.",
    imagem: "/imagens/corte.jpg",
  },
  {
    titulo: "Salão de Cabeleireiro Feminino",
    descricao: "Atendimento para beleza feminina.",
    imagem: "/imagens/penteado.jpg",
  },
  {
    titulo: "Manicure",
    descricao: "Ideal para manicures e nail designers.",
    imagem: "/imagens/manicure.jpg",
  },
  {
    titulo: "Barbearia",
    descricao: "Atende barbearias de todos os portes.",
    imagem: "/imagens/barba.jpg",
  },
  {
    titulo: "Tratamentos",
    descricao: "Gestão simples para serviços de cuidado.",
    imagem: "/imagens/hidratacao.jpg",
  },
  {
    titulo: "Outros Serviços",
    descricao: "Flexível para qualquer tipo de negócio.",
    imagem: "/imagens/pintura.jpg",
  },
]

export default function Servicos() {
  return (
    <section className={styles.servicos}>
      <div className={styles.container}>
        <h1>Atendemos Todos os Tipos de Serviços Esteticos</h1>
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