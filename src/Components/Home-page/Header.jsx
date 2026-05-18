import styles from './Header.module.css'
import { useNavigate } from 'react-router'

export const Header = () => {
  const navigate = useNavigate()

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
        <button style={{
            width: "10rem", height: "2rem",
            position: "absolute", fontSize:"16px", fontWidth: "bold", fontFamily: "sans-serif",
            color: "white", background: "#0b777b", borderRadius: "0.5rem", right: "25px", top:"15px"
        }} onClick={() =>navigate("/commander")}>
          Admin Page
        </button>
    </div>
  )
}
