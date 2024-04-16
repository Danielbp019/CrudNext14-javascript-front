'use client'
import styles from "./page.module.css";
import ArticuloClient from "./articulos/ArticuloClient";
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function Home() {

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.js');
  }, []);

  return (
    <main className={styles.main}>
      <ArticuloClient />
    </main>
  );
}
