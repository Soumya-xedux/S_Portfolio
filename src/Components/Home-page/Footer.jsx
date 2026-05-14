import React from 'react'
import styles from './Footer.module.css'
import { Mail, Phone, Linkedin, Github, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.heading}>Contacts</div>
      <div className={styles.contacts}>
          <a href="mailto:luckyssoumya719@gmail.com">
              <Mail size={28}/>
          </a>
          <a href="tel:+916370278336">
            <Phone size={28}/>
          </a>
          <a href="https://www.linkedin.com/in/soumya-ranjan-sahoo02/" target="_blank" rel="noopener noreferrer">
            Linkedin
          </a>
          <a href="https://github.com/Soumya-xedux" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          <a href="https://wa.me/916370278336" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={28}/>
          </a>
      </div>
    </div>
  )
}

function ImageSize({src, alt, width, height}) {
  return (<img src={src} alt={alt} 
    width={width} height={height}
    className={styles.image} />)
}
