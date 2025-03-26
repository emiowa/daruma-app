import React from 'react';
import Layout from "../components/Layout"
import Link from 'next/link';
import { useRouter } from 'next/router';
import LinkPaginasHeader from '@/components/links/LinkPaginasHeader';
const Home = () => {
  return (
    <div>
      <Layout>
        <h1 className='text-red-500 border'>Welcome toooo the homepage</h1>
        <LinkPaginasHeader />
      </Layout>
    </div>
  );
};
export default Home;