import { useState } from 'react'
import Card from '../../components/Card'
import Modal from '../../components/Modal' // vamos criar
import styles from './Equipe.module.css'

const equipe = [
  {
    nome: "Arthur",
    funcao: "Desenvolvedor",
    imagem: "/imagens/arthurr.jpg",
    descricao: "Faz a mágica acontecer por trás das cortinas. Se o app funciona direitinho, pode apostar que foi ele que consertou."
  },
  {
    nome: "Vitória",
    funcao: "Desenvolvedor",
    imagem: "/imagens/vitoria.jpg",
    descricao: "Cuida dos dados como se fossem plantas: alimenta, organiza e nunca deixa morrer. O app agradece."
  },
  {
    nome: "Joicy",
    funcao: "Desenvolvedor",
    imagem: "/imagens/joiicy.jpg",
    descricao: "Fez o app rodar liso no celular. Se abriu rápido e sem travar, ele vai dizer que é “simplesmente talento."
  },
  {
    nome: "Geovanna",
    funcao: "Desenvolvedor",
    imagem: "/imagens/geh.jpg",
    descricao: "Garante que o usuário não fique perdido. Criou um app tão intuitivo que até quem troca a senha e esquece pode usar."
  },
  {
    nome: "Victoria",
    funcao: "Desenvolvedor",
    imagem: "/imagens/victoria.jpg",
    descricao: "Encontra bugs escondidos até onde ninguém imaginava. Se passou por ela, está funcionando mesmo."
  },
  {
    nome: "Rafaela",
    funcao: "Desenvolvedor",
    imagem: "/imagens/rafaela.jpg",
    descricao: "Transforma código em telas tão bonitas que até ela mesma fica surpresa. Responsável pela interface charmosa do Studio App."
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
            Profissionais apaixonados por unir tecnologia e talento para facilitar a sua vida.
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