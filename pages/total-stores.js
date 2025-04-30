import React from 'react';
import Layout from '@/components/Layout/Layout';
import PendingStores from '../components/PendingStores/PendingStores'
const ComponentName = (props) => {
  return (
    <Layout>
      <div className="">
        <PendingStores />
      </div>
    </Layout>
  );
};

export default ComponentName;