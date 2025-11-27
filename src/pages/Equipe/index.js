import { useState } from 'react'
import Card from '../../components/Card'
import Modal from '../../components/Modal' // vamos criar
import styles from './Equipe.module.css'

const equipe = [
  {
    nome: "Arthur",
    funcao: "Barbeiro Sênior",
    imagem: "/imagens/arthur.jpg",
    descricao: "Especialista em cortes clássicos e degradê. 8 anos de experiência. Mestre da navalha e do estilo retrô."
  },
  {
    nome: "Vitória",
    funcao: "Cabeleireira & Estilista",
    imagem: "/imagens/vitoria.jpg",
    descricao: "Transforma cabelos com técnicas modernas. Apaixonada por penteados sociais e colorimetria."
  },
  {
    nome: "Joicy",
    funcao: "Especialista em Coloração",
    imagem: "/imagens/joicy.jpg",
    descricao: "Rainha das luzes, mechas e tonalizações. Cores perfeitas com saúde capilar garantida."
  },
  {
    nome: "Geovanna",
    funcao: "Maquiadora Profissional",
    imagem: "/imagens/geovanna.jpg",
    descricao: "Make para eventos, noivas e dia a dia. Realça sua beleza natural com técnica e sofisticação."
  },
  {
    nome: "Victoria",
    funcao: "Manicure & Podóloga",
    imagem: "/imagens/victoria.jpg",
    descricao: "Unhas impecáveis e cuidados com os pés. Higiene, design e durabilidade em cada atendimento."
  },
  {
    nome: "Rafaela",
    funcao: "Manicure & Nail Designer",
    imagem: "/imagens/rafaela.jpg",
    descricao: "Arte nas unhas: alongamentos, gel, fibra. Estilo único para quem ama se destacar."
  },
]

export default function Equipe() {
  const [membroSelecionado, setMembroSelecionado] = useState(null)

  const abrirModal = (membro) => setMembroSelecionado(membro)
  const fecharModal = () => setMembroSelecionado(null)

  return (
    <>
      <section className={styles.equipe}>
        <div className={styles.container}>
          <h1>Nossa Equipe</h1>
          <p className={styles.subtitulo}>
            Profissionais apaixonados por transformar seu visual com técnica e carinho.
          </p>

          <div className={styles.grid}>
            {equipe.map((membro, i) => (
              <div
                key={i}
                className={styles.cardWrapper}
                onClick={() => abrirModal(membro)}
              >
                <Card
                  titulo={membro.nome}
                  preco={membro.funcao}
                  imagem={membro.imagem}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {membroSelecionado && (
        <Modal membro={membroSelecionado} onClose={fecharModal} />
      )}
    </>
  )
}