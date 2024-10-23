import React from 'react';
import Layout from "../components/Layout"
import Link from 'next/link';
import { useRouter } from 'next/router';
const Home = () => {
  return (
    <div>
      <Layout>
        <h1>Welcome to the homepage</h1>
      </Layout>
    </div>
  );
};
export default Home;