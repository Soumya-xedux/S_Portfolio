import React from 'react'
import styles from './Footer.module.css'
import { Mail, Phone, MessageCircle } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

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
            <FaLinkedin size={28}/>
          </a>
          <a  href="https://github.com/Soumya-xedux" target="_blank" rel="noopener noreferrer">
            <FaGithub size={28}/>
          </a>
          <a href="https://wa.me/916370278336" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={28}/>
          </a>
      </div>
    </div>
  )
}

