// page.jsx
import styles from "./page.module.css";
import ArticuloClient from "./articulos/ArticuloClient";
import React from 'react';
import { Container } from 'react-bootstrap';

export default function Home() {

  return (
    <Container className={styles.main}>
      <ArticuloClient />
    </Container>
  );
}
