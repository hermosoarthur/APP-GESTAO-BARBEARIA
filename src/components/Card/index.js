import styles from './Card.module.css'

export default function Card({ titulo, preco, imagem }) {
  return (
    <div className={styles.card}>
      <img src={imagem} alt={titulo} />
      <h3>{titulo}</h3>
      <p className={styles.preco}>{preco}</p>
    </div>
  )
}