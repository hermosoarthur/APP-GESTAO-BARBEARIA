import styles from './Banner.module.css'

export default function Banner() {
  return (
    <div className={styles.banner}>
      <h1>Studio</h1>
      <p>Ferramenta de Gestão</p>
      <a href="#download" className={styles.botao}>Baixar App</a>
    </div>
  )
}