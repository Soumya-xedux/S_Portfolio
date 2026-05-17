import styles from './Header.module.css'

export const Header = () => {
  return (
    <div className={styles.header}>
        <h1>Soumya Ranjan Sahoo</h1>
        <h4>Data Engineer | MERN Stack Developer</h4>
        <span style={{
          fontSize: "12px",
          fontWeight: "800",
          color:"red",
          position:"absolute",
          right: "25px",
          bottom: "5px"
        }}>Note* - Currently projects are for demo purpose</span>
    </div>
  )
}
